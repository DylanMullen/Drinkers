
export const DISCORD_URL: string = "https://discord.gg/RK45xnyYFg";
export const TWITTER_URL: string = "https://twitter.com/StillSite";

//

const DEBUG = false;

export const URL: string = DEBUG ? "http://localhost:80" : "https://drinkers.party"
export const API_URL: string = DEBUG ? "http://localhost:5000" : "https://api.drinkers.party"
export const WEBSOCKET_URL: string = DEBUG ? "ws://localhost:5000" : "wss://api.drinkers.party:8443"