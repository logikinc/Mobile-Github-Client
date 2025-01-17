angular.module('intro', [])

.controller('introCtrl', function($scope, $rootScope, $state, $ionicNavBarDelegate, store) {

  if ($rootScope.access_token) {
    $state.go('search')
  }

  $ionicNavBarDelegate.setTitle('Welcome!');

  if (store.get('access_token')) {
    $scope.name = store.get('name');

    $scope.previousUser = function() {
      mixpanel.track('Returning User');
      $rootScope.access_token = store.get('access_token');
      $rootScope.authname = store.get('name');
      $rootScope.authlogin = store.get('login');
      $scope.authenticated = true;
      $scope.authlogin = true;
      $state.go('search')
    }
  } else {
    console.log('no access')
  }

  $scope.authme = function() {
    mixpanel.track('New Authorization');
    OAuth.popup('github')
      .done(function(result) {
        $rootScope.access_token = result.access_token;
        store.set('access_token', result.access_token);
        result.me().done(function(user_info) {
          if (user_info.name) {
            $rootScope.authname = user_info.name;
            $rootScope.authlogin = user_info.alias;

            store.set('name', $rootScope.authname);
            store.set('login', $rootScope.authlogin);

            $state.go('search');

          } else {

            store.set('name', user_info.alias);
            store.set('login', user_info.alias);

            $rootScope.authname = user_info.alias;
            $rootScope.authlogin = user_info.alias;

          }
        }).fail(function(error) {
          // alert(error)
        })
      }).fail(function(error) {
        // alert(error)
      })
  }
})