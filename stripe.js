// AutoCloser - Stripe Integration
// Payment links and webhook handling

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  basic: {
    name: 'Basic Website',
    amount: 9700, // £97 in pence
    description: 'Custom website with your business info'
  },
  pro: {
    name: 'Pro Website + Domain',
    amount: 19700, // £197
    description: 'Everything in Basic + your own domain'
  },
  enterprise: {
    name: 'Full Package',
    amount: 39700, // £397
    description: 'Full package + SEO + priority support'
  }
};

async function createPaymentLink(business, site, tier = 'basic') {
  const price = PRICES[tier];
  
  // Create Stripe product
  const product = await stripe.products.create({
    name: `${business.name} - ${price.name}`,
    description: price.description
  });
  
  // Create price
  const priceObj = await stripe.prices.create({
    unit_amount: price.amount,
    currency: 'gbp',
    product: product.id
  });
  
  // Create payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: priceObj.id, quantity: 1 }],
    metadata: {
      business_id: business.id,
      business_name: business.name,
      site_url: site.previewUrl
    },
    after_completion: {
      type: 'redirect',
      redirect: {
        url: `${process.env.SUCCESS_URL || 'https://autocloser.io/success'}?business=${business.id}`
      }
    }
  });
  
  return paymentLink.url;
}

async function createPaymentLinkSimple(tier = 'basic') {
  // Simpler version using saved prices
  const prices = {
    basic: process.env.STRIPE_PRICE_BASIC,
    pro: process.env.STRIPE_PRICE_PRO,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE
  };
  
  const priceId = prices[tier];
  
  if (!priceId) {
    return process.env.STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test';
  }
  
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { tier }
  });
  
  return paymentLink.url;
}

// Webhook handler
async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handlePaymentSuccess(session);
      break;
      
    case 'checkout.session.expired':
      const expired = event.data.object;
      await handlePaymentExpired(expired);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  
  res.json({ received: true });
}

async function handlePaymentSuccess(session) {
  const { business_id, business_name, site_url } = session.metadata;
  
  console.log(`💰 PAYMENT SUCCESS: ${business_name}`);
  console.log(`   Amount: £${session.amount_total / 100}`);
  console.log(`   Site: ${site_url}`);
  
  // Launch the site
  await launchSite(business_id);
  
  // Send welcome email
  await sendWelcomeEmail(business_id);
  
  // Update database
  await updateBusinessStatus(business_id, 'paid');
}

async function handlePaymentExpired(session) {
  console.log(`⏰ PAYMENT EXPIRED: ${session.metadata.business_name}`);
  
  // Send reminder email
  await sendPaymentReminder(session.metadata.business_id);
}

async function launchSite(businessId) {
  console.log(`🚀 Launching site for business ${businessId}`);
  // Would actually deploy/make site live
}

async function sendWelcomeEmail(businessId) {
  console.log(`📧 Sending welcome email for business ${businessId}`);
  // Would send welcome email
}

async function updateBusinessStatus(businessId, status) {
  console.log(`📊 Updating business ${businessId} status to ${status}`);
  // Would update database
}

async function sendPaymentReminder(businessId) {
  console.log(`📧 Sending payment reminder for business ${businessId}`);
  // Would send "payment expired" follow-up
}

module.exports = {
  createPaymentLink,
  createPaymentLinkSimple,
  handleWebhook,
  PRICES
};
