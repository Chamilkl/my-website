/**
 * Chamil Kalong - Dev Admin Portal Logic
 * Handles Authentication, Profile Avatar & Bio Editing,
 * Content Management (Education, Certificates, Activities, Projects),
 * LocalStorage Persistence, Data.js Export, and Google Firebase Cloud Sync.
 */

const DEV_USER = 'chamil';
const DEV_PASS = '280225';

document.addEventListener('DOMContentLoaded', () => {
  initCustomDevData();
  checkAuth();
  initAdminEventListeners();
  initFirebaseUI();
});

function initCustomDevData() {
  try {
    const customProfile = JSON.parse(localStorage.getItem('ck_custom_profile') || 'null');
    if (customProfile) {
      portfolioData.personalInfo = { ...portfolioData.personalInfo, ...customProfile };
    }

    const storedEdu = localStorage.getItem('ck_portfolio_education');
    if (storedEdu) portfolioData.education = JSON.parse(storedEdu);

    const storedCerts = localStorage.getItem('ck_portfolio_certificates');
    if (storedCerts) portfolioData.certificates = JSON.parse(storedCerts);

    const storedActs = localStorage.getItem('ck_portfolio_activities');
    if (storedActs) portfolioData.activities = JSON.parse(storedActs);

    const storedProjs = localStorage.getItem('ck_portfolio_projects');
    if (storedProjs) portfolioData.projects = JSON.parse(storedProjs);

  } catch (e) {
    console.error('Error loading custom dev data:', e);
  }
}

function syncLocalStorage() {
  try {
    localStorage.setItem('ck_portfolio_education', JSON.stringify(portfolioData.education));
    localStorage.setItem('ck_portfolio_certificates', JSON.stringify(portfolioData.certificates));
    localStorage.setItem('ck_portfolio_activities', JSON.stringify(portfolioData.activities));
    localStorage.setItem('ck_portfolio_projects', JSON.stringify(portfolioData.projects));
    if (portfolioData.personalInfo) {
      localStorage.setItem('ck_custom_profile', JSON.stringify(portfolioData.personalInfo));
    }
  } catch (e) {
    console.error('Error syncing local storage:', e);
  }
}

function checkAuth() {
  const isAuth = sessionStorage.getItem('dev_auth') === 'true';
  const loginScreen = document.getElementById('loginScreen');
  const adminDashboard = document.getElementById('adminDashboard');
  const authHeaderControls = document.getElementById('authHeaderControls');

  if (isAuth) {
    if (loginScreen) loginScreen.classList.add('hidden');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    if (authHeaderControls) authHeaderControls.classList.remove('hidden');

    loadProfileForm();
    renderAllAdminLists();
    updateCodeViewer();
    initFirebaseUI();
  } else {
    if (loginScreen) loginScreen.classList.remove('hidden');
    if (adminDashboard) adminDashboard.classList.add('hidden');
    if (authHeaderControls) authHeaderControls.classList.add('hidden');
  }
}

function initAdminEventListeners() {
  // Login Form
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('adminUser').value.trim();
      const p = document.getElementById('adminPass').value.trim();
      const err = document.getElementById('adminLoginErr');

      if (u === DEV_USER && p === DEV_PASS) {
        sessionStorage.setItem('dev_auth', 'true');
        if (err) err.classList.add('hidden');
        checkAuth();
      } else {
        if (err) err.classList.remove('hidden');
      }
    });
  }

  // Profile Save Form
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSave);
  }

  // Avatar Image Upload File Listener
  const avatarFileInput = document.getElementById('avatarFileInput');
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', handleAvatarFileUpload);
  }

  // Avatar URL Input Listener
  const avatarUrlInput = document.getElementById('avatarUrlInput');
  if (avatarUrlInput) {
    avatarUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        const preview = document.getElementById('avatarPreview');
        if (preview) preview.src = url;
      }
    });
  }

  // Forms Submissions
  const eduForm = document.getElementById('adminEduForm');
  if (eduForm) eduForm.addEventListener('submit', handleAddEdu);

  const certForm = document.getElementById('adminCertForm');
  if (certForm) certForm.addEventListener('submit', handleAddCert);

  const actForm = document.getElementById('adminActForm');
  if (actForm) actForm.addEventListener('submit', handleAddAct);

  const projForm = document.getElementById('adminProjForm');
  if (projForm) projForm.addEventListener('submit', handleAddProj);
}

