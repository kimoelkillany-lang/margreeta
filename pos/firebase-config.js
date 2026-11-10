/*
  Margreeta POS: Firebase connection (project margreeta-pos).
  From Firebase console > Project settings > General > Your apps > Web app "POS" > Config.
  These values aren't secret (every website using Firebase shows them). The Firestore rules and the staff login protect the data.
  The website's order form (index.html) reads this same file.
*/
window.MARGREETA_FIREBASE = {
  apiKey: "AIzaSyD3g-fQ6SZe--QjFSPJdJN6wPfNTTqR8Fg",
  authDomain: "margreeta-pos.firebaseapp.com",
  projectId: "margreeta-pos",
  storageBucket: "margreeta-pos.firebasestorage.app",
  messagingSenderId: "807991493005",
  appId: "1:807991493005:web:fd18d4fe62c91e82cfbdc4"
};
