const {getNumericValue} = require('./util');

exports.viewChange = ({ view, timeOffset = 0 } = {}) => async ({ beaconId, sessionId, time }) => ({
  sid: sessionId,
  bid: beaconId,
  ti: time + getNumericValue(timeOffset),
  t: 'viewChange',
  d: 0,
  ec: 0,
  bs: 1,
  v: view
});
