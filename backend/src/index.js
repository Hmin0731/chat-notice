import cors from "cors";
import express from "express";
import questionsRouter from "./routes/questions.js";
import resultsRouter from "./routes/results.js";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/questions", questionsRouter);
app.use("/api/results", resultsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`[backend] Server running at http://localhost:${PORT}`);
});
