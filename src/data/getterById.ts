export default class GetterById {
  additionals: any;
  className: any;
  client: any;
  consistencyLevel: any;
  errors: any;
  id: any;
  nodeName: any;
  objectsPath: any;
  constructor(client: any, objectsPath: any) {
    this.client = client;
    this.objectsPath = objectsPath;
    this.errors = [];
    this.additionals = [];
  }

  withId = (id: any) => {
    this.id = id;
    return this;
  };

  withClassName = (className: any) => {
    this.className = className;
    return this;
  };

  extendAdditionals = (prop: any) => {
    this.additionals = [...this.additionals, prop];
    return this;
  };

  withAdditional = (additionalFlag: any) => this.extendAdditionals(additionalFlag);

  withVector = () => this.extendAdditionals("vector");

  withConsistencyLevel = (cl: any) => {
    this.consistencyLevel = cl;
    return this;
  };

  withNodeName = (nodeName: any) => {
    this.nodeName = nodeName;
    return this;
  };

  validateId = () => {
    if (this.id == undefined || this.id == null || this.id.length == 0) {
      this.errors = [
        ...this.errors,
        "id must be set - initialize with getterById(id)",
      ];
    }
  };

  validate = () => {
    this.validateId();
  };

  buildPath = () => {
    return this.objectsPath.buildGetOne(this.id, this.className,
      this.additionals, this.consistencyLevel, this.nodeName)
  }

  do = () => {
    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    return this.buildPath()
      .then(this.client.get);
  };
}
