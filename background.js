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

            const payload = JSON.stringify(request.data);
            console.log('Payload size:', payload.length, 'bytes');
            console.log('Payload fields:', Object.fromEntries(
                Object.entries(request.data).map(([k, v]) => [k, typeof v === 'string' ? `${v.substring(0, 200)} (${v.length} chars)` : v])
            ));

            fetch('https://news.radio-t.com/api/v1/news/manual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${auth}`
                },
                body: payload
            })
            .then(async response => {
                if (!response.ok) {
                    const body = await response.text();
                    console.error('Server response:', response.status, body);
                    throw new Error(`HTTP ${response.status}: ${body}`);
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