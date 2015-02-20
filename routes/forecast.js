var express, router, config, registerMethod, client, Client;

express = require('express');
router  = express.Router();
Client  = require('node-rest-client').Client;
client  = new Client();

config  = {
  host    : 'https://api.forecast.io',
  apiKey  : '0c8f91f70f6056e820bfc36a0ee3dec7'
};

registerMethod = function(name, type, params, method){
  method  = method || 'GET';
  request = config.host + '/' + type + '/' + config.apiKey + '/' + params

  client.registerMethod(name, request, method);
};


/* GET forecast. */
router.get('/', function(req, res, next) {
  var request, latlong;
  latlong = '35.990511,-78.890954'; // PlotWatt lat and long
  request = config.host + '/forecast/' + config.apiKey + '/' + latlong;

  client.get(request, function(data, response){
    res.send(data);
  });
});

/* */

module.exports = router;
