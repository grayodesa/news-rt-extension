chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(tab.id, {action: "saveArticle"});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "saveArticle") {
        chrome.storage.sync.get(['username', 'password'], (credentials) => {
            if (!credentials.username || !credentials.password) {
                sendResponse({
                    success: false, 
                    error: 'Credentials not set. Please configure extension settings.'
                });
                return;
            }

            const auth = btoa(`${credentials.username}:${credentials.password}`);

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
        });
        return true;
    }
});