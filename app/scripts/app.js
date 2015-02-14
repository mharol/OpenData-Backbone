/*jshint -W020 */

if (!this.MyOD || typeof this.MyOD !== 'object') {
  this.MyOD = {};
}

(function () {
  'use strict';

  MyOD = new Backbone.Marionette.Application();

  MyOD.on('before:start', function(options){
    this.searchModel = new MyOD.Models.SearchModel();
    this.layout = new MyOD.Main.Layout();
    //this.reqres = new Backbone.Wreqr.RequestResponse();
  });

  MyOD.on('start', function(options){
    if (Backbone.history){
      //if you are hosting on a server that can let the browser handle all the routing,
      //you can use pushstate, otherwise (gh-pages) use hashed urls
      //Backbone.history.start({ pushState: Modernizr.history, root: '/OpenData-Backbone' });
      if (!Backbone.history.start({ pushState: false, root: '/OpenData-Backbone' })) {
        MyOD.navigate('404', { trigger:true });
      }
    }

    Backbone.history.on('route', this.layout.setClasses);
    this.layout.setClasses();
  });

  MyOD.navigate = function (route, options) {
    Backbone.history.navigate(route, options);
  };

  MyOD.search = function (options) {
    var route = MyOD.searchModel.getRoute();
    MyOD.navigate(route, { trigger:true });
  };

  MyOD.navigate404 = function () {
    MyOD.navigate('404', { trigger: true, replace: true });
  };

  MyOD.queryStringToObject = function () {
    var result = {};

    var q = Backbone.history.getFragment().split('?')[1];

    if (q) {
      var pairs = q.split('&');
      
      _.each(pairs, function(pair) {
        pair = pair.split('=');
        if (pair[0] === 'q') {
          result[pair[0]] = pair[1].replace(/\+/, ' ') || '';
        } else {
          result[pair[0]] = decodeURIComponent(pair[1] || '');
        }
      });
    }

    return result;
  };

  MyOD.onBeforeDestroy = function () {
    Backbone.history.stop();
  };

})();
