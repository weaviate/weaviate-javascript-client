// @ts-expect-error TS(7016): Could not find a declaration file for module 'isom... Remove this comment to see the full error message
import fetch from 'isomorphic-fetch'

export const httpClient = (config: any) => {
  const baseUri = `${config.scheme}://${config.host}/v1`
  const url = makeUrl(baseUri);

  return {
    post: (path: any, payload: any, expectReturnContent = true, bearerToken = "") => {
      var request = {
        method: "POST",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      addAuthHeaderIfNeeded(request, bearerToken)
      return fetch(url(path), request).then(makeCheckStatus(expectReturnContent));
    },
    put: (path: any, payload: any, expectReturnContent = true,  bearerToken = "") => {
      var request = {
        method: "PUT",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      addAuthHeaderIfNeeded(request, bearerToken);
      return fetch(url(path), request).then(makeCheckStatus(expectReturnContent));
    },
    patch: (path: any, payload: any, bearerToken = "") => {
      var request = {
        method: "PATCH",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      };
      addAuthHeaderIfNeeded(request, bearerToken);
      return fetch(url(path), request).then(makeCheckStatus(false));
    },
    delete: (path: any, payload: any, expectReturnContent = false, bearerToken = "") => {
      var request = {
        method: "DELETE",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      };
      addAuthHeaderIfNeeded(request, bearerToken);
      return fetch(url(path), request).then(makeCheckStatus(expectReturnContent));
    },
    head: (path: any, payload: any, bearerToken = "") => {
      var request = {
        method: "HEAD",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      };
      addAuthHeaderIfNeeded(request, bearerToken);
      // @ts-expect-error TS(2554): Expected 1 arguments, but got 2.
      return fetch(url(path), request).then(handleHeadResponse(false, true));
    },
    get: (path: any, expectReturnContent = true, bearerToken = "") => {
      var request = {
        method: "GET",
        headers: {
          ...config.headers,
        },
      };
      addAuthHeaderIfNeeded(request, bearerToken);
      return fetch(url(path), request).then(makeCheckStatus(expectReturnContent));
    },
    getRaw: (path: any, bearerToken = "") => {
      // getRaw does not handle the status leaving this to the caller
      var request = {
        method: "GET",
        headers: {
          ...config.headers,
        },
      };
      addAuthHeaderIfNeeded(request, bearerToken);
      return fetch(url(path), request);
    },
    externalGet: (externalUrl: any) => {
      return fetch(externalUrl, {
        method: "GET",
        headers: {
          ...config.headers,
        },
      }).then(makeCheckStatus(true));
    },
    externalPost: (externalUrl: any, body: any, contentType: any) => {
      if (contentType == undefined || contentType == "") {
        contentType = "application/json";
      }
      var request = {
        method: "POST",
        headers: {
          ...config.headers,
          "content-type": contentType
        }
      };
      if (body != null) {
        // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
        request.body = body;
      }
      return fetch(externalUrl, request).then(makeCheckStatus(true));
    }
  };
};

const makeUrl = (basePath: any) => (path: any) => basePath + path;

const makeCheckStatus = (expectResponseBody: any) => (res: any) => {
  if (res.status >= 400) {
    return res.text().then((errText: any) => {
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

const handleHeadResponse = (expectResponseBody: any) => (res: any) => {
  if (res.status == 204 || res.status == 404) {
    return res.status == 204
  }
  return makeCheckStatus(expectResponseBody)
}

function addAuthHeaderIfNeeded(request: any, bearerToken: any) {
  if (bearerToken != "") {
    request.headers.Authorization = `Bearer ${bearerToken}`;
  }
}

export default httpClient;