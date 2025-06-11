
export const DISCORD_URL: string = "https://discord.gg/RK45xnyYFg";
export const TWITTER_URL: string = "https://twitter.com/StillSite";

//

export const DEBUG = process.env.USE_LOCAL?.toLowerCase() === "true" ?? false;
const LOCAL_IP = process.env.LOCAL_IP

export const URL: string = DEBUG ? `${LOCAL_IP}` : "https://drinkers.party"
export const API_URL: string = DEBUG ? `http://${LOCAL_IP}:5000` : "http://drinkers-env-2.eba-sahtdp3w.eu-west-2.elasticbeanstalk.com"
export const WEBSOCKET_URL: string = DEBUG ? `ws://${LOCAL_IP}:5000` : "wss://api.drinkers.party:8443"