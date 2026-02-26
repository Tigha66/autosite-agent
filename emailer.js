// AutoSite Agent - Email Sender
// Sends preview emails to businesses

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail(business, website) {
  const ownerName = business.name.split(' ')[0]; // First name as guess
  
  const subject = `New website for ${business.name} - Free preview`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hi ${ownerName},</h2>
    
    <p>I noticed that <strong>${business.name}</strong> doesn't have a website yet, so I built you one for free!</p>
    
    <p>It's completely custom-made for ${business.name}:</p>
    
    <p style="text-align: center; margin: 30px 0;">
      <a href="${website.url}" class="button">View Your Website</a>
    </p>
    
    <h3>What's included:</h3>
    <ul>
      <li>✅ Custom design for ${business.category}</li>
      <li>✅ Your contact information</li>
      <li>✅ Services overview</li>
      <li>✅ Opening hours</li>
      <li>✅ Mobile friendly</li>
      <li>✅ Free SSL certificate</li>
    </ul>
    
    <h3>Want to make it live?</h3>
    <p>Reply <strong>YES</strong> and I'll set it up for just <strong>£97/year</strong></p>
    
    <p>No commitment. No pressure. Just let me know!</p>
    
    <p>Best regards,<br>AutoSite Agent</p>
    
    <div class="footer">
      <p>You're receiving this because we found ${business.name} and built a free preview.</p>
      <p>To unsubscribe, just reply "STOP"</p>
    </div>
  </div>
</body>
</html>
  `;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"AutoSite Agent" <noreply@autosite.co.uk>',
    to: business.email,
    subject,
    html
  };
  
  // In production, actually send
  // await transporter.sendMail(mailOptions);
  
  console.log(`  📧 Would send to: ${business.email}`);
  console.log(`  Subject: ${subject}`);
  
  return { sent: true, to: business.email };
}

module.exports = { sendEmail };
