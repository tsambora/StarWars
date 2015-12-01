var app = angular.module('app', ['ui.router', 'ngMaterialize', 'infinite-scroll']);

var appName = 'Starships of Star Wars';

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
      starships: function(starship) {
        return starship.getPage(1);
      }
    }
  });

  $stateProvider.state('app.feed.detail', {
    url: 'detail/:id',
    onEnter: function($state, $modal) {
      var p = $modal.open({
        templateUrl: '/views/detail.html',
        controller: 'StarshipModalController',
        fixedFooter: true
      }).finally(function() {
        $state.go('^');
      });
    },
    resolve: {
      starship: function($stateParams, starship) {
        starship.detail = starship.get($stateParams.id);
      }
    }
  });

  $stateProvider.state('app.moredetail', {
    url: '/moredetail/:url',
    templateUrl: '/views/moredetail.html',
    controller: 'StarshipDetailController',
    onEnter: function(page) {
      page.title = 'Starship | ' + appName;
    },
    resolve: {
      starships: function($stateParams, starship) {
        // Workaround caused by no id in API data
        //
        return starship.getStarship(decodeURIComponent($stateParams.url));
      },
      starshipSimilar: function($stateParams, starship){
        return starship.getPage(1);
      }
    }
  });

  $stateProvider.state('app.error', {
    url: '/error',
    templateUrl: '/views/error.html',
    onEnter: function(page) {
      page.title = 'Not found | ' + appName;
    }
  });

  $urlRouterProvider.otherwise('/error');
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

  o.getPage = function(page, callback) {
    return $http.get('http://swapi.co/api/starships/?page=' + page).success(function(data) {
      data.results.forEach(function(item) {
        o.list.push(item);
      });
      if (callback) callback(data.results, data.next);
    });
  };

  o.get = function(id) {
    var result = o.list[id];
    return result;
  };

  o.getStarship = function(url){
    return $http.get(url).success(function(data) {
      o.detail = data;
    });
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
    var starshipPage = 2;
    var nextPage = "";
    $scope.starship = starship;
    $scope.isLoading = false;

    $scope.loadMore = function () {
        if (!$scope.isLoading && nextPage != null){
          $scope.isLoading = true;
          $scope.starship.list.concat($scope.starship.getPage(starshipPage++, function(next){
              nextPage = next;
              $scope.isLoading = false;
          }));
        }
    }
});

app.controller('StarshipModalController', function($scope, $stateParams, $modalInstance, starship){
    $scope.starship = starship;
    $scope.id = $stateParams.id;

    $scope.close = function() {
      $modalInstance.close();
    };
});

app.controller('StarshipDetailController', function($scope, $stateParams, starship, starshipSimilar){
    $scope.id = $stateParams.id;
    $scope.starship = starship;
    $scope.starship.similar = [];

    starshipSimilar.data.results.forEach(function(item) {
      if(item.name != $scope.starship.detail.name
        && item.length < ($scope.starship.detail.length + 10)
        && item.length > ($scope.starship.detail.length - 10)){
          $scope.starship.similar.push(item);
      }
    });

    $scope.nextPage = "";
    var starshipPage = 2;
    $scope.isLoading = false;

    $scope.loadMoreSimilar = function() {
        if (!$scope.isLoading && $scope.nextPage != null){
          $scope.isLoading = true;
          $scope.starship.getPage(starshipPage++, function(results, next){
              results.forEach(function(item) {
                if(item.name != $scope.starship.detail.name
                  && item.length < ($scope.starship.detail.length + 10)
                  && item.length > ($scope.starship.detail.length - 10)){
                    $scope.starship.similar.push(item);
                }
              });
              $scope.nextPage = next;
              $scope.isLoading = false;
          });
        }
    }
});
