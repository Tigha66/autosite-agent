// AutoCloser - Objection Handler
// AI-powered objection handling

const objectionDB = {
  expensive: {
    triggers: ['expensive', 'too much', 'budget', 'cheaper', 'cost', 'price', 'money', '£', 'pounds'],
    responses: [
      "Totally understand budget is a factor. What if I do it for £67/year - that's less than £6/month?",
      "I hear you. What price point works for you? I want to make this happen.",
      "Let me give you a discount - £77/year. Deal?"
    ],
    escalateIf: 3 // Escalate after 3 tries
  },
  
  think: {
    triggers: ['think', 'consider', 'not sure', 'maybe', 'later', 'going to', 'will'],
    responses: [
      "What specifically do you need to think about?",
      "What's holding you back? Maybe I can help.",
      "Can I answer any questions that would help you decide?"
    ],
    escalateIf: 2
  },
  
  have_website: {
    triggers: ['have website', 'already have', 'already got', 'have one', 'site already'],
    responses: [
      "Great! Is it bringing in customers? Happy to take a look.",
      "Would you like a second opinion on it? We also do SEO.",
      "What's working/not working about it?"
    ],
    escalateIf: 999 // Don't escalate - they're not a prospect
  },
  
  not_right_time: {
    triggers: ['time', 'busy', 'right now', 'later', 'moment', 'momentarily', 'call back'],
    responses: [
      "Completely understand. When would be a better time?",
      "I'll follow up in a couple weeks. What's the best month?",
      "Quick question - what's the main thing holding you back right now?"
    ],
    escalateIf: 2
  },
  
  need_info: {
    triggers: ['send', 'details', 'more info', 'information', 'tell me', 'what is', 'how much'],
    responses: [
      "What specifically would you like to know?",
      "I can send over a brochure, case studies, or answer any questions.",
      "What questions do you have?"
    ],
    escalateIf: 999
  },
  
  call_me: {
    triggers: ['call', 'phone', 'speak', 'talk'],
    responses: [
      "Absolutely! When's the best time to call?",
      "Sure, what's your number and when works for you?",
      "I'll call you today. What's the best time?"
    ],
    escalateIf: 999
  },
  
  interested: {
    triggers: ['yes', 'interested', 'want', 'like', 'love', 'sure', 'ok', 'good'],
    responses: [
      "Awesome! Here's the payment link: {PAYMENT_LINK}",
      "Great! Pay here to make it live: {PAYMENT_LINK}",
      "Perfect! Let's get this done: {PAYMENT_LINK}"
    ],
    escalateIf: 0
  },
  
  no: {
    triggers: ['no', 'not interested', 'dont want', 'not for me', 'stop', 'unsubscribe'],
    responses: [
      "No problem! If you ever need a website in the future, I'm here.",
      "Understand. Thanks for your time!",
      "Fair enough. Best of luck with everything!"
    ],
    escalateIf: 0 // Don't follow up
  }
};

let conversationHistory = new Map();

function handleObjection(email, replyText) {
  const text = replyText.toLowerCase();
  
  // Get or init conversation
  if (!conversationHistory.has(email)) {
    conversationHistory.set(email, {
      count: 0,
      type: null,
      lastContact: Date.now()
    });
  }
  
  const convo = conversationHistory.get(email);
  convo.count++;
  convo.lastContact = Date.now();
  
  // Find matching objection type
  let matchedType = null;
  let matchedResponse = null;
  
  for (const [type, data] of Object.entries(objectionDB)) {
    if (data.triggers.some(t => text.includes(t))) {
      matchedType = type;
      
      // Check if should escalate
      if (data.escalateIf !== 999 && convo.count >= data.escalateIf) {
        return {
          response: "Let me have my manager call you to discuss.",
          escalate: true
        };
      }
      
      // Get random response
      matchedResponse = data.responses[Math.floor(Math.random() * data.responses.length)];
      break;
    }
  }
  
  // Default response if no match
  if (!matchedResponse) {
    matchedResponse = "Thanks for getting back to me! Let me know how I can help.";
  }
  
  convo.type = matchedType;
  
  return {
    response: matchedResponse,
    escalate: false,
    type: matchedType
  };
}

function shouldEscalate(email) {
  const convo = conversationHistory.get(email);
  return convo && convo.count >= 3;
}

function getConversation(email) {
  return conversationHistory.get(email);
}

function clearConversation(email) {
  conversationHistory.delete(email);
}

// Export for storage
function saveConversations() {
  return JSON.stringify([...conversationHistory.entries()]);
}

function loadConversations(data) {
  if (data) {
    conversationHistory = new Map(JSON.parse(data));
  }
}

module.exports = {
  handleObjection,
  shouldEscalate,
  getConversation,
  clearConversation,
  saveConversations,
  loadConversations,
  objectionDB
};
