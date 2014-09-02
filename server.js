var express = require('express');
   routes = require('./routes/route');
 
 

 
 
var app = express();
app.use(express.static(__dirname + '/public'));
app.get('/api/:id', routes.findAll);

app.get('*',function(req,res){
res.status(200).send('hello world');
});

 
app.listen(9090);
console.log('Listening on port 9090...');