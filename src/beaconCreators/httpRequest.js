const fetch = require('node-fetch');

const {getNumericValue} = require('./util');

exports.httpRequest = ({ method = 'GET', url, timeOffset = 0, fake } = {}) => async ({ beaconId, sessionId, time, view }) => {
  const beacon = {
    sid: sessionId,
    bid: beaconId,
    ti: time + getNumericValue(timeOffset),
    t: 'httpRequest',
    d: 0,
    ec: 0,
    bs: 1,
    hu: url,
    hm: method,
    v: view
  };

  if (fake) {
    beacon.d = getNumericValue(fake.duration);
    beacon.ec = fake.statusCode == null || fake.statusCode >= 500 ? 1 : 0;
    beacon.em = fake.statusCode == null ? 'Failed to establish connection' : null;
    beacon.hs = fake.statusCode;
    beacon.m_faked = 'This is a simulated HTTP request and therefore does not support backend correlation.';
  } else {
    await simulateHttpRequest(beacon);
  }

  return beacon;
};

async function simulateHttpRequest(beacon) {
  const start = Date.now();
  try {
    const response = await fetch(beacon.hu, {
      method: beacon.hm,
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
      },
      timeout: 15000
    });

    beacon.hs = response.status;
    beacon.d = Date.now() - start;
    if (!response.ok) {
      beacon.ec = 1;
    }

    const serverTiming = response.headers.get('server-timing');
    if (serverTiming) {
      const match = serverTiming.match(/^intid;desc=(.+)$/i);
      if (match) {
        // eslint-disable-next-line prefer-destructuring
        beacon.bt = match[1];
      }
    }
  } catch (e) {
    beacon.d = Date.now() - start;
    beacon.ec = 1;
    beacon.em = e.message;
  }
}
