let textPluginApp = angular.module('textSetting', []);

textPluginApp.controller('textSettingCtrl', ['$scope', function ($scope) {
    $scope.searchEngineIndexing = false;

    $scope.handleCheckboxClick = function () {
        // initialSearchEngineIndexing to  Save settings only if the searchEngineIndexing value has changed
        let initialSearchEngineIndexing = $scope.searchEngineIndexing;
        $scope.searchEngineIndexing = !$scope.searchEngineIndexing;

        if (!$scope.searchEngineIndexing) {
            buildfire.dialog.confirm({
                title: "Disable Search Engine Indexing",
                message: "Are you sure you want to disable search engine indexing? All indexed data from this Text WYSIWYG will be removed, and the content will no longer be searchable.",
                confirmButton: {type: 'warning', text: 'Disable'},
            }, function (err, isConfirmed) {
                $scope.searchEngineIndexing = !isConfirmed;
                $scope.$apply();

                if ($scope.searchEngineIndexing !== initialSearchEngineIndexing) {
                    Settings.save({searchEngineIndexing: $scope.searchEngineIndexing});
                    Content.get().then(function (data) {
                        if (data && data.data && data.data.content && data.data.content.text)
                        $scope.handleSearchEngine(data.data.content.text);
                    });
                }
            });
        } else {
            if ($scope.searchEngineIndexing !== initialSearchEngineIndexing) {
                Settings.save({searchEngineIndexing: $scope.searchEngineIndexing});
                Content.get().then(function (data) {
                    if (data && data.data && data.data.content && data.data.content.text)
                    $scope.handleSearchEngine(data.data.content.text);
                });
            }
        }
    };

    $scope.handleSearchEngine = function (content) {
        buildfire.dynamic.expressions.evaluate({expression: content}, (err, result) => {
            if (err) return console.error(err);
            const content = prepareSearchEngineContent(result.evaluatedExpression);
            if (!content.title || !content.description) {
                return;
            }
            if (!$scope.searchEngineIndexing) {
                SearchEngineService.delete().catch(()=>{
                    buildfire.dialog.toast({
                        message: 'Error indexing data.',
                        type:'danger'
                    });
                });
            } else
                SearchEngineService.save(content.title, content.description).catch(()=>{
                    buildfire.dialog.toast({
                        message: 'Error indexing data.',
                        type:'danger'
                    });
                });
        })
    };

    AuthManager.refreshCurrentUser().then(function () {
        Settings.get().then(function (data) {
            $scope.searchEngineIndexing = data.searchEngineIndexing;
            $scope.$apply();
        });
    });
}
]);
