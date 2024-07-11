// eslint-disable-next-line no-unused-vars
class Content {

    /**
     * get content data
     * @returns {Promise}
     */
    static get() {
        return new Promise((resolve, reject) => {
            buildfire.datastore.get( (err, res) => {
                if (err) return reject(err);
                    resolve(res);
            });
        });
    }
}
