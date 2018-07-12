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
		console.log("LOG : Response "+i+" has been saved.");
	}); 
	PythonShell.run('test.py', function (err) {
		if (err) throw err;
		console.log('LOG : Get response '+i+' important word.');
		console.log('LOG : Check \'output.txt\' file to get more information.')
		console.log('------------------------');
	});
	var wf=require('fs');
	
	//pyshell.send(event.message.text);
	//pyshell.on('text', function (msg) {
	//	// received a message sent from the Python script (a simple "print" statement)
	//	var buf=iconv.encode(msg,'utf8');
	//	var out=iconv.decode(msg,'big5');
	//	
	//	console.log('user response '+ i +' :'+ msg);	//multiuser???
	//	//console.log(msg.length + '= =');
	//	
	//});
	//pyshell.end(function (err,code,signal) {
	//	//if (err) throw err;
	//	//console.log('The exit code was: ' + code);
	//	//console.log('The exit signal was: ' + signal);
	//	//console.log('finished');
	//	//console.log('finished');
	//	console.log('------------------------');
	//);
	//var outdata;
	//var rf=require('fs');
	//rf.readFile('output.txt','utf8',function(err,data){
	//	if(err){
	//		return console.log(err);
	//	}
	//	var outdata=new String(data);
	//	outdata=iconv.encode(outdata,'utf8');
	//	outdata=iconv.decode(outdata,'big5');
	//	console.log(outdata);
	//});
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
	});
	Promise
		.all(promises)
		.then(() => res.json({success: true}))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000!');
})
