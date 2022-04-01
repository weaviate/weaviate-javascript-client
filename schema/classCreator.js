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

  withStopwordConfig = (config) => {
    if (this.class == null) {
      throw new Error("cannot assign stopword config to null class")
    }

    if (this.class.invertedIndexConfig == null) {
      this.class.invertedIndexConfig = {}
    }

    this.class.invertedIndexConfig.stopwords = config
    return this
  }

  validateStopwordConfig = () => {
    if (
      this.class.invertedIndexConfig != null &&
      this.class.invertedIndexConfig.stopwords != null &&
      typeof this.class.invertedIndexConfig.stopwords !== "object"
    ) {
      this.errors = [
        ...this.errors,
        "stopword config must be an object"
      ];
    }
  };

  validateInvertedIndexConfig = () => {
    this.validateBM25Config();
    this.validateStopwordConfig();
  }

  validate = () => {
    this.validateClass();
    this.validateInvertedIndexConfig();
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