window.handleDevLogout = function() {
  sessionStorage.removeItem('dev_auth');
  checkAuth();
};

/* ==========================================
   Firebase Integration & UI Status
   ========================================== */
function initFirebaseUI() {
  const jsonInput = document.getElementById('firebaseConfigJsonInput');
  const savedConfig = localStorage.getItem('ck_firebase_config');

  if (jsonInput) {
    if (savedConfig) {
      try {
        jsonInput.value = JSON.stringify(JSON.parse(savedConfig), null, 2);
      } catch {
        jsonInput.value = savedConfig;
      }
    } else if (typeof DEFAULT_FIREBASE_CONFIG !== 'undefined') {
      jsonInput.value = JSON.stringify(DEFAULT_FIREBASE_CONFIG, null, 2);
    }
  }

  updateFirebaseStatusBadge();
}

function updateFirebaseStatusBadge() {
  const badge = document.getElementById('firebaseStatusBadge');
  if (!badge) return;

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    badge.textContent = '🔥 เชื่อมต่อ Google Firebase แล้ว (Cloud Sync)';
    badge.className = 'text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700';
  } else {
    badge.textContent = 'ยังไม่ได้เชื่อมต่อ (ใช้ LocalStorage)';
    badge.className = 'text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
  }
}

window.saveFirebaseSettings = function() {
  const inputVal = document.getElementById('firebaseConfigJsonInput').value.trim();
  if (!inputVal) {
    localStorage.removeItem('ck_firebase_config');
    showNotice('ลบการตั้งค่า Firebase แล้ว');
    updateFirebaseStatusBadge();
    return;
  }

  try {
    let configObj = null;
    if (inputVal.startsWith('{')) {
      configObj = JSON.parse(inputVal);
    } else if (inputVal.includes('apiKey')) {
      // Parse object snippet if copied directly from Firebase Console JS snippet
      const cleanJson = inputVal
        .replace(/const firebaseConfig =/g, '')
        .replace(/;/g, '')
        .trim();
      configObj = eval(`(${cleanJson})`);
    }

    if (configObj && configObj.apiKey) {
      localStorage.setItem('ck_firebase_config', JSON.stringify(configObj));
      if (typeof initFirebase === 'function') {
        initFirebase();
      }
      updateFirebaseStatusBadge();
      showNotice('บันทึกค่า Firebase Config เรียบร้อยแล้ว!');
    } else {
      alert('❌ โครงสร้าง Firebase Config ไม่ถูกต้อง กรุณาตรวจสอบ apiKey หรือ JSON');
    }
  } catch (err) {
    alert('❌ ไม่สามารถอ่านค่า Firebase Config ได้ กรุณาตรวจสอบรูปแบบ JSON');
  }
};

window.testFirebaseConnection = async function() {
  saveFirebaseSettings();
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    const profile = await fetchFirebaseProfile();
    alert('✅ เชื่อมต่อ Google Firebase สำเร็จเรียบร้อยแล้ว!');
  } else {
    alert('❌ ไม่สามารถเชื่อมต่อ Firebase ได้ กรุณาตรวจสอบ Config JSON');
  }
};

/* ==========================================
   Tab Switcher Logic
   ========================================== */
window.showAdminTab = function(tabName) {
  const tabs = document.querySelectorAll('.admin-tab-content');
  const btns = document.querySelectorAll('.admin-side-btn');

  tabs.forEach(t => t.classList.add('hidden'));
  btns.forEach(b => {
    b.classList.remove('active', 'bg-slate-800', 'text-slate-100');
    b.classList.add('text-slate-400');
  });

  const targetTab = document.getElementById(`adminTab-${tabName}`);
  const targetBtn = document.getElementById(`sideBtn-${tabName}`);

  if (targetTab) targetTab.classList.remove('hidden');
  if (targetBtn) {
    targetBtn.classList.add('active', 'bg-slate-800', 'text-slate-100');
    targetBtn.classList.remove('text-slate-400');
  }

  if (tabName === 'backup') {
    updateCodeViewer();
  }
};

/* ==========================================
   Profile Management
   ========================================== */
