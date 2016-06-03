
angular.module('abmeasy', ['ionic', 'abmeasy.controllers', 'abmeasy.services'])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.run(function($ionicPlatform, $http, $localstorage, $state) {
  
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider,$urlRouterProvider) {

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'index.html'
  })

  $stateProvider.state('app.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'SignInCtrl'
  })

  $stateProvider.state('app.signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'SignUpCtrl'
  })

  $stateProvider.state('app.terms', {
    url: '/terms',
    templateUrl: 'templates/terms.html'
  })

  $stateProvider.state('app.home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'HomeCtrl'
  });

  $stateProvider.state('app.uploadtax', {
    url: '/uploadtax',
    templateUrl: 'templates/uploadtax.html',
    controller: 'UpdTaxDocCtrl'
  });

  $stateProvider.state('app.receiptimage', {
    url: '/receiptimage',
    templateUrl: 'templates/receiptimage.html',
    controller: 'ReceiptImageCtrl'
  });

  $stateProvider.state('app.uploadreceipt', {
    url: '/uploadreceipt',
    templateUrl: 'templates/uploadreceipt.html',
    controller: 'UpdReceiptDocCtrl'
  });

  $stateProvider.state('app.choosetype', {
    url: '/choosetype/:requesttype',
    templateUrl: 'templates/choosetype.html',
    controller: 'ChooseTypeCtrl'
  });

  $stateProvider.state('app.success', {
    url: '/success',
    templateUrl: 'templates/success.html',
    controller: 'SuccessCtrl'
  });

  $urlRouterProvider.otherwise("/login");
})