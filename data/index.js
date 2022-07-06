import Creator from "./creator";
import Validator from "./validator";
import Updater from "./updater";
import Merger from "./merger";
import Getter from "./getter";
import GetterById from "./getterById";
import Deleter from "./deleter";
import Checker from "./checker";
import ReferenceCreator from "./referenceCreator";
import ReferenceReplacer from "./referenceReplacer";
import ReferenceDeleter from "./referenceDeleter";
import ReferencePayloadBuilder from "./referencePayloadBuilder";
import DbVersionSupport from "../utils/dbVersionSupport";
import ObjectsPath from "./path";

const data = (client, dbVersionPromise) => {
  const dbVersionSupport = new DbVersionSupport(dbVersionPromise);
  const objectsPath = new ObjectsPath(dbVersionSupport);

  objectsPath.buildCreate("someId", "someClass").then(console.warn).catch(console.error);
  objectsPath.buildDelete("someId", "someClass").then(console.warn).catch(console.error);
  objectsPath.buildCheck("someId", "someClass").then(console.warn).catch(console.error);

  return {
    creator: () => new Creator(client),
    validator: () => new Validator(client),
    updater: () => new Updater(client),
    merger: () => new Merger(client),
    getter: () => new Getter(client),
    getterById: () => new GetterById(client),
    deleter: () => new Deleter(client),
    checker: () => new Checker(client),
    referenceCreator: () => new ReferenceCreator(client),
    referenceReplacer: () => new ReferenceReplacer(client),
    referenceDeleter: () => new ReferenceDeleter(client),
    referencePayloadBuilder: () => new ReferencePayloadBuilder(client),
  };
};

export default data;
