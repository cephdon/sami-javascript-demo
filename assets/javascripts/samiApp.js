angular.module('SAMIApp', ['ngRoute', 'OAuth2', 'SwaggerAPI', 'Stringify', 'Moment'])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: 'templates/welcome/index',
        controller: 'WelcomeController',
        requireNoAuthentication: true
      }).
      when('/devices/new', {
        templateUrl: 'templates/devices/new',
        controller: 'DevicesController',
        authenticateUser: true
      }).
      when('/devices', {
        templateUrl: 'templates/devices/index',
        controller: 'DevicesController',
        authenticateUser: true
      }).
      when('/messages', {
        templateUrl: 'templates/messages/index',
        controller: 'MessagesController',
        authenticateUser: true
      });
  }])
  .run(['$rootScope', '$location', '$route', 'Auth', 'OAuth2', 'App', function ($rootScope, $location, $route, Auth, OAuth2, App) {
    OAuth2.init({
      redirectUri: 'http://localhost:3000/auth/samihub/callback',
      authorizeUrl: 'https://accounts.samihub.com/authorize',
      clientId: $('meta[name=clientId]').attr('content')
    });

    Auth.accessToken = $('meta[name=accessToken]').attr('content');

    $rootScope.$on('$routeChangeStart', function (event, next) {
      if(next.authenticateUser && !Auth.accessToken){
        $location.path('/');
        $route.reload();
      }
      if(next.requireNoAuthentication && Auth.accessToken){
        $location.path('/devices');
        $route.reload();
      };
    });
  }])
  .service('App', ['$location', '$route', 'Auth', 'API', function($location, $route, Auth, API){
    var redirectToDefault = function(){
      $location.path('/devices');
      $route.reload();
    };

    var initialize = function(accessToken){
      var _this = this;
      Auth.accessToken = accessToken;
      API.registerToken().then(function(user){
        redirectToDefault();
      });
    };

    var logout = function(){
      Auth.accessToken = null;
      API.unregisterToken();
      redirectToDefault();
    };

    return {
      initialize: initialize,
      logout: logout
    };
  }])
  .constant('Auth', {
    accessToken: null
  })
  .directive('samiLoading', function(){
    return {
      restrict: 'A',
      templateUrl: 'templates/shared/loading',
      link: function($scope, $el, $attrs){
        $scope.$watch($attrs.samiLoading, function(newVal){
          if(!_.isUndefined(newVal)){
            $el.hide();
          }
        });
      }
    };
  })
  .controller('MenuController', ['$scope', '$location', 'Auth', 'App', function($scope, $location, Auth, App){
    $scope.isActive = function(paths){
      paths = (paths == null ? [] : (Array.isArray(paths) ? paths : [paths]));
      return (paths.indexOf($location.path()) > -1);
    };

    $scope.isAuthenticated = function(){
      return Auth.accessToken;
    };

    $scope.logout = App.logout;
  }])
  .controller('WelcomeController', ['$scope', 'OAuth2', 'App', function($scope, OAuth2, App){
    $scope.login = function(){
      var login = OAuth2.login();
      login.then($scope.handleSuccessLogin, $scope.handleFailLogin);
    };

    $scope.handleSuccessLogin = function(resp){
      App.initialize(resp['access_token']);
    };

    $scope.handleFailLogin = function(resp){
      $scope.error = resp.error;
    };
  }])
  .controller('DevicesController', [ '$scope', 'API', '$location', function($scope, API, $location){
    $scope.device = {};

    API.devices().then(function(res){
      $scope.devices = res.data;
    });

    API.deviceTypes().then(function(res){
      $scope.deviceTypes = res.data;
      $scope.device.dtid = $scope.deviceTypes[0].id;
    });

    $scope.findDevice = function(deviceId){
      return _.find($scope.devices, function(device){ return device.id == deviceId; });
    };

    $scope.findType = function(deviceTypeId){
      return _.find($scope.deviceTypes, function(type){ return type.id == deviceTypeId; });
    };

    $scope.create = function(){
      API.createDevice($scope.device).then(function(device){
        $scope.devices.push(device);
        $scope.device = {};
        $location.path('/devices');
      });
    };

    $scope.destroy = function(deviceId){
      API.destroyDevice(deviceId).then(function(res){
        $scope.devices = _.reject($scope.devices, function(device){ return device.id == res.data.id; });
      });
    };
  }])
  .controller('MessagesController', [ '$scope', 'API', 'Auth', function($scope, API, Auth){
    API.devices().then(function(res){
      $scope.devices = res.data;
    });

    API.deviceTypes().then(function(res){
      $scope.deviceTypes = res.data;
    });

    $scope.findDevice = function(deviceId){
      return _.find($scope.devices, function(device){ return device.id == deviceId; });
    };

    $scope.findType = function(deviceTypeId){
      return _.find($scope.deviceTypes, function(type){ return type.id == deviceTypeId; });
    };

    API.messages().then(function(res){
      $scope.messages = res.data;
    });
  }]);
