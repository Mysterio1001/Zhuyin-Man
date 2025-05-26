chrome.commands.onCommand.addListener(async (command) => {
  if (command === "trigger-reinput") {
    console.log("✅ 快捷鍵觸發：抓取目前輸入欄位文字");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab) return;

    // 透過 scripting API 在網頁上下文取得文字
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.value !== undefined) {
          return activeElement.value;
        } else {
          alert("⚠️ 沒有偵測到輸入欄位！");
          return null;
        }
      },
    });

    if (result) {
      console.log("🎯 擷取到文字：", result);

      // 直接用 Service Worker 的 fetch 發送到 Hammerspoon
      fetch("http://127.0.0.1:9876", {
        // 若要修改埠號，在這裡修改！
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
