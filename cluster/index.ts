import NodesStatusGetter from "./nodesStatusGetter";
import Connection from "../connection";

export interface IClientCluster {
  nodesStatusGetter: () => NodesStatusGetter
}

const cluster = (client: Connection): IClientCluster => {
  return {
    nodesStatusGetter: () => new NodesStatusGetter(client),
  };
};

export default cluster;
