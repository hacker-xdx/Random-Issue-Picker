document.getElementById("pickBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Strict check: must be in form github.com/<user>/<repo>/issues
  const issuesRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/issues$/;
  if (!issuesRegex.test(tab.url)) {
    document.getElementById("result").innerText =
      "Go to a repository's /issues page first.";
    return;
  }

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getRandomIssue
    });

    if (result) {
      document.getElementById("result").innerHTML =
        `<strong>#${result.number}</strong>: ${result.title}<br>` +
        `<a href="${result.url}" target="_blank">View on GitHub</a>`;
    } else {
      document.getElementById("result").innerText = "No open issues found!";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("result").innerText = "Error fetching issues.";
  }
});

function getRandomIssue() {
  try {
    const scriptTag = document.querySelector(
      'script[type="application/json"][data-target="react-app.embeddedData"]'
    );
    if (!scriptTag) return null;

    const data = JSON.parse(scriptTag.textContent);
    const edges =
      data?.payload?.preloadedQueries?.[0]?.result?.data?.repository?.search
        ?.edges;

    if (!edges || edges.length === 0) return null;

    const randomIssue = edges[Math.floor(Math.random() * edges.length)].node;

    return {
      number: randomIssue.number,
      title: randomIssue.title,
      url: `https://github.com/${data.payload.preloadedQueries[0].variables.owner}/` +
           `${data.payload.preloadedQueries[0].variables.name}/issues/${randomIssue.number}`
    };
  } catch {
    return null;
  }
}
