# Anudip Foundation — Website

A responsive, multi-page website inspired by the **Anudip Foundation for Social Welfare**, created as a student portfolio project.

The website presents Anudip's mission, courses, student projects, faculty, events, and contact information through a modern responsive interface.

> **Disclaimer:** This is an educational/student project inspired by the real Anudip Foundation. It is not the official Anudip Foundation website.

## 📌 About the Project

This is a fully responsive static website built with HTML, CSS, and vanilla JavaScript.

### Main Pages

| Page | Description |
|---|---|
| Home | Introduction, impact statistics, highlights, and calls to action |
| About Us | Mission, story, values, impact, timeline, and FAQ |
| Courses | Training programs and course details |
| Student Portfolio | Student projects and individual profiles |
| Faculty & Trainers | Trainer and programme profiles |
| Events & Gallery | Workshops, activities, and project events |
| Contact | Contact details, map, and enquiry form |

## ✨ Key Features

- Fully responsive design
- Mobile hamburger navigation
- Shared header and footer
- Light / dark theme toggle
- Theme preference saved with `localStorage`
- Animated hero sections
- Scroll animations using `IntersectionObserver`
- Student project portfolio
- Individual student profile pages
- Course detail pages with interactive accordions
- Faculty and trainer cards
- Events and gallery section
- AI chatbot using OpenRouter
- Contact form using Formspree
- Custom SVG illustrations
- No framework or build system required

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, responsive layouts, animations |
| JavaScript | Interactions and dynamic components |
| CSS Grid & Flexbox | Responsive layouts |
| IntersectionObserver | Scroll animations |
| Fetch API | Shared header/footer loading |
| LocalStorage | Theme persistence |
| OpenRouter API | AI chatbot |
| Formspree | Contact form |
| Google Fonts | Fraunces + Work Sans |

## 📁 Project Structure

```text
/
├── index.html
├── index.css
├── script.js
├── header.html
├── footer.html
├── chatbot.js
├── chatbot.css
├── config.example.js
├── anudip-logo.png
├── README.md
│
└── componenets/
    ├── about/
    │   ├── about.html
    │   ├── about.css
    │   ├── about.js
    │   ├── mission.png
    │   └── priya.png
    │
    ├── contact/
    │   ├── contact.html
    │   ├── contact.css
    │   └── contact.js
    │
    ├── courses/
    │   ├── courses.html
    │   ├── courses.css
    │   ├── courses.js
    │   ├── course-details.css
    │   ├── java-fullstack.html
    │   ├── python-web.html
    │   ├── aws.html
    │   ├── data-analytics.html
    │   ├── digital-marketing.html
    │   ├── graphic-design.html
    │   ├── tally.html
    │   └── english-it.html
    │
    ├── events/
    │   ├── events.html
    │   ├── events.css
    │   ├── events.js
    │   └── images/
    │
    ├── faculty/
    │   ├── faculty.html
    │   ├── faculty.css
    │   ├── faculty.js
    │   └── images/
    │
    └── students/
        ├── students.html
        ├── students.css
        ├── students.js
        ├── student-profile.css
        ├── student-profile.js
        ├── rahul.html
        ├── priya.html
        ├── sana.html
        ├── arjun.html
        ├── madhabi.html
        ├── yamini.html
        └── images/
```

> **Note:** The project currently uses the folder name `componenets`. Keep this spelling consistent in links and file paths unless you rename the folder everywhere.

## 🔗 Shared Header & Footer

Each page contains:

```html
<div id="header"></div>

<main id="main">
    <!-- Page content -->
</main>

<div id="footer"></div>
```

`script.js` loads `header.html` and `footer.html` and inserts them into these placeholders.

For a site served from the project root, root-relative paths are recommended:

```html
<a href="/index.html">Home</a>
<img src="/anudip-logo.png" alt="Anudip Foundation">
```

## 🌙 Light & Dark Mode

The selected theme is stored in the browser:

```javascript
localStorage.setItem("theme", "dark");
```

The theme is applied through the `<html>` element:

```html
<html data-theme="dark">
```

## 🤖 AI Chatbot

The project includes an AI chatbot powered by OpenRouter.

### Files

```text
chatbot.js
chatbot.css
config.example.js
config.js
```

### Setup

```bash
cp config.example.js config.js
```

Then add your API key to `config.js`.

```javascript
const OPENROUTER_API_KEY = "YOUR_API_KEY";
const OPENROUTER_MODEL = "openai/gpt-4o-mini";
```

