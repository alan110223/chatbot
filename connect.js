var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false }); 
var PythonShell = require('python-shell');
var fs=require('fs');
var iconv = require('iconv-lite');
var msg;
app.use(express.static('src'));
 
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/src/" + "index.html" );
});

app.post('/sendcomment.html',urlencodedParser, function(req, res) {
 	var name=req.body.name;
	var email=req.body.email;
	var comment=req.body.comment;
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
		var i,retword='';
		for(i=0;i<array.length;i++){
			retword=retword+'<p>'+array[i]+'</p>'
		}
		return retword;
	}
	res.send(Getwords());
	
	//res.sendFile( __dirname + "/src/" + "sendcomment.html" );
});
 
app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000!');
});
