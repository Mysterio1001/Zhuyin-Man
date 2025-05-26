# 文字重新輸入工具 - 使用說明

這個專案包含以下三部分：

✅ **Hammerspoon 腳本**  
✅ **Node.js 伺服器**  
✅ **Chrome 擴充功能**

本工具可讓你快速把瀏覽器輸入欄位的文字，透過 Hammerspoon 切換到注音輸入法並自動重新輸入！

---

## 使用前準備

- macOS（並安裝 [Hammerspoon](https://www.hammerspoon.org/)，安裝後請於終端機輸入以下指令）

  ```bash
  mkdir -p ~/.hammerspoon
  echo 'dofile(os.getenv("HOME") .. "/my-extension/hammerspoon/init.lua")' >> ~/.hammerspoon/init.lua

  ```

- Node.js 已安裝（若未安裝，請使用以下指令於終端機安裝：）

```bash
brew install node
```

### Chrome 擴充功能安裝步驟

1️⃣ 開啟 **Google Chrome**  
2️⃣ 點選右上角的「⋮」選單 → **更多工具** → **擴充功能**  
3️⃣ 開啟畫面右上角的 **「開發者模式」** 開關  
4️⃣ 點選左上角的 **「載入已解壓縮的擴充功能」** 按鈕  
5️⃣ 選擇 **`chrome-extension`** 資料夾  
6️⃣ 安裝完成後即可在 Chrome 中使用本工具！

### 設定 Chrome 快捷鍵

1️⃣ 仍在 **擴充功能管理頁面**，點選左上角的「☰」按鈕  
2️⃣ 選擇 **「鍵盤快速鍵」**（或「快捷鍵」）  
3️⃣ 找到 **文字重新輸入工具**  
4️⃣ 點選快捷鍵輸入框，手動按下你想要設定的快捷鍵（預設建議：`Command + Shift + Z`）  
5️⃣ 設定後即可在任何輸入欄位直接觸發！

---

## 檔案結構

```plaintext
my-extension/
├── hammerspoon/
│   └── init.lua
├── node-server/
│   └── server.js
├── chrome-extension/
│   ├── manifest.json
│   └── background.js
```

## 使用者需修改

### 1. hammerspoon (init.lua)

```lua
-- 這一段控制「要切換的應用程式」，預設是 Google Chrome
-- 如果想讓 Hammerspoon 操作其他應用程式，請把 "Google Chrome" 改成對應的應用程式名稱，例如 "Safari"。
local chrome = hs.application.get("Google Chrome")
```

### 2. 預設埠號為 9876，若你電腦已有其他程式使用這個埠號，以下檔案自行修改成其他可用埠號（例如 9877）。

#### 2. node-server (server.js)

```javascript
const port = 9876;
```

#### 3. chrome-extension (manifest.json)

```json
"host_permissions": ["http://127.0.0.1:9876/"],
```

#### 4. chrome-extension (background.js)

```javascript
// 如果伺服器埠號修改過，記得在 background.js 中找到：
fetch("http://127.0.0.1:9876", { ... })
```

⚠️ **小提醒**

- 本工具僅支援 **macOS**，且必須授權 Hammerspoon **「輔助使用權限」**。
- 路徑或檔名若有不同，記得在上述程式碼位置做相應修改。
- 所有範例檔案與結構已提供，僅需根據自己電腦路徑與需求微調。
- 有任何問題或擴充需求，歡迎找我協助 (holmes9073@gmail.com)
