;(function() { 'use strict';

  angular
    .module('sanji.window', ['google-maps', 'pasvaz.bindonce', 'sanji.validator', 'ngAnimate'])
    .constant('_', window._)
    .provider('SanjiWindowConfig', SanjiWindowConfig)
    .directive('sanjiHideWindow', sanjiHideWindow)
    .directive('sanjiWindow',sanjiWindow);

  function SanjiWindowConfig() {

    var Configurer, globalConfig;

    Configurer = {};
    Configurer.init = function(object, config) {

      object.setCacheAdapter = function(cacheAdapter) {
        config.cacheAdapter = cacheAdapter;
      };

      object.getCacheAdapter = function() {
        return config.cacheAdapter;
      };

    };

    globalConfig = {};

    Configurer.init(this, globalConfig);

    this.$get = function() {

      function Service() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        this.title = '';
        this.contentUrl = '';
        this.helpUrl = '';
        this.navigateContent = 'sanji-loading';
        this.recordState = [this.navigateContent];
        this.animateClass = 'slide-left';
        this.isProcessing = false;
        this.toggleStatus = false;
      }

      Service.prototype.setTitle = function(title) {
        this.title = title;
      };

      Service.prototype.getTitle = function() {
        return this.title;
      };

      Service.prototype.setContentUrl = function(url) {
        this.contentUrl = url;
      };

      Service.prototype.setHelpUrl = function(url) {
        this.helpUrl = url;
      };

      Service.prototype.navigateTo = function(state) {
        this.recordState.push(state);
        this.navigateContent = state;
      };

      Service.prototype.getWindowStatus = function() {
        return this.navigateContent;
      };

      Service.prototype.isEqualToCurrentState = function(state) {
        return (this.navigateContent === state ) ? true : false;
      };

      Service.prototype.goToLoadingState = function() {
        this.reset();
        this.navigateTo('sanji-loading');
      };

      Service.prototype.goToProcessingState = function() {
        this.reset();
        this.navigateTo('sanji-processing');
      };

      Service.prototype.goToInfoState = function() {
        this.navigateTo('sanji-info');
      };

      Service.prototype.goToEditState = function() {
        this.navigateTo('sanji-edit');
      };

      Service.prototype.goToAddState = function() {
        this.navigateTo('sanji-add');
      };

      Service.prototype.goToProblemState = function() {
        this.reset();
        this.navigateTo('sanji-connection-problem');
      };

      Service.prototype.goBack = function() {
        var states = this.recordState;
        states.pop();
        this.navigateContent = states[states.length - 1];
      };

      Service.prototype.reset = function() {
        this.recordState.length = 0;
      };

      Service.prototype.setToggleStatus = function(status) {
        this.toggleStatus = status;
      };

      Service.prototype.toggleWidget = function() {
        this.toggleStatus = !this.toggleStatus;
        if (angular.isDefined(this.cacheAdapter)) {
          this.cacheAdapter.put(this.title, this.toggleStatus);
        }
      };

      return Service;

    };

  }

  function sanjiHideWindow($animate) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        attrs.$observe('sanjiHideWindow', function(newValue) {
          var result = ('true' === newValue) ? true : false;
          if (result) {
            $animate.addClass(elem, 'ng-hide');
          } else {
            $animate.removeClass(elem, 'ng-hide');
          }
        });
      }
    };
  }

  function sanjiWindow($log, $controller, SanjiWindowConfig) {
    return {
      templateUrl: 'templates/sanji-window.html',
      restrict: 'EA',
      replace: true,
      scope: {
        title: '@',
        contentUrl: '@',
        helpUrl: '@'
      },
      link: function postLink(scope) {
        scope.sanjiWindowMgr = new SanjiWindowConfig();

        if (scope.contentUrl) {
          scope.sanjiWindowMgr.setContentUrl(scope.contentUrl);
        } else {
          $log.error('Sanji window content url not defined!');
        }

        if (scope.title) {
          scope.sanjiWindowMgr.setTitle(scope.title);
        }
        if (scope.helpUrl) {
          scope.sanjiWindowMgr.setHelpUrl(scope.helpUrl);
        }
      }
    };
  }

}());