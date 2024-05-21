let domainPrefix = '';
let threshold = 6;
let rightDomain = false;
// create storage DB for links displayed
let openRequest = indexedDB.open("linkDB", 1);
let db;

// Create a button element
const topButton = document.createElement('img');

// Set the source of the image
topButton.src = chrome.runtime.getURL("icons/top-icon.png");
// Set the position of the button to fixed
topButton.style.position = 'fixed';
// Set the distance from the right edge of the webpage
topButton.style.right = '2%';
// Set the distance from the bottom edge of the webpage
topButton.style.bottom = '20%';
topButton.style.width = '40px';
topButton.style.height = '40px';
topButton.style.transform = 'translateY(-50%)';
topButton.style.zIndex = '1000';
topButton.style.cursor = 'pointer'
document.body.appendChild(topButton);

// Hide the button by default
topButton.style.display = 'none';

// Show the button when the user scrolls down 100px from the top of the document
window.onscroll = () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topButton.style.display = 'block';
    } else {
        topButton.style.display = 'none';
    }
};

// Add a click event listener to the button
topButton.addEventListener('click', () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
});

// Show the button when the user scrolls down 100px from the top of the document
window.onscroll = () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topButton.style.display = 'block';
    } else {
        topButton.style.display = 'none';
    }
};

openRequest.onupgradeneeded = function() {
    db = openRequest.result;
    if (!db.objectStoreNames.contains('links')) {
        db.createObjectStore('links');
    }
};

openRequest.onerror = function() {
    console.error("Error opening linkDB", openRequest.error);
};

openRequest.onsuccess = function() {
    db = openRequest.result;
    console.log("linkDB opened successfully");
};

chrome.runtime.sendMessage({type: "getTabUrl"}, function(response) {
    domainPrefix = response.tabUrl;
    console.log('domainPrefix: ', domainPrefix);

    chrome.storage.sync.get(['website', 'threshold'], function(result) {
        const website = result.website;
        console.log('Website: ', website);
    
        if (result.threshold) {
            threshold = result.threshold;
        }
    
        rightDomain = domainPrefix === website;
    
        if (rightDomain) {
            console.log('right domain')
            // Create an img element
            const imgButton = document.createElement('img');
    
            // Set the source of the img to the path of your image
            imgButton.src = chrome.runtime.getURL("icons/icon.png");
    
            // Add styles to the img
            imgButton.style.position = 'fixed';
            imgButton.style.right = '2%';
            imgButton.style.top = '20%';
            imgButton.style.transform = 'translateY(-50%)';
            imgButton.style.zIndex = '1000';
            imgButton.style.cursor = 'pointer'
            // Resize the image
            imgButton.style.width = '40px';
            imgButton.style.height = '40px';
            // Append the img to the body
            document.body.appendChild(imgButton);
    
            // Add an event listener to the img
            imgButton.addEventListener('click', function() {
                // Fetch the links when the button is clicked
                const viewLinks = getLinks();
    
                // Send a message to the background script
                chrome.runtime.sendMessage({ type: 'startPreview', links: viewLinks, regex: '' });
                console.log("trigger button clicked from content.js");
            });
            
            // Set up the message listener inside the callback to ensure that the domain prefix has been fetched
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.type === 'clearDatabase') {
                    // Open a transaction on the database
                    const transaction = db.transaction('links', 'readwrite');
            
                    // Get the object store
                    const links = transaction.objectStore('links');
            
                    // Clear the object store
                    const request = links.clear();
            
                    request.onsuccess = () => {
                        console.log('Database cleared');
                    };
            
                    request.onerror = (event) => {
                        console.error('Error clearing database:', event.target.error);
                    };
                }

                if (request.type === 'displayImages') {
                    // Check if the link has already been displayed
                    let transaction = db.transaction("links");
                    let links = transaction.objectStore("links");
                    let dbRequest = links.get(request.link);

                    // Display the images
                    dbRequest.onsuccess = function() {
                        
                        let linkElement = document.querySelector(`a[href="${request.link.replace(domainPrefix, '')}"]`);

                        if (dbRequest.result) {
                            console.log('Link has already been displayed');
                            // Create a paragraph element to display the message
                            const messageElement = document.createElement('p');
                            messageElement.textContent = 'Already previewed';
                            messageElement.style.color = 'green';
                            linkElement.parentNode.insertBefore(messageElement, linkElement.nextSibling);
                        } else {
                            // Display the images
                            displayImages(request.imgUrls, request.link);
                            // console.log('content.js loaded');

                            // Add the link to the displayed links
                            transaction = db.transaction("links", "readwrite");
                            links = transaction.objectStore("links");
                            let linkTitle = linkElement.title;
                            links.add(linkTitle, request.link);
                        }
                    }
                }
            });
        } else {
            console.log('wrong domain');
        }
    
        
    });    

});

function displayImages(imgUrls, link) {
    // remove the prefix of link
    link = link.replace(domainPrefix, '');
    console.log('content.js received: ', imgUrls);
    console.log('content.js link: ', link);

    const linkElement = document.querySelector(`a[href="${link}"]`);

    // Check if linkElement was found
    if (linkElement) {
        if (imgUrls && imgUrls.length > 0) {
            // Create a container for the images
            const imageContainer = document.createElement('div');
            imageContainer.style.display = 'flex';
            imageContainer.style.flexWrap = 'wrap';

            imgUrls.forEach((imgUrl, index) => {
                console.log(imgUrl);
                const imagePreview = document.createElement('img');
                imagePreview.src = imgUrl.url;

                // Add styles to make the image fit the webpage
                imagePreview.style.maxWidth = '100%';
                imagePreview.style.maxHeight = 'auto';
                imagePreview.style.objectFit = 'contain';
                
                // Make the image a block-level element
                // imagePreview.style.display = 'block';

                // If there are more than 8 images, display 2 images in a row
                if (imgUrls.length > threshold || imagePreview.naturalHeight > imagePreview.naturalWidth) {
                    // imagePreview.style.flex = '0 0 50%';
                    imagePreview.style.width = '100%';
                    imagePreview.style.maxWidth = '50%';
                }
                

                // Handle image loading
                imagePreview.onload = function() {
                    // linkElement.parentNode.insertBefore(imagePreview, linkElement.nextSibling);
                    imageContainer.appendChild(imagePreview)
                };

                // Handle image error
                imagePreview.onerror = function() {
                    console.error('Error loading image: ', imgUrl);
                };

                if (index === 0 || index === imgUrls.length - 1) {
                    linkElement.parentNode.insertBefore(imageContainer, linkElement.nextSibling);
                }

            });
        } else {
            // Create a paragraph element to display the message
            const messageElement = document.createElement('p');
            messageElement.textContent = 'No preview images';
            messageElement.style.color = 'red';
            linkElement.parentNode.insertBefore(messageElement, linkElement.nextSibling);
        }
    } else {
        console.error('Link element not found: ', link);
    }
}

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