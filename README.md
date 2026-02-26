# Auto Closer - Automated Website Sales Agent

> Finds businesses → Builds demo sites → Sends outreach → Handles objections → Closes sales

---

## How It Works

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   FIND      │ →  │   BUILD      │ →  │   OUTREACH  │
│ Businesses  │    │   Demo Site  │    │   + Payment │
└──────────────┘    └──────────────┘    └──────────────┘
                                                │
                    ┌──────────────┐             │
                    │   HANDLE    │ ←───────────┘
                    │  Objections │
                    └──────────────┘
```

---

## Complete Sales Flow

### 1. Find Businesses Without Websites

**Sources:**
- Google Maps (via API or scraping)
- Yell.com
- Thomson Local
- Companies House
- Instagram (businesses with no website in bio)

**Criteria:**
- UK, London focus
- No website (verified via DNS)
- Has email or phone
- Active business

### 2. Build Demo Site Automatically

**Templates:**
| Category | Template |
|----------|----------|
| Restaurant | Menu + online ordering |
| Salon | Services + booking |
| Trades | Contact + quote form |
| Retail | Product showcase |
| Medical | Services + contact |
| Professional | Bio + services |

**Content Generated:**
- Business name + tagline
- Services list
- About section
- Contact details
- Location map
- Opening hours
- CTA buttons
- Social links placeholder

### 3. Send Outreach + Payment Link

**Initial Email:**
```
Subject: Free website for {BUSINESS_NAME}

Hi {OWNER_FIRST_NAME},

I noticed {BUSINESS_NAME} doesn't have a website, so I built you one for free!

Preview: {DEMO_URL}

This includes:
✅ Custom design for your business
✅ Your services
✅ Contact info & map
✅ Mobile-friendly
✅ Free SSL

It's yours for just £97/year.

Want it? Pay here: {PAYMENT_LINK}

Any questions? Just reply!

- AutoCloser
```

### 4. Handle Objections

**Common Objections + Responses:**

| Objection | Response |
|-----------|----------|
| "Too expensive" | "What would work for you? I can do £67/year" |
| "Need to think" | "Of course. What's holding you back?" |
| "Already have one" | "Great! Is it getting you customers? Happy to review it" |
| "Not right time" | "When would be better? I'll follow up" |
| "Send me details" | "What specific info do you need?" |
| "Call me" | "What's the best time? I'll call" |

### 5. Close the Sale

**Payment Flow:**
1. Stripe payment link in email
2. Auto-confirm on payment
3. Send welcome + launch instructions
4. Schedule setup call

---

## Automation Scripts

### Daily Runner
```javascript
// Run every morning at 6am
cron.schedule('0 6 * * *', async () => {
  const businesses = await findBusinesses(10);
  
  for (const business of businesses) {
    const site = await buildSite(business);
    await sendOutreach(business, site);
    await sleep(random(5, 30)); // Random delay
  }
});
```

### Follow-up Handler
```javascript
// Check for replies every hour
cron.schedule('0 * * * *', async () => {
  const replies = await checkEmailReplies();
  
  for (const reply of replies) {
    const response = handleObjection(reply);
    await sendResponse(reply, response);
  }
});
```

---

## Email Templates

### 1. Initial Outreach
```
Subject: Free website for {NAME}

Hi {FIRST_NAME},

Quick question - do you know that {BUSINESS} doesn't have a website?

I built a custom demo for you: {DEMO_URL}

It shows your services, contact info, location - everything customers need.

Cost: £97/year (or £197 with your own domain)

See it, love it, pay here: {STRIPE_LINK}

Questions? Just reply.

{Name}
```

### 2. Follow-up (After 2 days)
```
Subject: Did you see the website I made for {BUSINESS}?

Hi {FIRST_NAME},

Just checking in - did you get a chance to see the free website I made for {BUSINESS}?

{DEMO_URL}

It's fully custom and ready to go live. 

