import Where from "./where";
import NearText from "./nearText";
import NearVector from "./nearVector";
import Bm25 from "./bm25";
import Hybrid from "./hybrid";
import NearObject from "./nearObject";
import NearImage from "./nearImage";
import Ask from "./ask";
import Group from "./group";
import Sort from "./sort";
import Connection from "../connection";

export default class Getter {
  private client: Connection;
  private errors: any[];
  private includesNearMediaFilter: boolean;
  private nearVectorString?: string;
  private nearTextString?: string;
  private groupString?: string;
  private whereString?: string;
  private className?: string;
  private fields: any;
  private sortString?: string;
  private offset: any;
  private limit: any;
  private nearObjectString?: string;
  private bm25String?: string;
  private hybridString?: string;
  private askString?: string;
  private nearImageString?: string;
  private after?: string
  constructor(client: Connection) {
    this.client = client;
    this.errors = [];
    this.includesNearMediaFilter = false
  }

  withFields = (fields: any) => {
    this.fields = fields;
    return this;
  };

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  withAfter = (id: string) => {
    this.after = id;
    return this;
  };

  withGroup = (groupObj: any) => {
    try {
      this.groupString = new Group(groupObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withWhere = (whereObj: any) => {
    try {
      this.whereString = new Where(whereObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearText = (nearTextObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearTextString = new NearText(nearTextObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withBm25 = (bm25Obj: any) => {
    try {
      this.bm25String = new Bm25(bm25Obj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withHybrid = (hybridObj: any) => {
    try {
      this.hybridString = new Hybrid(hybridObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };


  withNearObject = (nearObjectObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearObjectString = new NearObject(nearObjectObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withAsk = (askObj: any) => {
    try {
      this.askString = new Ask(askObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  withNearImage = (nearImageObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearImageString = new NearImage(nearImageObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withNearVector = (nearVectorObj: any) => {
    if (this.includesNearMediaFilter) {
      throw new Error(
        "cannot use multiple near<Media> filters in a single query"
      )
    }

    try {
      this.nearVectorString = new NearVector(nearVectorObj).toString();
      this.includesNearMediaFilter = true;
    } catch (e: any) {
      this.errors = [...this.errors, e];
    }

    return this;
  };

  withLimit = (limit: any) => {
    this.limit = limit;
    return this;
  };

  withOffset = (offset: any) => {
    this.offset = offset;
    return this;
  };

  withSort = (sortObj: any) => {
    try {
      this.sortString = new Sort(sortObj).toString();
    } catch (e) {
      this.errors = [...this.errors, e];
    }
    return this;
  };

  validateIsSet = (prop: string | undefined | null, name: string, setter: string) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.errors = [
        ...this.errors,
        `${name} must be set - set with ${setter}`,
      ];
    }
  };

  validate = () => {
    this.validateIsSet(
      this.className,
      "className",
      ".withClassName(className)"
    );
    this.validateIsSet(this.fields, "fields", ".withFields(fields)");
  };

  do = () => {
    let params = "";

    this.validate();
    if (this.errors.length > 0) {
      return Promise.reject(
        new Error("invalid usage: " + this.errors.join(", "))
      );
    }

    if (
      this.whereString ||
      this.nearTextString ||
      this.nearObjectString ||
      this.nearVectorString ||
      this.nearImageString ||
      this.askString ||
      this.bm25String ||
      this.hybridString ||
      this.limit ||
      this.offset ||
      this.groupString ||
      this.sortString ||
      this.after
    ) {
      let args: any[] = [];

      if (this.whereString) {
        args = [...args, `where:${this.whereString}`];
      }

      if (this.nearTextString) {
        args = [...args, `nearText:${this.nearTextString}`];
      }

      if (this.nearObjectString) {
        args = [...args, `nearObject:${this.nearObjectString}`];
      }

      if (this.askString) {
        args = [...args, `ask:${this.askString}`];
      }

      if (this.nearImageString) {
        args = [...args, `nearImage:${this.nearImageString}`];
      }

      if (this.nearVectorString) {
        args = [...args, `nearVector:${this.nearVectorString}`];
      }

      if (this.bm25String) {
        args = [...args, `bm25:${this.bm25String}`];
      }

      if (this.hybridString) {
        args = [...args, `hybrid:${this.hybridString}`];
      }

      if (this.groupString) {
        args = [...args, `group:${this.groupString}`];
      }

      if (this.limit) {
        args = [...args, `limit:${this.limit}`];
      }

      if (this.offset) {
        args = [...args, `offset:${this.offset}`];
      }

      if (this.sortString) {
        args = [...args, `sort:[${this.sortString}]`];
      }

      if (this.after) {
        args = [...args, `after:"${this.after}"`];
      }

      params = `(${args.join(",")})`;
    } 

    return this.client.query(
      `{Get{${this.className}${params}{${this.fields}}}}`
    );
  };
}
