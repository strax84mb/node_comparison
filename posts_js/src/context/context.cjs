/**
 * Holder of all instanced beans.
 */
class Context {
    /**
     * All instanced beans are stored here
     */
    registry = {};

    /**
     * Check if bean exists and if not create it.
     * @param {Type} type 
     * @param {string} id 
     * @returns Instance of requested type
     */
    getBean(type, id) {
        let bean = this.registry[id];
        if (!bean) {
            bean = new type(this);
            bean.__init();
            this.registry[id] = bean;
        }
        return bean;
    }

    /**
     * Check if bean exists and if not create it.<br/>
     * Use this if initialization uses async functions.
     * @param {Type} type 
     * @param {string} id 
     * @returns Instance of requested type
     */
    async getBeanAsync(type, id) {
        let bean = this.registry[id];
        if (!bean) {
            bean = new type(this);
            await bean.__initAsync();
            this.registry[id] = bean;
        }
        return bean;
    }
}

exports.Context = Context;