function loadProfileForm() {
  const info = portfolioData.personalInfo;

  if (document.getElementById('profNameTh')) document.getElementById('profNameTh').value = info.nameTh || '';
  if (document.getElementById('profNameEn')) document.getElementById('profNameEn').value = info.nameEn || '';
  if (document.getElementById('profNickname')) document.getElementById('profNickname').value = info.nickname || '';
  if (document.getElementById('profRole')) document.getElementById('profRole').value = info.role || '';
  if (document.getElementById('profUniversity')) document.getElementById('profUniversity').value = info.university || '';
  if (document.getElementById('profDegree')) document.getElementById('profDegree').value = info.degree || '';
  if (document.getElementById('profEmail')) document.getElementById('profEmail').value = info.email || '';
  if (document.getElementById('profPhone')) document.getElementById('profPhone').value = info.phone || '';
  if (document.getElementById('profLocation')) document.getElementById('profLocation').value = info.location || '';
  if (document.getElementById('profBio')) document.getElementById('profBio').value = info.bio || '';

  const avatarUrl = info.avatarImage || 'assets/images/profile-avatar.svg';
  if (document.getElementById('avatarUrlInput')) document.getElementById('avatarUrlInput').value = avatarUrl;
  if (document.getElementById('avatarPreview')) document.getElementById('avatarPreview').src = avatarUrl;
}

function compressImageFile(file, maxDimension = 500, quality = 0.82) {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ file, dataUrl: e.target.result });
      reader.onerror = () => resolve({ file, dataUrl: null });
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/webp', quality);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ file, dataUrl });
            return;
          }
          const compressedFile = new File([blob], (file.name || 'avatar').replace(/\.[^/.]+$/, "") + ".webp", {
            type: "image/webp",
            lastModified: Date.now(),
          });
          resolve({ file: compressedFile, dataUrl });
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const reader = new FileReader();
      reader.onload = (e) => resolve({ file, dataUrl: e.target.result });
      reader.onerror = () => resolve({ file, dataUrl: null });
      reader.readAsDataURL(file);
    };
  });
}

async function handleAvatarFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file type & size (max 8MB)
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    showNotice('❌ รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WebP, GIF, SVG) เท่านั้น', true);
    return;
  }
  if (file.size > 8 * 1024 * 1024) {
    showNotice('❌ ไฟล์รูปภาพมีขนาดใหญ่เกิน 8MB กรุณาเลือกไฟล์ที่เล็กลง', true);
    return;
  }

  const preview = document.getElementById('avatarPreview');
  const urlInput = document.getElementById('avatarUrlInput');
  const fileInput = document.getElementById('avatarFileInput');
  if (fileInput) fileInput.disabled = true;

  showNotice('⏳ กำลังปรับขนาดและประมวลผลรูปภาพ...');

  // Compress client-side
  const { file: processedFile, dataUrl } = await compressImageFile(file, 500, 0.82);

  // Set instant preview
  if (dataUrl) {
    if (preview) preview.src = dataUrl;
    if (urlInput) urlInput.value = dataUrl;
  }

  // Try Firebase Storage upload
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    showNotice('⏳ กำลังอัปโหลดไปยัง Google Firebase Storage...');
    try {
      const cloudUrl = await uploadFirebaseImage(processedFile, 'avatars');
      if (cloudUrl) {
        if (preview) preview.src = cloudUrl;
        if (urlInput) urlInput.value = cloudUrl;
        if (fileInput) fileInput.disabled = false;
        showNotice('✅ อัปโหลดขึ้น Firebase Storage สำเร็จ! กด "บันทึกข้อมูลโปรไฟล์" เพื่อบันทึกถาวร');
        return;
      }
    } catch (err) {
      console.warn('[Avatar Upload] Firebase Storage upload error:', err);
      const errCode = err.code || err.message || '';
      let errDetail = 'กรุณาตรวจสอบ Storage Rules หรือเปิดใช้งาน Storage ใน Firebase Console';
      if (errCode.includes('unauthorized') || errCode.includes('permission')) {
        errDetail = 'Storage Rules ยังไม่อนุญาตให้อัปโหลด (unauthorized)';
      } else if (errCode.includes('not-found')) {
        errDetail = 'ยังไม่ได้เปิดใช้งาน Storage ใน Firebase Console (bucket not found)';
      }

      showNotice(`⚠️ Firebase Storage: ${errDetail}<br><span class="text-[11px] opacity-80">💡 ระบบได้บีบอัดรูปภาพและเก็บไว้ในฟอร์มให้แล้ว กด <b>"บันทึกข้อมูลโปรไฟล์"</b> เพื่อบันทึกลง Firestore ได้ทันที</span>`, true);
    }
  } else {
    showNotice('✅ โหลดรูปภาพเรียบร้อย (กด <b>"บันทึกข้อมูลโปรไฟล์"</b> เพื่อบันทึก)');
  }

  if (fileInput) fileInput.disabled = false;
}

