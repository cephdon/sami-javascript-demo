# Sample Javascript App for SAMI

## Installation

1. Create an application with a redirection url pointing to the the following path:

        /auth/samihub/callback

2. Do the following:

    ```sh
    git clone git@bitbucket.org:samihub/sami.git
    cd sami/salamis/clients/samples/javascript
    npm install bower -g
    npm install .
    bower install
    SAMI_CLIENT_ID=<client-id> node index.js
    ```
3. Go to http://localhost:3000/
4. Enjoy.

## SAMI SDK

This sample uses the node package swagger-client.

### Setting authorization header
In order to set the access token, you should do the following:
```
config.js#L63-70
```
```javascript
    var client = require("swagger-client");
    client.authorizations.add(
      "accessToken", // This is just an authorization identifier. It can be anything.
      new client.ApiKeyAuthorization(
        "Authorization",
        "Bearer " + accessToken,
        "header"
      )
    );
```
Once setup, you can call the api as follows:
```
config.js#L72-80
```
```javascript
    var swagger = new client.SwaggerApi({
      url: 'http://localhost:3000/swagger', // The url to the api doc.
      success: function() {
        if(swagger.ready === true) {
          var params = {};
          swagger.apis['users.json'].self(params, function(response){
            var json = JSON.parse(response.data.toString()); // Buffer of data to string
            console.log(json.data);
          });
        }
      }
    });
```
You can look at more examples of the api in the next sections.

### Getting the current user
```
lib/swaggerApi.js#L14-19
```
```javascript
    var swagger = new client.SwaggerApi({
      url: 'http://localhost:3000/swagger',
      success: function() {
        if(swagger.ready === true) {
          var params = {};
          swagger.apis['users.json'].self(params, function(response){
            var currentUser = JSON.parse(response.data.toString()).data;
          });
        }
      }
    });
```

### Getting devices of the current user
```
lib/swaggerApi.js#L21-30
```
```javascript
    var swagger = new client.SwaggerApi({
      url: 'http://localhost:3000/swagger', // The url to the api doc.
      success: function() {
        if(swagger.ready === true) {
          var params = {};
          params = {
            includeProperties: true,
            userId: 1234
          };
          swagger.apis['users.json'].getUserDevices(params, function(response){
            var json = JSON.parse(response.data.toString());
            var userDevices = json.data.devices;
          });
        }
      }
    });
```

### Getting messages
```
lib/swaggerApi.js#L32-41
```
```javascript
    var swagger = new client.SwaggerApi({
      url: 'http://localhost:3000/swagger', // The url to the api doc.
      success: function() {
        if(swagger.ready === true) {
          var params = {
            sdids: '1234,1235',
            count: 100
          };
          swagger.apis['messages.json'].getNormalizedMessagesLast(params, function(response){
            var json = JSON.parse(response.data.toString());
            var messages = json.data;
          });
        }
      }
    });
```
