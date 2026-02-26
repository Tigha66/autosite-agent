// AutoCloser - Email Handler
// Processes incoming email replies

const nodemailer = require('nodemailer');
const { handleObjection, shouldEscalate, getConversation } = require('./objection');
const { createPaymentLink, sendWelcome } = require('./stripe');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Store processed emails
const processedEmails = new Set();

async function checkReplies() {
  // This would connect to IMAP and check for new replies
  // For now, return empty array
  console.log('   (Checking for replies...)');
  return [];
}

async function processReply(reply) {
  const { from, subject, body, businessId } = reply;
  
  // Skip if already processed
  if (processedEmails.has(reply.id)) {
    return { processed: false, reason: 'already processed' };
  }
  
  processedEmails.add(reply.id);
  
  console.log(`   Processing: ${subject} from ${from}`);
  
  // Handle the objection
  const result = handleObjection(from, body);
  
  // Build response
  let responseText = result.response;
  
  // If interested, add payment link
  if (result.type === 'interested') {
    const business = await getBusiness(businessId);
    const site = await getSite(businessId);
    const paymentLink = await createPaymentLink(business, site);
    responseText = responseText.replace('{PAYMENT_LINK}', paymentLink);
  }
  
  // Send response
  await sendResponse(from, subject, responseText);
  
  // Check if should escalate
  if (result.escalate) {
    console.log(`   ⚠️ ESCALATING: ${from}`);
    await sendEscalationAlert(from, businessId);
  }
  
  // If "no" - remove from follow-ups
  if (result.type === 'no') {
    await removeFromFollowUps(businessId);
  }
  
  return { processed: true, type: result.type };
}

async function sendResponse(to, subject, text) {
  const isReply = subject.toLowerCase().startsWith('re:');
  const newSubject = isReply ? subject : `Re: ${subject}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"AutoCloser" <noreply@autocloser.io>',
    to,
    subject: newSubject,
    text
  };
  
  // In production: await transporter.sendMail(mailOptions);
  console.log(`   📧 Would send: ${newSubject}`);
  console.log(`   Response: ${text.substring(0, 100)}...`);
  
  return mailOptions;
}

async function sendWelcome(business) {
  const text = `
🎉 Welcome to AutoCloser!

Hi ${business.firstName},

Your website is now LIVE!

🌐 ${business.siteUrl}
🔗 Your domain: ${business.domain}

What's included:
✅ Your custom website (${business.template} template)
✅ Free SSL certificate
✅ Mobile-optimized
✅ 12 months of updates

Next steps:
1. Check out your site
2. Let me know any changes
3. Share with customers!

Questions? Just reply.

Best,
AutoCloser
  `;
  
  return sendResponse(business.email, 'Your website is LIVE!', text);
}

async function sendEscalationAlert(email, businessId) {
  // Alert the human owner
  const alertText = `
⚠️ ESCALATION NEEDED

Email: ${email}
Business ID: ${businessId}
Conversation: ${JSON.stringify(getConversation(email))}

Reply needed!
  `;
  
  // Would send to admin
  console.log(`   🚨 ESCALATION: ${email}`);
}

async function getBusiness(id) {
  // Get from database
  return { id, name: 'Business', email: 'test@test.com' };
}

async function getSite(id) {
  return { previewUrl: 'https://test.netlify.app' };
}

async function removeFromFollowUps(id) {
  console.log(`   🗑️ Removed ${id} from follow-ups`);
}

module.exports = {
  checkReplies,
  processReply,
  sendResponse,
  sendWelcome
};
