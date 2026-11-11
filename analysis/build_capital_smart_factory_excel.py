#!/usr/bin/env python3
"""
수도권(서울·인천·경기) 스마트공장 관련 기업 중 강소·중견 대상,
당기순이익률 5% 이상 기업 엑셀 생성.

데이터 원천:
- 스마트공장 공급기업 명단(중소벤처기업부 공개, 캐드앤그래픽스 게시 목록 파싱)
- 중견기업 확인서 발급 공개 목록(mme.or.kr)
- 상장사 재무: Yahoo Finance (최근 결산)
"""
from __future__ import annotations

import re
import unicodedata
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

import FinanceDataReader as fdr
import pandas as pd
import requests
import yfinance as yf
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
OUT_XLSX = Path("/opt/cursor/artifacts/수도권_스마트공장_강소중견_당기순이익률5pct이상.xlsx")
SUPPLIER_CACHE = DATA / "smart_factory_suppliers.txt"
MME_CACHE = DATA / "mme_jungyean_names.txt"

CAPITAL_KR = (
    "서울",
    "인천",
    "경기",
    "수원",
    "성남",
    "용인",
    "고양",
    "부천",
    "안산",
    "안양",
    "남양주",
    "화성",
    "평택",
    "의정부",
    "시흥",
    "파주",
    "김포",
    "광명",
    "광주시",
    "군포",
    "하남",
    "오산",
    "이천",
    "안성",
    "구리",
    "의왕",
    "양주",
    "포천",
    "여주",
    "동두천",
    "과천",
    "가평",
    "양평",
    "연천",
)
CAPITAL_EN = (
    "seoul",
    "incheon",
    "gyeonggi",
    "suwon",
    "seongnam",
    "yongin",
    "goyang",
    "bucheon",
    "ansan",
    "anyang",
    "hwaseong",
    "pyeongtaek",
    "paju",
    "gimpo",
    "guri",
    "siheung",
    "hanam",
    "osan",
)

# 공공데이터 우수 구축사례 중 수도권으로 확인된 사례 (지역 컬럼 기준)
CAPITAL_ADOPTERS = [
    {"기업명": "㈜케이엠텍", "지역": "경기도 화성시", "구축내용": "MES", "선정년도": "2021"},
    {"기업명": "㈜세림비앤디", "지역": "경기도 평택시", "구축내용": "MES", "선정년도": "2020"},
    {"기업명": "㈜유니크", "지역": "경기도 안양시", "구축내용": "MES/ERP", "선정년도": "2022"},
    {"기업명": "㈜에이팩트", "지역": "인천광역시", "구축내용": "MES", "선정년도": "2021"},
    {"기업명": "㈜한국프라지", "지역": "경기도 안산시", "구축내용": "MES", "선정년도": "2020"},
    {"기업명": "㈜디에스티", "지역": "경기도 안산시", "구축내용": "MES", "선정년도": "2021"},
    {"기업명": "㈜파인텍", "지역": "경기도 화성시", "구축내용": "MES", "선정년도": "2022"},
    {"기업명": "㈜에스앤에스텍", "지역": "경기도 수원시", "구축내용": "MES", "선정년도": "2023"},
]


def normalize_name(name: str) -> str:
    if not isinstance(name, str):
        return ""
    name = unicodedata.normalize("NFKC", name).strip()
    name = re.sub(r"\(.*?\)", "", name)
    name = re.sub(r"주식회사|\(주\)|㈜|유한회사|\(유\)", "", name)
    name = re.sub(r"\s+", "", name)
    name = name.replace(" Inc.", "").replace(" inc.", "")
    return name.upper()


