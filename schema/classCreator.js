import { DEFAULT_KIND, validateKind } from "../kinds";

export default class ClassCreator {
  constructor(client) {
    this.client = client;
    this.errors = [];
  }

  withClass = (classObj) => {
    this.class = classObj;
    return this;
  };

  validateClass = () => {
    if (this.class == undefined || this.class == null) {
      this.errors = [
        ...this.errors,
        "class object must be set - set with .withClass(class)",
      ];
    }
  };

  withBM25Config = (config) => {
    if (this.class == null) {
      throw new Error("cannot assign BM25 config to null class")
    }

    if (this.class.invertedIndexConfig == null) {
      this.class.invertedIndexConfig = {}
    }

    this.class.invertedIndexConfig.bm25 = config
    return this
  }

  validateBM25Config = () => {
    if (
      this.class.invertedIndexConfig != null &&
      this.class.invertedIndexConfig.bm25 != null &&
      typeof this.class.invertedIndexConfig.bm25 !== "object"
    ) {
      this.errors = [
        ...this.errors,
        "BM25 config must be an object"
      ];
    }
  };

  validate = () => {
    this.validateClass();
    this.validateBM25Config();
  };

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/schema`;
    return this.client.post(path, this.class);
  };
}
