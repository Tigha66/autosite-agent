# AutoSite Agent - Daily Automated Website Builder

## How It Works

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   FIND      │ →  │   BUILD     │ →  │   EMAIL     │ →  │   SCHEDULE  │
│ Businesses  │    │   Website   │    │   Preview   │    │   Daily     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Step 1: Find Businesses Without Websites

### Sources to Scrape:
1. **Google Maps** - Business listings
2. **Yell.com** - UK business directory
3. **Thomson Local** - UK directory
4. **Companies House** - Registered businesses
5. **Instagram/TikTok** - Businesses with social but no site

### Criteria:
- London UK location
- No website (check via DNS/Google)
- Has email or phone
- Active business

### Data to Collect:
```json
{
  "business_name": "John's Bakery",
  "address": "123 High Street, London",
  "postcode": "SW1A 1AA",
  "category": "Bakery",
  "phone": "+447000000000",
  "email": "john@example.com",
  "has_website": false
}
```

---

## Step 2: Build Custom Website

### Template Selection by Category:
| Category | Template |
|----------|----------|
| Restaurant | Restaurant template |
| Retail | Shop template |
| Salon | Beauty template |
| Trades | Service template |
| Medical | Healthcare template |
| Professional | Business template |

### Auto-Generated Content:
- Business name + tagline
- Services/products
- About section
- Contact info (from data)
- Location map embed
- Opening hours
- Testimonials section
- Call to action

### Deploy:
- Netlify (free)
- Custom subdomain: businessname.autosite.co.uk

---

## Step 3: Email Preview

### Email Template:
```
Subject: New website for {BUSINESS_NAME} - Free preview

Hi {OWNER_NAME},

I noticed {BUSINESS_NAME} doesn't have a website yet, so I built you one for free!

Preview here: https://{BUSINESS}.netlify.app

It's fully custom - just for {BUSINESS_NAME}. 

Want it? Reply YES and it's yours for £97/year.

- AutoSite Agent
```

---

## Step 4: Daily Automation

### Cron Schedule:
- **Time**: 6:00 AM daily
- **Limit**: 10 businesses/day
- **Sleep**: Random 5-30 min between emails

---

## Files Created

| File | Purpose |
|------|---------|
| `finder.js` | Find businesses without websites |
| `builder.js` | Generate and deploy websites |
| `emailer.js` | Send preview emails |
| `scheduler.js` | Daily cron automation |
| `config.js` | Configuration |

---

## Quick Start

```bash
# Install
npm install puppeteer axios nodemailer dotenv

# Configure
cp .env.example .env
# Add your SMTP, Google API keys

# Run manually
node scheduler.js
```

---

## Pricing for Clients

| Plan | Price |
|------|-------|
| Basic (site only) | £97/year |
| Pro (site + domain) | £197/year |
| Enterprise (full) | £397/year |

---

## Revenue Potential

| Daily | Monthly | Yearly |
|-------|---------|--------|
| 10 leads | 300 leads | 3,650 leads |
| 1% close | 3 sales | 36 sales |
| £291 | £873 | £10,476 |

---

**Want me to build this complete system?** 🚀
