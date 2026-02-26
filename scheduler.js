// AutoSite Agent - Main Scheduler
// Runs daily to find, build, and email websites

require('dotenv').config();
const { findBusinesses } = require('./finder');
const { buildWebsite } = require('./builder');
const { sendEmail } = require('./emailer');

const DAILY_LIMIT = 10; // Websites per day
const DELAY_MIN = 5; // Minutes between emails
const DELAY_MAX = 30;

async function sleep(min, max) {
  const ms = Math.random() * (max - min) + min;
  return new Promise(r => setTimeout(r, ms * 60 * 1000));
}

async function runDaily() {
  console.log('🚀 AutoSite Agent starting...');
  console.log(`📅 ${new Date().toISOString()}`);
  
  // Step 1: Find businesses
  console.log('\n🔍 Step 1: Finding businesses without websites...');
  const businesses = await findBusinesses(DAILY_LIMIT);
  
  if (businesses.length === 0) {
    console.log('❌ No businesses found today');
    return;
  }
  
  console.log(`✅ Found ${businesses.length} businesses`);
  
  // Step 2: Build websites
  console.log('\n🏗️ Step 2: Building websites...');
  const results = [];
  
  for (const business of businesses) {
    try {
      console.log(`  Building for: ${business.name}...`);
      const website = await buildWebsite(business);
      results.push({ business, website, success: true });
      console.log(`  ✅ ${website.url}`);
    } catch (err) {
      console.log(`  ❌ Failed: ${err.message}`);
      results.push({ business, error: err.message, success: false });
    }
  }
  
  // Step 3: Send emails
  console.log('\n📧 Step 3: Sending preview emails...');
  let sent = 0;
  
  for (const result of results) {
    if (!result.success) continue;
    
    try {
      await sendEmail(result.business, result.website);
      sent++;
      console.log(`  ✅ Emailed: ${result.business.name}`);
      
      // Random delay between emails
      if (sent < results.filter(r => r.success).length) {
        await sleep(DELAY_MIN, DELAY_MAX);
      }
    } catch (err) {
      console.log(`  ❌ Email failed: ${err.message}`);
    }
  }
  
  // Summary
  console.log('\n📊 Daily Summary:');
  console.log(`  Businesses found: ${businesses.length}`);
  console.log(`  Websites built: ${results.filter(r => r.success).length}`);
  console.log(`  Emails sent: ${sent}`);
  
  return results;
}

// Run if called directly
if (require.main === module) {
  runDaily()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runDaily };
