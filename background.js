// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startScrape' && Array.isArray(message.links)) {
    processLinksSequentially(message.links);
  }
});

async function processLinksSequentially(links) {
  for (let url of links) {
    try {
      // create/open tab
      const tab = await createTab(url);
      // wait until tab is fully loaded
      await waitForTabComplete(tab.id);
      // ask content script in that tab to scrape and post
      const result = await sendScrapeCommand(tab.id, { apiUrl: 'http://localhost:5000/profiles' });
      console.log('Scrape result for', url, result);
    } catch (err) {
      console.error('Error with', url, err);
    } finally {
      // close tab if it exists
      try { await chrome.tabs.remove(tab.id); } catch(e) { /* ignore */ }
    }
    // small delay between profiles to reduce stress on page
    await sleep(1500);
  }
  console.log('All links processed.');
}

function createTab(url) {
  return new Promise((resolve) => {
    chrome.tabs.create({ url, active: true }, (tab) => resolve(tab));
  });
}

function waitForTabComplete(tabId) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      chrome.tabs.onUpdated.removeListener(listener);
      reject(new Error('Timeout waiting for tab to load'));
    }, 20000); // 20s timeout

    function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        clearTimeout(timeout);
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }
    chrome.tabs.onUpdated.addListener(listener);
  });
}

function sendScrapeCommand(tabId, payload) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { action: 'scrapeProfile', payload }, (response) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(response);
    });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
