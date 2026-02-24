const emailTamplates = {
  signupOTP: (otp) => ({
    subject: "Verify with OTP",
    body: `
        Dear User,

        Your One-Time Password (OTP) for completing your signup is: ${otp}

        Please enter this OTP to verify your account.
        Note: This code will expire in 10 minutes.

        Thank you for joining us!
        Best Regards,
        Via Menu 2.0 Team
    `,
  }),
  forgotPasswordOTP: (name, otp) => ({
    subject: "Reset Your Password - OTP Verification",
    body: `
      Hi ${name},
      
      We received a request to reset your password.
      
      Your One-Time Password (OTP) for password reset is: ${otp}

      Please use this code to reset your password. 
      Note: This OTP will expire in 10 minutes. 

      If you didn't request this, please ignore this email.

      Thank you,  
      Via Menu 2.0 Team
    `,
  }),
};
export { emailTamplates };
