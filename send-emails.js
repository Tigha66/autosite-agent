// AutoCloser - Send Outreach Emails to Businesses

const businesses = require('./businesses');
const nodemailer = require('nodemailer');

// Email config
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'abdelhaktirha@gmail.com',
    pass: 'cqvi elia legz hbmv'
  }
});

// Demo site URLs (simulated - would be Netlify URLs)
const demoSites = {
  1: 'https://golden-fish-chips.netlify.app',
  2: 'https://lavender-hair-beauty.netlify.app',
  3: 'https://dave-s-plumbing-services.netlify.app',
  4: 'https://sweet-dreams-bakery.netlify.app',
  5: 'https://west-london-auto-repairs.netlify.app',
  6: 'https://tasty-kebab-house.netlify.app',
  7: 'https://elegant-nails-spa.netlify.app',
  8: 'https://green-thumb-gardening.netlify.app'
};

// Stripe payment link (demo)
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
    .features li:last-child { border: none; }
    .footer { margin-top: 20px; font-size: 12px; color: #888; text-center }
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
  
  <div class="footer">
    <p>You're receiving this because we found ${business.name} and built a free preview.</p>
    <p>To unsubscribe, reply "STOP"</p>
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
    console.log(`✅ Email sent to ${business.name} (${business.email})`);
    console.log(`   Message ID: ${info.messageId}`);
    return { success: true, business, messageId: info.messageId };
  } catch (err) {
    console.log(`❌ Failed to send to ${business.name}: ${err.message}`);
    return { success: false, business, error: err.message };
  }
}

async function sendAllEmails() {
  console.log('📧 Sending outreach emails to businesses...\n');
  
  const results = [];
  
  for (const business of businesses) {
    console.log(`\n📋 Processing: ${business.name}`);
    console.log(`   Email: ${business.email}`);
    
    const result = await sendOutreachEmail(business);
    results.push(result);
    
    // Random delay between emails
    await new Promise(r => setTimeout(r, 2000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 EMAIL SUMMARY');
  console.log('='.repeat(50));
  
  const sent = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Total businesses: ${results.length}`);
  console.log(`Emails sent: ${sent}`);
  console.log(`Failed: ${failed}`);
  
  results.forEach(r => {
    if (r.success) {
      console.log(`✅ ${r.business.name}`);
    } else {
      console.log(`❌ ${r.business.name}: ${r.error}`);
    }
  });
  
  return results;
}

// Export
module.exports = { sendOutreachEmail, sendAllEmails };

// Run if called directly
if (require.main === module) {
  sendAllEmails()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
