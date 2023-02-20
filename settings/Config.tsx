
export const DISCORD_URL: string = "https://discord.gg/RK45xnyYFg";
export const TWITTER_URL: string = "https://twitter.com/StillSite";

//

const DEBUG = process.env.USE_LOCAL?.toLowerCase() === "true" ?? false;
const LOCAL_IP = process.env.LOCAL_IP

export const URL: string = DEBUG ? `http://${LOCAL_IP}:3000` : "https://drinkers.party"
export const API_URL: string = DEBUG ? `http://${LOCAL_IP}:5000` : "https://api.drinkers.party"
export const WEBSOCKET_URL: string = DEBUG ? `ws://${LOCAL_IP}:5000` : "wss://api.drinkers.party:8443"