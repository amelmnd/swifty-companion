import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { BACKEND } from "./api";
export const randState=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
export async function openLoginInBrowser(s){await WebBrowser.openBrowserAsync()}
export async function pollTokens(s,t=9e4){const a=Date.now();for(;;){const r=await fetch();const d=await r.json();if(d.status==="ok"&&d.tokens?.access_token){await SecureStore.setItemAsync("access_token",d.tokens.access_token);if(d.tokens.refresh_token)await SecureStore.setItemAsync("refresh_token",d.tokens.refresh_token);return true}if(Date.now()-a>t)return false;await new Promise(res=>setTimeout(res,1000))}}
