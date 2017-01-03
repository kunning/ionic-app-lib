angular.module('app', [])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.app = {
    name: '',
    id: '',
    template: 'super'
  }

  $scope.onSubmit = function() {
    $http.post('/api/cli', {
      command: 'start',
      app: $scope.app
    }).then(function(resp) {
      console.log(resp);
    }, function(err) {
      console.error('Unable to execute command', err);
    });
  }
}]);
