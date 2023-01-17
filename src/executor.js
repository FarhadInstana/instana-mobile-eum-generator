const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const beaconCreators = require('./beaconCreators');
const { getPlaybook } = require('./playbook');
const { transmit } = require('./transmission');
const {addMeta} = require('./meta');
const users = require('./users');

exports.start = async () => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const user = getRandomUser();
      const playbook = getPlaybook(user);
      const beacons = await executePlaybook(playbook, { user });
      /* eslint-disable-next-line no-await-in-loop */
      await transmit(beacons, user);
    } catch (e) {
      console.error(`Failed to simulate regular load`, e);
    }
  }
};

async function executePlaybook(playbook, { user, previousView, time = Date.now(), sessionId = uuidv4() } = {}) {
  const beacons = [];

  for (const beaconDefinition of playbook) {
    if (beaconDefinition.abortChance != null && Math.random() <= beaconDefinition.abortChance) {
      break;
    } else if (beaconDefinition.chance != null && Math.random() > beaconDefinition.chance) {
      continue;
    }

    const beaconCreator = beaconCreators[beaconDefinition.type](beaconDefinition);

    /* eslint-disable-next-line no-await-in-loop */
    const beacon = await beaconCreator({
      beaconId: uuidv4(),
      sessionId,
      time,
      view: previousView
    });
    addUserInformation(beacon, user);
    time = beacon.ti + (beacon.d || 0);
    previousView = beacon.v;
    beacons.push(beacon);
  }

  return beacons;
}

function addUserInformation(beacon, user) {
  beacon.agv = 'demoLoadGenerator';
  beacon.ui = user.id;
  beacon.un = user.fullName;
  beacon.ue = user.email;
  beacon.ul = user.language;
  beacon.bi = user.bundleIdentifier;
  beacon.ab = user.appBuild;
  beacon.av = user.appVersion;
  beacon.p = user.platform;
  beacon.osn = user.osName;
  beacon.osv = user.osVersion;
  beacon.dma = user.deviceManufacturer;
  beacon.dmo = user.deviceModel;
  beacon.dh = user.deviceHardware;
  beacon.ro = user.rooted ? '1' : '0';
  beacon.gpsm = user.googlePlayServicesMissing ? '1' : '0';
  beacon.vw = user.viewportWidth;
  beacon.vh = user.viewportHeight;
  beacon.cn = user.carrier;
  beacon.ct = user.connectionType;
  beacon.ect = user.effectiveConnectionType;
  addMeta(beacon, user.meta);
}

function getRandomUser() {
  const index = _.random(0, users.length - 1);
  return users[index];
}
