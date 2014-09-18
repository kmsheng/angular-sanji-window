;(function() { 'use strict';

  angular
    .module('demoApp')
    .service('BundleService', BundleService);

    function BundleService($http, $q, $ocLazyLoad, io) {

      // Members definition
      var self = this;

      self.bundles = [];
      self.MODULE_NAME = 'sanji.window';
      self.getAll = getAll;
      self.lazyLoadBundle = lazyLoadBundle;

      init();

      function init() {
        var socket = io.connect('http://localhost');
        socket.on('news', function (data) {
          console.log(data);
        });
      }

      // Member function implement
      function getAll() {
        var deferred = $q.defer();

        $http
        .get('http://sanjiwindowapi.apiary-mock.com/bundles')
        .then(function(res) {

          var files = [], bundles = res.data, len = bundles.length;

          for (var i = 0; i < len; i++) {
            files.push(bundles[i].url.service);
            files.push(bundles[i].url.controller);
          }

          self.lazyLoadBundle(files)
          .then(function() {
            self.bundles = res.data;
            deferred.resolve(self.bundles);
          });

        });

        return deferred.promise;
      }

      function lazyLoadBundle(files) {
        return $ocLazyLoad.load({
          name: self.MODULE_NAME,
          files: files
        });
      }

    }

}());
