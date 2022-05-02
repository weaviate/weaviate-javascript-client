import ObjectsBatcher from "./objectsBatcher";
import ObjectsBatchDeleter from "./objectsBatchDeleter";
import ReferencesBatcher from "./referencesBatcher";
import ReferencePayloadBuilder from "./referencePayloadBuilder";

const batch = (client) => {
  return {
    objectsBatcher: () => new ObjectsBatcher(client),
    objectsBatchDeleter: () => new ObjectsBatchDeleter(client),
    referencesBatcher: () => new ReferencesBatcher(client),
    referencePayloadBuilder: () => new ReferencePayloadBuilder(client),
  };
};

export default batch;
