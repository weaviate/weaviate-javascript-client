export default class OpenidConfigurationGetterGetter {
  client: any;
  constructor(client: any) {
    this.client = client;
  }

  do = () => {
    return this.client
      .getRaw("/.well-known/openid-configuration")
      .then((res: any) => {
        if (res.status < 400) {
          return res.json();
        }

        if (res.status == 404) {
          // OIDC is not configured
          return Promise.resolve(undefined);
        }

        return Promise.reject(
          new Error(`unexpected status code: ${res.status}`)
        );
      });
  };
}
