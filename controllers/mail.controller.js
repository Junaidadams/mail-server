import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Email sent successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email." });
  }
};
