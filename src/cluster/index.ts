import NodesStatusGetter from "./nodesStatusGetter";

const cluster = (client: any) => {
  return {
    nodesStatusGetter: () => new NodesStatusGetter(client),
  };
};

export default cluster;
