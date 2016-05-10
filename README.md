# Ftv::Components::TouchEvents

This project is part of [francetv zoom open source projects](https://github.com/francetv/zoom-public) (iOS, Android and Angular).

Directive to handle touch events and add an active class to html element.

## Get sources

```
git clone git@github.com:francetv/ftv-angular-touchevents.git
```

## Required dependencies

- [npm](https://nodejs.org/)
- [gem](https://rubygems.org/)

## How to use

Include javascript

```
<script src="dist/component.js"></script>
```

Add module into your app

```
angular.module('daddemoApp', ['ftv.components.touchEvents']);
```

Use it in template via attributes

```
<div ng-touch-start="touchStart()" ng-touch-finish="touchFinish()" ng-active-on-click="2000"></div>
```

* ng-touch-start: trigger callback on touchstart event from browser
* ng-touch-finish: trigger callback on touchend touchcancel event from browser
* ng-active-on-click: how many time the "active" class will be visible (in ms). if "pending", it will wait until network has completed request

## Build process

```
sudo apt-get install ruby ruby-dev gem
npm install -g gulp bower

npm install
bower install
sudo gem install compass

gulp build
```

# Development build for front web only

```
gulp build-dev-watch
```

## Tests

```
gulp karma-test
```

## Demo

```
gulp build
npm install -g http-server
http-server
```

Open [demo](http://127.0.0.1:8080/demo.html)
