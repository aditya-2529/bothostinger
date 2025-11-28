const { Resend } = require('resend');

// Replace with your actual API Key from Resend.com
const resend = new Resend('re_PtwvraPT_YovTEKzPPZt4SFZB2ot2zaRx'); 

async function sendWelcomeEmail(email, username, otp) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BotHost <onboarding@resend.dev>', // Use 'onboarding@yourdomain.com' later
            to: [email],
            subject: 'Verify your BotHost Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #7c3aed;">Welcome to BotHost! 🚀</h2>
                    <p>Hi ${username},</p>
                    <p>Thanks for joining the ultimate Discord bot hosting platform. To get started, please verify your email address.</p>
                    
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
                            ${otp}
                        </span>
                    </div>
                    
                    <p>This code will expire in 10 minutes.</p>
                    <p>Happy Hosting,<br>The BotHost Team</p>
                </div>
            `,
        });

        if (error) {
            console.error("Email Error:", error);
            return false;
        }
        return true;
    } catch (err) {
        console.error("Email Exception:", err);
        return false;
    }
}

module.exports = { sendWelcomeEmail };