import { text } from "express";
import nodemailer from "nodemailer";

const portfolioTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password or OAuth2 token
  },
});

export const sendServiceEmail = async (req, res) => {
  const { formData } = req.body;
  // if (!formData || !formData.selectedPackage) {
  //   return res.status(400).json({ message: "Invalid data provided." });
  // }
  const { selectedPackage, selectedPages, message, includeRetainer } = formData;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `${selectedPackage} website requested`,
    text: `${
      !message
        ? "No message provided"
        : `They added the following message: "${message}"`
    }
    
${selectedPages} 

${!includeRetainer ? "No retainer requested" : "Retainer requested."}`,
  };
  try {
    await portfolioTransporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
};

const roobTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ROOB_EMAIL_USER,
    pass: process.env.ROOB_EMAIL_PASS,
  },
});

export const sendRoobRequestEmail = async (req, res) => {
  const { formData } = res.body;
  const { name, contactEmail, type, variant, message } = formData;
  const mailOptions = {
    from: process.env.ROOB_EMAIL_USER,
    to: contactEmail,
    subject: `${type} ${variant} commission piece requested from ${name}`,
    text: `${message}`,
  };

  try {
    await roobTransporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
};
