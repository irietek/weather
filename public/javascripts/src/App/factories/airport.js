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

