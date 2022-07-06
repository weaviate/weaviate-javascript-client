import { isValidStringProperty } from "../validation/string";

export function buildObjectsPath(id, className) {
  let path = `objects`;
  if (isValidStringProperty(className)) {
    path = `${path}/${className}`;
  }
  return `/${path}/${id}`;
}

const objectsPathPrefix = "/objects";
export default class ObjectsPath {

  constructor(dbVersionSupport) {
    this.dbVersionSupport = dbVersionSupport;
  }

  buildCreate() {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(_ => objectsPathPrefix);
  }

  buildDelete(id, className) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = objectsPathPrefix;
        if (supports) {
          if (isValidStringProperty(className)) {
            path = `${path}/${className}`
          } else {
            // TODO warning no classname
          }
        } else {
          // TODO obsolete classname
        }
        if (isValidStringProperty(id)) {
          path = `${path}/${id}`
        }
        return path;
      });
  }

  buildCheck(id, className) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = objectsPathPrefix;
        if (supports) {
          if (isValidStringProperty(className)) {
            path = `${path}/${className}`
          } else {
            // TODO warning no classname
          }
        } else {
          // TODO obsolete classname
        }
        if (isValidStringProperty(id)) {
          path = `${path}/${id}`
        }
        return path;
      });
  }

  // TODO remove limit
  buildGetOne(id, className, additionals) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = objectsPathPrefix;
        if (supports) {
          if (isValidStringProperty(className)) {
            path = `${path}/${className}`
          } else {
            // TODO warning no classname
          }
        } else {
          // TODO obsolete classname
        }
        if (isValidStringProperty(id)) {
          path = `${path}/${id}`
        }
        const queryParams = [];
        if (Array.isArray(additionals) && additionals.length > 0) {
          queryParams.push(`include=${additionals.join(",")}`);
        }
        if (typeof limit == "number" && limit > 0) {
          queryParams.push(`limit=${limit}`);
        }
        if (queryParams.length > 0) {
          path = `${path}?${queryParams.join("&")}`
        }
        return path;
      });
  }

  buildGet(limit, additionals) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = objectsPathPrefix;
        const queryParams = [];
        if (Array.isArray(additionals) && additionals.length > 0) {
          queryParams.push(`include=${additionals.join(",")}`);
        }
        if (typeof limit == "number" && limit > 0) {
          queryParams.push(`limit=${limit}`);
        }
        if (queryParams.length > 0) {
          path = `${path}?${queryParams.join("&")}`
        }
        return path;
      });
  }

  buildUpdate(id, className) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = objectsPathPrefix;
        if (supports) {
          if (isValidStringProperty(className)) {
            path = `${path}/${className}`
          } else {
            // TODO warning no classname
          }
        }
        if (isValidStringProperty(id)) {
          path = `${path}/${id}`
        }
        return path;
      });
  }

  buildMerge(id, className) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = objectsPathPrefix;
        if (supports) {
          if (isValidStringProperty(className)) {
            path = `${path}/${className}`
          } else {
            // TODO warning no classname
          }
        }
        if (isValidStringProperty(id)) {
          path = `${path}/${id}`
        }
        return path;
      });
  }
}
