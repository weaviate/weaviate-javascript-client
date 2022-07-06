import DbVersionSupport from "../utils/dbVersionSupport";
import { isValidStringProperty } from "../validation/string";

export function buildObjectsPath(id, className) {
  let path = `objects`;
  if (isValidStringProperty(className)) {
    path = `${path}/${className}`;
  }
  return `/${path}/${id}`;
}

const pathPrefix = "/objects";
export default class ObjectsPath {
  

  constructor(dbVersionSupport) {
    this.dbVersionSupport = dbVersionSupport;
  }

  buildCreate() {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(_ => pathPrefix);
  }

  buildDelete(id, className) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise()
      .then(supports => {
        var path = pathPrefix;
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
        var path = pathPrefix;
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

}
