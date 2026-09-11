# Anudip Foundation Website — Technical Breakdown

## 🗂️ What Kind of Project Is This?

This is a **multi-page static website** built without any framework or build tool.
It runs entirely in the browser — no server, no database, no backend.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Structure** | HTML5 (Semantic) | Page layout and content |
| **Styling** | Vanilla CSS3 | Design system, animations, responsive layout |
| **Logic** | Vanilla JavaScript (ES6+) | Form validation, chatbot, lightbox, tabs |
| **Fonts** | Google Fonts (Fraunces + Work Sans) | Premium typography |
| **AI** | OpenRouter API → `gpt-4o-mini` | Powers the AI chatbot widget |
| **Maps** | Google Maps Embed API | Branch location on contact page |
| **Version Control** | Git + GitHub | Source code management |

---

## 📁 File Architecture

```
anudip-foundation-website/
│
├── index.html           ← Home page
├── about.html           ← About Us + timeline
├── courses.html         ← Course listings
├── portfolio.html       ← Student projects (6 cards with AI photos)
├── faculty.html         ← Trainer profiles
├── events.html          ← Upcoming events + photo gallery
├── contact.html         ← Contact form + branch locations + map
├── donate.html          ← Donation page (UPI, bank, cheque)
│
├── style.css            ← Single global stylesheet (~500 lines)
├── script.js            ← Gallery lightbox + contact form validation
├── chatbot.js           ← AI chatbot widget (OpenRouter API)
├── about-extra.css/.js  ← About page animated timeline
│
├── config.js            ← API key (gitignored 🔒)
├── config.example.js    ← Template for developers
├── .env                 ← Environment vars (gitignored 🔒)
├── .env.example         ← Template for .env
├── .gitignore           ← Excludes secrets from GitHub
│
└── images/              ← All photos (AI-generated + real)
    ├── student.jpg
    ├── rahul-kumar.jpg      ← AI generated
    ├── sana-mallick.jpg     ← AI generated
    ├── arjun-toppo.jpg      ← AI generated
    ├── madhabi-das.jpg      ← AI generated
    ├── yamini-ramaswamy.jpg ← AI generated
    ├── event-certificate-day.jpg  ← AI generated
    └── ... (8 total event photos)
```

---

## 🔑 Key Technical Concepts Used

### 1. CSS Custom Properties (Variables)
Instead of repeating colours/fonts, the entire design system is defined once:
```css
:root {
  --ink:       #211a34;   /* primary text */
  --moss:      #345f49;   /* brand green  */
  --marigold:  #e5a736;   /* accent gold  */
  --paper:     #f7f4ef;   /* background   */
  --font-display: 'Fraunces', serif;
  --font-body:    'Work Sans', sans-serif;
  --radius:    8px;
  --wrap:      1140px;
}
```
**Why it matters:** Change one value → entire site updates. This is the same concept as design tokens in React/Tailwind.

---

### 2. CSS Grid & Flexbox (Responsive Layout)
Every page uses CSS Grid for the main layout and Flexbox for components:
```css
/* 3-column portfolio grid that collapses on mobile */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 960px) {
  .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .portfolio-grid { grid-template-columns: 1fr; }
}
```
**No CSS framework used** — this shows you understand layout fundamentals from scratch.

---

### 3. Pure CSS Mobile Menu (Checkbox Hack)
The hamburger menu works with **zero JavaScript**:
```html
<input type="checkbox" id="navCheck">       <!-- hidden checkbox -->
<nav class="main-nav">...</nav>
<label for="navCheck">☰</label>             <!-- triggers checkbox -->
```
```css
.main-nav { display: none; }
#navCheck:checked ~ .main-nav { display: flex; }
```
**Why it's clever:** Uses the CSS sibling selector `~` and `:checked` pseudo-class to toggle the nav without JS.

---

