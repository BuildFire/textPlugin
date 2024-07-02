// eslint-disable-next-line no-unused-vars
class Setting {
    /**
     * Create a setting model.
     * @param {object} data - model value
     */
    constructor(data = {}) {
        this.searchEngineIndexing = data.searchEngineIndexing || false;
    }
    /**
     * Convert the model to plain JSON
     * @return {Setting} A Setting object.
     */
    toJSON() {
        return {
            searchEngineIndexing: this.searchEngineIndexing,
        };
    }
}
