var app = angular.module('app', ['ui.router', 'ngMaterialize', 'infinite-scroll']);

var appName = 'Starships of Star Wars';
var starshipPage = 0;
var nextPage = "";

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider.state('app', {
    abstract: true,
    template: '<ui-view/>'
  });

  $stateProvider.state('app.feed', {
    url: '/',
    templateUrl: '/views/feed.html',
    controller: 'StarshipController',
    onEnter: function(page) {
      page.title = 'Home | ' + appName;
    },
    resolve: {
      starship: function(starship) {
        return starship;
      }
    }
  });

  $stateProvider.state('app.feed.detail', {
    url: 'detail/:id',
    onEnter: function($state, $modal) {
      var p = $modal.open({
        templateUrl: '/views/detail.html',
        controller: 'StarshipController',
        fixedFooter: true
      }).finally(function() {
        $state.go('^');
      });
    },
    resolve: {
      starship: function($stateParams, starship) {
        starship.getAll().success(function() {
          starship.detail = starship.get($stateParams.id);
        });
      }
    }
  });

  $locationProvider.html5Mode(true);
});

app.factory('page', function() {
  var o = {
    title: '',
    isLoading: false
  };

  o.init = function() {
    $('.tooltipped').tooltip();
  };

  return o;
});

app.factory('starship', function($http){
  var o = {
    list: []
  };

  o.getAll = function() {
    return $http.get('http://swapi.co/api/starships/').success(function(data) {
      angular.copy(data, o.list);
    });
  };

  o.getPage = function(page, callback) {
    return $http.get('http://swapi.co/api/starships/?page='+ page).success(function(data) {
      data.results.forEach(function(item) {
        o.list.push(item);
      });
      nextPage = data.next;
      if (callback) callback();
    });
  };

  o.get = function(id) {
    var result = null;
    o.list.forEach(function(item) {
      if (item.id == id) result = item;
    });
    return result;
  };

  return o;
});

app.controller('AppController', function($scope, page) {
  $scope.page = page;

  $scope.$on('$stateChangeStart', function(event, toState) {
    if (toState.name !== 'app') page.isLoading = true;
  });

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.name !== 'app') page.isLoading = false;
  });

  $scope.$on('$stateChangeError', function(event, toState) {
    if (toState.name !== 'app') page.isLoading = false;
  });

  $scope.$on('$includeContentLoaded', function(event) {
    page.init();
  });
});

app.controller('StarshipController', function($scope, starship){
    $scope.starship = starship;
    $scope.isLoading = false;

    $scope.loadMore = function () {
        if (!$scope.isLoading && nextPage != null){
          $scope.isLoading = true;
          $scope.starship.list.concat($scope.starship.getPage(++starshipPage, function(){
              $scope.isLoading = false;
          }));
        }
    }
});
