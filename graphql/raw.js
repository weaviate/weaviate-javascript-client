export default class RawGraphQL {
    
    constructor(client, query) {
        this.client = client;
        this.errors = [];
        this.query = query;
    }

    validateIsSet = (prop, name, setter) => {
        if (prop == undefined || prop == null || prop.length == 0) {
            this.errors = [
                ...this.errors,
                `${name} must be set - set with ${setter}`,
            ];
        }
    };

    validate = () => {
        this.validateIsSet(
            this.query,
            "query",
            ".raw(query)"
        );
    };

    do = () => {
        let params = "";

        this.validate();
        if (this.errors.length > 0) {
            return Promise.reject(
                new Error("invalid usage: " + this.errors.join(", "))
            );
        }

        if (this.query) {
            return this.client.query(this.query);
        };
    }
}
