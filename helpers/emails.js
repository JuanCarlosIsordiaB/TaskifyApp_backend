import nodemailer from 'nodemailer';

export const emailRegister = async(data) => {
    
    const {email, name, token} = data;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });


    //Information of the email
    const info = await transport.sendMail({
        from: '"Taskify - Project Administrator" <accounts@taskify.com>',
        to: email,
        subject: "Taskify - Confirm your account",
        text: 'Confirm your account to continue using Taskify',
        html: `
            <p>Hello: ${name}, We need to confirm your account.  </p>
            <p>Your account is almost ready, you just need to visit  <a href='${process.env.FRONTEND_URL}/confirm/${token}'> Confirm Account </a></p>

            <p>If you did not create this account, ignore this email.</p>
        
        
        `,
    })
}


export const emailForgetPassword = async(data) => {
    
    const {email, name, token} = data;

    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });


    //Information of the email
    const info = await transport.sendMail({
        from: '"Taskify - Project Administrator" <accounts@taskify.com>',
        to: email,
        subject: "Taskify - Reset your password",
        text: 'Reset your password to continue using Taskify',
        html: `
            <p>Hello: ${name}, We need to reset your password.  </p>
            <p>Your account is almost ready, you just need to visit  <a href='${process.env.FRONTEND_URL}/forget-password/${token}'> Reset your password </a></p>

            <p>If you did not request your password change, ignore this message.</p>
        
        
        `,
    })
}