/**
 * HarmoNyx API - Tauri 通訊與腳本執行生命週期管理
 */

const invoke = window.__TAURI__ ? (window.__TAURI__.core ? window.__TAURI__.core.invoke : window.__TAURI__.invoke) : null;

export const HarmoNyxAPI = {
    _execId: 0, 

    /**
     * 檢查當前執行 ID 是否依然有效 (用於安樂死機制)
     */
    isAlive: (id) => {
        if (id !== HarmoNyxAPI._execId) {
            throw 'Script cancelled';
        }
        return true;
    },

    getCurrentId: () => HarmoNyxAPI._execId,

    /**
     * 重置環境：增加版本號 (會讓舊的 sleep 醒來後自動自殺)
     */
    reset: async () => {
        HarmoNyxAPI._execId++;
    },

    /**
     * 支援版本檢查的睡眠
     */
    sleep: (ms) => {
        const id = HarmoNyxAPI._execId;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id === HarmoNyxAPI._execId) resolve();
                else reject('Script cancelled'); 
            }, ms);
        });
    },

    /**
     * 停止執行
     */
    stop: async () => {
        await HarmoNyxAPI.reset();
        // 這裡可以加入 Kill Processing Process 的呼叫
        if (invoke) {
            try { 
                // TODO: 實作 Rust 端的 stop_processing
                // await invoke('stop_processing'); 
            } catch (e) {}
        }
    },

    getInvoke: () => invoke
};

window.HarmoNyx = HarmoNyxAPI;
