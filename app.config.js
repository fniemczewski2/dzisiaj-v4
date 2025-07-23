// app.config.js
export default ({ config }) => ({
  expo: {
    name: "Dzisiajv4",
    slug: "dzisiajv4",
    owner: "f.niemczewski",
    version: "1.0.0",
    scheme: "appwrite-callback-6877e1290006c3e6b744",
    userInterfaceStyle: "automatic",

    updates: {
      url: "https://u.expo.dev/5655fb4a-0e31-440b-a7e7-525445147d87",
    },

    runtimeVersion: { policy: "appVersion" },

    android: { "package": "com.fniemczewski.dzisiajv4" },

    ios: {
      bundleIdentifier: "com.fniemczewski.dzisiajv4",
      supportsTablet: true,
      infoPlist: {
        "ITSAppUsesNonExemptEncryption": false
      }
    },

    web: {
      bundler: "metro",
      output: "server",
    },


    plugins: [
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            "com.googleusercontent.apps.1076392100281-n2d5mlcbtfnro5bn92lr2lu2f7qnbkns",
        },
      ],
      "expo-web-browser",
    ],

    extra: {
      APPWRITE_PROJECT_ID: "6877e1290006c3e6b744",
      APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1",
      GOOGLE_WEB:
        "1076392100281-v84uu4n5ghotff7cjvrd1um6vtoug3up.apps.googleusercontent.com",
      GOOGLE_IOS:
        "1076392100281-n2d5mlcbtfnro5bn92lr2lu2f7qnbkns.apps.googleusercontent.com",
      GOOGLE_ANDROID:
        "1076392100281-gd23br8j29nitqbv8hih8jqnmv7tpf0j.apps.googleusercontent.com",
      eas: {
        projectId: "5655fb4a-0e31-440b-a7e7-525445147d87",
      },
    },
  },
});
