export abstract class Bean {
    protected __ctx: Context;

    constructor(ctx: Context) {
        this.__ctx = ctx
    }

    // implementation should still be 
    // async __init() { ... }
    abstract __init();
}

export class Context {
    registry: Map<string, Bean>;

    constructor() {
        this.registry = new Map<string, Bean>();
    }

    async getBean(id: string, type: {new(ctx: Context)}): Promise<Bean> {
        let bean: Bean = this.registry.get(id);
        if (!bean) {
            bean = new type(this);
            await bean.__init();
            this.registry.set(id, bean);
        }
        return bean;
    }
}
