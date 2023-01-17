module.exports = {
  numberOfConcurrentUsers: 1,
  reportingTargets: {
    // https://farhad-sebootsaas.instana.io
    farhad: {
      'https://eum-green-saas.instana.io/mobile': ['h9HWMs6rSVuUs1j1mrv3LA']
    }
  },
  services: {
    shop: `http://web.robot-shop:8080`
  }
};
