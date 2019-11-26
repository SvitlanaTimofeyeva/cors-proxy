var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    app = express();

var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

  if (req.method === 'OPTIONS') {
      // CORS Preflight
      res.send();
  } else {
      var targetURL = req.query.url;
      if (!targetURL) {
          res.send(500, { error: 'There is no Target-Endpoint header in the request' });
          return;
      }
      const headers = {
        'Authorization': 'Basic dTIxODAzNjpKaklLUENkc281NFRaQnFB',
        'sec-fetch-mode': 'no-cors'
      }
      if (req.headers.range) {
        headers['Range'] = req.headers.range;
      }
      request({ url: targetURL, method: req.method, json: req.body, headers },
        function (error, response, body) {
            if (error) {
                console.error('error: ' + error, req.headers)
            }
        }).pipe(res);
  }
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
