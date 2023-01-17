const { addMeta } = require('../meta');

const {getNumericValue} = require('./util');

exports.customEvent = ({ eventName, timeOffset = 0, duration = 0, meta = {}, view: customViewName } = {}) => async ({
  beaconId,
  sessionId,
  time,
  view
}) => {
  const beacon = {
    sid: sessionId,
    bid: beaconId,
    ti: time + getNumericValue(timeOffset),
    t: 'custom',
    cen: eventName,
    d: getNumericValue(duration),
    ec: 0,
    bs: 1,
    v: customViewName || view
  };
  addMeta(beacon, meta);
  return beacon;
};
