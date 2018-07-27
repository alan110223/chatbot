'use strict'
const line = require('./index');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const utf8 = require('utf8');
var urlencodedParser = bodyParser.urlencoded({ extended: false }); 
var PythonShell = require('python-shell');
//var pyshell = new PythonShell('test.py');
var iconv = require('iconv-lite');
var fs=require('fs');
// need raw buffer for signature validation
app.use(bodyParser.json({
	verify (req, res, buf) {
		req.rawBody = buf
	}
}))
app.use(express.static('src'));
// init with auth
line.init({
  accessToken: 'k3f/nnuQ7YdvIpyCoLv5MB48d1z+aqvkmwrvQ36X/Ca6UYRNeXAHMUezvNaf+/drofUCf+Ucf5EBu162Z1RXwTDSDyX6V/V+/iyoRxA52MCbcZHj4uSY4I4mi0n5g3136OvS6wFodDi/dltsc7c/IAdB04t89/1O/w1cDnyilFU=',
  // (Optional) for webhook signature validation
  channelSecret: '117c5552066adef3868951fb60021d12'

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


app.post('/sendcomment.html',urlencodedParser, function(req, res) {
 	var name=req.body.name;
	var email=req.body.email;
	var comment=req.body.comment;
	var msg;
	console.log('name : ' + req.body.name);
    console.log('email : ' + req.body.email);
    console.log('comment : ' + req.body.comment);
	
	fs.writeFile('sentence.txt', comment, function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("LOG : Response has been saved.");
	}); 
	var options = {
		pythonOptions: ['-u']
	};
	PythonShell.run('test.py',options, function (err) {
		if (err) throw err;
		console.log('LOG : Get response important word.');
		console.log('LOG : Check \'output.txt\' file to get more information.');
		console.log('------------------------');
	});
	function SyncFunction(){
		var ret;
		setTimeout(function(){
			fs.readFile('output.txt',(err,data)=> {
				if(err) {
					return console.log(err);
				}
				msg=iconv.decode(data, 'big5')
				//console.log("data : "+ data);
				console.log("LOG : Response has been read.");
			});
			ret = "hello";
		},2500);
		while(ret === undefined) {
			require('deasync').sleep(100);
		}
		
		// returns hello with sleep; undefined without
		return msg;    
	}
	msg=SyncFunction().toString();
	console.log(msg);
	var array = msg.split('\r\n');
	function Getwords(){
		var j,retword='';
		for(j=0;j<array.length;j++){
			retword=retword+'<p>'+array[j]+'</p>'
		}
		return retword;
	}
	res.send(Getwords());
	
	//res.sendFile( __dirname + "/src/" + "sendcomment.html" );
});

var i=0;
app.post('/webhook/', line.validator.validateSignature(), (req, res, next) => {
	i++;
	const promises = req.body.events.map(event => {
		console.log('LOG : Get user user id : ' + event.source.userId);
		console.log('LOG : Get message '+i+' type : '+event.message.type);
		switch(event.message.type){
			case 'text':
				
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
						text: event.message.text 
					}
					]
				})
				break;
			case 'sticker':
				console.log("LOG : Response "+i+" is sticker,which will not be saved.");
				
				console.log('------------------------');
				if(event.message.packageId>=2000000||event.message.stickerId>=50000000){
					return line.client
					.replyMessage({
						replyToken: event.replyToken,
						messages: [
						{
							type: 'text',
							text: '不要回那個= ='
						},
						{
							type: "flex",
							altText: "this is a flex message",
							contents: {
								type: "bubble",
								direction: "rtl",
								hero: {
									type: "image",
									url: "https://imgur.com/CJ0hIQ1.jpg#",
								},
								body: {
									type: "box",
									layout: "vertical",
									contents: 
									[
									{
										type: "text",
										text: "這是用小畫家畫的圖"
									}
									]
								},
								styles: {
									body: {
										backgroundColor: "#00ff0f"
									},
									hero: {
										separator: true,
										separatorColor: "#0F0000"
									}
								}
							}
							
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
						messages:[
						{
							type: "imagemap",
							baseUrl: "https://i.imgur.com/1JTYNdN.jpg#",
							altText: "This is an imagemap",
							baseSize: {
								height: 1000,
								width: 1000
							},
							actions: [
								{
									type: "uri",
									linkUri: "https://www.facebook.com",
									area: {
										x: 0,
										y: 0,
										width: 500,
										height: 500
									}
								},
								{
									type: "message",
									text: "hi~~~",
									area: {
										x: 0,
										y: 500,
										width: 500,
										height: 500
									}
								},
								{
									type: "uri",
									linkUri: "https://www.google.com",
									area: {
										x: 500,
										y: 500,
										width: 500,
										height: 500
									}
								},
								{
									type: "message",
									text: "你好",
									area: {
										x: 500,
										y: 0,
										width: 500,
										height: 500
									}
								}
							]
						}
						]
						/*messages: [
						{
							type: "image",
							originalContentUrl: "https://img.ltn.com.tw/Upload/3c/page/2017/04/29/170429-29989-1.jpg",
							previewImageUrl: "https://img.ltn.com.tw/Upload/3c/page/2017/04/29/170429-29989-1.jpg"
						},
						{
							type: "text",
							text: "收到聲音訊息"
						}
						]*/
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
							text: "https://www.google.com.tw/search?q="+event.message.address
						}
						]
					})
				break;
			case 'image':
				console.log("LOG : Response "+i+" is image,which will not be saved.");
				console.log('LOG : Get an image and its id : '+event.message.id);
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
							text: "收到圖片"
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
