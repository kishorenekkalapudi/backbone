  // var MongoClient = require('mongodb').MongoClient
  //   , format = require('util').format;


exports.findAll = function(req, res) {
    res.type('json').status('200').send([{firsrname:'ram',lastName:'ram',age:'29'}, {firsrname:'ram',lastName:'N',age:'29'}, {firsrname:'ram',lastName:'ram',age:'29'}]);

   

  };
 