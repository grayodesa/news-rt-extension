import Defuddle from 'defuddle';

function normalizeDate(dateStr) {
    if (!dateStr) return new Date().toISOString();
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
}

function extractPageMetadata() {
    const result = new Defuddle(document).parse();
    const title = result.title || document.title || '';
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    return {
        title,
        author: result.author || '',
        snippet: result.description || '',
        pic: result.image || '',
        domain: result.domain || window.location.hostname,
        slug,
        content: result.content || '',
        link: window.location.href,
        origlink: window.location.href,
        ts: normalizeDate(result.published),
        geek: false,
        position: -1
    };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveArticle") {
        const metadata = extractPageMetadata();
        chrome.runtime.sendMessage({
            type: "saveArticle",
            data: metadata
        }, response => {
            if (response && response.success) {
                alert('Статья успешно добавлена!');
            } else {
                const errorMsg = response && response.error ? response.error : 'Неизвестная ошибка';
                alert(`Ошибка при сохранении: ${errorMsg}`);
            }
        });
    }
});
