  // var MongoClient = require('mongodb').MongoClient
  //   , format = require('util').format;


exports.findAll = function(req, res) {
    res.type('json').status('200').send([{name:'wine1'}, {name:'wine2'}, {name:'wine4'}]);

   

  };
 