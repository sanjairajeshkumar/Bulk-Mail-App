require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// Gmail configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send email API
app.post("/sendemail", async function (req, res) {

    try {

        const { msg, emailList } = req.body;

        if (!msg || !msg.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        if (!Array.isArray(emailList) || emailList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Email list is empty"
            });
        }

        for (const email of emailList) {

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "A message from Bulk Mail App",
                text: msg
            });

            console.log("Email sent to: " + email);
        }

        res.status(200).json({
            success: true,
            message: "Emails sent successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to send emails"
        });

    }

});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log("Server started on port " + PORT);
});
