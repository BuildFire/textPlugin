// eslint-disable-next-line no-unused-vars
class Settings {
    /**
     * Get database collection tag
     * @returns {string}
     */
    static get TAG() {
        return "settings";
    }

    /**
     * get settings data
     * @returns {Promise}
     */
    static get() {
        return new Promise((resolve, reject) => {
            buildfire.datastore.get(Settings.TAG, (err, res) => {
                if (err) return reject(err);
                if (!res || !res.data || !Object.keys(res.data).length) {
                    const data = new Setting().toJSON();
                    resolve(data);
                } else {
                    const data = new Setting(res.data).toJSON();
                    resolve(data);
                }
            });
        });
    }

    /**
     * set settings data
     * @param {Object} data
     * @returns {Promise}
     */
    static save(data) {
        return new Promise((resolve, reject) => {
            buildfire.datastore.save(data, Settings.TAG, (err, res) => {
                if (err) return reject(err);
                return resolve(new Setting(res.data).toJSON());
            });
        });
    }
}
