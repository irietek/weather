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
