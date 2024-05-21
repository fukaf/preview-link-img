// Save options
function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        website: document.querySelector('#website').value
    });
}

// Restore options
function restoreOptions() {
    chrome.storage.sync.get('website', (res) => {
        document.querySelector('#website').value = res.website || '';
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);