window.resetDefaultAvatar = function() {
  const defaultPath = 'assets/images/profile-avatar.svg';
  if (document.getElementById('avatarPreview')) document.getElementById('avatarPreview').src = defaultPath;
  if (document.getElementById('avatarUrlInput')) document.getElementById('avatarUrlInput').value = defaultPath;
};

async function handleProfileSave(e) {
  e.preventDefault();

  const updatedProfile = {
    nameTh: document.getElementById('profNameTh').value.trim(),
    nameEn: document.getElementById('profNameEn').value.trim(),
    nickname: document.getElementById('profNickname').value.trim(),
    role: document.getElementById('profRole').value.trim(),
    university: document.getElementById('profUniversity').value.trim(),
    degree: document.getElementById('profDegree').value.trim(),
    email: document.getElementById('profEmail').value.trim(),
    phone: document.getElementById('profPhone').value.trim(),
    location: document.getElementById('profLocation').value.trim(),
    bio: document.getElementById('profBio').value.trim(),
    avatarImage: document.getElementById('avatarUrlInput').value.trim() || 'assets/images/profile-avatar.svg'
  };

  portfolioData.personalInfo = { ...portfolioData.personalInfo, ...updatedProfile };
  syncLocalStorage();

  // Sync to Firebase Cloud if configured
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    const ok = await saveFirebaseProfile(portfolioData.personalInfo);
    if (ok) {
      showNotice('บันทึกข้อมูลโปรไฟล์และซิงค์ไปยัง Firebase Cloud เรียบร้อยแล้ว!');
    } else {
      showNotice('บันทึกในเครื่องเรียบร้อยแล้ว (ไม่สามารถซิงค์ไป Firebase ได้)');
    }
  } else {
    showNotice('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว (เก็บใน LocalStorage)');
  }

  updateCodeViewer();
}

/* ==========================================
   Content Handlers (Add / Delete)
   ========================================== */
async function handleAddEdu(e) {
  e.preventDefault();
  const newItem = {
    period: document.getElementById('eduPeriod').value.trim(),
    degree: document.getElementById('eduDegree').value.trim(),
    major: document.getElementById('eduMajor').value.trim(),
    institution: document.getElementById('eduInst').value.trim(),
    description: document.getElementById('eduDesc').value.trim() || '',
    highlights: ['อัปเดตจากระบบ Dev Portal']
  };

  portfolioData.education.unshift(newItem);
  syncLocalStorage();

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseEducationList(portfolioData.education);
  }

  renderAllAdminLists();
  document.getElementById('adminEduForm').reset();
  showNotice('เพิ่มประวัติการศึกษาใหม่เรียบร้อยแล้ว!');
}

async function handleAddCert(e) {
  e.preventDefault();
  const newItem = {
    id: `cert-${Date.now()}`,
    title: document.getElementById('certTitleInput').value.trim(),
    organization: document.getElementById('certOrgInput').value.trim(),
    date: document.getElementById('certDateInput').value.trim(),
    category: document.getElementById('certCatInput').value.trim(),
    badge: document.getElementById('certBadgeInput').value.trim() || 'เกียรติบัตร',
    file: document.getElementById('certFileInput').value.trim() || '#',
    icon: 'fa-certificate',
    description: document.getElementById('certDescInput').value.trim() || ''
  };

  portfolioData.certificates.unshift(newItem);
  syncLocalStorage();

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseCertificateList(portfolioData.certificates);
  }

  renderAllAdminLists();
  document.getElementById('adminCertForm').reset();
  showNotice('เพิ่มเกียรติบัตรใหม่เรียบร้อยแล้ว!');
}

