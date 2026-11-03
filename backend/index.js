
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Brevo API configuration
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Send email API
app.post("/sendemail", async function (req, res) {
    try {
        const { msg, emailList } = req.body;

        // Validate message
        if (!msg || !msg.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Validate email list
        if (!Array.isArray(emailList) || emailList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Email list is empty"
            });
        }

        // Check Brevo API key
        if (!process.env.BREVO_API_KEY) {
            throw new Error("BREVO_API_KEY is missing");
        }

        // Check verified sender email
        if (!process.env.EMAIL_USER) {
            throw new Error("EMAIL_USER is missing");
        }

        // Clean and filter email list
        const cleanEmailList = emailList
            .map(email => String(email || "").trim())
            .filter(email => email.length > 0);

        if (cleanEmailList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Email list has no valid entries"
            });
        }

        // Send emails using Brevo HTTPS API
        for (const email of cleanEmailList) {

            const response = await fetch(BREVO_API_URL, {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: "Bulk Mail App",
                        email: process.env.EMAIL_USER
                    },
                    to: [
                        { email: email }
                    ],
                    subject: "A message from Bulk Mail App",
                    textContent: msg
                })
            });

            if (!response.ok) {
                const errorDetails = await response.text();

                throw new Error(
                    `Brevo API Error ${response.status}: ${errorDetails}`
                );
            }

            const result = await response.json();

            console.log("Email sent to:", email);
            console.log("Brevo Message ID:", result.messageId);
        }

        return res.status(200).json({
            success: true,
            message: "Emails sent successfully"
        });

    } catch (error) {

        console.error("Email sending error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send emails"
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});