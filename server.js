var express = require('express'),
   routes = require('./routes/route');
 	var bodyParser = require('body-parser');
 

 
 
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.get('/rest/api/members', routes.findAll);
app.post('/post',function  (req,res) {
console.log(req.body);
res.type('application/json').status(200).send({"name":"good"});

	// body...
});
app.get('*',function(req,res){
res.status(400).send(" Specific URL is not vaild or post");
});


 
app.listen(9090);
console.log('Listening on port 9090...');