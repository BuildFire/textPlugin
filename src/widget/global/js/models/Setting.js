class Setting {
    /**
     * Create a setting model.
     * @param {object} data - model value
     */
    constructor(data = {}) {
        this.searchEngineIndexing = data.searchEngineIndexing || false;
        this.isActive = data.isActive || false;
        this.createdOn = data.createdOn || new Date();
        this.createdBy = data.createdBy || '';
        this.lastUpdatedOn = data.lastUpdatedOn || new Date();
        this.lastUpdatedBy = data.lastUpdatedBy || '';
    }
    /**
     * Convert the model to plain JSON
     * @return {Setting} A Setting object.
     */
    toJSON() {
        return {
            searchEngineIndexing: this.searchEngineIndexing,
            isActive: this.isActive,
            createdOn: this.createdOn,
            createdBy: this.createdBy,
            lastUpdatedOn: this.lastUpdatedOn,
            lastUpdatedBy: this.lastUpdatedBy
        };
    }
}
