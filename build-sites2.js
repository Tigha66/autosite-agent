// AutoSite Builder - Batch 2

const fs = require('fs');
const path = require('path');
const businesses = require('./businesses2');

const template = fs.readFileSync(
  path.join(__dirname, 'templates', 'site-template.html'),
  'utf8'
);

const categoryDisplay = {
  restaurant: 'Café & Restaurant',
  salon: 'Hair & Beauty',
  trades: 'Trades & Services',
  bakery: 'Bakery',
  medical: 'Pharmacy & Health',
  retail: 'Retail Shop'
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

  const deployDir = path.join(__dirname, 'deploy', siteName);
  fs.mkdirSync(deployDir, { recursive: true });
  fs.writeFileSync(path.join(deployDir, 'index.html'), siteContent);
  fs.writeFileSync(path.join(deployDir, '_redirects'), '/* /index.html 200');

  return {
    siteName,
    deployDir,
    previewUrl: `https://${siteName}.netlify.app`
  };
}

async function buildAllSites() {
  console.log('🚀 AutoSite Builder - Batch 2\n');
  console.log(`Found ${businesses.length} businesses to process\n`);
  
  const results = [];
  
  for (const business of businesses) {
    console.log(`📋 ${business.name} (${business.area})`);
    const siteContent = generateSite(business);
    const result = await deployToNetlify(business, siteContent);
    results.push({ business, ...result });
    console.log(`   ✅ ${result.previewUrl}`);
  }
  
  console.log('\n🎉 All sites built!');
  return results;
}

module.exports = { generateSite, deployToNetlify, buildAllSites };

if (require.main === module) {
  buildAllSites().then(console.log);
}
