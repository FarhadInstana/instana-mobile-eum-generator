# Mobile App Monitoring Simulator for testing purposes

for main repo, go to https://github.ibm.com/instana/demo/tree/demo-2.0/demo_apps/eum-apps/eum-mobile-app

internal notes:

vi config.js  
docker build -t farhad_eum_mobile .  
docker run --name farhad_eum_mobile_demo_generator --env="REPORT_ENV=farhad" farhad_eum_mobile  
