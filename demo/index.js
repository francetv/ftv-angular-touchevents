angular.module('demoApp', ['ftv.components.touchEvents']);
angular.module('demoApp').controller('DemoController', ['$scope', '$http', function($scope, $http) {
    $scope.responseReceived = false;
    $scope.state = "nothing";

    $scope.touchStart = function() {
        console.log('Touch start');
        $scope.state = "start";
    }

    $scope.touchFinish= function() {
        console.log('Touch finished');
        $scope.state = "finished";
    }

    $scope.getGoogle = function() {
        $scope.responseReceived = false;
        $http({method:'GET', url:'https://www.google.fr'}).then(function(){
            $scope.responseReceived = true;
            console.log('Response received');
        }, function(){
            $scope.responseReceived = true;
            console.log('Response received');
        });
    }
}]);
