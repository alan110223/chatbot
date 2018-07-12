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
  accessToken: 'KeHUWcvtD50A++1NNj11dtxIoU90nVMFMevYQsJ8ZU3aIUL9EgQVwxBkMPDLFm+GofUCf+Ucf5EBu162Z1RXwTDSDyX6V/V+/iyoRxA52MDoituSh1ExJl7P1ZuvOgmEXYtaCWmepJPhwphas3JeQwdB04t89/1O/w1cDnyilFU=',
  // (Optional) for webhook signature validation
  channelSecret: '9a60b3910f4dfece5a7bf11d8aac9dd2'
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
  // get content from request body
  i++;
  const promises = req.body.events.map(event => {
    // reply message
	//var pyshell = new PythonShell('test.py');
	var fs=require('fs');
	fs.writeFile('sentence.txt', event.message.text, function(err) {
		if(err) {
			return console.log(err);
		}
		i++;
		console.log("Response "+i+" has been saved.");
	}); 
	PythonShell.run('test.py', function (err) {
		if (err) throw err;
		console.log('Get response '+i+' important word.');
	});
	var wf=require('fs');
	
	//pyshell.send(event.message.text);
	//yshell.on('message', function (msg) {
	//	// received a message sent from the Python script (a simple "print" statement)
	//	
	//	var out=iconv.decode(msg,'utf8');
	//	var buf=iconv.encode(msg,'big5');
	//	console.log('user response '+ i +' :'+ buf);	//multiuser???
	//	//console.log(msg.length + '= =');
	//	
	//);
	//yshell.end(function (err,code,signal) {
	//	//if (err) throw err;
	//	//console.log('The exit code was: ' + code);
	//	//console.log('The exit signal was: ' + signal);
	//	//console.log('finished');
	//	//console.log('finished');
	//	console.log('------------------------');
	//);
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
  })
  Promise
    .all(promises)
    .then(() => res.json({success: true}))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
})
