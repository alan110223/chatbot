chatbot
======
  要能跑程式需要用到node.js、ngrok、python還有line的一個官方帳號(能使用message api)

使用步驟:
------
	1.下載整個檔案
	2.更改accessToken與channelSecret(在test_webhook裡面)
	3.開啟下載好的ngork.exe輸入`ngork http 3000
	4.登入line developers 網站->點開建立好的bot->Webhook URL 的部分改成ngork.exe中的新網址
	5.開啟cmd，在下載的地方打node test_webhook.js 開啟local與ngrok的通道
	6.開啟line，找到你的官方帳號，開始對話，他會回傳一樣的東西(聲音與圖片暫時沒有)
	7.output.txt會有接收到和官方帳號對話的的文字資料(目前可收到文字、聲音、圖片、地址、貼圖的訊息做回應)

網頁連線
------
手機/電腦皆可正常顯示
為了要等待python執行，資料送出後會等待2.5秒，故回應速度慢
使用簡單的html/css製作的靜態網頁，填好資料後會在網頁上顯示斷句的結果
![](https://imgur.com/JyCuXSO.jpg "cmd也會有紀錄")
	
目前手機與電腦(windows)版本仍然會有差異
![](https://imgur.com/mfVxwx9.jpg "但windows電腦版好像沒在更新了...")

資料來源
------
	1.Node LINE Bot API : https://github.com/tejitak/node-line-bot-api 這份程式碼架構主要是參考他的範例 
	2.python-shell : https://www.npmjs.com/package/python-shell 能夠使用python處理文字訊息
	3.jieba : https://github.com/fxsjy/jieba 中文分詞工具
