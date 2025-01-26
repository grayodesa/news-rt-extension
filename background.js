chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {action: "saveArticle"});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "saveArticle") {
        const username = 'admin';
        const password = 'R4k?9oTU';
        const auth = btoa(`${username}:${password}`);

        fetch('https://news.radio-t.com/api/v1/news/manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${auth}`
            },
            body: JSON.stringify(request.data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            sendResponse({success: true});
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({success: false, error: error.message});
        });
        return true;
    }
});