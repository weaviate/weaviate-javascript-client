export default class RawGraphQL {
    client: any;
    errors: any;
    query: any;

    constructor(client: any, quer: any) {
        this.client = client;
        this.errors = [];
    }

    withQuery = (query: any) => {
        this.query = query;
        return this;
    };


    validateIsSet = (prop: any, name: any, setter: any) => {
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
            ".raw().withQuery(query)"
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