PilotWeather.controller('ForecastController', ['$log', '$rootScope', 'ForecastService', function($log, $rootScope, ForecastService){
  this.plot     = [];
  this.display  = false;
  var _self     = this;
  
  $rootScope.$on('plot:forecast', function(event, data){
    // Forecast request
    _self.display = true;
    _.forEach(data.points, function(point){
      var time = data.time.add(point.time_elapsed, 'hours');
      var arg = {
        cord  : point.current_cordinate,
        time  : time.format('X'),
        show  : time.format('lll')
      };
      ForecastService.request(arg, function(weather){
        weather.time = arg.show;
        weather.cord = arg.cord;
        _self.plot.push(weather);
      });
    });
  });

}]);
