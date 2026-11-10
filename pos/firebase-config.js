/*
  Margreeta POS: Firebase connection.

  In the Firebase console: Project settings (gear icon) > General > "Your apps" > Web app > "SDK setup and configuration" > Config.
  You'll see a block that starts with:  const firebaseConfig = {
  Copy the six lines inside its { } and paste them over the six PASTE lines below. Keep the quotes and commas.
  These values aren't secret (every website using Firebase shows them). The Firestore rules and the staff login protect the data.
*/
window.MARGREETA_FIREBASE = {
  apiKey: "PASTE-apiKey-HERE",
  authDomain: "PASTE-authDomain-HERE",
  projectId: "PASTE-projectId-HERE",
  storageBucket: "PASTE-storageBucket-HERE",
  messagingSenderId: "PASTE-messagingSenderId-HERE",
  appId: "PASTE-appId-HERE"
};
