import { isValidStringProperty } from "../validation/string";

const objectsPathPrefix = "/objects";

export class ObjectsPath {

  constructor(dbVersionSupport) {
    this.dbVersionSupport = dbVersionSupport;
  }

  buildCreate() {
    return this.build({}, []);
  }
  buildDelete(id, className) {
    return this.build({id, className}, [this.addClassNameDeprecatedNotSupportedCheck, this.addId]);
  }
  buildCheck(id, className) {
    return this.build({id, className}, [this.addClassNameDeprecatedNotSupportedCheck, this.addId]);
  }
  buildGetOne(id, className, additionals, consistencyLevel, nodeName) {
    return this.build({id, className, additionals, consistencyLevel, nodeName}, 
      [this.addClassNameDeprecatedNotSupportedCheck, this.addId, this.addQueryParams]);
  }
  buildGet(className, limit, additionals) {
    return this.build({className, limit, additionals}, [this.addQueryParamsForGet]);
  }
  buildUpdate(id, className) {
    return this.build({id, className}, [this.addClassNameDeprecatedCheck, this.addId]);
  }
  buildMerge(id, className) {
    return this.build({id, className}, [this.addClassNameDeprecatedCheck, this.addId]);
  }

  build(params, modifiers) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise().then(support => {
      var path = objectsPathPrefix;
      modifiers.forEach(modifier => {
        path = modifier(params, path, support);
      });
      return path;
    });
  }

  addClassNameDeprecatedNotSupportedCheck(params, path, support) {
    if (support.supports) {
      if (isValidStringProperty(params.className)) {
        return `${path}/${params.className}`;
      } else {
        support.warns.deprecatedNonClassNameNamespacedEndpointsForObjects();
      }
    } else {
      support.warns.notSupportedClassNamespacedEndpointsForObjects();
    }
    return path;
  }
  addClassNameDeprecatedCheck(params, path, support) {
    if (support.supports) {
      if (isValidStringProperty(params.className)) {
        return `${path}/${params.className}`;
      } else {
        support.warns.deprecatedNonClassNameNamespacedEndpointsForObjects();
      }
    }
    return path;
  }
  addId(params, path) {
    if (isValidStringProperty(params.id)) {
      return `${path}/${params.id}`;
    }
    return path;
  }
  addQueryParams(params, path) {
    const queryParams = [];
    if (Array.isArray(params.additionals) && params.additionals.length > 0) {
      queryParams.push(`include=${params.additionals.join(",")}`);
    }
    if (isValidStringProperty(params.nodeName)) {
      queryParams.push(`node_name=${params.nodeName}`);
    }
    if (isValidStringProperty(params.consistencyLevel)) {
      queryParams.push(`consistency_level=${params.consistencyLevel}`);
    }
    if (queryParams.length > 0) {
      return `${path}?${queryParams.join("&")}`;
    }
    return path;
  }
  addQueryParamsForGet(params, path, support) {
    const queryParams = [];
    if (Array.isArray(params.additionals) && params.additionals.length > 0) {
      queryParams.push(`include=${params.additionals.join(",")}`);
    }
    if (typeof params.limit == "number" && params.limit > 0) {
      queryParams.push(`limit=${params.limit}`);
    }
    if (isValidStringProperty(params.className)) {
      if (support.supports) {
        queryParams.push(`class=${params.className}`);
      } else {
        support.warns.notSupportedClassParameterInEndpointsForObjects();
      }
    }
    if (queryParams.length > 0) {
      return `${path}?${queryParams.join("&")}`;
    }
    return path;
  }
}


export class ReferencesPath {

  constructor(dbVersionSupport) {
    this.dbVersionSupport = dbVersionSupport;
  }

  build(id, className, property) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise().then(support => {
      var path = objectsPathPrefix;
      if (support.supports) {
        if (isValidStringProperty(className)) {
          path = `${path}/${className}`;
        } else {
          support.warns.deprecatedNonClassNameNamespacedEndpointsForReferences();
        }
      } else {
        support.warns.notSupportedClassNamespacedEndpointsForReferences();
      }
      if (isValidStringProperty(id)) {
        path = `${path}/${id}`;
      }
      path = `${path}/references`;
      if (isValidStringProperty(property)) {
        path = `${path}/${property}`;
      }
      return path;
    });
  }
}
