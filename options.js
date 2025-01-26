document.addEventListener('DOMContentLoaded', () => {
    // Загружаем сохраненные настройки
    chrome.storage.sync.get(['username', 'password'], (items) => {
        document.getElementById('username').value = items.username || '';
        document.getElementById('password').value = items.password || '';
    });

    // Обработчик сохранения
    document.getElementById('save').addEventListener('click', () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        chrome.storage.sync.set({
            username: username,
            password: password
        }, () => {
            const status = document.getElementById('status');
            status.textContent = 'Settings saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);
        });
    });
}); 