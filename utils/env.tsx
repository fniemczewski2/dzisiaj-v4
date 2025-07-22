import Constants from "expo-constants";

export const APPWRITE_ENDPOINT =
  Constants?.expoConfig?.extra?.APPWRITE_ENDPOINT ?? "";
export const APPWRITE_PROJECT_ID =
  Constants?.expoConfig?.extra?.APPWRITE_PROJECT_ID ?? "";
