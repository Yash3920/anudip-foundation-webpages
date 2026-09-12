/* =========================================================
   ANUDIP AI ASSISTANT — powered by OpenRouter
   API key + model come from config.js (gitignored).
   ========================================================= */

/* ---------- Inject the stylesheet once ---------- */
(function () {
  if (document.getElementById('chatbotStyles')) return;

  /* Reliable depth check: are we inside /components/ subfolder? */
  var isNested = window.location.pathname.includes('/components/');
  var prefix = isNested ? '../../' : './';

  var link = document.createElement('link');
  link.id = 'chatbotStyles';
  link.rel = 'stylesheet';
  link.href = prefix + 'chatbot.css';
  document.head.appendChild(link);
})();

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

  addMessage(question, 'user');
  chatHistory.push({ role: 'user', content: question });
  chatbotInput.value = '';
  chatbotSendBtn.disabled = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: chatHistory.slice(-8)
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