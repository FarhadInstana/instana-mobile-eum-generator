const _ = require('lodash');

exports.getNumericValue = v => {
  if (typeof v === 'number') {
    return v;
  }

  if (v instanceof Array) {
    const min = v[0];
    const max = v[1];
    return _.random(min, max, false);
  }

  throw new Error(`Unsupported value for getNumericValue. Received a '${typeof v}': ${v}`);
}
