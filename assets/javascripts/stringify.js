angular.module('Stringify', [])
  .filter('stringify', function(){
    return function(input){
      return JSON.stringify(input, undefined, 2);
    }
  });
