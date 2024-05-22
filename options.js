// Save options
function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        website: document.querySelector('#website').value,
        regex: document.querySelector('#regex').value
    }, function() {
        // Update status to let user know options were saved.
        let saveMessage = document.getElementById('saveMessage');
        saveMessage.style.display = 'block';
        setTimeout(function() {
            saveMessage.style.display = 'none';
        }, 1000);
    });
}

// Restore options
function restoreOptions() {
    chrome.storage.sync.get(['website', 'regex'], (res) => {
        document.querySelector('#website').value = res.website || '';
        document.querySelector('#regex').value = res.regex || '';
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);