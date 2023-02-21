import Connection from "../connection";

export default class ConceptsGetter {
  private client: Connection;
  private errors: any[];
  private concept: any;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  validateIsSet = (prop: string | any[] | null | undefined, name: string, setter: string) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  withConcept = (concept: any) => {
    this.concept = concept;
    return this;
  };

  validate = () => {
    this.validateIsSet(this.concept, "concept", "withConcept(concept)");
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    const path = `/modules/text2vec-contextionary/concepts/${this.concept}`;
    return this.client.get(path);
  };
}
