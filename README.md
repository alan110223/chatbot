<p>要能跑程式需要用到node.js、ngrok、python還有line的一個官方帳號</p>

<br>使用步驟:</br>
  <br>1.下載整個檔案</br>
  <br>2.更改accessToken與channelSecret(在test_webhook裡面)</br>
  <br>3.開啟下載好的ngork.exe輸入ngork http 3000</br>
  <br>4.登入line developers 網站->點左邊的chatbot->Webhook URL 的部分改成ngork.exe中的新網址</br>
  <br>5.開啟cmd，在下載的地方打node test_webhook.js 開啟local與ngrok的通道</br>
  <br>6.開啟line，找到你的官方帳號，開始對話，他會回傳一樣的東西</br>
  <br>7.output.txt會有接收到和官方帳號對話的的文字資料(目前僅能使用中文與英文，送貼圖或影片程式會出錯)</br>

  
