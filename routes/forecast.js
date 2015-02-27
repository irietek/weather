var express, router, config, client, Client,
    getDistance, forecastReq, cacheManager, memoryCache;

express       = require('express');
router        = express.Router();
Client        = require('node-rest-client').Client;
client        = new Client();
cacheManager  = require('cache-manager');
memoryCache   = cacheManager.caching({store: 'memory', max: 100, ttl: 60});

config  = {
  host    : 'https://api.forecast.io',
  apiKey  : '0c8f91f70f6056e820bfc36a0ee3dec7'
};

forecastReq = function(request, cb){
  var cacheKey  = request;

  memoryCache.get(cacheKey, function(err, result){
    if (result) {
      return cb(null, result);
    }

    client.get(request, function(data, response){
      result = JSON.parse(data);
      memoryCache.set(cacheKey, result.currently);
      cb(null, result.currently);
    });
  });
};

getDistance = function(lat1, lat2, lon1, lon2) {
  var R, dLat, dLon, deg2rad, a, c, d;

  deg2rad = function(deg){ return deg * (Math.PI/180); };
  R       = 3440.064794816; // Radius of the earth in nautical miles
  dLat    = deg2rad(lat2 - lat1);
  dLon    = deg2rad(lon1 - lon2);
  
  a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  d = R * c;

  return d;
};

/* GET PlotWatt forecast */
router.get('/', function(req, res, next) {
  var request, latlong;
  latlong = '35.990511,-78.890954'; // PlotWatt lat and long
  request = config.host + '/forecast/' + config.apiKey + '/' + latlong;

  client.get(request, function(data, response){
    res.send(data);
  });
});

/* GET forecast at a point in time */
router.get('/:cord/:time?', function(req, res, next){
  var cord, time, request;

  cord = req.params.cord;
  time = req.params.time;

  request = config.host + '/forecast/' + config.apiKey + '/' + cord;
  request = (time) ? request+','+time : request;
  forecastReq(request, function(err, result){
    res.send(result);
  });
});

/* GET path plot from params */
router.get('/:orig_latlong/:dest_latlong/:dep_time/:speed', function(req, res, next) {
  var request, response, duration, points, last_plot,
      lat1, lat2, lon1, lon2, lat_rate, lon_rate,
      orig, dest, time, speed, distance;

  orig  = req.params.orig_latlong;
  dest  = req.params.dest_latlong;
  time  = req.params.dep_time;
  speed = req.params.speed;

  lat1  = parseFloat(orig.split(',')[0]);
  lat2  = parseFloat(dest.split(',')[0]);
  lon1  = parseFloat(orig.split(',')[1]);
  lon2  = parseFloat(dest.split(',')[1]);

  distance  = getDistance(lat1, lat2, lon1, lon2);
  duration  = distance / speed;
  lat_rate  = (lat2 - lat1) / duration;
  lon_rate  = (lon2 - lon1) / duration;
  points    = new Array(Math.ceil(duration));
  last_plot = points.length;
  for (var i = 0; i < last_plot; i++) {
    var distance_traveled, time_elapsed, current_latitude, current_longitude;
    distance_traveled = ((speed * (i+1)) >= distance) ? distance - (speed * i) : speed * (i + 1);
    current_latitude  = (i === last_plot - 1) ? lat2 : lat1 + (lat_rate * (i+1));
    current_latitude  = current_latitude.toFixed(6);
    current_longitude = (i === last_plot - 1) ? lon2 : lon1 + (lon_rate * (i+1));
    current_longitude = current_longitude.toFixed(6);
    time_elapsed      = (i === last_plot - 1) ? duration : i;
    points[i] = {
      distance_traveled : distance_traveled,
      time_elapsed      : time_elapsed,
      current_latitude  : current_latitude,
      current_longitude : current_longitude,
      current_cordinate : current_latitude+','+current_longitude
    };
  }

  response  = {
    cordinate : {lat: [lat1, lat2], lon: [lon1, lon2]},
    rate      : {lat: lat_rate, lon: lon_rate},
    distance  : distance,
    speed     : speed,
    duration  : duration,
    points    : points
  };

  res.send(response);

});

module.exports = router;
