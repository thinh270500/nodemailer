const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

require("dotenv").config();

app.use(express.json());

// Cấu hình transporter (Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


app.post("/send-mail", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await transporter.sendMail({
      from: `"Mail API" <YOUR_GMAIL@gmail.com>`,
      to,
      subject,
      text,
    });
    res.json({ success: true, message: "Mail sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
