// AutoCloser - Main Sales Automation
// Finds businesses → Builds sites → Sends outreach → Handles objections → Closes sales

require('dotenv').config();
const { findBusinesses } = require('./finder');
const { buildSite } = require('./builder');
const { sendOutreach, sendFollowUp } = require('./outreach');
const { handleObjection, shouldEscalate } = require('./objection');
const { createPaymentLink, confirmPayment } = require('./stripe');
const { checkReplies, processReply } = require('./email-handler');

const DAILY_LIMIT = 10;
const FOLLOWUP_DELAY = 2; // days

async function sleep(min, max) {
  const ms = Math.random() * (max - min) + min;
  return new Promise(r => setTimeout(r, ms * 60 * 1000));
}

// ============== DAILY FLOW ==============

async function runDaily() {
  console.log('🚀 AutoCloser Daily Run');
  console.log(`📅 ${new Date().toISOString()}\n`);
  
  // Step 1: Find businesses
  console.log('🔍 Step 1: Finding businesses...');
  const businesses = await findBusinesses(DAILY_LIMIT);
  console.log(`   Found ${businesses.length} businesses\n`);
  
  if (businesses.length === 0) {
    console.log('❌ No businesses found');
    return;
  }
  
  // Step 2: Build demo sites
  console.log('🏗️ Step 2: Building demo sites...');
  const sites = [];
  
  for (const business of businesses) {
    try {
      const site = await buildSite(business);
      sites.push({ business, site });
      console.log(`   ✅ ${business.name} → ${site.previewUrl}`);
    } catch (err) {
      console.log(`   ❌ ${business.name}: ${err.message}`);
    }
  }
  
  console.log('');
  
  // Step 3: Send outreach
  console.log('📧 Step 3: Sending outreach...');
  
  for (const { business, site } of sites) {
    try {
      const paymentLink = await createPaymentLink(business, site);
      await sendOutreach(business, site, paymentLink);
      console.log(`   ✅ Sent to ${business.name}`);
      await sleep(5, 15); // 5-15 min delay
    } catch (err) {
      console.log(`   ❌ ${business.name}: ${err.message}`);
    }
  }
  
  // Summary
  console.log('\n📊 Daily Summary:');
  console.log(`   Businesses: ${businesses.length}`);
  console.log(`   Sites built: ${sites.length}`);
  console.log(`   Emails sent: ${sites.length}`);
  
  return sites;
}

// ============== REPLY HANDLING ==============

async function checkForReplies() {
  console.log('\n📬 Checking for replies...');
  
  const replies = await checkReplies();
  
  if (replies.length === 0) {
    console.log('   No new replies');
    return;
  }
  
  console.log(`   Found ${replies.length} replies`);
  
  for (const reply of replies) {
    await processReply(reply);
  }
}

// ============== SCHEDULER ==============

const cron = require('node-cron');

// Daily at 6am
cron.schedule('0 6 * * *', runDaily);

// Check replies every hour
cron.schedule('0 * * * *', checkForReplies);

// Follow-ups at 9am
cron.schedule('0 9 * * *', async () => {
  console.log('\n📧 Sending follow-ups...');
  const pending = getPendingOutreach();
  
  for (const p of pending) {
    if (daysSince(p.sentAt) >= FOLLOWUP_DELAY && p.followups < 2) {
      await sendFollowUp(p.business, p.site);
      console.log(`   ✅ Follow-up sent to ${p.business.name}`);
    }
  }
});

module.exports = { runDaily, checkForReplies };
