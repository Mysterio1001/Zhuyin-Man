hs.urlevent.bind("input", function(eventName, params)
  local text = params["data"] or ""
  if text == "" then
    print("沒有收到 data")
    return
  end

  -- 切換到注音輸入法
  hs.keycodes.currentSourceID("com.apple.inputmethod.TCIM.Zhuyin")
  hs.timer.usleep(300000)

  -- 切回 Chrome
  local chrome = hs.application.get("Google Chrome")
  if chrome then
    chrome:activate()
    hs.timer.usleep(300000)
  end

  -- 全選 + 刪除
  hs.eventtap.keyStroke({"cmd"}, "a")
  hs.timer.usleep(100000)
  hs.eventtap.keyStroke({}, "delete")
  hs.timer.usleep(100000)

  -- 逐字輸入
  for c in text:gmatch(".") do
  if c == " " then
    hs.eventtap.keyStroke({}, "space")
  else
    hs.eventtap.keyStroke({}, c)
  end
  hs.timer.usleep(1000)
  end
end)

hs.urlevent.httpCallback = true
print("✅ Hammerspoon URL Scheme input 已就緒")
