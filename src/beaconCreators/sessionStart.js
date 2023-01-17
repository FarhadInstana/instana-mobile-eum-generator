exports.sessionStart = ({ view }={}) => async ({beaconId, sessionId, time}) => ({
  sid: sessionId,
  bid: beaconId,
  ti: time,
  t: 'sessionStart',
  d: 0,
  ec: 0,
  bs: 1,
  v: view
});
