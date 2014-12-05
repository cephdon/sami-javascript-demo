angular.module('Moment', [])
  .filter('timestampToDate', function(){
    return function(input){
      return moment.unix(input/1000);
    }
  })
  .filter('fromNow', function(){
    return function(input){
      return moment(input).fromNow();
    }
  });
