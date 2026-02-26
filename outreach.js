// AutoCloser - Email Outreach
// Sends outreach emails with payment links

const nodemailer = require('nodemailer');
const { createPaymentLink } = require('./stripe');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Store outreach history
const outreachHistory = new Map();

async function sendOutreach(business, site, paymentLink) {
  const firstName = business.name.split(' ')[0] || 'there';
  
  const subject = `Free website for ${business.name}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 12px; margin-top: 20px; }
    .button { display: inline-block; padding: 14px 28px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
    .button:hover { background: #5a6fd6; }
    .features { list-style: none; padding: 0; }
    .features li { padding: 8px 0; border-bottom: 1px solid #eee; }
    .features li:last-child { border: none; }
    .footer { margin-top: 20px; font-size: 12px; color: #888; text-align: center; }
    .price { font-size: 24px; font-weight: bold; color: #667eea; }
    .price-old { text-decoration: line-through; color: #999; font-size: 16px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">🎉 Free Website Preview</h1>
    <p style="margin: 10px 0 0 0;">Made specifically for ${business.name}</p>
  </div>
  
  <div class="content">
    <p>Hi ${firstName},</p>
    
    <p>I noticed <strong>${business.name}</strong> doesn't have a website yet, so I built you one for free!</p>
    
    <p style="text-align: center;">
      <a href="${site.previewUrl}" class="button">👀 View Your Free Website</a>
    </p>
    
    <h3>What's included:</h3>
    <ul class="features">
      <li>✅ Custom design for ${business.category}</li>
      <li>✅ Your services & products</li>
      <li>✅ Contact info & map</li>
      <li>✅ Opening hours</li>
      <li>✅ Mobile-friendly</li>
      <li>✅ Free SSL certificate</li>
    </ul>
    
    <p style="text-align: center; margin: 30px 0;">
      <span class="price-old">£197</span>
      <span class="price">£97/year</span>
    </p>
    
    <p style="text-align: center;">
      <a href="${paymentLink}" class="button" style="background: #22c55e;">💳 Get It Now</a>
    </p>
    
    <p><em>No commitment. See it first, then decide.</em></p>
    
    <p>Questions? Just reply!</p>
    
    <p>Best regards,<br>AutoCloser</p>
  </div>
  
  <div class="footer">
    <p>You're receiving this because we found ${business.name} and built a free preview.</p>
    <p>To unsubscribe, reply "STOP"</p>
  </div>
</body>
</html>
  `;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"AutoCloser" <noreply@autocloser.io>',
    to: business.email,
    subject,
    html
  };
  
  // In production: await transporter.sendMail(mailOptions);
  console.log(`   📧 Would send to: ${business.email}`);
  console.log(`   Subject: ${subject}`);
  
  // Store in history
  outreachHistory.set(business.id, {
    business,
    site,
    sentAt: Date.now(),
    followups: 0
  });
  
  return mailOptions;
}

async function sendFollowUp(business, site) {
  const firstName = business.name.split(' ')[0] || 'there';
  
  const subject = `Did you see the website I made for ${business.name}?`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 12px; }
    .button { display: inline-block; padding: 14px 28px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="content">
    <p>Hi ${firstName},</p>
    
    <p>Just checking in - did you get a chance to see the free website I made for ${business.name}?</p>
    
    <p>Preview: <a href="${site.previewUrl}">${site.previewUrl}</a></p>
    
    <p>It's fully custom and ready to go live. Just £97/year.</p>
    
    <p>Let me know if you have any questions!</p>
    
    <p>Best,<br>AutoCloser</p>
  </div>
</body>
</html>
  // Update `;
  
  follow-up count
  const record = outreachHistory.get(business.id);
  if (record) {
    record.followups++;
  }
  
  return { sent: true, followup: true };
}

function getPendingOutreach() {
  return [...outreachHistory.values()];
}

function getOutreachRecord(businessId) {
  return outreachHistory.get(businessId);
}

module.exports = {
  sendOutreach,
  sendFollowUp,
  getPendingOutreach,
  getOutreachRecord
};
