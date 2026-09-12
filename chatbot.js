/* =========================================================
   ANUDIP AI ASSISTANT — powered by OpenRouter
   API key + model come from config.js (gitignored).
   ========================================================= */

/* ---------- Inject the stylesheet once ---------- */
(function () {
  if (document.getElementById('chatbotStyles')) return;

  // Work out how deep we are, so the path works from any page
  var depth = window.location.pathname.split('/').filter(Boolean).length;
  var prefix = '';

  // If we're not at the site root, walk back up
  // Adjust this if your folder structure is different.
  // Example: /pages/faculty/faculty.html → depth = 3 → prefix = '../../'
  // If your site is served from a subfolder (e.g. /anudip/), this still works.
  if (depth > 1) {
    prefix = '../'.repeat(depth - 1);
  }

  var link = document.createElement('link');
  link.id = 'chatbotStyles';
  link.rel = 'stylesheet';
  link.href = prefix + 'chatbot.css';
  document.head.appendChild(link);
})();

/* ---------- Knowledge sent with every request ---------- */
const ANUDIP_KNOWLEDGE = `
You are the AI assistant on the Anudip Foundation website, an Indian NGO
(founded 2007, Kolkata) that trains marginalised youth and women in digital
and vocational skills and helps place them in jobs.

Key facts: 7,30,000+ learners trained, 53% women, 90+ centres across 22
Indian states and 3 countries, 70% job placement rate, 300% average rise in
family income, 400+ corporate hiring partners (Accenture, Infosys, Axis
Bank, Capgemini, IndiGo, HCLTech, Zomato, iMerit).

Courses: Web Development with React, Python, Java Full-Stack, AWS, Data
Analytics, Digital Marketing, Graphic Design, Accounting with Tally Prime,
English Communication & IT — most priced at ₹1,000.

Tracks: DeepTech (advanced software), Diya (foundations for at-risk youth),
FuturePro (ICT literacy), AI Academy (applied AI).

Contact: Mira Towers, Sector V, Salt Lake, Kolkata 700091.
Phone +91 33 2357 7406. Email connect@anudip.org.

Answer in 2-4 sentences unless more detail is asked for. If a question is
unrelated to Anudip Foundation, politely redirect. If unsure of a detail,
say so and suggest emailing connect@anudip.org.
`.trim();

/* ---------- Inject widget HTML ---------- */
const chatbotHTML = `
  <button class="chatbot-bubble" id="chatbotBubble" aria-label="Open Anudip AI assistant">💬</button>
  <div class="chatbot-panel" id="chatbotPanel" role="dialog" aria-label="Anudip AI assistant">
    <div class="chatbot-header">
      <h3>Ask Anudip AI</h3>
      <button id="chatbotCloseBtn" aria-label="Close chat">✕</button>
    </div>
    <div class="chatbot-messages" id="chatbotMessages">
      <div class="chatbot-msg from-bot">Hi! Ask me anything about Anudip Foundation — courses, impact, volunteering or donating.</div>
    </div>
    <div class="chatbot-input-row">
      <input type="text" id="chatbotInput" placeholder="Ask a question..." autocomplete="off">
      <button id="chatbotSendBtn">Send</button>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', chatbotHTML);

/* ---------- Wire up UI ---------- */
const chatbotBubble = document.getElementById('chatbotBubble');
const chatbotPanel = document.getElementById('chatbotPanel');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSendBtn = document.getElementById('chatbotSendBtn');

chatbotBubble.addEventListener('click', () => {
  chatbotPanel.classList.toggle('is-open');
  if (chatbotPanel.classList.contains('is-open')) chatbotInput.focus();
});
document.getElementById('chatbotCloseBtn').addEventListener('click', () => {
  chatbotPanel.classList.remove('is-open');
});

/* Close on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatbotPanel.classList.contains('is-open')) {
    chatbotPanel.classList.remove('is-open');
  }
});

/* ---------- Chat logic ---------- */
let chatHistory = [];

function addMessage(text, from) {
  const msg = document.createElement('div');
  msg.className = `chatbot-msg from-${from}`;
  msg.textContent = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

async function sendChatMessage() {
  const question = chatbotInput.value.trim();
  if (!question) return;

  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "PASTE_YOUR_OPENROUTER_API_KEY_HERE") {
    addMessage('The site owner needs to add an OpenRouter API key in config.js first.', 'system');
    return;
  }

  addMessage(question, 'user');
  chatHistory.push({ role: 'user', content: question });
  chatbotInput.value = '';
  chatbotSendBtn.disabled = true;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.href,
        'X-Title': 'Anudip Foundation Website'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'system', content: ANUDIP_KNOWLEDGE }, ...chatHistory.slice(-8)]
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't get a response.";
    addMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    console.error('Chatbot error:', err);
    addMessage('Something went wrong reaching the AI. Please try again shortly.', 'system');
  } finally {
    chatbotSendBtn.disabled = false;
  }
}

chatbotSendBtn.addEventListener('click', sendChatMessage);
chatbotInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });