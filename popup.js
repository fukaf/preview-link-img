let startPreviewButton = document.getElementById('previewButton');


window.onload = function() {
    // // Fetch the URL of the current tab
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     const url = new URL(tabs[0].url);
    //     const domainPrefix = url.protocol + '//' + url.hostname;

    //     // Set the domain prefix as the default value in the input box
    //     document.getElementById('domainPrefix').value = domainPrefix;
    // });

    // // Existing code to save the domain prefix
    // document.getElementById('saveButton').addEventListener('click', function() {
    //     const domainPrefix = document.getElementById('domainPrefix').value;
    //     chrome.storage.sync.set({domainPrefix: domainPrefix}, function() {
    //         console.log('Domain prefix saved');
    //     });
    // });

    document.getElementById('save').addEventListener('click', function() {
        let threshold = document.getElementById('threshold').value;
        chrome.storage.sync.set({threshold: threshold}, function() {
            console.log('Threshold value is set to ' + threshold);
        });
    });

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

    // Get the regex from the input field
    const regexInput = document.getElementById('regexInput');
    const regex = regexInput.value;

    // Execute script to parse urls needed for preview
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getLinks,
    }).then((results) => {
        // results is an array of results from each frame where the script was injected
        // We'll assume there's only one frame here for simplicity
        const viewLinks = results[0].result;

        // Send links to background.js
        chrome.runtime.sendMessage({ type: 'startPreview', links: viewLinks, regex: regex});
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