async function handleAddAct(e) {
  e.preventDefault();
  const newItem = {
    id: `act-${Date.now()}`,
    title: document.getElementById('actTitleInput').value.trim(),
    organization: document.getElementById('actOrgInput').value.trim(),
    date: document.getElementById('actDateInput').value.trim(),
    badge: document.getElementById('actBadgeInput').value.trim() || 'กิจกรรม',
    description: document.getElementById('actDescInput').value.trim() || ''
  };

  portfolioData.activities.unshift(newItem);
  syncLocalStorage();

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseActivityList(portfolioData.activities);
  }

  renderAllAdminLists();
  document.getElementById('adminActForm').reset();
  showNotice('เพิ่มกิจกรรมใหม่เรียบร้อยแล้ว!');
}

async function handleAddProj(e) {
  e.preventDefault();
  const tagsStr = document.getElementById('projTagsInput').value.trim();
  const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : ['Project'];

  const newItem = {
    id: Date.now(),
    title: document.getElementById('projTitleInput').value.trim(),
    englishTitle: document.getElementById('projEngTitleInput').value.trim() || 'Project',
    category: document.getElementById('projCatInput').value,
    categoryName: document.getElementById('projCatInput').value === 'iot' ? 'IoT & Embedded' : (document.getElementById('projCatInput').value === 'network' ? 'Network & Systems' : 'Software & Web'),
    image: 'assets/images/project-web.svg',
    summary: document.getElementById('projSummaryInput').value.trim(),
    description: document.getElementById('projDescInput').value.trim() || '',
    tags: tags,
    date: document.getElementById('projDateInput').value.trim() || '2026',
    github: '#',
    demo: '#'
  };

  portfolioData.projects.unshift(newItem);
  syncLocalStorage();

  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseProjectList(portfolioData.projects);
  }

  renderAllAdminLists();
  document.getElementById('adminProjForm').reset();
  showNotice('เพิ่มโปรเจกต์ใหม่เรียบร้อยแล้ว!');
}

/* ==========================================
   Render Admin Lists
   ========================================== */
function renderAllAdminLists() {
  // Education List
  const eduContainer = document.getElementById('eduListContainer');
  if (eduContainer) {
    eduContainer.innerHTML = portfolioData.education.map((item, idx) => `
      <div class="glass-panel p-4 rounded-xl flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-slate-100">${item.degree}</span> - <span class="text-slate-300">${item.institution}</span>
          <span class="text-[11px] text-slate-400 block">${item.major} (${item.period})</span>
        </div>
        <button onclick="deleteEduItem(${idx})" class="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors">
          <i class="fas fa-trash-alt mr-1"></i> ลบ
        </button>
      </div>
    `).join('');
  }

  // Certificates List
  const certContainer = document.getElementById('certListContainer');
  if (certContainer) {
    certContainer.innerHTML = portfolioData.certificates.map((item, idx) => `
      <div class="glass-panel p-4 rounded-xl flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-slate-100">${item.title}</span>
          <span class="text-[11px] text-slate-400 block">${item.organization} • ${item.date}</span>
        </div>
        <button onclick="deleteCertItem(${idx})" class="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors">
          <i class="fas fa-trash-alt mr-1"></i> ลบ
        </button>
      </div>
    `).join('');
  }

  // Activities List
  const actContainer = document.getElementById('actListContainer');
  if (actContainer) {
    actContainer.innerHTML = portfolioData.activities.map((item, idx) => `
      <div class="glass-panel p-4 rounded-xl flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-slate-100">${item.title}</span>
          <span class="text-[11px] text-slate-400 block">${item.organization} • ${item.date}</span>
        </div>
        <button onclick="deleteActItem(${idx})" class="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors">
          <i class="fas fa-trash-alt mr-1"></i> ลบ
        </button>
      </div>
    `).join('');
  }

  // Projects List
  const projContainer = document.getElementById('projListContainer');
  if (projContainer) {
    projContainer.innerHTML = portfolioData.projects.map((item, idx) => `
      <div class="glass-panel p-4 rounded-xl flex items-center justify-between text-xs">
        <div>
          <span class="font-bold text-slate-100">${item.title}</span>
          <span class="text-[11px] text-slate-400 block">${item.categoryName} (${item.date})</span>
        </div>
        <button onclick="deleteProjItem(${idx})" class="px-2.5 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors">
          <i class="fas fa-trash-alt mr-1"></i> ลบ
        </button>
      </div>
    `).join('');
  }

  updateCodeViewer();
}

