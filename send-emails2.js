// AutoCloser - Batch 2 Emails

const businesses = require('./businesses2');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'abdelhaktirha@gmail.com',
    pass: 'cqvi elia legz hbmv'
  }
});

const demoSites = {
  9: 'https://peckham-dry-cleaners.netlify.app',
  10: 'https://hackney-carpets.netlify.app',
  11: 'https://camden-coffee-house.netlify.app',
  12: 'https://islington-pharmacy.netlify.app',
  13: 'https://wimbledon-hair-studio.netlify.app',
  14: 'https://brixton-pet-shop.netlify.app',
  15: 'https://kensington-plumbing.netlify.app',
  16: 'https://shoreditch-cafe.netlify.app',
  17: 'https://notting-hill-bakery.netlify.app',
  18: 'https://chelsea-dog-grooming.netlify.app',
  19: 'https://stratford-auto-centre.netlify.app',
  20: 'https://clapham-yoga-studio.netlify.app'
};

const paymentLink = 'https://buy.stripe.com/test';

async function sendOutreachEmail(business) {
  const demoUrl = demoSites[business.id];
  const firstName = business.owner.split(' ')[0];
  
  const subject = `Free website for ${business.name} - Preview inside!`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 12px; margin-top: 20px; }
    .button { display: inline-block; padding: 14px 28px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0; }
    .button-green { background: #22c55e; }
    .features { list-style: none; padding: 0; }
    .features li { padding: 8px 0; border-bottom: 1px solid #eee; }
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
    
    <p>I noticed that <strong>${business.name}</strong> doesn't have a website yet, so I built you one for free!</p>
    
    <p style="text-align: center;">
      <a href="${demoUrl}" class="button" target="_blank">👀 View Your Free Website</a>
    </p>
    
    <h3>What's included:</h3>
    <ul class="features">
      <li>✅ Custom design for your ${business.category}</li>
      <li>✅ Your contact information & map</li>
      <li>✅ Services overview</li>
      <li>✅ Opening hours</li>
      <li>✅ Mobile-friendly</li>
      <li>✅ Free SSL certificate</li>
    </ul>
    
    <p style="text-align: center; margin: 30px 0;">
      <span class="price-old">£197</span>
      <span class="price">£97/year</span>
    </p>
    
    <p style="text-align: center;">
      <a href="${paymentLink}" class="button button-green" target="_blank">💳 Get It Now for £97</a>
    </p>
    
    <p><em>No commitment. See it first, then decide!</em></p>
    
    <p>Questions? Just reply!</p>
    
    <p>Best regards,<br>Abdelhak<br>AutoAI Web Solutions<br><a href="https://autoaiwebsolutions.com">autoaiwebsolutions.com</a></p>
  </div>
</body>
</html>
  `;
  
  const mailOptions = {
    from: '"Abdelhak - AutoAI Web Solutions" <abdelhaktirha@gmail.com>',
    to: business.email,
    subject,
    html
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ ${business.name}: ${business.email}`);
    return { success: true, business, messageId: info.messageId };
  } catch (err) {
    console.log(`❌ ${business.name}: ${err.message}`);
    return { success: false, business, error: err.message };
  }
}

async function sendAllEmails() {
  console.log('📧 Sending Batch 2 emails...\n');
  
  for (const business of businesses) {
    console.log(`📋 ${business.name}...`);
    await sendOutreachEmail(business);
    await new Promise(r => setTimeout(r, 1500));
  }
  
  console.log('\n✅ All Batch 2 emails sent!');
}

if (require.main === module) {
  sendAllEmails().then(() => process.exit(0));
}

module.exports = { sendOutreachEmail, sendAllEmails };
