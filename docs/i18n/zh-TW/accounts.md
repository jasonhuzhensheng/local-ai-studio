[繁體中文](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> 這些文件由公開專案文字經機器翻譯而成，尚未全部經過母語人士審校。如有技術歧義，請查閱英文或簡體中文來源。不包含私人使用者資料。

# 網站帳戶

## 用法

在執行服務的Mac上，開啟`http://127.0.0.1:1235/setup`建立第一個管理員。使用者名稱包含 3–32 字母、數字、底線或連字符，並標準化為小寫。密碼包含 12–128 字元。沒有預設憑證。遠端設備無法聲明初始管理員帳戶。

設定後，未經身份驗證的裝置會看到登入頁面。開啟**帳號/登出** (`/account`) 變更您的密碼或登出。管理員可以建立users/administrators、重設密碼、disable/enable帳戶、更改角色和刪除帳戶。刪除和權限變更需要確認。伺服器防止刪除、停用或降級最後啟用的管理員。刪除帳戶不會刪除共享任務。

使用右上角的語言選單，可從33種語言中選擇。瀏覽器會記住您的選擇。語言套件由本機提供；切換語言不會將內容傳送至線上翻譯服務。使用者提示詞、對話和已儲存內容會保留原本的語言。

這是一個共享工作室。登入使用者共享對圖像、視訊和伺服器端聊天任務的存取權限。瀏覽器聊天記錄保留在 localStorage 中。不存在多租戶隔離、每用戶任務儲存或計費。現有的僅限本地視訊的限制仍然存在。

## 儲存與保護

- `src/studio_auth.mjs` 在業務路由之前運行，包括 API 和 image/reference/video 檔案。
未經驗證的頁面會重新導向為 303； API 和媒體傳回 401。
帳戶資產、語言資產和非秘密setup/sign-in狀態都是公開的。
- 帳號檔案：`LOCAL_IMAGE_DATA_DIR/auth/users.json`，預設`app/.local/auth/users.json`；專用部署使用`runtime/auth/users.json`。
目錄模式：0700；檔案模式：0600。
密碼使用 scrypt N32768/r8/p1、隨機鹽和恆定時間雜湊比較。
寫入是原子的，帳戶變更是序列化的。
損壞的現有資料庫會阻止啟動而不是重新開啟註冊。
- 會話使用 32 隨機位元組；伺服器僅儲存摘要。
Cookie 為 HttpOnly、SameSite=Strict，有效期限為 12 小時。
重新啟動需要重新登入。
Password/role 變更、重設、停用和刪除撤銷受影響的會話。
登出不會刪除或重新執行已啟動的任務。
- 寫入需要同源 Origin 和 JSON。
X-Forwarded-For 不受信任。
每個來源 IP 每 15 分鐘最多可獲得 15 sign-in/setup/self-password-change 嘗試。
限制：4 並發密碼衍生和 100 帳戶。
重新啟動會清除嘗試限制。
- 現有部署使用 HTTP over private Tailscale。
Tailscale 加密設備到設備的傳輸；普通 LAN HTTP 本身沒有。
此包未配置公共存取和 TLS。
Secure cookie 僅針對本機 TLS 請求設定。
不要直接透過公共 HTTP 公開它。
- 切勿上傳身份驗證資料庫、會話或密碼。
遷移時初始化新帳號。
stdio MCP、本機LM Studio和作業系統檔案權限均在網站認證之外。

## 驗證

使用临时帐户数据库运行 `node tests/studio_auth.mjs`，而不使用真正的 models。它涵蓋未經身份驗證的 API/media 封鎖、初始設定來源限制、角色、密碼 hashing/file 模式、最後管理員保護、會話撤銷、持久性、損壞檔案拒絕和速率限制。

local_chat、chat_background、image_studio 和 video_web 測試使用獨立的測試管理員登入；不存在生產驗證旁路。真實密碼由使用者輸入，不得保存在測試或文件中。
