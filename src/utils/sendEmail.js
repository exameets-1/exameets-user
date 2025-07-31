// import nodeMailer from "nodemailer"

// export const sendEmail = async({email, subject, message, type = 'signin'})=>{
//     const transporter = nodeMailer.createTransport({
//         host : process.env.NEXT_PUBLIC_SMTP_HOST,
//         service: process.env.NEXT_PUBLIC_SMTP_SERVICE,
//         port : process.env.NEXT_PUBLIC_SMTP_PORT,
//         auth : {
//             user : type === 'signin' ? process.env.NEXT_PUBLIC_SMTP_MAIL_SIGNIN : process.env.NEXT_PUBLIC_SMTP_MAIL_LOGIN,
//             pass : type === 'signin' ? process.env.NEXT_PUBLIC_SMTP_PASSWORD_SIGNIN : process.env.NEXT_PUBLIC_SMTP_PASSWORD_LOGIN
//         }
//     })

//     const options = {
//         from : type === 'signin' ? process.env.NEXT_PUBLIC_SMTP_MAIL_SIGNIN : process.env.NEXT_PUBLIC_SMTP_MAIL_LOGIN,
//         to : email,
//         subject,
//         text : message
//     }
//     await transporter.sendMail(options);
// }

import nodeMailer from "nodemailer"

export const sendEmail = async({email, subject, message, type = 'signin'}) => {
    try {
        // Validate required environment variables
        const smtpHost = process.env.SMTP_HOST;
        const smtpService = process.env.SMTP_SERVICE;
        const smtpPort = process.env.SMTP_PORT;
        const smtpUser = type === 'signin' ? process.env.SMTP_MAIL_SIGNIN : process.env.SMTP_MAIL_LOGIN;
        const smtpPass = type === 'signin' ? process.env.SMTP_PASSWORD_SIGNIN : process.env.SMTP_PASSWORD_LOGIN;

        if (!smtpHost || !smtpService || !smtpPort || !smtpUser || !smtpPass) {
            throw new Error('Missing required SMTP configuration');
        }

        console.log('Configuring email transporter with:', {
            host: smtpHost,
            service: smtpService,
            port: smtpPort,
            user: smtpUser?.replace(/(.{3}).*(@.*)/, '$1***$2'), // Mask email for security
        });

        const transporter = nodeMailer.createTransport({
            host: smtpHost,
            service: smtpService,
            port: parseInt(smtpPort),
            secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: true, // Enable debug for more detailed logs
            logger: true
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log('SMTP transporter verified successfully');

        const options = {
            from: `"Exameets" <${smtpUser}>`,
            to: email,
            subject,
            text: message,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #015990;">Email Verification</h2>
                    <p>Your OTP for email verification is:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
                        ${message.match(/\d{6}/)?.[0] || 'OTP'}
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `
        };

        console.log('Sending email to:', email);
        const info = await transporter.sendMail(options);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Detailed email error:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        throw error;
    }
};