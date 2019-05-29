/**
* @name Auth
* @summary Auth Hydra Express service entry point
* @description Authentication and Authorization
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');
const mongoose = require('mongoose');

let config = require('fwsp-config');

/**
* Load configuration file and initialize hydraExpress app
*/
config.init('./config/config-test.json')
  .then(() => {
    config.version = version;
    return hydraExpress.init(config.getObject(), version, () => {

      mongoose.connect(config.dburl,{ useNewUrlParser: true });
      var db = mongoose.connection;
        db.on('error', function (err) {
          console.log('Failed to connect to database');
          process.exit(1);
        });
      
        db.once('open', function () {
          console.log("Connected to database");
        });

      hydraExpress.registerRoutes({
        '/authapi/v1': require('./routes/auth-v1-routes')
      });
    });
  })
  .then(serviceInfo => console.log('serviceInfo', serviceInfo))
  .catch(err => console.log('err', err));
