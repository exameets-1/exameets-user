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
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            service: process.env.SMTP_SERVICE,
            port: parseInt(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: type === 'signin' ? process.env.SMTP_MAIL_SIGNIN : process.env.SMTP_MAIL_LOGIN,
                pass: type === 'signin' ? process.env.SMTP_PASSWORD_SIGNIN : process.env.SMTP_PASSWORD_LOGIN
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const options = {
            from: type === 'signin' ? process.env.SMTP_MAIL_SIGNIN : process.env.SMTP_MAIL_LOGIN,
            to: email,
            subject,
            text: message
        };

        const info = await transporter.sendMail(options);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};