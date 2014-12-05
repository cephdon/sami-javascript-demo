angular.module('SwaggerAPI', [])
  .service('API', ['Auth', '$http', function(Auth, $http){
    return {
      registerToken: function(){
        return $http.post('/api/v1/auth/token', {
          accessToken: Auth.accessToken
        });
      },
      unregisterToken: function(){
        return $http.delete('/api/v1/auth/token');
      },
      deviceTypes: function(){
        return $http.get('/api/v1/device_types');
      },
      devices: function(){
        return $http.get('/api/v1/devices');
      },
      createDevice: function(device){
        return $http.post('/api/v1/devices', device);
      },
      destroyDevice: function(deviceId){
        return $http.delete('/api/v1/devices/' + deviceId);
      },
      messages: function(options){
        return $http.get('/api/v1/messages');
      }
    }
  }]);