### 4. Async/Await + Fetch API (AI Chatbot)
The chatbot sends messages to OpenRouter's REST API:
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'openai/gpt-4o-mini',
    messages: [
      { role: 'system', content: ANUDIP_KNOWLEDGE },  // context prompt
      ...chatHistory.slice(-8)                          // last 8 messages
    ]
  })
});
const data = await response.json();
const reply = data.choices[0].message.content;
```
**Concepts:** REST API, JSON, async/await, error handling (try/catch), conversation history management.

---

### 5. DOM Manipulation & Event Handling
The contact form validates fields in real-time:
```javascript
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();  // stops page reload

  const email = document.getElementById('email').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // regex

  if (!emailPattern.test(email)) {
    setFieldError('email', 'Please enter a valid email address.');
  }
});
```
**Concepts:** Event listeners, `preventDefault()`, regex validation, DOM querying.

---

### 6. CSS background-image with object positioning
Portfolio photos are portrait headshots displayed in landscape cards:
```css
.portfolio-thumb {
  aspect-ratio: 3/2;
  background-size: cover;
  background-position: center 10%;  /* shows face, not cropped top */
}
```
**Why it matters:** Understanding `background-position` vs `object-position`, aspect ratios, and how `cover` scales images.

---

### 7. CSS Grid `grid-column: 1 / -1` (Full-span rows)
The gallery heading spans all 4 columns:
```css
.gallery-heading {
  grid-column: 1 / -1;  /* -1 means last column line */
}
```
This makes the heading sit above all tiles, aligned left — without breaking out of the grid container.

---

### 8. Secret Management (.env + .gitignore)
API keys are kept off GitHub using a two-file pattern:
```
.env          ← real secrets  →  added to .gitignore ✅
config.js     ← real key      →  added to .gitignore ✅

.env.example      ← placeholder  → committed to GitHub ✅
config.example.js ← placeholder  → committed to GitHub ✅
```
**Why it matters:** Industry standard security practice. If you push a real API key to GitHub, bots scrape it within seconds.

---

### 9. Semantic HTML5
Every page uses correct semantic elements:
```html
<header>, <nav>, <main>, <section>, <article>,
<aside>, <footer>, <figure>, <time>, <address>
```
Plus ARIA attributes for accessibility:
```html
<nav aria-label="Primary">
<button role="tab" aria-selected="true" aria-controls="panel-upi">
<div role="tabpanel" aria-labelledby="tab-upi">
```

---

## 🌟 Features You Can Highlight

| Feature | Technical Detail |
|---|---|
| **AI Chatbot** | OpenRouter API, `gpt-4o-mini`, conversation history, async/await |
| **Student Portfolio** | CSS Grid, background-image with position tricks, AI-generated photos |
| **Events Gallery** | CSS hover overlay with `::after` pseudo-element + opacity transition |
| **Contact Form** | JS validation, regex, DOM manipulation, error states |
| **Donate Page** | Tab UI with ARIA roles, UPI/Bank/Cheque details, 80G tax info, form validation with PAN regex |
| **Responsive Design** | CSS Grid + 3 breakpoints (960px, 640px, 480px), no framework |
| **Mobile Menu** | Pure CSS checkbox hack — no JavaScript needed |
| **Map Embed** | Google Maps iframe embed API |
| **Secret Management** | `.gitignore`, `.env` pattern, `config.js` gitignored |
| **Git/GitHub** | Version control, `git init`, `git push` |
| **SEO** | Meta descriptions, semantic HTML, single `<h1>` per page |

---

## 🗣️ How to Explain It in an Interview / Presentation

### One-line pitch:
> "A fully responsive 8-page static website for Anudip Foundation, built with HTML, CSS, and JavaScript — featuring an AI-powered chatbot, client-side form validation, a donation payment page, and a live Google Maps embed."

### If asked "Why no framework like React?"
> "For a content-driven informational site, vanilla HTML/CSS/JS gives the fastest load time with zero build tooling overhead. It also demonstrates that I understand the fundamentals — not just a framework API."

### If asked about the AI chatbot:
> "The chatbot uses the Fetch API to call OpenRouter's REST endpoint, which routes to GPT-4o-mini. I maintain a rolling conversation history of the last 8 messages and inject a system prompt with Anudip-specific context so the AI stays on-topic."

### If asked about security:
> "The API key is stored in `config.js` which is gitignored — it never reaches GitHub. I follow the `.env` pattern: a real secrets file locally, and a `.env.example` template committed to the repo for other developers."

---

## 📊 Project Stats

- **Pages:** 8 (index, about, courses, portfolio, faculty, events, contact, donate)
- **Lines of CSS:** ~540 lines, single stylesheet
- **Images:** 19 total (11 original + 8 AI-generated event photos + 5 AI-generated student portraits)
- **External dependencies:** 0 npm packages, 0 frameworks
- **APIs used:** OpenRouter (AI), Google Fonts, Google Maps Embed
