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
