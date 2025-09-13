const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // ya apka SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Pet Adoption" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent to:", to);
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

module.exports = sendEmail;