// AutoSite Agent - Website Builder
// Generates and deploys custom websites

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Template HTML by category
const TEMPLATES = {
  restaurant: (b) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${b.name} - Best ${b.category} in London</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <header class="bg-white shadow">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <h1 class="text-3xl font-bold text-gray-800">${b.name}</h1>
      <p class="text-gray-600">${b.category} in London</p>
    </div>
  </header>
  
  <section class="max-w-6xl mx-auto px-4 py-12">
    <h2 class="text-2xl font-bold mb-6">Our Services</h2>
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="font-bold text-lg">Quality Service</h3>
        <p class="text-gray-600">Professional ${b.category} services in London</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="font-bold text-lg">Experienced Team</h3>
        <p class="text-gray-600">Years of experience serving London</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="font-bold text-lg">Free Quote</h3>
        <p class="text-gray-600">Contact us for a free consultation</p>
      </div>
    </div>
  </section>
  
  <section class="bg-white py-12">
    <div class="max-w-6xl mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6">Contact Us</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <p class="text-lg mb-2">📍 ${b.address}</p>
          <p class="text-lg mb-2">📞 ${b.phone}</p>
          <p class="text-lg mb-2">✉️ ${b.email || 'Email us today'}</p>
        </div>
        <div class="bg-gray-100 p-6 rounded-lg">
          <h3 class="font-bold text-lg mb-4">Opening Hours</h3>
          <p>Mon-Fri: 9am - 6pm</p>
          <p>Sat: 10am - 4pm</p>
          <p>Sun: Closed</p>
        </div>
      </div>
    </div>
  </section>
  
  <footer class="bg-gray-800 text-white py-8">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <p>&copy; 2026 ${b.name}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
`,
  
  default: (b) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${b.name} - ${b.category} in London</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
    <div-4xl mx-auto px-4 class="max-w text-center">
      <h1 class="text-4xl font-bold mb-4">${b.name}</h1>
      <p class="text-xl">Professional ${b.category} services in London</p>
    </div>
  </header>
  
  <section class="max-w-4xl mx-auto px-4 py-12">
    <h2 class="text-2xl font-bold mb-6 text-center">About Us</h2>
    <p class="text-gray-700 text-lg text-center mb-8">
      We are a professional ${b.category} business serving London with quality services.
      Contact us today for a free consultation.
    </p>
  </section>
  
  <section class="bg-white py-12">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6 text-center">Get In Touch</h2>
      <div class="text-center space-y-4">
        <p class="text-xl">📍 ${b.address}</p>
        <p class="text-xl">📞 ${b.phone}</p>
        <p class="text-xl">✉️ ${b.email || 'Email us today'}</p>
      </div>
    </div>
  </section>
  
  <footer class="bg-gray-800 text-white py-6 text-center">
    <p>&copy; 2026 ${b.name}</p>
  </footer>
</body>
</html>
`
};

function getTemplate(category) {
  return TEMPLATES[category] || TEMPLATES.default;
}

async function buildWebsite(business) {
  const template = getTemplate(business.category);
  const html = template(business);
  
  // Create site directory
  const siteDir = path.join(__dirname, 'sites', business.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  fs.mkdirSync(siteDir, { recursive: true });
  
  // Write index.html
  const indexPath = path.join(siteDir, 'index.html');
  fs.writeFileSync(indexPath, html);
  
  // Deploy to Netlify (simplified - would use API)
  const siteName = business.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
  
  // In production, would deploy via Netlify API
  const url = `https://${siteName}.netlify.app`;
  
  return {
    name: business.name,
    category: business.category,
    html,
    url,
    deployed: false // Would be true after deployment
  };
}

module.exports = { buildWebsite, getTemplate };
