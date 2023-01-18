import { isValidStringProperty } from "../validation/string";

const objectsPathPrefix = "/objects";

export class ObjectsPath {
  dbVersionSupport: any;

  constructor(dbVersionSupport: any) {
    this.dbVersionSupport = dbVersionSupport;
  }

  buildCreate() {
    return this.build({}, []);
  }
  buildDelete(id: any, className: any) {
    return this.build({id, className}, [this.addClassNameDeprecatedNotSupportedCheck, this.addId]);
  }
  buildCheck(id: any, className: any) {
    return this.build({id, className}, [this.addClassNameDeprecatedNotSupportedCheck, this.addId]);
  }
  buildGetOne(id: any, className: any, additionals: any, consistencyLevel: any, nodeName: any) {
    return this.build({id, className, additionals, consistencyLevel, nodeName}, 
      [this.addClassNameDeprecatedNotSupportedCheck, this.addId, this.addQueryParams]);
  }
  buildGet(className: any, limit: any, additionals: any) {
    return this.build({className, limit, additionals}, [this.addQueryParamsForGet]);
  }
  buildUpdate(id: any, className: any) {
    return this.build({id, className}, [this.addClassNameDeprecatedCheck, this.addId]);
  }
  buildMerge(id: any, className: any) {
    return this.build({id, className}, [this.addClassNameDeprecatedCheck, this.addId]);
  }

  build(params: any, modifiers: any) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise().then((support: any) => {
      var path = objectsPathPrefix;
      modifiers.forEach((modifier: any) => {
        path = modifier(params, path, support);
      });
      return path;
    });
  }

  addClassNameDeprecatedNotSupportedCheck(params: any, path: any, support: any) {
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
  addClassNameDeprecatedCheck(params: any, path: any, support: any) {
    if (support.supports) {
      if (isValidStringProperty(params.className)) {
        return `${path}/${params.className}`;
      } else {
        support.warns.deprecatedNonClassNameNamespacedEndpointsForObjects();
      }
    }
    return path;
  }
  addId(params: any, path: any) {
    if (isValidStringProperty(params.id)) {
      return `${path}/${params.id}`;
    }
    return path;
  }
  addQueryParams(params: any, path: any) {
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
  addQueryParamsForGet(params: any, path: any, support: any) {
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
  dbVersionSupport: any;

  constructor(dbVersionSupport: any) {
    this.dbVersionSupport = dbVersionSupport;
  }

  build(id: any, className: any, property: any) {
    return this.dbVersionSupport.supportsClassNameNamespacedEndpointsPromise().then((support: any) => {
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
