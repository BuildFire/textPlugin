(function (angular) {
    angular
        .module('textDirectives', [])
        .directive('owlCarousel', [
            owlCarouselDirective
        ]);

    function owlCarouselDirective() {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {


                var $element = $(element),
                    owlCarousel = null,
                    propertyName = attributes.owlCarousel;
                function init(newItems) {
                    var options = {
                        items: 1,
                        lazyLoad: true,
                        navigation: false
                    }
                    if (owlCarousel) {
                        owlCarousel.destroy();
                    }
                    var itemCount = Number(newItems)
                    if (itemCount > 1) {
                        options['loop'] = true;
                    }
                    setTimeout(function () {
                        $element.owlCarousel(options);
                        owlCarousel = $element.data('owlCarousel');
                    }, 500)
                }
                scope.$watch(propertyName, function (newItems, oldItems) {
                    init(newItems);
                });
            }
        };
    }
})(window.angular, undefined);
