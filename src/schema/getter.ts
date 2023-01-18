export default class Getter {
  client: any;
  errors: any;
  constructor(client: any) {
    this.client = client;
    this.errors = [];
  }

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }
    const path = `/schema`;
    return this.client.get(path);
  };
}
