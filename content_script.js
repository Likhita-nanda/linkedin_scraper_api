// content_script.js
console.log("✅ Content script loaded on:", window.location.href);

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'scrapeProfile') {
    try {
      const data = scrapeProfileFromDOM();
      // Add url
      data.url = window.location.href;
      // POST to API
      const apiUrl = (message.payload && message.payload.apiUrl) || 'http://localhost:5000/profiles';
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      sendResponse({ status: 'ok', saved: json });
    } catch (err) {
      console.error('scrape error', err);
      sendResponse({ status: 'error', error: err.message });
    }
    // keep the message channel open for async
    return true;
  }
});

function scrapeProfileFromDOM() {
  // These selectors are approximate — LinkedIn changes often.
  const name = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : '';
  // location is often in a span under name; try a couple places
  let location = '';
  const locEl = document.querySelector('.pv-top-card--list-bullet li') || document.querySelector('.text-body-small.inline');
  if (locEl) location = locEl.innerText.trim();

  // bio line / headline
 let bioLine = '';
 const bioEl = document.querySelector('.text-body-medium.break-words') ||
               document.querySelector('.pv-text-details__left-panel .text-body-medium');
 if (bioEl) bioLine = bioEl.innerText.trim();


  // About section may be inside section with id 'about' or have specific selectors
  let about = '';
  const aboutEl = document.querySelector('#about') || document.querySelector('.pv-about-section');
  if (aboutEl) {
    about = aboutEl.innerText.trim();
  } else {
    // fallback: find "About" heading and next sibling
    const headings = Array.from(document.querySelectorAll('section h2, h3'));
    const aboutHeading = headings.find(h => /about/i.test(h.innerText));
    if (aboutHeading && aboutHeading.parentElement) {
      about = aboutHeading.parentElement.innerText.replace(/About/i,'').trim();
    }
  }

  // follower count / connections
  let follower_count = 0;
  let connection_count = '';
  const followersEl = Array.from(document.querySelectorAll('span')).find(s => /followers/i.test(s.innerText));
  if (followersEl) {
    const match = followersEl.innerText.match(/([\d,\.kK+]+)/);
    if (match) follower_count = parseFollowerString(match[1]);
  }
  // connections (often shows "500+ connections")
  const connEl = Array.from(document.querySelectorAll('span')).find(s => /connections/i.test(s.innerText));
  if (connEl) connection_count = connEl.innerText.trim();

  // bio field (short intro)
  let bio = '';
  const summaryEl = document.querySelector('.pv-text-align-left') || document.querySelector('.pv-top-card--experience-list');
  if (summaryEl) bio = summaryEl.innerText.trim();

  return {
    name,
    location,
    about,
    bio,
    follower_count,
    connection_count,
    bio_line: bioLine
  };
}

function parseFollowerString(s) {
  if (!s) return 0;
  // Remove commas
  s = s.replace(/,/g,'').toLowerCase();
  if (s.endsWith('k')) return Math.round(parseFloat(s) * 1000);
  if (s.endsWith('m')) return Math.round(parseFloat(s) * 1000000);
  // if numeric
  const num = parseInt(s.replace(/\D/g,''), 10);
  return isNaN(num) ? 0 : num;
}
