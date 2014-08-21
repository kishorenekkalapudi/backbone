var express = require('express');
 
var app = express();
 app.use(express.static(__dirname + '/public'));
app.get('*',function(req,res){
res.status(200).send('hello world');
});
 
app.listen(8880);
console.log('Listening on port 8880...');