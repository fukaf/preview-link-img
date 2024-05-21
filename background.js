let defaultRegex = /<img[^>]*src="([^"]*u9img[^"]*)"/gi;

// Receive links from message sent by popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getTabUrl') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const url = new URL(tabs[0].url);
            const domainPrefix = url.protocol + '//' + url.hostname;
            sendResponse({tabUrl: domainPrefix});
        });
        return true;
    }

    if (request.type === 'startPreview') {
        console.log('background.js loaded'); 
        const links = request.links;
        let regexString = request.regex.replace(/\\\\/g, '\\');
        
        if (!regexString) {
            regexString = defaultRegex;
        }

        const regex = new RegExp(regexString, 'gi'); // Create a RegExp object from the string

        console.log('regex: ', regex);
        // console.log('next_page_links: ', links);

        // Fetch content for all links
        Promise.all(links.map(link => fetchWebpageContent(link, regex)))
            .then(allImgUrls => {
                // Get the current tab id
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    // Send a message to the content script in the current tab for each link
                    links.forEach((link, index) => {
                        chrome.tabs.sendMessage(tabs[0].id, {type: 'displayImages', imgUrls: allImgUrls[index], link: link});
                    });
                });
            });
    }
});

function fetchWebpageContent(link, regex) {
    // fetch the webpage content
    return fetch(link)
        .then(response => response.text())
        .then(data => {
            // extract the images urls from the data
            const images = extractImages(data, regex);
            return images;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function extractImages(content, regex) {
    // extract the images urls from the data
    
    const images = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        images.push({ url: 'https:' + match[1] }); // Extract the captured image URL
    }
    return images;
}