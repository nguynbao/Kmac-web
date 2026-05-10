require("dotenv").config();
const fs = require("fs");
const path = require("path");

module.exports = function (req, res, next) {
  // Bắt các request yêu cầu file config.js
  if (req.url.includes("/js/api/config.js")) {
    const configPath = path.join(__dirname, "js", "api", "config.js");
    let content = fs.readFileSync(configPath, "utf8");

    // Đọc biến từ .env (fallback về localhost:3000 nếu không có)
    const envUrl = process.env.API_BASE_URL || "http://localhost:3000/api";

    // Thay thế biến trong nội dung file gửi xuống trình duyệt
    content = content.replace(
      /const API_BASE_URL\s*=\s*["'].*?["'];/,
      `const API_BASE_URL = "${envUrl}";`,
    );

    res.setHeader("Content-Type", "application/javascript");
    res.end(content);
    return;
  }
  next();
};
