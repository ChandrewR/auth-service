var express = require('express');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('../models/user');
var bcrypt = require('bcrypt');


exports.authenticate = function(req, res, next) {

  let fetchedUser;

  try {
    User.findOne({associateID :req.body.associateID}).then(user => {
      //res.setHeader("Authorization","");
      fetchedUser = user;
      console.log(user);
      if (!user)  {
        return res.sendError({message : 'User not found', role : null, token : null});
      }

      console.log("............=========>"+req.body.password);
      if(req.body.password == null) {
        return res.sendError({message : 'Authentication failed', role : null, token : null});
      }
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      //res.setHeader("Authorization","");
      try {
        if(!result) {
          console.log("Check1");
          return res.sendError({message : 'Authentication failed', role : null, token : null});
        }
        const token = jwt.sign({associateid : fetchedUser.associateID},
          "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
          { expiresIn : "1h"});
          res.sendOk({message : 'Success', role : fetchedUser.role, token : token, expiresIn : 3600});

      } catch (e) {
        res.sendError({
          message : "Authentication failed",
          user : null,
          token : null
        });

      }
      
    });
  } catch(e) {
    //res.setHeader("Authorization","");
    console.log(e);
    res.sendError({
      message : "Authentication failed",
      user : null,
      token : null
    });
  }
  
}
 
exports.adduser = function(req, res) {

  var password = null;
  if( req.body.role == 'Admin' ) {
    password = 'admin'
  } else {
    password = 'password'
  }

  console.log('------->'+password);

  try {

    bcrypt.hash(password,10).then(hash => {
      var user = new User({ 
        associateID: req.body.associateID,
        password : hash,
        role: req.body.role
      });
    
      user.save().then(result => {
           res.sendOk({ 
            success: true,
            message : 'User successfully added!',
            _id : result._id
           });
        });
    });
    
  } catch(e) {
    res.sendError({ 
      success: false,
      message : 'Error occurred, while adding user.',
      _id : null
     });
  }
} 