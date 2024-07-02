const instanceId = buildfire.getContext().instanceId;

class SearchEngineService {
    /**
     * Get database collection tag
     * @returns {string}
     */
    static get TAG() {
        return 'wysiwygContent';
    }

    /**
     * Get database collection key
     * @returns {string}
     */

    static get KEY() {
        return `wysiwyg_${instanceId}`;
    }

    /**
     * save search engine data
     * @returns {Promise}
     */
    static save(title , description) {
        return new Promise((resolve, reject) => {
            buildfire.services.searchEngine.save({
                tag: SearchEngineService.TAG, key: SearchEngineService.KEY, title, description
            }, (err, result) => {
                if (err) return console.error(err);
            },);
        });
    }
    /**
     * delete search engine data
     * @param {Object} data
     * @returns {Promise}
     */
    static delete() {
        return new Promise((resolve, reject) => {
            buildfire.services.searchEngine.delete({
                  tag: SearchEngineService.TAG, key: SearchEngineService.KEY
              },
              (err, result) => {
                  if (err) return console.error(err);
              }
            );
        });
    }
}
