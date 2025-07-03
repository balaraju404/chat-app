import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
 appId: "com.gbr.chatapp",
 appName: "GBR Chat App",
 webDir: "www",
 plugins: {
  Keyboard: {
   resize: "body",
   style: "light",
   resizeOnFullScreen: true
  }
 }
}

export default config;