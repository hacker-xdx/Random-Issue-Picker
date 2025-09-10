(function () {
  try {
    const scriptTag = document.querySelector(
      'script[type="application/json"][data-target="react-app.embeddedData"]'
    );
    if (!scriptTag) {
      alert("Could not find GitHub issue data on this page.");
      return;
    }

    const data = JSON.parse(scriptTag.textContent);
    const edges = data?.payload?.preloadedQueries?.[0]?.result?.data?.repository?.search?.edges;

    if (!edges || edges.length === 0) {
      alert("No open issues found!");
      return;
    }

    const randomIssue = edges[Math.floor(Math.random() * edges.length)].node;

    alert(
      `#${randomIssue.number}: ${randomIssue.title}\n\n` +
      `Link: https://github.com/${data.payload.preloadedQueries[0].variables.owner}/` +
      `${data.payload.preloadedQueries[0].variables.name}/issues/${randomIssue.number}`
    );
  } catch (err) {
    console.error(err);
    alert("Error parsing GitHub issues.");
  }
})();
