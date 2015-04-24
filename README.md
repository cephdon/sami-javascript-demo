# SAMI Sample JavaScript App

This sample JavaScript app was created to showcase how to manage SAMI's authentication (based on OAuth2), send and receive messages with SAMI's REST APIs and other functionalities.

##  Prerequisites

 * [Node.js](https://nodejs.org/) 

## Installation

1. Create an Application in devportal.samsungsami.io:
  * The Redirect URI is set to 'http://localhost:3000/auth/samihub/callback'.
  * Choose "Client credentials, auth code, Implicit" for OAuth 2.0 flow.
  * Under "PERMISSIONS", check "Read" for "Profile". 
  * Click the "Add Device Type" button. Pick a few device types to set the proper permissions per the following guideline. If you just want to see data of a device on the sample app, check "Read" permission for the corresponding device type. If you want the ability to delete a device shown on the sample app, check "Read" and "Write" permissions for the corresponding device type.
  * Save your application. Make a note of your client ID, which will be used in the next step.
2. Do the following at the root directory of this sample app:

    ```sh
    npm install bower -g
    npm install .
    bower install
    SAMI_CLIENT_ID=<YOUR CLIENT APP ID> node index.js
    ```
3. Go to http://localhost:3000/
4. Start to play with the app.

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

## More about SAMI

If you are not familiar with SAMI we have extensive documentation at http://developer.samsungsami.io

The full SAMI API specification with examples can be found at http://developer.samsungsami.io/sami/api-spec.html

We blog about advanced sample applications at http://blog.samsungsami.io/

To create and manage your services and devices on SAMI visit developer portal at http://devportal.samsungsami.io

## Licence and Copyright

Licensed under the Apache License. See LICENCE.

Copyright (c) 2015 Samsung Electronics Co., Ltd.
