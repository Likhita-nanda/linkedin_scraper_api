# linkedin_scraper_api
---
Task 2 — LinkedIn Profile Scraper Chrome Extension
📘 Overview

This project is a Chrome Extension that scrapes a user’s LinkedIn profile information such as their name, about, bio, followers, connections, and more — then stores the data in a local database using a Node.js (Express + Sequelize + SQLite) backend.

It helps automate data collection from LinkedIn profiles for analysis or personal use, without manually copying profile details.
---
⚙️ Features

🔍 Automatically scrapes LinkedIn profile data using DOM selectors.

💾 Saves scraped profiles to a local SQLite database.

🌐 Communicates with the backend using REST APIs (/profiles).

📋 Displays success status in the popup window.

🧱 Modular structure for easy customization.
---
```
linkedin-scraper-extension/
│
├── manifest.json           # Chrome Extension configuration file  
├── popup.html              # Popup UI displayed when the extension is clicked  
├── popup.js                # Logic for sending messages between popup and background  
├── background.js           # Listens for tab updates and manages extension events  
├── contentScript.js        # Scrapes data from the LinkedIn page using DOM  
│
├── server.js               # Express backend for storing and retrieving profiles  
├── models/
│   └── profile.js          # Sequelize model (Profile table structure)  
│
├── package.json            # Node.js dependencies and scripts  
└── database.sqlite         # Auto-generated SQLite database  
```
---
🚀 Setup Instructions
🧠 Prerequisites

1) Node.js (v14+ recommended)
2) Google Chrome browser

---
Backend Setup

1) Install dependencies:

```npm install```

2) Start the server:

```node server.js```

3) You should see:

```Server listening on http://localhost:5000```

This creates a database.sqlite file automatically in your project directory.
---
💻 Chrome Extension Setup

1) Open Chrome → go to chrome://extensions/

2) Enable Developer Mode (top-right corner)

3) Click Load unpacked and select your linkedin-scraper-extension/ folder

4) The extension icon will now appear in your browser toolbar.
---
How It Works

1) Go to any LinkedIn profile page.

2) Click the extension icon.

3) The content script runs automatically, scraping profile details using DOM selectors.

4) Data is sent to the backend (server.js) via a POST request to /profiles.

5)vThe data is stored in the local SQLite database.

6) You can fetch all saved profiles via a GET request:

```http://localhost:5000/profiles```

---
Technologies Used

1) Node.js (Backend)

2) Express.js (API)

3) Sequelize ORM

4) SQLite (Database)

5) Chrome Extensions API

6) HTML / JS / DOM Manipulation
