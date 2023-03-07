import Scheduler from "./scheduler";
import Getter from "./getter";
import Connection from "../connection";

export interface IClientClassifications {
  scheduler: () => Scheduler
  getter: () => Getter
}

const data = (client: Connection): IClientClassifications => {
  return {
    scheduler: () => new Scheduler(client),
    getter: () => new Getter(client),
  };
};

export default data;
