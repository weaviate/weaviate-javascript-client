import Aggregator from "./aggregator";
import Getter from "./getter";
import Explorer from "./explorer";
import Raw from "./raw";

const graphql = (client: any) => {
  return {
    get: () => new Getter(client),
    aggregate: () => new Aggregator(client),
    explore: () => new Explorer(client),
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    raw: () => new Raw(client),
  };
};

export default graphql;