**Never commit your real API key to GitHub.**

Add this to `.gitignore`:

```text
config.js
```

> For a production website, API requests should be handled by a backend because frontend API keys can be exposed.

## 📩 Contact Form

The Contact page uses Formspree.

```html
<form
    action="https://formspree.io/f/YOUR_FORM_ID"
    method="POST"
    id="contactForm">
```

Current fields:

- `name`
- `email`
- `reason`
- `message`

The button provides these states:

| State | Button |
|---|---|
| Idle | Send Message |
| Sending | Sending... |
| Success | Sent! ✓ |
| Error | Try again |

### Formspree Setup

1. Create a Formspree form.
2. Copy your endpoint.
3. Replace `YOUR_FORM_ID`.
4. Submit a test message.
5. Complete any email confirmation required by Formspree.

## 🎓 Student Portfolio

The portfolio includes:

| Student | Project |
|---|---|
| Priya Banerjee | Local Tutor Booking Site |
| Rahul Kumar | Household Budget Tracker |
| Sana Mallick | Crop Price Dashboard |
| Arjun Toppo | AI Resume Reviewer |
| Madhabi Das | NGO Volunteer Portal |
| Yamini Ramaswamy | Sales Performance Dashboard |

Each profile can present the student's project, skills, education, and project details.

## 📚 Course Detail Pages

Course pages follow a reusable structure:

```text
Hero
↓
Learning Pillars
↓
Interactive Curriculum
↓
Modules
↓
Learning Outcomes
↓
Course Statistics
↓
Enquiry CTA
```

The curriculum uses an interactive accordion.

## 👨‍🏫 Faculty & Trainers

Faculty profiles include:

- Profile image
- Name
- Role
- Experience
- Short description

Cards use scroll-in animations and subtle hover interactions.

## 🚀 Getting Started

### Requirements

- Modern web browser
- VS Code or another code editor
- Local static server

### VS Code Live Server

Install the **Live Server** extension.

Then:

```text
Right-click index.html
        ↓
Open with Live Server
```

### Python

From the project root:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

### Why use a server?

The shared header/footer are loaded with `fetch()`. Opening the site directly with `file:///` can prevent these requests from working because of browser security restrictions.

## 🔧 Troubleshooting

### Header or footer missing

Check that every page contains:

```html
<div id="header"></div>
<div id="footer"></div>
```

Then check the browser Console and Network tab for 404 errors.

### `Cannot GET` errors

Check that the folder name and links match exactly.

For this project, the current folder is:

```text
componenets
```

### Images not showing

Check:

1. The image exists.
2. The filename matches exactly.
3. The extension is correct.
4. The path is correct.

### Contact form not working

Check that the form contains a real Formspree endpoint:

```html
action="https://formspree.io/f/YOUR_FORM_ID"
```

### Chatbot not working

Check:

- `config.js` exists locally.
- The API key is valid.
- `config.js` loads before `chatbot.js`.
- `config.js` is not committed to GitHub.

## 📱 Responsive Design

The website is designed for:

- Mobile phones
- Tablets
- Laptops
- Desktop screens

Responsive CSS, Grid, Flexbox, and flexible typography are used throughout the project.

## 🎯 Project Goals

1. Create a professional NGO-inspired website.
2. Present training opportunities clearly.
3. Showcase student projects.
4. Demonstrate responsive web development.
5. Demonstrate JavaScript interaction and animation.
6. Integrate an AI-powered feature.
7. Integrate a working contact form.
8. Practice Git and GitHub collaboration.

## 👥 Team Project

This website was developed as a student group project.

Possible responsibilities include:

- UI/UX design
- HTML development
- CSS and responsive design
- JavaScript functionality
- Student portfolio content
- Course pages
- AI integration
- Contact form integration
- Testing and debugging
- GitHub collaboration
- Final presentation

## 📄 License

This project is intended for educational and portfolio purposes.

The Anudip Foundation name, branding, trademarks, and organization-specific information belong to the respective organization.

## 🙏 Credits

- **Inspired by:** Anudip Foundation for Social Welfare
- **Fonts:** Fraunces and Work Sans
- **AI integration:** OpenRouter
- **Contact form:** Formspree
- **Development:** Student portfolio project

---

⭐ **This project demonstrates a complete multi-page HTML/CSS/JavaScript website with reusable components, responsive design, animations, AI integration, and form handling.**
