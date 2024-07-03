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
                    const currentUser = AuthManager.currentUser;
                    const data = new Setting().toJSON();
                    data.createdBy = currentUser?._id ? currentUser._id : "";
                    Settings.save(data).then(()=>{
                        ControlState.settings = data;
                        resolve(data);
                    })
                } else {
                    const data = new Setting(res.data).toJSON();
                    ControlState.settings = data;
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
            const currentUser = AuthManager.currentUser;
            data.lastUpdatedBy = currentUser?._id ? currentUser._id : "";
            data.createdBy = data.createdBy || ControlState.settings?.createdBy;
            data.createdOn = ControlState.settings?.createdOn || new Date();
            buildfire.datastore.save(new Setting(data).toJSON(), Settings.TAG, (err, res) => {
                if (err) return reject(err);
                return resolve(new Setting(res.data).toJSON());
            });
        });
    }
}
