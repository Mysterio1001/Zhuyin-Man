chrome.commands.onCommand.addListener(async (command) => {
  const port = 9876; // 若要修改埠號，在這裡修改！

  if (command === "trigger-reinput") {
    console.log("快捷鍵觸發：抓取目前輸入欄位文字");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab) return;

    // 透過 scripting API 在網頁上下文取得文字
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const el = document.activeElement;

        // 1. 嘗試直接用 activeElement.value
        if (el && "value" in el && typeof el.value === "string") {
          return el.value;
        }

        // 2. 嘗試 contenteditable 文字
        if (el && el.isContentEditable) {
          return el.innerText || el.textContent || null;
        }

        // 3. 嘗試搜尋頁面上看起來像 input 的元素
        const input = document.querySelector(
          'input[type="search"], input[type="text"], [contenteditable="true"]'
        );
        if (input) {
          if ("value" in input) return input.value;
          if (input.isContentEditable)
            return input.innerText || input.textContent;
        }

        return null;
      },
    });

    if (result) {
      console.log("🎯 擷取到文字：", result);

      // 檢查 Node.js 伺服器是否運行中
      try {
        const healthCheck = await fetch(`http://127.0.0.1:${port}/health`, {
          method: "GET",
        });
        if (!healthCheck.ok) throw new Error("伺服器未就緒");
        console.log("✅ 伺服器已運行");
      } catch (err) {
        console.warn("⚠️ 伺服器未運行，嘗試叫 Hammerspoon 開伺服器！");
        // 呼叫 URL Scheme
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (url) => {
            window.open(url);
          },
          args: ["hammerspoon://start_server"],
        });
        // 等待伺服器啟動
        await new Promise((r) => setTimeout(r, 100));
      }

      // 直接用 Service Worker 的 fetch 發送到 Hammerspoon
      fetch(`http://127.0.0.1:${port}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: result,
      })
        .then((res) => res.text())
        .then((text) => console.log("✅ Hammerspoon 回應：", text))
        .catch((err) => console.error("❌ 錯誤：", err));
    }
  }
});
