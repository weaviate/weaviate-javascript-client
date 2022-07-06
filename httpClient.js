const fetch = require("isomorphic-fetch");

const client = (config) => {
  const url = makeUrl(config.baseUri);

  return {
    post: (path, payload, expectReturnContent = true) => {
      return fetch(url(path), {
        method: "POST",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(expectReturnContent));
    },
    put: (path, payload, expectReturnContent = true) => {
      return fetch(url(path), {
        method: "PUT",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(expectReturnContent));
    },
    patch: (path, payload) => {
      return fetch(url(path), {
        method: "PATCH",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(false));
    },
    delete: (path, payload, expectReturnContent = false) => {
      return fetch(url(path), {
        method: "DELETE",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }).then(makeCheckStatus(expectReturnContent));
    },
    head: (path, payload) => {
      return fetch(url(path), {
        method: "HEAD",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }).then(handleHeadResponse(false, true));
    },
    get: (path, expectReturnContent = true) => {
      return fetch(url(path), {
        method: "GET",
        headers: {
          ...config.headers,
        },
      }).then(makeCheckStatus(expectReturnContent));
    },
    getRaw: (path) => {
      // getRaw does not handle the status leaving this to the caller
      return fetch(url(path), {
        method: "GET",
        headers: {
          ...config.headers,
        },
      });
    },
  };
};

const makeUrl = (basePath) => (path) => basePath + path;

const makeCheckStatus = (expectResponseBody) => (res) => {
  if (res.status >= 400) {
    return res.text().then(errText => {
      var err;
      try {
        // in case of invalid json response (like empty string)
        err = JSON.stringify(JSON.parse(errText))
      } catch(e) {
        err = errText
      }
      return Promise.reject(
        `usage error (${res.status}): ${err}`
      );
    });
  }

  if (expectResponseBody) {
    return res.json();
  }
};

const handleHeadResponse = (expectResponseBody) => (res) => {
  if (res.status == 204 || res.status == 404) {
    return res.status == 204
  }
  return makeCheckStatus(expectResponseBody)
}

module.exports = client;
