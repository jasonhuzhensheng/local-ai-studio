繁體中文 | ../README.md
這些文件由公開專案文字經機器翻譯而成，尚未全部經過母語人士審校。如有技術歧義，請查閱英文或簡體中文來源。不包含私人使用者資料。

Local AI Studio：全新 Apple Silicon Mac 的遷移源碼包

此審查版本包括 frontend/backend 原始程式碼、測試、模型下載清單、固定依賴項、本機引擎原始程式碼和實驗性 Apple 視訊修補程式。它可能落後於當地的開發或生產。
它不包括權重、虛擬環境、先前的任務、參考影像、聊天記錄、帳戶配置和秘密。它不是一鍵式的app。

將整個資料夾與 INSTALL-PROMPT.en.txt 一起交給目標 Mac 上的編碼助理。
原始驗證機是具有 96GB 記憶體的 M2 Max。首先檢查目標型號、記​​憶體和作業系統。不要在記憶體較低的 Mac 上盲目重複使用視訊設定。

內容：
 src/ 前端、後端、download/validation 工具、模型清單
 tests/ 測試；有些需要安裝models/services. 不要亂全部運行
 requirements/viggle-pinned.txt 固定影像環境
 src/h3_requirements.lock 單獨的固定視訊環境
 vendor/ 無需編譯二進位檔案的本機原始碼；保留上游許可證
 patches/ ComfyUI/ClipProj 提交並部署 Python 更改
 SHA256SUMS.txt 每個檔案校驗和

模型入口位於 src/：image_models.json（Qwen GGUF）、viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json（底模與轉接器）、wai_model.json、upscale_model.json 以及 h3_apple_models.json（影片）。下載前請檢查各清單及其安裝程式。
文字模型：huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF，檔案 Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf。本套件未包含該模型完整的固定修訂版本與雜湊。請先取得並記錄可信的上游中繼資料；不要聲稱與原機器逐位元組一致。


新機器安裝尚未經過驗證。查看目標使用者的原始機器路徑、模型別名和系統工具路徑。不要將歷史補丁重新套用到已修改的供應商原始碼。成功下載並不表示推理成功或品質可接受。

使用右上角的語言選單，可從33種語言中選擇。瀏覽器會記住您的選擇。語言套件由本機提供；切換語言不會將內容傳送至線上翻譯服務。使用者提示詞、對話和已儲存內容會保留原本的語言。
