let textPluginApp = angular.module('textPlugin', ['ui.tinymce']);

textPluginApp.controller('textPluginCtrl', ['$scope', function ($scope) {
    var datastoreInitialized = false;

    $scope.searchEngineIndexing = false;

    $scope.editorOptions = {
        plugins: 'advlist autolink link image lists charmap print preview',
        skin: 'lightgray',
        trusted: true,
        theme: 'modern',
        format: 'html',
        convert_urls: false,
        relative_urls: false

    };

    $scope.data = {
        content: {
            carouselImages: [], text: "<p>&nbsp;<br></p>"
        }, design: {
            backgroundImage: null, backgroundBlur: 0, selectedLayout: 1
        }
    };

    // create a new instance of the buildfire carousel editor
    var editor = new buildfire.components.carousel.editor("#carousel");

    /*
     * Go pull any previously saved data
     * */
    buildfire.datastore.get(function (err, result) {

        if (!err) {
            datastoreInitialized = true;
        } else {
            console.error("Error: ", err);
            return;
        }

        if (result && result.data && !angular.equals({}, result.data) && result.id) {
            if (!result.data.design) result.data.design = $scope.data.design;
            $scope.data = result.data;
            $scope.id = result.id;
            if ($scope.data.content && $scope.data.content.carouselImages) editor.loadItems($scope.data.content.carouselImages);
            if (tmrDelay) clearTimeout(tmrDelay);
        } else {
            $scope.data = {
                content: {
                    text: '<p>The WYSIWYG (which stands for What You See Is What You Get) allows you to do some really cool stuff. You can add images like this</p>\
                    <p><img src="https://static.pexels.com/photos/12057/pexels-photo-12057-large.jpeg" alt="" width="100%" height="auto" /></p>\
                    <p>You can even create links like these:<br /> Link to web content like <a href="http://www.google.com">this</a><br /> Link to a phone number like this <a href="tel: 8005551234">8005551234</a><br /> Link to an email like this <a href="mailto:noreply@google.com">noreply@google.com</a></p>\
                    <p>Want to add some super cool videos about this item? You can do that too!</p>\
                    <p><iframe src="https://www.youtube.com/embed/wTcNtgA6gHs" width="100%" height="auto" frameborder="0" allowfullscreen="allowfullscreen"></iframe></p>\
                    <p>You can create bulleted and numbered lists like this:</p>\
                    <ul>\
                    <li>This is an item in a list</li>\
                    <li>This is another item in a list</li>\
                    <li>This is a last item in a list</li>\
                    </ul>\
                    <p>Want more info? Check out our tutorial by clicking the help button at the top of this page.</p>',

                    carouselImages: [{
                        "action": "noAction",
                        "iconUrl": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/5db61d30-0854-11e6-8963-f5d737bc276b.jpg",
                        "title": "image 1"
                    }, {
                        "action": "noAction",
                        "iconUrl": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/31c88a00-0854-11e6-8963-f5d737bc276b.jpeg",
                        "title": "image 2"
                    }]
                }, design: {
                    backgroundImage: null, backgroundBlur: 0, selectedLayout: 1
                }
            };
            editor.loadItems($scope.data.content.carouselImages);
        }

        /*
         * watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch('data', saveDataWithDelay, true);

        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
        }
    });

    AuthManager.refreshCurrentUser().then(function () {
        Settings.get().then((data) => $scope.searchEngineIndexing = data.searchEngineIndexing);
    });

    /*
     * Call the datastore to save the data object
     */
    var saveData = function (newObj, callBack) {
        if (!datastoreInitialized) {
            console.error("Error with datastore didn't get called");
            return;
        }
        if (newObj.content.text.indexOf("src=\"//") != -1) {
            newObj.content.text = newObj.content.text.replace("src=\"//", "src=\"https://")
        }
        if (newObj == undefined) return;

        if ($scope.frmMain.$invalid) {
            console.warn('invalid data, details will not be saved');
            return;
        }

        if (!newObj.content || !newObj.design) return;

        buildfire.datastore.save(newObj, function (err, result) {
            if (err || !result) {
                console.error('Error saving the widget details: ', err);
            }
            callBack();
        });
    };
    var saveSearchEngine = function (content) {
        if (!$scope.searchEngineIndexing) return;
        buildfire.dynamic.expressions.evaluate({expression: content}, (err, result) => {
            if (err) return console.error(err);
            const content = prepareSearchEngineContent(result.evaluatedExpression);
            if (!content.title || !content.description) {
                SearchEngineService.delete().catch(()=>{
                    buildfire.dialog.toast({
                        message: 'Error indexing data.',
                        type:'danger'
                    });
                });
                return;
            }
            SearchEngineService.save(content.title, content.description).catch(()=>{
                buildfire.dialog.toast({
                    message: 'Error indexing data.',
                    type:'danger'
                });
            });
        })
    };
    /*
     * create an artificial delay so api isnt called on every character entered
     * */
    var tmrDelay = null;

    var saveDataWithDelay = function (newObj, oldObj) {
        if (tmrDelay) clearTimeout(tmrDelay);
        if (angular.equals(newObj, oldObj)) return;
        tmrDelay = setTimeout(function () {
            saveData(newObj, function () {saveSearchEngine(newObj.content.text)});
        }, 500);
    };

    // this method will be called when a new item added to the list
    editor.onAddItems = editor.onDeleteItem = editor.onItemChange = editor.onOrderChange = function () {
        $scope.data.content.carouselImages = editor.items;
        saveData($scope.data);
    };
}]);
