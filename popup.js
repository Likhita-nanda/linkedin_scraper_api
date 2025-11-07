// popup.js
const startBtn = document.getElementById('startBtn');
const linksTextarea = document.getElementById('links');
const statusDiv = document.getElementById('status');

function setStatus(msg) {
  statusDiv.textContent = msg;
}

startBtn.addEventListener('click', async () => {
  const raw = linksTextarea.value.trim();
  if (!raw) {
    setStatus('Please paste profile links (min 3).');
    return;
  }
  const links = raw.split('\n').map(s => s.trim()).filter(Boolean);
  if (links.length < 3) {
    setStatus('Please provide at least 3 links.');
    return;
  }

  // Send to background to start
  chrome.runtime.sendMessage({ action: 'startScrape', links });
  setStatus('Started — open LinkedIn and ensure you are logged in.');
});
