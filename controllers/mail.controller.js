import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password or OAuth2 token
  },
});

export const sendServiceEmail = async (req, res) => {
  const { serviceEmailData } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: ``,
    text: `
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
};
