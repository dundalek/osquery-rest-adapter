var exec = require('child_process').exec;
var fuzzy = require('fuzzy');
var express = require('express');
var cors = require('cors')

var app = express();
app.use(cors());

var userName = 'local';
var programName = 'osquery';

var tables = new Promise(function(resolve, reject) {
  exec('osqueryi .tables', function(err, stdout, stderr) {
    if (err) return reject(err);
    var out = stdout.trim().replace(/=>/g, '').split('\n').map(function(table) {
      return {
        userName: userName,
        programName: programName,
        relationName: table.trim()
      }
    })
    resolve(out);
  });
});

app.get('/dataset/search', function (req, res, next) {
  tables.then(function(results) {
    if (req.query.q) {
      var q = req.query.q.replace(/\s+/g, '');
      var options = {extract: function(el) {return el.relationName;}}
      matches = fuzzy.filter(q, results, options);
      results = matches.map(function(el) {return el.original;});
    }
    res.json(results);
  }).catch(next);
});

function extractParam(req, param) {
  // get param and trip prefix, e.g. user-MyUser -> MyUser
  return req.params[param].slice(param.length + 1);
}

function isValidTableName(name) {
  return !!name.match(/^[_A-Za-z]+$/);
}

app.get('/dataset/:user/:program/:relation/data', function (req, res, next) {
  var user = extractParam(req, 'user');
  var program = extractParam(req, 'program');
  var relation = extractParam(req, 'relation');
  
  if (!isValidTableName(relation)) return next('Invalid table name: ' + relation);
  
  exec('osqueryi --json "select * from ' + relation + '"', function(err, stdout, stderr) {
    if (err) return next(err);
    res.send(stdout);
  });
  
});

var server = app.listen(process.env.PORT || 8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
