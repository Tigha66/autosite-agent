// AutoSite Agent - Business Finder
// Finds local businesses in London without websites

const axios = require('axios');
const dns = require('dns');
const { promisify } = require('util');

const lookup = promisify(dns.lookup);
const resolveMx = promisify(dns.resolveMx);

// UK Business categories to target
const CATEGORIES = [
  'restaurant',
  'cafe',
  'bakery',
  'salon',
  'barber',
  'plumber',
  'electrician',
  'carpenter',
  'cleaner',
  'gym',
  'dentist',
  'optician',
  'pharmacy',
  'shop',
  'store'
];

// London areas to target
const AREAS = [
  'Central London',
  'West London',
  'East London',
  'South London',
  'North London'
];

async function hasWebsite(domain) {
  try {
    await lookup(domain);
    return true;
  } catch {
    // Try with www
    try {
      await lookup('www.' + domain);
      return true;
    } catch {
      return false;
    }
  }
}

async function findBusinesses(limit = 10) {
  const businesses = [];
  const seen = new Set();
  
  // Try multiple sources in parallel
  const sources = [
    searchGoogleMaps,
    searchYell,
    searchThomson
  ];
  
  for (const source of sources) {
    if (businesses.length >= limit) break;
    
    try {
      const results = await source();
      
      for (const business of results) {
        if (businesses.length >= limit) break;
        
        const key = business.name + business.address;
        if (seen.has(key)) continue;
        seen.add(key);
        
        // Check if they have a website
        const domain = business.name.toLowerCase()
          .replace(/[^a-z0-9]/g, '') + '.co.uk';
        
        business.domain = domain;
        business.hasWebsite = await hasWebsite(domain);
        
        if (!business.hasWebsite) {
          businesses.push(business);
        }
      }
    } catch (err) {
      console.log(`  Source error: ${err.message}`);
    }
  }
  
  return businesses.slice(0, limit);
}

async function searchGoogleMaps() {
  // Using Google Maps API or scraping
  // Placeholder - would need API key
  return [];
}

async function searchYell() {
  // Scrape yell.com for London businesses
  const businesses = [];
  
  for (const category of CATEGORIES.slice(0, 3)) {
    try {
      const url = `https://www.yell.com/${category}s/in/london/`;
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000
      });
      
      // Parse HTML to extract business info
      // Simplified - would need proper parsing
      console.log(`  Scraped ${category} from Yell`);
    } catch (err) {
      // Skip if fails
    }
  }
  
  return businesses;
}

async function searchThomson() {
  // Similar to Yell
  return [];
}

// Export for testing
module.exports = { findBusinesses, hasWebsite, CATEGORIES, AREAS };