window.deleteEduItem = async function(idx) {
  if (!confirm('ยืนยันลบรายการการศึกษานี้?')) return;
  portfolioData.education.splice(idx, 1);
  syncLocalStorage();
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseEducationList(portfolioData.education);
  }
  renderAllAdminLists();
  showNotice('ลบรายการการศึกษาเรียบร้อยแล้ว');
};

window.deleteCertItem = async function(idx) {
  if (!confirm('ยืนยันลบเกียรติบัตรนี้?')) return;
  portfolioData.certificates.splice(idx, 1);
  syncLocalStorage();
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseCertificateList(portfolioData.certificates);
  }
  renderAllAdminLists();
  showNotice('ลบเกียรติบัตรเรียบร้อยแล้ว');
};

window.deleteActItem = async function(idx) {
  if (!confirm('ยืนยันลบกิจกรรมนี้?')) return;
  portfolioData.activities.splice(idx, 1);
  syncLocalStorage();
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseActivityList(portfolioData.activities);
  }
  renderAllAdminLists();
  showNotice('ลบกิจกรรมเรียบร้อยแล้ว');
};

window.deleteProjItem = async function(idx) {
  if (!confirm('ยืนยันลบโปรเจกต์นี้?')) return;
  portfolioData.projects.splice(idx, 1);
  syncLocalStorage();
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    await saveFirebaseProjectList(portfolioData.projects);
  }
  renderAllAdminLists();
  showNotice('ลบโปรเจกต์เรียบร้อยแล้ว');
};

/* ==========================================
   Backup & Export Code
   ========================================== */
function updateCodeViewer() {
  const viewer = document.getElementById('dataJsCodeViewer');
  if (viewer) {
    viewer.value = `/**\n * Chamil Kalong - Personal Portfolio Data\n * มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย สงขลา\n */\n\nconst portfolioData = ${JSON.stringify(portfolioData, null, 2)};`;
  }
}

window.copyDataJsCode = function() {
  const viewer = document.getElementById('dataJsCodeViewer');
  if (viewer) {
    navigator.clipboard.writeText(viewer.value).then(() => {
      showNotice('คัดลอกโค้ด data.js เรียบร้อยแล้ว! นำไปวางทับในไฟล์ assets/js/data.js ได้เลย');
    });
  }
};

window.downloadDataJsFile = function() {
  const viewer = document.getElementById('dataJsCodeViewer');
  if (!viewer) return;

  const blob = new Blob([viewer.value], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  a.click();
  URL.revokeObjectURL(url);
  showNotice('ดาวน์โหลดไฟล์ data.js เรียบร้อยแล้ว!');
};

window.resetAllDataToDefault = function() {
  if (!confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับคืนค่าเริ่มต้น (Default State) หรือไม่?')) return;
  localStorage.removeItem('ck_custom_profile');
  localStorage.removeItem('ck_portfolio_education');
  localStorage.removeItem('ck_portfolio_certificates');
  localStorage.removeItem('ck_portfolio_activities');
  localStorage.removeItem('ck_portfolio_projects');
  localStorage.removeItem('ck_custom_certs');
  localStorage.removeItem('ck_custom_activities');
  localStorage.removeItem('ck_custom_projects');
  localStorage.removeItem('ck_custom_education');
  localStorage.removeItem('ck_firebase_config');
  alert('รีเซ็ตข้อมูลทั้งหมดกลับคืนค่าเริ่มต้นแล้ว!');
  location.reload();
};

let _noticeTimeout = null;
function showNotice(msg, isError = false) {
  const notice = document.getElementById('adminNotice');
  const text = document.getElementById('adminNoticeText');
  if (notice && text) {
    if (_noticeTimeout) clearTimeout(_noticeTimeout);
    text.innerHTML = msg;
    if (isError) {
      notice.className = 'p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all bg-rose-950/90 border-rose-600 text-rose-200 shadow-xl';
    } else {
      notice.className = 'p-4 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all bg-emerald-950/90 border-emerald-600 text-emerald-200 shadow-xl';
    }
    notice.classList.remove('hidden');
    _noticeTimeout = setTimeout(() => {
      notice.classList.add('hidden');
    }, isError ? 8000 : 4000);
  }
}

window.hideNotice = function() {
  const notice = document.getElementById('adminNotice');
  if (notice) notice.classList.add('hidden');
};
