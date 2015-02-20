var config, request, registerMethod, client, Client;

config = {
  host    : 'https://api.forecast.io',
  apiKey  : '0c8f91f70f6056e820bfc36a0ee3dec7'
};

Client  = require('node-rest-client').Client;
client  = new Client();

registerMethod = function(name, type, params, method){
  method  = method || 'GET';
  request = config.host + '/' + type + '/' + config.apiKey + '/' + params

  client.registerMethod(name, request, method);
};

registerMethod('PlotWatt', 'forecast', '35.990511,-78.890954');

client.methods.PlotWatt(function(data, response){
  var json;

  json = JSON.parse(data);
  console.log(JSON.stringify(json, null, 2));
});
