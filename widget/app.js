'use strict';

(function (angular) {
    //created mediaCenterWidget module
    angular
        .module('textWidget', [
            'textEnums',
            'textServices',
            'textDirectives',
            'ngAnimate',
            'ngRoute'])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        //injected ui.sortable for manual ordering of list
        //ngClipboard to provide copytoclipboard feature
        .config(['$routeProvider', function ($routeProvider) {

            /**
             * Disable the pull down refresh
             */
                //buildfire.datastore.disableRefresh();

            $routeProvider
                .when('/', {
                    templateUrl: 'templates/layout1.html',
                    controllerAs: 'WidgetHome',
                    controller: 'WidgetHomeCtrl'
                })
                .otherwise('/');
        }])
        .run(function ($rootScope, $location, EVENTS) {
            //route handler
        })
        .filter('getImageUrl', function () {
            return function (url, width, height, type) {
                if (type == 'resize')
                    return buildfire.imageLib.resizeImage(url, {
                        width: width,
                        height: height
                    });
                else
                    return buildfire.imageLib.cropImage(url, {
                        width: width,
                        height: height
                    });
            }
        });
})(window.angular, undefined);
