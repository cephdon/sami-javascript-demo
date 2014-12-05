angular.module('OAuth2', [])
  .filter('queryToJSON', function(){
    return function(query){
      var pairs = query.split('&');
      var result = {};
      pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
      });
      return JSON.parse(JSON.stringify(result));
    }
  })
  .service('OAuth2', ['$interval', '$filter','$q', function($interval, $filter, $q){
    return {
      init: function(config){
        this.config = config;
      },
      login: function(){
        this.deferred = $q.defer();
        this.popup = window.open(this.authenticationUrl(),
                                 '_blank', this.popupOptions()
                                );
                                var _that = this;
                                this.popupObserver = $interval(function(){
                                  _that.observePopup();
                                }, 100);
                                return this.deferred.promise;
      },
      authenticationUrl: function(){
        return this.config.authorizeUrl + "?" + "client_id=" + this.config.clientId + "&response_type=token";
      },
      popupOptions: function(){
        var windowWidth = 500;
        var windowHeight = 550
        // Multi Screen Popup Positioning (http://stackoverflow.com/a/16861050)
        //   Credit: http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
        // Fixes dual-screen position                         Most browsers      Firefox
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        var width = window.innerWidth || documentElement.clientWidth || screen.width;
        var height = window.innerHeight || documentElement.clientHeight || screen.height;

        var left = ((width - windowWidth) / 2) + dualScreenLeft;
        var top  = ((height - windowHeight) / 2) + dualScreenTop;
        return "resizeable=true,height=" + windowHeight + ",width=" + windowWidth + ",left=" + left + ",top="  + top;
      },
      observePopup: function(){
        this.observePopupClose();
        this.observePopupResponse();
      },
      observePopupClose: function(){
        if(this.popup.closed){
          this.deferred.reject({
            error: 'Login cancelled'
          });
          this.endObserve();
        }
      },
      observePopupResponse: function(){
        var popupLocation = '';
        var redirectUri = '';
        try{
          popupLocation = this.popup.location;
          redirectUri = popupLocation.href.substr(0, popupLocation.href.indexOf('#'));
          var index = popupLocation.href.indexOf('?')
          if(index >=0)
            redirectUri = popupLocation.href.substr(0, index);
        } catch(e) {
        };
        if(redirectUri === this.config.redirectUri){
          this.handleResponse(this.popup.location);
          this.popup.close()
          this.endObserve();
        };
      },
      endObserve: function(){
        $interval.cancel(this.popupObserver);
      },
      handleResponse: function(location){
        var successResponse = $filter('queryToJSON')(location.hash);
        if(!successResponse['access_token']){
          var failureResponse = $filter('queryToJSON')(location.search.slice(1));
          this.deferred.reject({
            error: failureResponse['error_description']
          });
        } else {
          this.deferred.resolve(successResponse);
        }
      }
    };
  }]);
