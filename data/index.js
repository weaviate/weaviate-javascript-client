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
import { ObjectsPath, ReferencesPath } from "./path";

const data = (client, dbVersionSupport) => {
  const objectsPath = new ObjectsPath(dbVersionSupport);
  const referencesPath = new ReferencesPath(dbVersionSupport)

  return {
    creator: () => new Creator(client, objectsPath),
    validator: () => new Validator(client),
    updater: () => new Updater(client, objectsPath),
    merger: () => new Merger(client, objectsPath),
    getter: () => new Getter(client, objectsPath),
    getterById: () => new GetterById(client, objectsPath),
    deleter: () => new Deleter(client, objectsPath),
    checker: () => new Checker(client, objectsPath),
    referenceCreator: () => new ReferenceCreator(client, referencesPath),
    referenceReplacer: () => new ReferenceReplacer(client, referencesPath),
    referenceDeleter: () => new ReferenceDeleter(client, referencesPath),
    referencePayloadBuilder: () => new ReferencePayloadBuilder(client),
  };
};

export default data;
