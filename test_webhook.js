'use strict'
const line = require('./index');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const utf8 = require('utf8');

var PythonShell = require('python-shell');
//var pyshell = new PythonShell('test.py');
var iconv = require('iconv-lite');

// need raw buffer for signature validation
app.use(bodyParser.json({
	verify (req, res, buf) {
		req.rawBody = buf
	}
}))

// init with auth
line.init({
  accessToken: '',
  // (Optional) for webhook signature validation
  channelSecret: ''

})

/**
 * response example (https://devdocs.line.me/ja/#webhook):
 * {
 *   "events": [
 *     {
 *       "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
 *       "type": "message",
 *       "timestamp": 1462629479859,
 *       "source": {
 *         "type": "user",
 *         "userId": "u206d25c2ea6bd87c17655609a1c37cb8"
 *       },
 *       "message": {
 *         "id": "325708",
 *         "type": "text",
 *         "text": "Hello, world"
 *       }
 *     }
 *   ]
 * }
 */
var i=0;

app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
	i++;
	const promises = req.body.events.map(event => {
		console.log('LOG : Get user user id : ' + event.source.userId);
		console.log('LOG : Get message '+i+' type : '+event.message.type);
		switch(event.message.type){
			case 'text':
				var fs=require('fs');
				fs.writeFile('sentence.txt', event.message.text, function(err) {
					if(err) {
						return console.log(err);
					}
					console.log("LOG : Response "+i+" has been saved.");
				}); 
				PythonShell.run('test.py', function (err) {
					if (err) throw err;
					console.log('LOG : Get response '+i+' important word.');
					console.log('LOG : Check \'output.txt\' file to get more information.');
					console.log('------------------------');
				});
								
				return line.client
				.replyMessage({
					replyToken: event.replyToken,
					messages: [
					{
						type: 'text',
						text: event.message.text + ' 嘻嘻'
					}
					]
				})
				break;
			case 'sticker':
				console.log("LOG : Response "+i+" is sticker,which will not be saved.");
				
				console.log('------------------------');
				if(event.message.packageId>=2000000){
					return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: 'text',
							text: '不要回那個= ='
						}
						]
					})
				}else{
					return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: 'sticker',
							stickerId: event.message.stickerId,
							packageId: event.message.packageId
						}
						]
					})
				}
				break;
			case 'video':
				console.log("LOG : Response "+i+" is video,which will not be saved.");
				
				console.log('------------------------');
				break;
			case 'audio':
				console.log("LOG : Response "+i+" is audio,which will not be saved.");
				console.log('------------------------');
				return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: "image",
							originalContentUrl: "https://img.ltn.com.tw/Upload/3c/page/2017/04/29/170429-29989-1.jpg",
							previewImageUrl: "https://img.ltn.com.tw/Upload/3c/page/2017/04/29/170429-29989-1.jpg"
						},
						{
							type: "text",
							text: "用打字的不要偷懶好嗎"
						}
						]
					})
				
				console.log('------------------------');
				break;
			case 'location':
				console.log("LOG : Response "+i+" is location,which will not be saved.");
				console.log('LOG : Get user\'s current address : '+event.message.address);
				
				console.log('------------------------');
				return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: 'text',
							text: event.message.address
						}
						]
					})
				break;
			case 'imagemap':
				
				
				console.log('------------------------');
				break;
			case 'image':
				console.log("LOG : Response "+i+" is image,which will not be saved.");
				console.log('LOG : Get an image and it\'s id : '+event.message.id);
				console.log('LOG : Auto reply an image.');
				console.log('------------------------');
				return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: "image",
							originalContentUrl: "https://adeshpande3.github.io/assets/AlexNet.png",
							previewImageUrl: "https://adeshpande3.github.io/assets/AlexNet.png"
						},
						{
							type: "text",
							text: "我看不懂，所以只好傳AlexNet的架構圖"
						}
						]
					})
				break;
			default :
				console.log('------------------------');
				return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: 'text',
							text: '不要玩他...'
						}
						]
					})
				break;
			
		}
		
	});
	Promise
		.all(promises)
		.then(() => res.json({success: true}))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000!');
})