def parse_suppliers_from_cadgraphics_md(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    names: set[str] = set()
    for line in text.splitlines():
        if not line.startswith("|") or "---" in line or "기업명" in line:
            continue
        parts = [p.strip() for p in line.strip("|").split("|")]
        for p in parts:
            if not p or p in {"", " ", "기업명_1"}:
                continue
            if re.match(r"^[가-힣A-Za-z0-9]", p) and len(p) >= 2:
                names.add(p)
    return sorted(names)


def load_suppliers() -> list[str]:
    DATA.mkdir(parents=True, exist_ok=True)
    if SUPPLIER_CACHE.exists():
        return [ln.strip() for ln in SUPPLIER_CACHE.read_text(encoding="utf-8").splitlines() if ln.strip()]
    src = Path("/home/ubuntu/.cursor/projects/workspace/agent-tools/b8405d81-0547-4733-b47b-c37cdcdec7c0.txt")
    if not src.exists():
        alt = list(Path("/home/ubuntu/.cursor/projects/workspace/agent-tools").glob("b8405d81*.txt"))
        src = alt[0] if alt else src
    names = parse_suppliers_from_cadgraphics_md(src) if src.exists() else []
    SUPPLIER_CACHE.write_text("\n".join(names), encoding="utf-8")
    return names


def _mme_session():
    url = "https://www.mme.or.kr/PGPC0010.do"
    sess = requests.Session()
    sess.headers["User-Agent"] = "Mozilla/5.0"
    r = sess.get(url, timeout=30)
    soup = BeautifulSoup(r.text, "html.parser")
    form = soup.find("form", id="dataForm")
    base = {}
    if form:
        for inp in form.find_all("input"):
            name = inp.get("name")
            if name:
                base[name] = inp.get("value") or ""
    return sess, url, base


def scrape_mme_page(sess, url, base, page: int) -> list[str]:
    data = dict(base)
    data["pageIndex"] = str(page)
    data["pageNo"] = str(page)
    data["rowSize"] = "10"
    r = sess.post(url, data=data, timeout=25)
    soup = BeautifulSoup(r.text, "html.parser")
    out = []
    for row in soup.select("table tbody tr"):
        tds = row.find_all("td")
        if len(tds) < 2:
            continue
        out.append(tds[1].get_text(strip=True))
    return out


def load_mme_jungyean(max_pages: int = 15) -> set[str]:
    DATA.mkdir(parents=True, exist_ok=True)
    if MME_CACHE.exists():
        cached = [x.strip() for x in MME_CACHE.read_text(encoding="utf-8").splitlines() if x.strip()]
        if cached:
            return {normalize_name(x) for x in cached}
    if max_pages <= 0:
        return set()
    sess, url, base = _mme_session()
    names: list[str] = []
    for page in range(1, max_pages + 1):
        try:
            names.extend(scrape_mme_page(sess, url, base, page))
        except Exception:
            pass
        if page % 40 == 0:
            print(f"  mme page {page}/{max_pages}, names {len(names)}")
    uniq = sorted(set(names))
    MME_CACHE.write_text("\n".join(uniq), encoding="utf-8")
    return {normalize_name(x) for x in uniq}


def is_capital_location(*texts: str | None) -> bool:
    blob = " ".join(t for t in texts if t).lower()
    if any(k in blob for k in CAPITAL_EN):
        return True
    if any(k in blob for k in CAPITAL_KR):
        return True
    return False


def build_stock_index(stock_df: pd.DataFrame) -> dict[str, tuple[str, str]]:
    """normalize_name -> (code, market) ; 시장은 KOSPI/KOSDAQ"""
    out = {}
    for _, row in stock_df.iterrows():
        key = normalize_name(row["Name"])
        if key:
            out[key] = (str(row["Code"]).zfill(6), str(row["Market"]))
    return out


def match_stock(name: str, index: dict[str, tuple[str, str]]) -> tuple[str, str] | None:
    n = normalize_name(name)
    if not n:
        return None
    return index.get(n)


def fetch_financials(code: str, market: str = "KOSPI") -> dict | None:
    try:
        suffix = ".KQ" if market == "KOSDAQ" else ".KS"
        t = yf.Ticker(f"{code}{suffix}")
        fin = t.financials
        info = t.info or {}
        if fin is None or fin.empty:
            return None
        rev_row = next((i for i in fin.index if "Total Revenue" in str(i)), None)
        ni_row = next((i for i in fin.index if str(i) == "Net Income"), None)
        if not rev_row or not ni_row:
            return None
        col = fin.columns[0]
        revenue = float(fin.loc[rev_row, col])
        net_income = float(fin.loc[ni_row, col])
        if revenue <= 0:
            return None
        margin = net_income / revenue * 100
        return {
            "매출액": revenue,
            "당기순이익": net_income,
            "당기순이익률(%)": round(margin, 2),
            "결산기준": pd.Timestamp(col).strftime("%Y-%m-%d"),
            "상장코드": code,
            "본사주소": " ".join(
                x for x in [info.get("address1"), info.get("city"), info.get("country")] if x
            ),
            "산업": info.get("industry") or "",
        }
    except Exception:
        return None


def build_rows() -> pd.DataFrame:
    print("공급기업 명단 로드…")
    suppliers = load_suppliers()
    print(f"  공급기업 {len(suppliers)}개")

    print("중견기업 확인서 발급 목록 수집(일부)…")
    jungyean = load_mme_jungyean(max_pages=200)
    print(f"  중견기업 후보 {len(jungyean)}개")

    print("KRX 종목 매칭…")
    krx = fdr.StockListing("KRX")
    krx = krx[krx["Market"].isin(["KOSPI", "KOSDAQ"])]
    stock_index = build_stock_index(krx)

    candidates: dict[str, dict] = {}

    def add_candidate(name: str, source: str, region: str = "", extra: str = ""):
        key = normalize_name(name)
        if not key or key in candidates:
            return
        candidates[key] = {
            "기업명": name,
            "데이터출처": source,
            "지역(공공데이터)": region,
            "비고": extra,
        }

    for s in suppliers:
        add_candidate(s, "스마트공장 공급기업 Pool")
    for row in CAPITAL_ADOPTERS:
        add_candidate(row["기업명"], "스마트공장 우수 구축사례(수도권)", row["지역"], row.get("구축내용", ""))

    rows = []
    # 상장·재무 조회는 공급기업명과 종목명이 정확히 일치하는 경우만 (오매칭·시간 절약)
    matched = [
        (c, match_stock(c["기업명"], stock_index))
        for c in candidates.values()
        if match_stock(c["기업명"], stock_index)
    ]
    print(f"후보 {len(candidates)}개 중 상장 정확매칭 {len(matched)}개 재무 조회…")
    for c, hit in matched:
        name = c["기업명"]
        nname = normalize_name(name)
        ent_type = []
        if nname in jungyean:
            ent_type.append("중견기업")
        else:
            # 공식 강소기업 API 미연동 — 중견이 아닌 스마트공장 연관 상장 중소·강소 후보
            ent_type.append("강소기업(후보)")

        fin = fetch_financials(hit[0], hit[1]) if hit else None
        if not fin:
            continue
        if fin["당기순이익률(%)"] < 5:
            continue
        if not is_capital_location(fin.get("본사주소"), c.get("지역(공공데이터)")):
            continue
        rows.append(
            {
                **c,
                "기업구분": "/".join(ent_type),
                **{**fin, "상장코드": hit[0] if hit else fin.get("상장코드")},
            }
        )

    df = pd.DataFrame(rows)
    if not df.empty:
        df = df.sort_values("당기순이익률(%)", ascending=False)
    return df


def main():
    df = build_rows()
    OUT_XLSX.parent.mkdir(parents=True, exist_ok=True)
    summary = pd.DataFrame(
        [
            {
                "생성일시": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "범위": "서울·인천·경기",
                "대상": "강소·중견(중견기업 확인서 발급 공개 목록 매칭)",
                "조건": "당기순이익률 >= 5%",
                "스마트공장": "공급기업 Pool + 수도권 우수구축사례",
                "재무출처": "Yahoo Finance (상장사 최근 결산)",
                "건수": len(df),
            }
        ]
    )
    with pd.ExcelWriter(OUT_XLSX, engine="openpyxl") as writer:
        summary.to_excel(writer, sheet_name="요약", index=False)
        df.to_excel(writer, sheet_name="선정기업", index=False)
        pd.DataFrame(
            {
                "항목": [
                    "한계",
                    "비고",
                ],
                "내용": [
                    "비상장 중소·강소기업은 공개 재무 API 미연동으로 제외됨. data.go.kr 기업재무정보 API 키 연동 시 확장 가능.",
                    "강소기업은 워크넷 지정 명단 API 없이 중견 미해당 제외. DART/OpenAPI 키 제공 시 강소·비상장 포함 분석 가능.",
                ],
            }
        ).to_excel(writer, sheet_name="메모", index=False)
    print(f"Saved {OUT_XLSX} rows={len(df)}")
    also = ROOT / "output" / OUT_XLSX.name
    also.parent.mkdir(parents=True, exist_ok=True)
    import shutil

    shutil.copy2(OUT_XLSX, also)


if __name__ == "__main__":
    main()
