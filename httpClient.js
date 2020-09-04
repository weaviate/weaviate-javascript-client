const fetch = require('isomorphic-fetch');

const client = config => {
  const url = makeUrl(config.baseUri);

  return {
    post: (path, payload) => {
      return fetch(url(path), {
        method: 'POST',
        headers: {
          ...config.headers,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(true));
    },
    delete: path => {
      return fetch(url(path), {
        method: 'DELETE',
        headers: {
          ...config.headers,
          'content-type': 'application/json',
        },
      }).then(makeCheckStatus(false));
    },
    get: path => {
      return fetch(url(path), {
        method: 'GET',
        headers: {
          ...config.headers,
        },
      }).then(makeCheckStatus(true));
    },
  };
};

const makeUrl = basePath => path => basePath + path;

const makeCheckStatus = expectResponseBody => res => {
  if (res.status >= 400 && res.status < 500) {
    return res.json().then(err => {
      Promise.reject(`usage error (${res.status}): ${JSON.stringify(err)}`);
    });
  }

  if (res.status >= 500) {
    return res.json().then(err => {
      Promise.reject(`usage error (${res.status}): ${JSON.stringify(err)}`);
    });
  }

  if (expectResponseBody) {
    return res.json();
  }
};

module.exports = client;
