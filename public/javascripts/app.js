var PilotWeather;

PilotWeather = angular.module('PilotWeather', ['ngRoute']);

PilotWeather.config(['$routeProvider', function($routeProvider){
  $routeProvider.
    when('/', {
      templateUrl : '/templates/index.html',
      controller  : 'MainController'
    }).
    otherwise({
      redirectTo  : '/'
    });
}]);

PilotWeather.factory('AirportService', ['$log', '$http', function($log, $http){
  
  return {
    airport: null,
    request: function(args, callback){
      var url = '/data/airports.json';
      
      $http.get(url)
        .success(function(data){
          if (callback) {
            airport = data;
            callback(data);
          }
        })
        .error(function(data, status){
          $log.debug("error", data, status);
        })
    }
  }
}]);


PilotWeather.factory('ForecastService', ['$log', '$http', function($log, $http){
  
  return {
    request: function(args, callback){
      var url = '/forecast/'+args.cord+'/'+args.time;
      
      $http.get(url)
        .success(function(data){
          if (callback) {
            callback(data);
          }
        })
        .error(function(data, status){
          console.log("error", data, status);
        })
    }
  }
}]);


PilotWeather.factory('PlotService', ['$log', '$http', function($log, $http){
  
  return {
    request: function(args, callback){
      var url = '/forecast/'+args.orig+'/'+args.dest+'/'+moment(args.time).format('X')+'/'+args.speed;
      
      $http.get(url)
        .success(function(data){
          if (callback) {
            callback(data);
          }
        })
        .error(function(data, status){
          console.log("error", data, status);
        })
    }
  }
}]);

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

PilotWeather.controller('MainController', [function(){
  $(function () {
    $('#inputTime').datetimepicker();
  });
}]);

PilotWeather.controller('PlotController', ['$log', '$rootScope', 'PlotService', function($log, $rootScope, PlotService){

  var _self;

  this.plot     = null;
  this.time     = null;
  this.display  = false;
  this.request  = {
    orig  : '35.990511,-78.890954',
    dest  : '26.146614,-80.332965',
    time  : '02/23/2015 7:26 PM',
    speed : 90
  };

  this.map = {
    center  : null,
    zoom    : '6',
    size    : '600x400',
    maptype : '&maptype=hybrid',
    path    : 'color:0xff0000ff|weight:4',
    start   : 'color:red%7Clabel:C%7C',
    end     : 'color:green%7Clabel:C%7C'
  };

  _self = this;

  this.submit = function($event){
    _self.request.time = $($event.currentTarget).find('#inputTime').val();
    _self.time = moment(_self.request.time);
    PlotService.request(_self.request, _self.forecast);
  };

  this.forecast = function(data){
    // TODO: Figure out and apply a zoom level formula
    if (data.distance > 601 && data.distance < 1000) _self.map.zoom = 4;
    if (data.distance > 401 && data.distance < 600) _self.map.zoom = 5;
    if (data.distance > 200 && data.distance < 400) _self.map.zoom = 6;
    
    // Find map center point
    var mid = Math.floor(data.points.length / 2);
    _self.display     = true;
    _self.map.center  = data.points[mid].current_cordinate;

    // Forecast request
    data.time = _self.time;
    $rootScope.$broadcast('plot:forecast', data);
  };

}]);
