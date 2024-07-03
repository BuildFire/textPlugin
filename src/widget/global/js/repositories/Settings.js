// eslint-disable-next-line no-unused-vars
class Settings {

static _settings = {}
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
                    buildfire.auth.getCurrentUser((err, user) => {
                        if (err) return reject();
                        data.createdBy = user._id ? user._id : "";
                        Settings.save(data).then(()=>{
                            this._settings = data;
                            resolve(data);
                        })
                    });
                } else {
                    const data = new Setting(res.data).toJSON();
                    this._settings = data;
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
            buildfire.auth.getCurrentUser((err, user) => {
                if (err) return reject();
                data.lastUpdatedBy = user._id? user._id : "";
                data.createdBy = data.createdBy || this._settings.createdBy;
                data.createdOn = this._settings.createdOn || new Date();
                buildfire.datastore.save(new Setting(data).toJSON(), Settings.TAG, (err, res) => {
                    if (err) return reject(err);
                    return resolve(new Setting(res.data).toJSON());
                });
            });
        });
    }
}
