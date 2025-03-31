const express = require('express');
const path = require('path');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PWD || '',
  },
});

app.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || message.length < 10) {
    return res.status(400).json({ success: false, error: 'Invalid input' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.HERBARY_EMAIL || 'aryamohanan.online@gmail.com',
    subject: `🔔 New Feedback/Inquiry from ${name}`,
    text: `You have received a new message from the website contact form.

  Name: ${name}
  Email: ${email}

  Message:
  ${message}

  Please review and respond accordingly.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
