import Connection from "../connection";

export default class ExtensionCreator {
  private client: Connection;
  private errors: any[];
  private concept: any;
  private definition: any;
  private weight: any;
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
  }

  withConcept = (concept: any) => {
    this.concept = concept;
    return this;
  };

  withDefinition = (definition: any) => {
    this.definition = definition;
    return this;
  };

  withWeight = (weight: any) => {
    this.weight = weight;
    return this;
  };

  validateIsSet = (prop: string | any[] | null | undefined, name: string, setter: string) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validate = () => {
    this.validateIsSet(this.concept, "concept", "withConcept(concept)");
    this.validateIsSet(
      this.definition,
      "definition",
      "withDefinition(definition)"
    );
    this.validateIsSet(this.weight, "weight", "withWeight(weight)");
  };

  payload = () => ({
    concept: this.concept,
    definition: this.definition,
    weight: this.weight,
  });

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    const path = `/modules/text2vec-contextionary/extensions`;
    return this.client.post(path, this.payload());
  };
}
