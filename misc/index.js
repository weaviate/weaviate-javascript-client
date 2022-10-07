import LiveChecker from "./liveChecker";
import ReadyChecker from "./readyChecker";
import MetaGetter from "./metaGetter";
import OpenidConfigurationGetter from "./openidConfigurationGetter";
import NodesGetter from "./nodesGetter";

const misc = (client, dbVersionProvider) => {
  return {
    liveChecker: () => new LiveChecker(client, dbVersionProvider),
    readyChecker: () => new ReadyChecker(client, dbVersionProvider),
    metaGetter: () => new MetaGetter(client),
    openidConfigurationGetter: () => new OpenidConfigurationGetter(client),
    nodesGetter: () => new NodesGetter(client),
  };
};

export default misc;
