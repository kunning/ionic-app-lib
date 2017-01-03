angular.module('app', [])

.run(['$rootScope', '$http', function($rootScope, $http) {
}])

.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.loading = false;
  $scope.loadingMessage = 'Loading...';

  $scope.env = {
    cwd: ''
  };
  $http.get('/api/env').then(function(res) {
    $scope.env = res.data;
  });

  $scope.startLoading = function(loadingMessage) {
    $scope.loading = true;
    $scope.loadingMessage = loadingMessage;
  };
  $scope.endLoading = function() {
    $scope.loading = false;
  };
}])

.controller('Step1Ctrl', ['$scope', '$http', function($scope, $http) {
  $scope.app = {
    name: 'My App',
    directory: 'myApp',
    path: '',
    id: generateId(),
    template: 'super'
  };

  $scope.userModifiedDirectory = false;

  function generateId() {
    var packageName = '' + Math.round((Math.random() * 899999) + 100000);
    packageName = 'com.ionicframework.app' + packageName.replace(/\./g, '');
    return packageName;
  }

  function generateDirectory(name) {
    return name.trim()
      .toLowerCase()
      .replace(/([^A-Z0-9]+)(.)/ig,
      function(match) {
        return arguments[2].toUpperCase();  //3rd index is the character we need to transform uppercase
      });
  }

  $scope.$watch('app.name', function(nv, ov) {
    console.log('App name', nv);
    if(!$scope.userModifiedDirectory) {
      $scope.app.directory = generateDirectory(nv);
    }
  })

  $scope.onSubmit = function() {
    $scope.startLoading('Creating app...');
    $http.post('/api/cli', {
      command: 'start',
      app: $scope.app
    }).then(function(resp) {
      $scope.endLoading();
      console.log(resp);
    }, function(err) {
      $scope.endLoading();
      console.error('Unable to execute command', err);
    });
  }

  var aid = document.querySelector('#app-directory');
  aid.addEventListener('input', function(e) {
    $scope.$apply(function() {
      $scope.userModifiedDirectory = true;
    });
  })
}]);
