// Marionette.Wreqr, v0.0.0
// Copyright (c)2012 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
// http://github.com/marionettejs/marionette.wreqr
Backbone.Marionette.Wreqr = (function(Backbone, Marionette, _){
  "option strict";
  var Wreqr = {};

  Wreqr.Handlers = (function(Backbone, _){
    "option strict";
    
    var Handlers = function(){
      "use strict";
      this._handlers = {};
    };
  
    Handlers.extend = Backbone.Model.extend;
  
    _.extend(Handlers.prototype, {
      addHandler: function(name, handler, context){
        var config = {
          callback: handler,
          context: context
        };
  
        this._handlers[name] = config;
      },
  
      getHandler: function(name){
        var config = this._handlers[name];
  
        if (!config){
          throw new Error("Handler not found for '" + name + "'");
        }
  
        return function(){
          return config.callback.apply(config.context, arguments);
        };
      },
  
      removeHandler: function(name){
        delete this._handlers[name];
      },
  
      removeAllHandlers: function(){
        this._handlers = {};
      }
    });
  
    return Handlers;
  })(Backbone, _);
  
  Wreqr.Commands = (function(Wreqr){
    "option strict";
  
    return Wreqr.Handlers.extend({
      execute: function(name, args){
        this.getHandler(name)(args);
      }
    });
  
  })(Wreqr);
  
  Wreqr.RequestResponse = (function(Wreqr){
    "option strict";
  
    return Wreqr.Handlers.extend({
      request: function(name, args){
        return this.getHandler(name)(args);
      }
    });
  
  })(Wreqr);
  
  
  (function(){
    "option strict";

    console.log("foo");
  
    if (Backbone && Backbone.Marionette && Backbone.Marionette.Application){
      console.log("bar");

      var commands = new Wreqr.Commands();
      var reqres = new Wreqr.RequestResponse();
  
      _.extend(Backbone.Marionette.Application.prototype, {
        commands: commands,
        execute: function(name, argObj){
          commands.execute(name, argObj);
        },
  
        requestResponse: reqres,
        request: function(name, argObj){
          return reqres.request(name, argObj);
        }
      });
    }
  })();
  

  return Wreqr;
})(Backbone, Backbone.Marionette, _);
