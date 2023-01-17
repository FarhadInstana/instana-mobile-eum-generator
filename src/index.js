const _ = require("lodash");

const executor = require("./executor");
const config = require("./config");

(async () => {
  const executions = _.range(config.numberOfConcurrentUsers).map(() =>
    executor.start().catch(e => {
      console.error(e);
    })
  );

  await Promise.all(executions);
})();
