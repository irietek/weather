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

