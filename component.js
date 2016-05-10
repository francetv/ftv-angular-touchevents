/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 France Télévisions
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