Let me know if you have any questions!

{Agent}
```

### 3. Handle "Too Expensive"
```
Subject: Re: Free website for {BUSINESS}

Hi {FIRST_NAME},

Totally understand budget is a factor.

What if I do it for £67/year? That's less than £6/month.

Pay here: {STRIPE_LINK}

Does that work?

{Agent}
```

### 4. Handle "Need to Think"
```
Subject: Re: Free website for {BUSINESS}

Hi {FIRST_NAME},

No problem! 

What specifically do you need to think about? Maybe I can help.

{Agent}
```

### 5. Close - Payment Received
```
Subject: 🎉 Website is LIVE!

Hi {FIRST_NAME},

Payment confirmed! Your website is now live at: {LIVE_URL}

Here's what happens next:
1. You own {YOURDOMAIN.COM}
2. SSL is automatic
3. Changes are free for 12 months

Questions? Just reply!

🎉 {Agent}
```

---

## Stripe Integration

### Payment Links
- £97/year: Basic site
- £197/year: Site + domain
- £397/year: Full package + SEO

### Webhook Handler
```javascript
app.post('/webhook/stripe', async (req, res) => {
  const event = req.body;
  
  if (event.type === 'checkout.session.completed') {
    const email = event.data.object.customer_email;
    const business = await findBusinessByEmail(email);
    
    // Launch site
    await launchSite(business);
    
    // Send welcome email
    await sendWelcome(business);
  }
});
```

---

## Objection Handler AI

```javascript
const objectionResponses = {
  expensive: {
    triggers: ['expensive', 'too much', 'budget', 'cheaper', 'cost'],
    responses: [
      "What would work for your budget?",
      "I can offer you a discount - what price makes sense?",
      "Let me do {DISCOUNTED_PRICE} for you instead."
    ]
  },
  think: {
    triggers: ['think', 'consider', 'not sure', 'maybe', 'later'],
    responses: [
      "What do you need to think about?",
      "What's holding you back?",
      "Can I answer any questions?"
    ]
  },
  have_website: {
    triggers: ['have website', 'already have', 'already got'],
    responses: [
      "Great! Is it bringing in customers?",
      "Would you like a second opinion on it?",
      "We can also do SEO to rank higher."
    ]
  },
  time: {
    triggers: ['time', 'busy', 'right now', 'later'],
    responses: [
      "When would be a better time?",
      "I'll follow up then.",
      "Quick call - when works for you?"
    ]
  },
  need_info: {
    triggers: ['send', 'details', 'more info', 'information'],
    responses: [
      "What specifically would you like to know?",
      "I can send over whatever you need.",
      "What questions do you have?"
    ]
  }
};

function handleObjection(emailText) {
  const text = emailText.toLowerCase();
  
  for (const [type, data] of Object.entries(objectionResponses)) {
    if (data.triggers.some(t => text.includes(t))) {
      return randomItem(data.responses);
    }
  }
  
  return "Thanks for your reply! Let me know how I can help.";
}
```

---

## Stats Dashboard

| Metric | Target |
|--------|--------|
| Sites built/day | 10 |
| Emails sent/day | 10 |
| Open rate | 40% |
| Reply rate | 8% |
| Close rate | 3% |
| Daily sales | £291 |
| Monthly | £8,730 |
| Yearly | £106,335 |

---

## Files

| File | Purpose |
|------|---------|
| `finder.js` | Find businesses |
| `builder.js` | Build demo sites |
| `outreach.js` | Send emails |
| `objection.js` | Handle responses |
| `closer.js` | Close sales |
| `stripe.js` | Payment handling |
| `scheduler.js` | Daily automation |

---

## Setup

```bash
npm install axios puppeteer nodemailer stripe dotenv

# Configure
cp .env.example .env
# Add API keys

# Run
node scheduler.js
```

---

**Want me to build the complete code for all these files?** 🚀
