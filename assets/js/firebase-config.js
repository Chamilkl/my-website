/**
 * Chamil Kalong - Google Firebase Real-Time Integration & Helper API
 * Uses Firestore Database & Firebase Storage (Firebase v10 Compat SDK)
 */

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAdXGqrFSv-71uCr4xF4IKdVLfGTRudEIk",
  authDomain: "my-portfolio-7e48e.firebaseapp.com",
  databaseURL: "https://my-portfolio-7e48e-default-rtdb.firebaseio.com",
  projectId: "my-portfolio-7e48e",
  storageBucket: "my-portfolio-7e48e.firebasestorage.app",
  messagingSenderId: "144031863829",
  appId: "1:144031863829:web:1615c487c3b096ac2c6a1c",
  measurementId: "G-G4HBT14NDK"
};

let firebaseApp = null;
let firestoreDb = null;
let firebaseStorage = null;

function initFirebase() {
  try {
    if (!window.firebase) {
      firebaseApp = null;
      firestoreDb = null;
      firebaseStorage = null;
      return false;
    }

    const savedConfigStr = localStorage.getItem('ck_firebase_config');
    let config = DEFAULT_FIREBASE_CONFIG;
    if (savedConfigStr) {
      try {
        config = JSON.parse(savedConfigStr);
      } catch (e) {
        config = DEFAULT_FIREBASE_CONFIG;
      }
    }

    if (!config || !config.apiKey || !config.projectId) {
      return false;
    }

    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(config);
    } else {
      firebaseApp = firebase.app();
    }

    firestoreDb = firebase.firestore();
    firebaseStorage = firebase.storage();
    console.log('✅ Firebase initialized successfully.');
    return true;
  } catch (err) {
    console.error('❌ Error initializing Firebase:', err);
    firebaseApp = null;
    firestoreDb = null;
    firebaseStorage = null;
    return false;
  }
}

// Auto init on script load
if (window.firebase) {
  initFirebase();
}

function isFirebaseConfigured() {
  return firestoreDb !== null;
}

/* ==========================================
   Firebase API Helper Functions
   ========================================== */

/** Profile API */
async function fetchFirebaseProfile() {
  if (!firestoreDb) return null;
  try {
    const docRef = firestoreDb.collection('portfolio').doc('profile');
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error('Firebase profile fetch error:', err);
    return null;
  }
}

async function saveFirebaseProfile(profileData) {
  if (!firestoreDb) return false;
  try {
    const payload = {
      nameTh: profileData.nameTh || '',
      nameEn: profileData.nameEn || '',
      nickname: profileData.nickname || '',
      role: profileData.role || '',
      roleEn: profileData.roleEn || profileData.role || '',
      university: profileData.university || '',
      universityEn: profileData.universityEn || profileData.university || '',
      degree: profileData.degree || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      location: profileData.location || '',
      bio: profileData.bio || '',
      bioEn: profileData.bioEn || profileData.bio || '',
      avatarImage: profileData.avatarImage || 'assets/images/profile-avatar.svg',
      socials: {
        github: profileData.socials?.github || '',
        linkedin: profileData.socials?.linkedin || '',
        facebook: profileData.socials?.facebook || '',
        emailLink: profileData.socials?.emailLink || ''
      },
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await firestoreDb.collection('portfolio').doc('profile').set(payload, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving profile to Firebase:', err);
    return false;
  }
}

/** Image Storage API */
async function uploadFirebaseImage(file, folder = 'avatars') {
  if (!firebaseStorage) {
    throw new Error('Firebase Storage ยังไม่ได้ถูกตั้งค่าหรือเปิดใช้งาน');
  }

  const fileExt = file.name ? file.name.split('.').pop() : 'webp';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const metadata = {
    contentType: file.type || 'image/webp'
  };

  try {
    const storageRef = firebaseStorage.ref().child(fileName);
    const snapshot = await storageRef.put(file, metadata);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (err) {
    console.warn('First bucket upload failed, attempting fallback bucket if applicable:', err);
    
    // If bucket-not-found and current bucket ends with firebasestorage.app, try appspot.com
    if (err.code === 'storage/bucket-not-found' || err.code === 'storage/project-not-found') {
      try {
        const altStorage = firebase.app().storage('gs://my-portfolio-7e48e.appspot.com');
        const altRef = altStorage.ref().child(fileName);
        const altSnap = await altRef.put(file, metadata);
        return await altSnap.ref.getDownloadURL();
      } catch (altErr) {
        console.error('Fallback bucket upload also failed:', altErr);
        throw altErr;
      }
    }

    throw err;
  }
}

/** Education API */
async function fetchFirebaseEducation() {
  if (!firestoreDb) return null;
  try {
    const docRef = firestoreDb.collection('portfolio').doc('education');
    const docSnap = await docRef.get();
    if (docSnap.exists && Array.isArray(docSnap.data().items)) {
      return docSnap.data().items;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function saveFirebaseEducationList(eduList) {
  if (!firestoreDb) return false;
  try {
    await firestoreDb.collection('portfolio').doc('education').set({ items: eduList });
    return true;
  } catch (err) {
    return false;
  }
}

/** Certificates API */
async function fetchFirebaseCertificates() {
  if (!firestoreDb) return null;
  try {
    const docRef = firestoreDb.collection('portfolio').doc('certificates');
    const docSnap = await docRef.get();
    if (docSnap.exists && Array.isArray(docSnap.data().items)) {
      return docSnap.data().items;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function saveFirebaseCertificateList(certList) {
  if (!firestoreDb) return false;
  try {
    await firestoreDb.collection('portfolio').doc('certificates').set({ items: certList });
    return true;
  } catch (err) {
    return false;
  }
}

/** Activities API */
async function fetchFirebaseActivities() {
  if (!firestoreDb) return null;
  try {
    const docRef = firestoreDb.collection('portfolio').doc('activities');
    const docSnap = await docRef.get();
    if (docSnap.exists && Array.isArray(docSnap.data().items)) {
      return docSnap.data().items;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function saveFirebaseActivityList(actList) {
  if (!firestoreDb) return false;
  try {
    await firestoreDb.collection('portfolio').doc('activities').set({ items: actList });
    return true;
  } catch (err) {
    return false;
  }
}

/** Projects API */
async function fetchFirebaseProjects() {
  if (!firestoreDb) return null;
  try {
    const docRef = firestoreDb.collection('portfolio').doc('projects');
    const docSnap = await docRef.get();
    if (docSnap.exists && Array.isArray(docSnap.data().items)) {
      return docSnap.data().items;
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function saveFirebaseProjectList(projList) {
  if (!firestoreDb) return false;
  try {
    await firestoreDb.collection('portfolio').doc('projects').set({ items: projList });
    return true;
  } catch (err) {
    return false;
  }
}
