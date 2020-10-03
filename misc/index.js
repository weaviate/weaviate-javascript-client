const LiveChecker = require('./liveChecker');
const ReadyChecker = require('./readyChecker');
const MetaGetter = require('./metaGetter');
const OpenidConfigurationGetter = require('./openidConfigurationGetter');

const data = client => {
  return {
    liveChecker: () => new LiveChecker(client),
    readyChecker: () => new ReadyChecker(client),
    metaGetter: () => new MetaGetter(client),
    openidConfigurationGetter: () => new OpenidConfigurationGetter(client),
  };
};

export default data;
