function extractPageMetadata() {
    const title = document.title || '';
    const authorMeta = document.querySelector('meta[name="author"], meta[property="article:author"]');
    const author = authorMeta ? authorMeta.content : '';
    const descriptionMeta = document.querySelector('meta[name="description"], meta[property="og:description"]');
    const snippet = descriptionMeta ? descriptionMeta.content : '';
    const imageMeta = document.querySelector('meta[property="og:image"]');
    const pic = imageMeta ? imageMeta.content : '';
    const domain = window.location.hostname;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Используем Readability
    const documentClone = document.cloneNode(true);
    const reader = new Readability(documentClone, {
        keepClasses: false,
        debug: false,
        maxElemsToParse: 0,
        nbTopCandidates: 5,
        charThreshold: 500
    });
    
    const article = reader.parse();
    const content = article ? article.content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Удаляем script теги
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')    // Удаляем style теги
        .replace(/\s{2,}/g, ' ')  // Нормализуем пробелы
        .trim() : '';
    
    return {
        title,
        author,
        snippet,
        pic,
        domain,
        slug,
        content,
        link: window.location.href,
        origlink: window.location.href,
        ts: new Date().toISOString(),
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