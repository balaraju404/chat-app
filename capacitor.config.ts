import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
 appId: "chat.app",
 appName: "Chat App",
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