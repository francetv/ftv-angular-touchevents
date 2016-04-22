angular.module('ftv.services.httpRequestTracker', []).service('httpRequestTracker', ['$http', function ($http) {
    this.hasPendingRequests = function () {
        return $http.pendingRequests.length > 0;
    };
}]);

angular.module("ftv.components.touchEvents", ['ftv.services.httpRequestTracker'])
    .directive("ngTouchStart", function () {
        return {
            link: function ($scope, $element) {
                $element.bind('touchstart', onTouchStart);

                function onTouchStart() {
                    var method = $element.attr('ng-touch-start');
                    $scope.$apply(method);
                }
            }
        };
    })
    .directive("ngTouchFinish", function () {
        return {
            link: function ($scope, $element) {
                $element.bind('touchend touchcancel', onTouchFinish);

                function onTouchFinish() {
                    var method = $element.attr('ng-touch-finish');
                    $scope.$apply(method);
                }
            }
        };
    })
    .directive('ngActiveOnClick', ['$timeout', 'httpRequestTracker', function ($timeout, httpRequestTracker) {
    return {
        link: function ($scope, $element, attr) {
            var dragging = false;

            $element.bind('touchmove', onTouchMove);
            $element.bind('touchend touchcancel', onTouchEnd);
            $element.bind('mouseup', onTouchEnd);

            function onTouchMove () {
                dragging = true;
            }

            function onTouchEnd () {
                if (dragging) {
                    dragging = false;
                    return;
                }
                dragging = false;

                $element.addClass('active');

                var clickTarget = $element.find('a');
                if(clickTarget) {
                    clickTarget.trigger('click');
                }

                var duration = attr.ngActiveOnClick;
                if (!duration) {
                    return;
                }

                if (duration === 'pending') {
                    return pendingActive();
                }

                if (isNaN(parseInt(duration))) {
                    return;
                }

                $timeout(function(){
                    $element.removeClass('active');
                }, duration);
            }

            function pendingActive() {
                $timeout(function(){
                    if (httpRequestTracker.hasPendingRequests()) {
                        return pendingActive();
                    }

                    $element.removeClass('active');
                }, '500');
            }
        }
    };
}]);
