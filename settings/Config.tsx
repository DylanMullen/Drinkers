export const DISCORD_URL: string = "https://discord.gg/RK45xnyYFg";
export const TWITTER_URL: string = "https://twitter.com/StillSite";

//

const DEBUG = false;

export const API_URL: string = DEBUG ? "http://localhost:5000" : "https://api.drinkers.beer"
export const WEBSOCKET_URL: string = DEBUG ? "ws://localhost:5000" : "wss://api.drinkers.beer:8443"