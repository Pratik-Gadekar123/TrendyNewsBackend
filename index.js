import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// If you're on Node 18+, global fetch exists. If not, install node-fetch and import it.
// import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",   // later replace with your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.get("/api/news", async (req, res) => {
  const q = req.query.search || "india";

  try {
    const url =
      `https://newsapi.org/v2/everything` +
      `?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;

    const r = await fetch(url);
    const data = await r.json();

    // If NewsAPI returns an error or non-2xx, forward it
    if (!r.ok || data.status === "error") {
      return res.status(r.status || 500).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ status: "error", message: "Failed to fetch news" });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
