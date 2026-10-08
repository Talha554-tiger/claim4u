/**
 * Claim4u - Firebase Initialisation
 * ----------------------------------------------------------
 * Initialises Firebase app and Analytics using the CDN ESM
 * shim so this works in plain HTML pages (no bundler needed).
 *
 * All other scripts can reference:
 *   window.firebaseApp       - the initialised FirebaseApp
 *   window.firebaseAnalytics - the Analytics instance
 */

// ---- Firebase SDK (CDN - modular ESM shim) ---------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics }  from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";

// ---- Project configuration --------------------------------
const firebaseConfig = {
  apiKey:            "AIzaSyBlxOPxact-c_Sp1LrJJp6VgVMx8mFEzLU",
  authDomain:        "hhgg-c32b9.firebaseapp.com",
  projectId:         "hhgg-c32b9",
  storageBucket:     "hhgg-c32b9.firebasestorage.app",
  messagingSenderId: "461994095544",
  appId:             "1:461994095544:web:3331c0b9ff9efcb896954d",
  measurementId:     "G-E38RB8ZQKE"
};

// ---- Initialise & expose globally -------------------------
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

window.firebaseApp       = app;
window.firebaseAnalytics = analytics;

console.log("[Claim4u] Firebase initialised");
