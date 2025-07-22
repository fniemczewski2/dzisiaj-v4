// app.config.js
export default {
  expo: {
    name: "Dzisiajv4",
    slug: "dzisiajv4",
    owner: "fniemczewski",
    version: "1.0.0",
    userInterfaceStyle: "automatic",
    scheme: "appwrite-callback-6877e1290006c3e6b744",
    plugins: [
    "expo-web-browser"
  ],
  web: {
      "bundler": "metro",
  },
  ios: {
      "bundleIdentifier": "com.fniemczewski.dzisiaj"
    },
    extra: {
      APPWRITE_PROJECT_ID: "6877e1290006c3e6b744",
      APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1",
    },
  },
};
