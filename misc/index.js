import LiveChecker from "./liveChecker";
import ReadyChecker from "./readyChecker";
import MetaGetter from "./metaGetter";
import OpenidConfigurationGetter from "./openidConfigurationGetter";
import NodesStatusGetter from "./nodesStatusGetter";

const misc = (client, dbVersionProvider) => {
  return {
    liveChecker: () => new LiveChecker(client, dbVersionProvider),
    readyChecker: () => new ReadyChecker(client, dbVersionProvider),
    metaGetter: () => new MetaGetter(client),
    openidConfigurationGetter: () => new OpenidConfigurationGetter(client),
    nodesStatusGetter: () => new NodesStatusGetter(client),
  };
};

export default misc;
