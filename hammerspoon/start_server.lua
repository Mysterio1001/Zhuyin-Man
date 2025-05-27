hs.urlevent.bind("start_server", function()
  local homeDir = os.getenv("HOME")
  local serverPath = homeDir .. "/my-extension/node-server/server.js"
  local nodePath = os.getenv("HOME") .. "/.nvm/versions/node/v18.20.7/bin/node" --這裡是本機node的路徑

  -- 使用 hs.task.spawn 執行
  local task = hs.task.new(nodePath, nil, {serverPath})
  if task then
    task:start()
    print("✅ 已用 hs.task 啟動 Node.js 伺服器")
  else
    print("❌ 無法啟動 Node.js 伺服器")
  end
end)
