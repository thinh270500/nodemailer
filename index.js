import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Tạo OAuth2 client cho Gmail API
const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground" // redirect URI trùng với nơi lấy refresh_token
);

// Gán refresh_token
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Tạo Gmail API client
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// API gửi mail
app.post("/send", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).send("❌ Missing to, subject, or text");
    }

    // Tạo nội dung mail theo định dạng RFC 2822
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      text,
    ].join("\n");

    // Mã hóa base64url
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Gửi mail
    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedMessage },
    });

    res.status(200).send("✅ Gmail API: Mail sent successfully!");
  } catch (error) {
    console.error("❌ Gmail API error:", error);
    res.status(500).send("❌ Failed to send mail via Gmail API");
  }
});

// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Gmail API server running on port ${PORT}`));
