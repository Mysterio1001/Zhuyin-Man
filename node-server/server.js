const express = require("express");
const app = express();
const port = 9876; // 若要修改埠號，在這裡修改！

app.use(express.text());

app.post("/", (req, res) => {
  console.log("接收到字串：", req.body);

  // 透過 AppleScript 呼叫 Hammerspoon URL Scheme
  const { exec } = require("child_process");
  const url = `hammerspoon://input?data=${encodeURIComponent(req.body)}`;
  exec(`open "${url}"`, (err, stdout, stderr) => {
    if (err) {
      console.error("呼叫 Hammerspoon 失敗：", err);
      res.status(500).send("fail");
      return;
    }
    console.log("成功呼叫 Hammerspoon");
    res.send("ok");
  });
});

app.listen(port, () => {
  console.log(`Node.js 伺服器已在 http://localhost:${port} 上運行`);
});
