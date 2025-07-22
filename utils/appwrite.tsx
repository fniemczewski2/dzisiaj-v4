// appwriteClient.ts
import { Account, Client, Databases } from "appwrite";
import Constants from "expo-constants";

const endpoint = Constants.expoConfig?.extra?.APPWRITE_ENDPOINT;
const projectId = Constants.expoConfig?.extra?.APPWRITE_PROJECT_ID;

if (!endpoint || !projectId) {
  console.error("Missing Appwrite config in app.config.js");
  throw new Error("Appwrite is not configured properly");
}

// Konfiguracja klienta
const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

// Klasy Appwrite
const account = new Account(client);
const databases = new Databases(client);

// Funkcja sprawdzająca czy użytkownik jest zalogowany
async function ensureSession() {
  try {
    const user = await account.get();
    console.log("Użytkownik zalogowany:", user);
    return user;
  } catch (err) {
    console.warn("Użytkownik nie jest zalogowany:", err);
    return null;
  }
}

// Funkcja wylogowania
async function logout() {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Błąd wylogowania:", error);
    throw error;
  }
}

export {
  account, client, databases,
  ensureSession,
  logout
};

