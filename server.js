const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  const inputUrl = req.query.url;

  if (!inputUrl || !inputUrl.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  // ลบ query string เช่น ?igshid=...
  const cleanUrl = inputUrl.split("?")[0];

  try {
    const response = await axios.get(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const $ = cheerio.load(response.data);

    const videoUrl = $('meta[property="og:video"]').attr("content") || null;
    const imageUrl = $('meta[property="og:image"]').attr("content") || null;
    const title = $('meta[property="og:title"]').attr("content") || "";
    const description = $('meta[property="og:description"]').attr("content") || "";

    res.json({
      success: true,
      title,
      description,
      video: videoUrl,
      image: imageUrl,
    });
  } catch (err) {
    console.error("Scrape failed:", err.message);
    res.status(500).json({ error: "Scrape failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
