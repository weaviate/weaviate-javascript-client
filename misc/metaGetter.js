export default class MetaGetter {
  constructor(client) {
    this.client = client;
  }

  do = () => {
    return this.client.get("/meta", true);
  };

  fetchVersion = () => {
    return this.client.get("/meta", true)
      .then(res => {
        return res.version;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
}
