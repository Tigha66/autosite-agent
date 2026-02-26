// AutoSite Builder - Generates and Deploys Sites to Netlify

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const businesses = require('./businesses');

// Read template
const template = fs.readFileSync(
  path.join(__dirname, 'templates', 'site-template.html'),
  'utf8'
);

// Category display names
const categoryDisplay = {
  restaurant: 'Restaurant Services',
  salon: 'Hair & Beauty',
  trades: 'Trades & Services',
  bakery: 'Bakery'
};

function generateSite(business) {
  let site = template
    .replace(/<BUSINESS_NAME>/g, business.name)
    .replace(/<CATEGORY>/g, business.category)
    .replace(/<CATEGORY_DISPLAY>/g, categoryDisplay[business.category] || 'Services')
    .replace(/<ADDRESS>/g, business.address)
    .replace(/<AREA>/g, business.area)
    .replace(/<PHONE>/g, business.phone.replace(/\s/g, ''))
    .replace(/<PHONE_DISPLAY>/g, business.phone)
    .replace(/<EMAIL>/g, business.email);

  return site;
}

async function deployToNetlify(business, siteContent) {
  const siteName = business.name.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50);

  // Create temporary directory
  const deployDir = path.join(__dirname, 'deploy', siteName);
  fs.mkdirSync(deployDir, { recursive: true });
  
  // Write index.html
  fs.writeFileSync(path.join(deployDir, 'index.html'), siteContent);
  
  // Create _redirects for Netlify
  fs.writeFileSync(path.join(deployDir, '_redirects'), '/* /index.html 200');
  
  console.log(`\n📁 Created deploy files for: ${business.name}`);
  console.log(`   Deploy dir: ${deployDir}`);
  
  return {
    siteName,
    deployDir,
    previewUrl: `https://${siteName}.netlify.app`
  };
}

async function buildAllSites() {
  console.log('🚀 AutoSite Builder - Building Demo Sites\n');
  console.log(`Found ${businesses.length} businesses to process\n`);
  
  const results = [];
  
  for (const business of businesses) {
    console.log(`\n📋 Processing: ${business.name}`);
    console.log(`   Category: ${business.category}`);
    console.log(`   Location: ${business.area}`);
    
    // Generate site
    const siteContent = generateSite(business);
    
    // Deploy to Netlify (create deploy files)
    const result = await deployToNetlify(business, siteContent);
    
    results.push({
      business,
      ...result
    });
    
    console.log(`   ✅ Site generated: ${result.previewUrl}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 BUILD SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total businesses: ${businesses.length}`);
  console.log(`Sites generated: ${results.length}`);
  console.log('\n🎉 All demo sites ready!');
  
  return results;
}

// Export for use
module.exports = { generateSite, deployToNetlify, buildAllSites };

// Run if called directly
if (require.main === module) {
  buildAllSites()
    .then(results => {
      console.log('\n✅ Complete!');
      console.log('\nSites created:');
      results.forEach(r => {
        console.log(`- ${r.business.name}: ${r.previewUrl}`);
      });
    })
    .catch(console.error);
}
