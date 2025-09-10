chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("github.com") && tab.url.includes("/issues")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert("Go to a repo's /issues page first!")
    });
  }
});
