// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load recent scripts
async function loadRecentScripts() {
  const container = document.getElementById('scripts-container');
  const querySnapshot = await db.collection('scripts').orderBy('added_at', 'desc').limit(5).get();
  querySnapshot.forEach(doc => {
    const data = doc.data();
    const scriptBox = document.createElement('div');
    scriptBox.className = 'script-box';
    scriptBox.innerHTML = `
      <img src="${data.image}" alt="${data.title}">
      <h3>${data.title}</h3>
      <button class="get-btn" onclick="incrementDownloads('${doc.id}')">Get</button>
    `;
    container.appendChild(scriptBox);
  });
}

// Increment downloads
async function incrementDownloads(id) {
  const scriptRef = db.collection('scripts').doc(id);
  await scriptRef.update({ downloads: firebase.firestore.FieldValue.increment(1) });
}

// Count visitors
async function countVisitors() {
  const visitorCountRef = db.collection('meta').doc('visitor_count');
  await visitorCountRef.update({ count: firebase.firestore.FieldValue.increment(1) });
  const doc = await visitorCountRef.get();
  document.getElementById('visitor-count').innerText = doc.data().count;
}

// On page load
window.onload = async () => {
  await loadRecentScripts();
  await countVisitors();
};
