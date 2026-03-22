// ui/src/modules/updater.js
export const Updater = {
    // 檢查更新的主函式
    async check(currentVersion) {
        const btn = document.getElementById('update-btn');
        const icon = btn.querySelector('img');
        
        // 1. 狀態：檢查中 (旋轉)
        icon.src = '/icons/sync_24dp_EA3323.png';
        icon.classList.add('spin-animation');
        btn.title = "檢查更新...";
        this.log("檢查更新中...");

        try {
            const res = await fetch('https://api.github.com/repos/simfonia/HarmoNyx/releases/latest');
            if (!res.ok) throw new Error('Network response was not ok');
            const release = await res.json();
            const latestVersion = release.tag_name.replace('v', '');

            console.log(`[Updater] Debug -> Current: ${currentVersion}, Latest: ${latestVersion}`);

            const cParts = currentVersion.split('.').map(Number);
            const lParts = latestVersion.split('.').map(Number);
            
            let hasUpdate = false;
            for (let i = 0; i < 3; i++) {
                const l = lParts[i] || 0;
                const c = cParts[i] || 0;
                if (l > c) {
                    hasUpdate = true;
                    break;
                }
                if (l < c) {
                    hasUpdate = false;
                    break;
                }
            }

            if (!hasUpdate) {
                // 2. 狀態：最新版
                icon.classList.remove('spin-animation');
                icon.src = '/icons/published_with_changes_24dp_75FB4C.png';
                btn.title = `已是最新版: ${currentVersion}`;
                btn.onclick = () => this.check(currentVersion);
                this.log(`HarmoNyx 已是最新版本 (${currentVersion})`);
            } else {
                // 3. 狀態：有新版 (彈跳漸變)
                icon.classList.remove('spin-animation');
                icon.src = '/icons/cloud_download_24dp_FE2F89.png';
                icon.classList.add('bounce-gradient');
                btn.title = `版本更新: ${currentVersion} -> ${latestVersion}`;
                btn.onclick = async () => {
                    await window.__TAURI__.shell.open(release.html_url);
                };
                this.log(`發現新版本: ${latestVersion} (點擊工具列跳動的更新按鈕前往下載)`);
            }
        } catch (e) {
            icon.classList.remove('spin-animation');
            this.log(`更新檢查失敗: ${e.message}`);
        }
    },
    
    // 將訊息發送到日誌面板
    log(msg) {
        const logContainer = document.getElementById('log-container');
        if (logContainer) {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.style.color = '#75FB4C';
            logEntry.textContent = `[System] ${msg}`;
            logContainer.appendChild(logEntry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
        console.log(`[Updater] ${msg}`);
    }
};
