/* eslint-disable no-restricted-syntax, no-prototype-builtins */

const fetch = require('node-fetch');

const config = require('./config');

exports.transmit = async (beacons, user) => {
  const transmissionPromises = [];
  const reportingTarget = config.reportingTargets[process.env.REPORT_ENV];
  Object.keys(reportingTarget).forEach(url =>
    reportingTarget[url].forEach(key =>
      transmissionPromises.push(transmitTo(beacons, user, url, key))
    )
  );
  await Promise.all(transmissionPromises);
};

async function transmitTo(beacons, user, url, key) {
  beacons.forEach(b => {b.k = key;});

  const headers = {
    'Content-Type': 'text/plain',
    // fallback user agent header to avoid detection as bot
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
  };

  if (user) {
    headers['X-REALER-IP'] = user.ip;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: encode(beacons),
      headers,
      timeout: 10000
    });
    if (!response.ok) {
      const responseBody = await response.text();
      let message = `Failed to report beacon to ${url} with API key ${key}. Received status code: ${
        response.status
      }`;

      if (!process.env.DOCKER) {
        message = `${message} ${responseBody}`;
      }

      console.error(message);
    }
  } catch (e) {
    console.log(e);
    // we are shutting down some environments from time to time. Avoid log spam.
    if (e.code !== 'ENETUNREACH') {
      console.error(`Failed to report beacon to ${url} with API key ${key}: ${e}`);
    }
  }
}

function encode(beacons) {
  let str = '';

  for (let i = 0; i < beacons.length; i++) {
    const beacon = beacons[i];

    // Multiple beacons are separated by an empty line
    str += '\n';

    for (const key in beacon) {
      if (Object.prototype.hasOwnProperty.call(beacon, key)) {
        const value = beacon[key];
        if (value != null) {
          str += '\n' + encodePart(key) + '\t' + encodePart(value);
        }
      }
    }
  }

  return str.substring(2);
}

function encodePart(part) {
  return String(part)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}
