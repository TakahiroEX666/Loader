// server.js
const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = process.env.PORT || 3000;

app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).send("Invalid URL");
  }

  const cleanUrl = url.split("?")[0]; // 💥 ตัดพวก ?igsh=... ออก
  const cmd = `instaloader --no-captions --no-metadata-json --dirname-pattern=downloads ${cleanUrl}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error.message);
      return res.status(500).send(`Download failed: ${error.message}`);
    }

    res.send("Download complete (saved in server folder)");
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
