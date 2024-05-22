let startPreviewButton = document.getElementById('previewButton');


window.onload = function() {

    document.getElementById('optionsButton').addEventListener('click', function() {
        chrome.runtime.openOptionsPage();
    });

    document.getElementById('clearDatabase').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the database?')) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {type: 'clearDatabase'});
            });
        }
    });
}



startPreviewButton.addEventListener("click", async () => {
    // Get current tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Execute script to parse urls needed for preview
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getLinks,
    }).then((results) => {
        // results is an array of results from each frame where the script was injected
        // We'll assume there's only one frame here for simplicity
        const viewLinks = results[0].result;

        // Send links to background.js
        chrome.runtime.sendMessage({ type: 'startPreview', links: viewLinks});
    });
});

// Function to get links from the page
function getLinks() {
    const links = document.links;
    const viewLinks = [];
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.includes('view')) {
            viewLinks.push(links[i].href);
        }
    }
    return viewLinks;
}