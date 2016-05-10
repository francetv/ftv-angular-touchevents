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

describe('FTV::ngTouchevents::Component', function () {
    var element, $scope, directiveScope, hasPendingRequests;

    beforeEach(module('ftv.components.touchEvents', function($provide){
        $provide.value("httpRequestTracker", {
            hasPendingRequests: function () {
                return hasPendingRequests;
            }
        });
    }));

    beforeEach(function(){
        hasPendingRequests = false;
    });

    describe('ngActiveOnClick', function () {
        var $element;
        function ngActiveOnClickTest(eventsToTrigger, isActive) {
            $scope.$digest();

            directiveScope = element.isolateScope();

            $element = $(element[0]);

            for (var i = 0; i < eventsToTrigger.length; i++) {
                element.trigger(eventsToTrigger[i]);
            }

            expect($element.hasClass('active')).toEqual(isActive);
        }
        function ngActiveOnClickTestTouch(isActive){
            return ngActiveOnClickTest(['mousedown', 'mouseup'], isActive);
        }
        function ngActiveOnClickTestDrag(isActive){
            return ngActiveOnClickTest(['mousedown', 'touchmove', 'mouseup'], isActive);
        }
        describe('no duration set', function () {
            beforeEach(inject(function ($compile, $rootScope) {
                $scope = $rootScope;

                element = $compile('<div ng-active-on-click></div>')($scope);

                directiveScope = element.isolateScope();
            }));

            it('when touchmove has been detected we dont set active class', function () {
                ngActiveOnClickTestDrag(false);
            });
            it('set active class otherwise', function () {
                ngActiveOnClickTestTouch(true);
            });
        });
        describe('duration set', function () {
            beforeEach(inject(function ($compile, $rootScope) {
                $scope = $rootScope;

                element = $compile('<div ng-active-on-click="200"></div>')($scope);

                directiveScope = element.isolateScope();
            }));
            it('remove class active after duration if set', inject(function ($timeout) {
                ngActiveOnClickTestTouch(true);

                $timeout.flush();

                expect($element.hasClass('active')).toEqual(false);
            }));
        });
        describe('duration set with variable', function () {
            beforeEach(inject(function ($compile, $rootScope) {
                $scope = $rootScope;

                element = $compile('<div ng-active-on-click="{{duration}}"></div>')($scope);

                directiveScope = element.isolateScope();
            }));
            it('remove class active after duration if set', inject(function ($timeout) {
                $scope.duration = 200;

                ngActiveOnClickTestTouch(true);

                $timeout.flush();

                expect($element.hasClass('active')).toEqual(false);
            }));
        });
        describe('propagation of click event', function () {
            beforeEach(inject(function ($compile, $rootScope) {

                $scope = $rootScope;

                element = $compile('<div ng-active-on-click="10"><a href="#" ></a></div>')($scope);

                directiveScope = element.isolateScope();
            }));
            it('should trigger the event for the "a" children', inject(function ($timeout) {

                var clicked = false;

                element.find('a').bind('click', function () {
                   clicked = true;
                });

                ngActiveOnClickTestTouch(true);

                $timeout.flush();

                expect(clicked).toBeTruthy();
            }));
        });
        describe('duration set with "pending" should wait until $http.pendingRequests is empty', function () {
            beforeEach(inject(function ($compile, $rootScope) {
                $scope = $rootScope;

                element = $compile('<div ng-active-on-click="{{duration}}"></div>')($scope);

                directiveScope = element.isolateScope();

                hasPendingRequests = true;
            }));
            it('remove class active when no pending request left', inject(function ($timeout) {
                $scope.duration = 'pending';

                ngActiveOnClickTestTouch(true);

                $timeout.flush();

                expect($element.hasClass('active')).toEqual(true);

                hasPendingRequests = false;

                $timeout.flush();

                expect($element.hasClass('active')).toEqual(false);
            }));
        });
    });
});
