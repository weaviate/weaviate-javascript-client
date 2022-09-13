import Aggregator from "./aggregator";
import Getter from "./getter";
import Explorer from "./explorer";

const graphql = (client) => {
  return {
    get: () => new Getter(client),
    aggregate: () => new Aggregator(client),
    explore: () => new Explorer(client),
    raw: (query) => new Raw(client, query),
  };
};

export default graphql;
