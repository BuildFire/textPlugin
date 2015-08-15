(function (angular) {
    angular
        .module('textWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$window', 'DB', 'COLLECTIONS','$sce', function ($scope, $window, DB, COLLECTIONS, $sce) {
            var WidgetHome = this;
            WidgetHome.media = {};
            var Text = new DB(COLLECTIONS.Text)
            Text.get().then(BootStrap, showDummy)
            function BootStrap(media) {
                WidgetHome.media = media;
                if (!WidgetHome.media.content) {
                    WidgetHome.media.content = {
                        sortBy: "Newest"
                    }
                }
            }

            function showDummy() {
                console.log(WidgetHome.media)
                WidgetHome.media = {
                    content: {
                        images: [{
                            imageUrl: "http://www.placehold.it/1280x720.jpg",
                            title: "Dummy",
                            links: "http://www.placehold.it/1280x720.jpg",
                            target: "_blank" //possible values “_blank”
                        }, {
                            imageUrl: "http://www.placehold.it/1280x720.jpg",
                            title: "Dummy",
                            links: "http://www.placehold.it/1280x720.jpg",
                            target: "_blank" //possible values “_blank”
                        }
                        ],
                        descriptionHTML: '<h1>This is dummy data this will change</h1>',
                        description: ' This is dummy data this will change',
                        sortBy: 'Newest'
                    },
                    design: {
                        backgroundImage: ""
                    }

                }
            }
            WidgetHome.isDefined = function (item) {
                return item.imageUrl !== undefined && item.imageUrl !== '';
            };
            WidgetHome.safeHtml = function (html) {
                if (html)
                    return $sce.trustAsHtml(html);
            }
        }]);
})(window.angular, undefined);