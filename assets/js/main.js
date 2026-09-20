/**
 * Chamil Kalong - Personal Portfolio Main JavaScript
 * Handles dynamic data rendering, theme switching, category filtering,
 * modal dialogs, smooth scrolling, and form interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  loadCustomDevData();
  initTheme();
  renderHeroAndAbout();
  renderEducation();
  renderSkills();
  renderProjects('all');
  renderActivities();
  renderCertificates();
  initNavigation();
  initContactForm();
  initBackToTop();
  initDevPortal();
  initScrollAnimations();
  initIoTSimulator();
  initLanguage();
});

/* ==========================================
   Language Toggle (TH / EN)
   ========================================== */
const _i18n = {
  th: {
    // Nav
    nav_home: 'หน้าแรก', nav_about: 'เกี่ยวกับ', nav_education: 'การศึกษา',
    nav_skills: 'ทักษะ', nav_projects: 'ผลงาน', nav_lab: 'ทดลอง IoT',
    nav_certs: 'เกียรติบัตร', nav_contact: 'ติดต่อ',
    // Hero
    hero_role: 'นักศึกษาชั้นปีที่ 2 · วิศวกรรมไฟฟ้า วิชาเอกเทคนิคคอมพิวเตอร์',
    hero_bio: portfolioData?.personalInfo?.bio || '',
    // Section headings
    sec_about: 'เกี่ยวกับฉัน', sec_education: 'ประวัติการศึกษา',
    sec_skills: 'ทักษะและความสามารถ', sec_projects: 'ผลงานโครงงาน',
    sec_activities: 'กิจกรรมและผลงานประทับใจ', sec_certs: 'เกียรติบัตรและวุฒิบัตรรับรอง',
    sec_contact: 'ช่องทางการติดต่อ',
    sec_lab: 'ห้องทดลองระบบ IoT & ไมโครคอนโทรลเลอร์จำลอง',
    // About section bio card
    about_university: 'มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย สงขลา (RUTS)',
    // Back to top
    btt: 'กลับขึ้นบน'
  },
  en: {
    nav_home: 'Home', nav_about: 'About', nav_education: 'Education',
    nav_skills: 'Skills', nav_projects: 'Projects', nav_lab: 'IoT Lab',
    nav_certs: 'Certificates', nav_contact: 'Contact',
    hero_role: 'Year 2 Student · Electrical Engineering, Computer Technology Major',
    hero_bio: 'I am a 2nd-year Bachelor of Industrial Education student, majoring in Computer Technology at RUTS Songkhla. Passionate about IoT, Embedded Systems, Networking, and Software Development.',
    sec_about: 'About Me', sec_education: 'Education History',
    sec_skills: 'Skills & Expertise', sec_projects: 'Projects',
    sec_activities: 'Activities & Achievements', sec_certs: 'Certificates & Credentials',
    sec_contact: 'Contact',
    sec_lab: 'IoT & Microcontroller Interactive Lab',
    about_university: 'Rajamangala University of Technology Srivijaya, Songkhla',
    btt: 'Back to Top'
  }
};

let _currentLang = localStorage.getItem('ck-portfolio-lang') || 'th';

function initLanguage() {
  _applyLanguage(_currentLang);
}

function toggleLanguage() {
  _currentLang = _currentLang === 'th' ? 'en' : 'th';
  localStorage.setItem('ck-portfolio-lang', _currentLang);
  _applyLanguage(_currentLang);
}

function _applyLanguage(lang) {
  const t = _i18n[lang];

  // Update label button
  const labelEl = document.getElementById('langLabel');
  if (labelEl) labelEl.textContent = lang === 'th' ? 'TH' : 'EN';

  // Update nav links with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  const info = portfolioData?.personalInfo || {};

  // Hero name
  const nameEl = document.getElementById('heroName');
  if (nameEl) nameEl.textContent = lang === 'th'
    ? (info.nameTh || 'ชามิล กาหลง')
    : (info.nameEn || 'Chamil Kalong');

  // Hero role
  const roleEl = document.getElementById('heroRole');
  if (roleEl) roleEl.textContent = (lang === 'th' ? info.role : info.roleEn) || t.hero_role;

  // Hero bio
  const bioEl = document.getElementById('heroBio');
  if (bioEl) bioEl.textContent = (lang === 'th' ? info.bio : info.bioEn) || t.hero_bio;

  // Hero university
  const uniEl = document.getElementById('heroUniversity');
  if (uniEl) uniEl.textContent = (lang === 'th' ? info.university : info.universityEn) || t.about_university;

  // Section headings (h3 with data-i18n-section)
  const sectionMap = {
    about: 'sec_about', education: 'sec_education', skills: 'sec_skills',
    projects: 'sec_projects', 'tech-lab': 'sec_lab', activities: 'sec_activities',
    certificates: 'sec_certs', contact: 'sec_contact'
  };
  Object.entries(sectionMap).forEach(([id, key]) => {
    const sec = document.getElementById(id);
    if (sec && t[key]) {
      const h3 = sec.querySelector('h3');
      if (h3) h3.textContent = t[key];
    }
  });
}



/* ==========================================
   IoT Simulator - Tech Lab Section
   ========================================== */
const _iotState = {
  relay1: false,
  relay2: false,
  voltage: 220.4,
  current: 1.85,
  overload: false,
  overloadTimeout: null,
  intervalId: null
};

function initIoTSimulator() {
  _iotUpdateDisplay();
  _iotState.intervalId = setInterval(_iotTickSensor, 1500);
}

function _iotTickSensor() {
  if (_iotState.overload) return; // overload mode handles its own updates

  // Simulate natural fluctuation
  const activeRelays = (_iotState.relay1 ? 1 : 0) + (_iotState.relay2 ? 1 : 0);
  const baseLoad = 0.3 + activeRelays * 0.85;

  _iotState.voltage = parseFloat((220 + (Math.random() - 0.5) * 1.2).toFixed(1));
  _iotState.current = parseFloat((baseLoad + (Math.random() - 0.5) * 0.15).toFixed(2));
  _iotUpdateDisplay();
}

function _iotUpdateDisplay() {
  const power = parseFloat((_iotState.voltage * _iotState.current).toFixed(1));
  const vEl = document.getElementById('simVoltageVal');
  const aEl = document.getElementById('simCurrentVal');
  const wEl = document.getElementById('simPowerVal');

  if (vEl) vEl.textContent = _iotState.voltage.toFixed(1) + ' V';
  if (aEl) aEl.textContent = _iotState.current.toFixed(2) + ' A';
  if (wEl) wEl.textContent = power + ' W';

  // Color coding: overload = red blink
  if (_iotState.overload) {
    if (aEl) aEl.classList.replace('text-emerald-400', 'text-red-400');
    if (wEl) wEl.classList.replace('text-cyan-400', 'text-red-400');
  } else {
    if (aEl) { aEl.classList.remove('text-red-400'); aEl.classList.add('text-emerald-400'); }
    if (wEl) { wEl.classList.remove('text-red-400'); wEl.classList.add('text-cyan-400'); }
  }
}

function toggleRelay(num) {
  const isOn = num === 1 ? (_iotState.relay1 = !_iotState.relay1) : (_iotState.relay2 = !_iotState.relay2);
  const iconEl = document.getElementById('relayIcon' + num);
  const statusEl = document.getElementById('relayStatus' + num);

  if (isOn) {
    iconEl.classList.replace('bg-slate-800', 'bg-emerald-900');
    iconEl.classList.replace('border-slate-700', 'border-emerald-500');
    iconEl.classList.replace('text-slate-500', 'text-emerald-400');
    statusEl.textContent = 'STATUS: ON ✔';
    statusEl.classList.replace('text-slate-500', 'text-emerald-400');
  } else {
    iconEl.classList.replace('bg-emerald-900', 'bg-slate-800');
    iconEl.classList.replace('border-emerald-500', 'border-slate-700');
    iconEl.classList.replace('text-emerald-400', 'text-slate-500');
    statusEl.textContent = 'STATUS: OFF';
    statusEl.classList.replace('text-emerald-400', 'text-slate-500');
  }

  // Immediately update load simulation
  _iotTickSensor();
}

function triggerOverloadSim() {
  if (_iotState.overload) return;
  _iotState.overload = true;

  const aEl = document.getElementById('simCurrentVal');
  const wEl = document.getElementById('simPowerVal');

  // Show spike
  _iotState.voltage = parseFloat((218 + Math.random()).toFixed(1));
  _iotState.current = parseFloat((15 + Math.random() * 5).toFixed(2));
  _iotUpdateDisplay();

  // Blink animation for 3s then recover
  let blink = 0;
  const blinkInterval = setInterval(() => {
    blink++;
    const v = document.getElementById('simVoltageVal');
    if (v) v.style.opacity = blink % 2 === 0 ? '1' : '0.3';
    if (aEl) aEl.style.opacity = blink % 2 === 0 ? '1' : '0.3';
    if (wEl) wEl.style.opacity = blink % 2 === 0 ? '1' : '0.3';
  }, 300);

  // Recover after 4s
  _iotState.overloadTimeout = setTimeout(() => {
    clearInterval(blinkInterval);
    _iotState.overload = false;
    _iotState.voltage = 220.2;
    _iotState.current = 1.80;
    const v = document.getElementById('simVoltageVal');
    if (v) v.style.opacity = '1';
    if (aEl) aEl.style.opacity = '1';
    if (wEl) wEl.style.opacity = '1';
    _iotUpdateDisplay();
  }, 4000);
}

/* ==========================================
   1. Theme Toggle Management (Dark/Light Gray)
   ========================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('ck-portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('ck-portfolio-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun text-yellow-400 text-lg';
    } else {
      themeIcon.className = 'fas fa-moon text-slate-700 text-lg';
    }
  }
}

/* ==========================================
   2. Hero & About Section Rendering
   ========================================== */
function renderHeroAndAbout() {
  const info = portfolioData.personalInfo;

  // Hero Texts & Avatar
  const heroName = document.getElementById('heroName');
  const heroRole = document.getElementById('heroRole');
  const heroUniversity = document.getElementById('heroUniversity');
  const heroBio = document.getElementById('heroBio');
  const heroAvatarImg = document.getElementById('heroAvatarImg');

  if (heroName) heroName.textContent = info.nameTh;
  if (heroRole) heroRole.textContent = `${info.role}`;
  if (heroUniversity) heroUniversity.textContent = info.university;
  if (heroBio) heroBio.textContent = info.bio;
  if (heroAvatarImg && info.avatarImage) heroAvatarImg.src = info.avatarImage;

  // Stats Grid in About Section
  const statsContainer = document.getElementById('aboutStatsGrid');
  if (statsContainer) {
    statsContainer.innerHTML = info.stats.map(stat => `
      <div class="glass-panel p-5 rounded-2xl text-center flex flex-col items-center justify-center">
        <div class="w-12 h-12 rounded-xl bg-slate-700/40 border border-slate-600 flex items-center justify-center mb-3">
          <i class="fas ${stat.icon} text-slate-200 text-xl"></i>
        </div>
        <h4 class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">${stat.label}</h4>
        <p class="text-base font-semibold text-slate-100">${stat.value}</p>
      </div>
    `).join('');
  }

  // Social Links
  const socialContainer = document.getElementById('heroSocialLinks');
  if (socialContainer) {
    socialContainer.innerHTML = `
      <a href="${info.socials.github}" target="_blank" aria-label="GitHub" class="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-400 transition-all">
        <i class="fab fa-github text-lg"></i>
      </a>
      <a href="${info.socials.linkedin}" target="_blank" aria-label="LinkedIn" class="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-400 transition-all">
        <i class="fab fa-linkedin-in text-lg"></i>
      </a>
      <a href="${info.socials.facebook}" target="_blank" aria-label="Facebook" class="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-400 transition-all">
        <i class="fab fa-facebook-f text-lg"></i>
      </a>
      <a href="${info.socials.emailLink}" aria-label="Email" class="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-400 transition-all">
        <i class="fas fa-envelope text-lg"></i>
      </a>
    `;
  }
}

/* ==========================================
   3. Education Timeline Rendering
   ========================================== */
function renderEducation() {
  const container = document.getElementById('educationTimeline');
  if (!container) return;

  container.innerHTML = portfolioData.education.map((item, index) => {
    const isEven = index % 2 === 0;
    return `
      <div class="relative mb-8 last:mb-0 md:w-1/2 ${isEven ? 'md:ml-auto md:pl-10' : 'md:mr-auto md:pr-10 md:text-right'} pl-10 md:pl-0">
        <div class="timeline-dot"></div>
        <div class="glass-panel p-5 rounded-2xl relative">
          <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-slate-700/60 border border-slate-600 text-slate-200 mb-2">
            <i class="far fa-calendar-alt mr-1"></i> ${item.period}
          </span>
          <h3 class="text-base font-bold text-slate-100 mb-1">${item.degree}</h3>
          <h4 class="text-sm font-semibold text-slate-300 mb-1">${item.major}</h4>
          <p class="text-xs font-medium text-slate-400"><i class="fas fa-university mr-1"></i> ${item.institution}</p>
        </div>
      </div>
    `;
  }).join('');
}

/* ==========================================
   4. Skills & Expertise Rendering
   ========================================== */
function renderSkills() {
  const container = document.getElementById('skillsContainer');
  if (!container) return;

  container.innerHTML = portfolioData.skillCategories.map(category => `
    <div class="glass-panel p-6 rounded-2xl">
      <h3 class="text-lg font-bold text-slate-100 mb-6 flex items-center border-b border-slate-700/60 pb-3">
        <span class="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center mr-3 text-slate-300">
          <i class="fas fa-layer-group text-sm"></i>
        </span>
        ${category.title}
      </h3>
      <div class="space-y-5">
        ${category.skills.map(skill => `
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-sm font-medium text-slate-200 flex items-center">
                <i class="${skill.icon.includes(' ') ? skill.icon : 'fas ' + skill.icon} text-slate-400 w-5 mr-2"></i>
                ${skill.name}
              </span>
              <span class="text-xs font-semibold text-slate-400">${skill.level}%</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" data-level="${skill.level}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Animate progress bars when in viewport
  setTimeout(animateProgressBars, 200);
}

function animateProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill');
  bars.forEach(bar => {
    const level = bar.getAttribute('data-level');
    bar.style.width = `${level}%`;
  });
}

/* ==========================================
   5. Projects Showcase & Filter Logic
   ========================================== */
function renderProjects(filter = 'all') {
  const container = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!container) return;

  // Update active filter button
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const filteredData = filter === 'all' 
    ? portfolioData.projects 
    : portfolioData.projects.filter(p => p.category === filter);

  if (filteredData.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 glass-panel rounded-2xl">
        <p class="text-slate-400 text-base">ไม่พบผลงานในหมวดหมู่นี้</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredData.map(project => `
    <div class="glass-panel rounded-2xl overflow-hidden group flex flex-col justify-between">
      <div>
        <div class="relative overflow-hidden h-48 bg-slate-900 flex items-center justify-center border-b border-slate-700/50">
          <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-medium">
            ${project.categoryName}
          </span>
        </div>
        <div class="p-6">
          <div class="flex items-center text-xs text-slate-400 mb-2">
            <i class="far fa-calendar mr-1"></i> ${project.date}
          </div>
          <h3 class="text-lg font-bold text-slate-100 mb-2 line-clamp-1 group-hover:text-slate-300 transition-colors">${project.title}</h3>
          <p class="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">${project.summary}</p>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${project.tags.map(tag => `<span class="tag-pill">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="px-6 pb-6 pt-0 flex justify-between items-center border-t border-slate-800/40 pt-4">
        <button onclick="openProjectModal(${project.id})" class="text-xs font-semibold text-slate-300 hover:text-white flex items-center transition-colors">
          ดูรายละเอียดโปรเจกต์ <i class="fas fa-arrow-right ml-1.5 text-xs"></i>
        </button>
      </div>
    </div>
  `).join('');
}

// Attach Event Listeners to Category Buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('filter-btn')) {
    const filter = e.target.getAttribute('data-filter');
    renderProjects(filter);
  }
});

/* ==========================================
   6. Project Modal Popup Detail
   ========================================== */
window.openProjectModal = function(id) {
  const project = portfolioData.projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('projectModalContent');
  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <div class="relative">
      <button onclick="closeProjectModal()" class="absolute top-0 right-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center z-20">
        <i class="fas fa-times"></i>
      </button>
      <div class="h-60 rounded-xl overflow-hidden bg-slate-900 mb-5 relative border border-slate-700">
        <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover" />
      </div>
      <div class="flex items-center text-xs text-slate-400 mb-2 space-x-3">
        <span><i class="far fa-folder mr-1"></i> ${project.categoryName}</span>
        <span>•</span>
        <span><i class="far fa-calendar mr-1"></i> ${project.date}</span>
      </div>
      <h2 class="text-xl font-bold text-slate-100 mb-1">${project.title}</h2>
      <h3 class="text-sm font-medium text-slate-400 mb-4">${project.englishTitle}</h3>
      
      <p class="text-sm text-slate-300 mb-5 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
        ${project.description}
      </p>

      <div class="mb-5">
        <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tech Stack & Tools</h4>
        <div class="flex flex-wrap gap-2">
          ${project.tags.map(t => `<span class="tag-pill font-mono">${t}</span>`).join('')}
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-3 border-t border-slate-800">
        <button onclick="closeProjectModal()" class="btn-secondary-gray text-xs py-2 px-5">
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
};

window.closeProjectModal = function() {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

/* ==========================================
   7. Activities Rendering
   ========================================== */
function renderActivities() {
  const container = document.getElementById('activitiesGrid');
  if (!container) return;

  container.innerHTML = portfolioData.activities.map(act => `
    <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start mb-3">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-700/60 border border-slate-600 text-slate-200">
            ${act.badge}
          </span>
          <span class="text-xs text-slate-400 font-mono"><i class="far fa-clock mr-1"></i> ${act.date}</span>
        </div>
        <h3 class="text-base font-bold text-slate-100 mb-2">${act.title}</h3>
        <p class="text-xs text-slate-400 mb-3"><i class="fas fa-building mr-1.5"></i> ${act.organization}</p>
        <p class="text-xs text-slate-300 leading-relaxed">${act.description}</p>
      </div>
    </div>
  `).join('');
}

/* ==========================================
   7.5 Certificates Rendering
   ========================================== */
function renderCertificates(filter = 'all') {
  const container = document.getElementById('certificatesGrid');
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  if (!container || !portfolioData.certificates) return;

  certFilterBtns.forEach(btn => {
    if (btn.getAttribute('data-cert-filter') === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const filteredData = filter === 'all' 
    ? portfolioData.certificates 
    : portfolioData.certificates.filter(c => 
        (c.category || '').toLowerCase().includes(filter.toLowerCase()) || 
        (c.badge || '').toLowerCase().includes(filter.toLowerCase()) ||
        (c.title || '').toLowerCase().includes(filter.toLowerCase())
      );

  if (filteredData.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 glass-panel rounded-2xl">
        <p class="text-slate-400 text-sm">ไม่พบเกียรติบัตรในหมวดหมู่นี้</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredData.map(cert => `
    <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:border-slate-500 transition-all">
      <div>
        <div class="flex justify-between items-start mb-3">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800 border border-slate-700 text-slate-200 flex items-center gap-1.5">
            <i class="fas ${cert.icon || 'fa-certificate'} text-amber-400"></i>
            ${cert.badge}
          </span>
          <span class="text-[11px] text-slate-400 font-mono"><i class="far fa-calendar-alt mr-1"></i> ${cert.date}</span>
        </div>
        <h3 class="text-base font-bold text-slate-100 mb-2 group-hover:text-slate-200 transition-colors">${cert.title}</h3>
        <p class="text-xs font-semibold text-slate-400 mb-3 flex items-center">
          <i class="fas fa-university text-slate-500 mr-1.5"></i> ${cert.organization}
        </p>
        <p class="text-xs text-slate-300 leading-relaxed mb-4">${cert.description}</p>
      </div>
      <div class="pt-4 border-t border-slate-800 flex justify-between items-center">
        <span class="text-[11px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800/60">${cert.category}</span>
        <a href="${encodeURI(cert.file)}" target="_blank" rel="noopener noreferrer" class="btn-secondary-gray text-xs py-1.5 px-3 inline-flex items-center gap-1.5 hover:bg-slate-700">
          <span>ดูไฟล์ PDF</span>
          <i class="fas fa-file-pdf text-red-400"></i>
        </a>
      </div>
    </div>
  `).join('');
}

/* ==========================================
   8. Navigation, Active Link & Mobile Menu
   ========================================== */
function initNavigation() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close menu when link clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Active Link Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================
   9. Contact Form & Feedback Handling
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim() || 'ข้อความจากเว็บไซต์พอร์ตโฟลิโอ';
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
      alert('กรุณากรอกข้อมูลในช่องที่มีเครื่องหมายให้ครบถ้วน');
      return;
    }

    // Change button state to Loading
    const originalBtnHTML = submitBtn ? submitBtn.innerHTML : 'ส่งข้อความ';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> กำลังส่งข้อความ...`;
    }

    try {
      // Send real email via Web3Forms API to chamil.k@rmutsvmail.com
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '3ccfd5a5-2893-451e-8504-8a14e88c3fc9',
          name: name,
          email: email,
          subject: `[Portfolio] ${subject} - จากคุณ ${name}`,
          message: message
        })
      });

      const result = await response.json();

      showContactSuccessModal(name);
      form.reset();
    } catch (error) {
      console.log('Sending message via Web3Forms:', error);
      showContactSuccessModal(name);
      form.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    }
  });
}

function showContactSuccessModal(name) {
  const modal = document.getElementById('contactSuccessModal');
  if (modal) {
    const nameEl = document.getElementById('modalSenderName');
    if (nameEl) nameEl.textContent = name;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

window.closeContactSuccessModal = function() {
  const modal = document.getElementById('contactSuccessModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

/* ==========================================
   10. Back to Top Button
   ========================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollAnimations() {
  // Simple scroll animation trigger
}

/* ==========================================
   11. Developer Portal & Admin Dashboard System
   ========================================== */
const DEV_USER = 'chamil';
const DEV_PASS = '280225';

async function loadCustomDevData() {
  try {
    const customProfile = JSON.parse(localStorage.getItem('ck_custom_profile') || 'null');
    if (customProfile) {
      portfolioData.personalInfo = { ...portfolioData.personalInfo, ...customProfile };
    }

    const storedEdu = localStorage.getItem('ck_portfolio_education');
    if (storedEdu) {
      portfolioData.education = JSON.parse(storedEdu);
    }

    const storedCerts = localStorage.getItem('ck_portfolio_certificates');
    if (storedCerts) {
      portfolioData.certificates = JSON.parse(storedCerts);
    }

    const storedActs = localStorage.getItem('ck_portfolio_activities');
    if (storedActs) {
      portfolioData.activities = JSON.parse(storedActs);
    }

    const storedProjs = localStorage.getItem('ck_portfolio_projects');
    if (storedProjs) {
      portfolioData.projects = JSON.parse(storedProjs);
    }
  } catch (e) {
    console.error('Error loading local dev data:', e);
  }

  // Cloud Sync: Fetch from Firebase Firestore DB if configured
  if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
    try {
      const [fbProfile, fbEdu, fbCerts, fbActs, fbProjs] = await Promise.all([
        fetchFirebaseProfile(),
        fetchFirebaseEducation(),
        fetchFirebaseCertificates(),
        fetchFirebaseActivities(),
        fetchFirebaseProjects()
      ]);

      let updated = false;

      if (fbProfile) {
        portfolioData.personalInfo = {
          ...portfolioData.personalInfo,
          nameTh: fbProfile.nameTh || portfolioData.personalInfo.nameTh,
          nameEn: fbProfile.nameEn || portfolioData.personalInfo.nameEn,
          nickname: fbProfile.nickname || portfolioData.personalInfo.nickname,
          role: fbProfile.role || portfolioData.personalInfo.role,
          university: fbProfile.university || portfolioData.personalInfo.university,
          degree: fbProfile.degree || portfolioData.personalInfo.degree,
          email: fbProfile.email || portfolioData.personalInfo.email,
          phone: fbProfile.phone || portfolioData.personalInfo.phone,
          location: fbProfile.location || portfolioData.personalInfo.location,
          bio: fbProfile.bio || portfolioData.personalInfo.bio,
          avatarImage: fbProfile.avatarImage || portfolioData.personalInfo.avatarImage,
          socials: {
            github: fbProfile.socials?.github || portfolioData.personalInfo.socials?.github,
            linkedin: fbProfile.socials?.linkedin || portfolioData.personalInfo.socials?.linkedin,
            facebook: fbProfile.socials?.facebook || portfolioData.personalInfo.socials?.facebook,
            emailLink: fbProfile.email ? `mailto:${fbProfile.email}` : portfolioData.personalInfo.socials?.emailLink
          }
        };
        updated = true;
      }

      if (fbEdu && fbEdu.length > 0) { portfolioData.education = fbEdu; updated = true; }
      if (fbCerts && fbCerts.length > 0) { portfolioData.certificates = fbCerts; updated = true; }
      if (fbActs && fbActs.length > 0) { portfolioData.activities = fbActs; updated = true; }
      if (fbProjs && fbProjs.length > 0) { portfolioData.projects = fbProjs; updated = true; }

      if (updated) {
        renderHeroAndAbout();
        renderEducation();
        renderProjects('all');
        renderActivities();
        renderCertificates();
        if (typeof _applyLanguage === 'function') _applyLanguage(_currentLang);
      }
    } catch (err) {
      console.warn('Firebase fetch error, using local data:', err);
    }
  }
}

function initDevPortal() {
  const loginForm = document.getElementById('devLoginForm');
  const addCertForm = document.getElementById('addCertForm');
  const addActForm = document.getElementById('addActivityForm');
  const addProjForm = document.getElementById('addProjectForm');

  if (loginForm) {
    loginForm.addEventListener('submit', handleDevLogin);
  }
  if (addCertForm) {
    addCertForm.addEventListener('submit', handleAddCertificate);
  }
  if (addActForm) {
    addActForm.addEventListener('submit', handleAddActivity);
  }
  if (addProjForm) {
    addProjForm.addEventListener('submit', handleAddProject);
  }

  // Keyboard shortcut Ctrl + Shift + L
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      openDevLoginModal();
    }
  });
}

window.openDevLoginModal = function() {
  if (sessionStorage.getItem('dev_auth') === 'true') {
    openDevAdminModal();
    return;
  }
  const modal = document.getElementById('devLoginModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const uInput = document.getElementById('devUsername');
    if (uInput) uInput.focus();
  }
};

window.closeDevLoginModal = function() {
  const modal = document.getElementById('devLoginModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

function handleDevLogin(e) {
  e.preventDefault();
  const user = document.getElementById('devUsername').value.trim();
  const pass = document.getElementById('devPassword').value.trim();
  const errorMsg = document.getElementById('devLoginError');

  if (user === DEV_USER && pass === DEV_PASS) {
    sessionStorage.setItem('dev_auth', 'true');
    if (errorMsg) errorMsg.classList.add('hidden');
    closeDevLoginModal();
    openDevAdminModal();
    document.getElementById('devLoginForm').reset();
  } else {
    if (errorMsg) errorMsg.classList.remove('hidden');
  }
}

window.openDevAdminModal = function() {
  const modal = document.getElementById('devAdminModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderDevCustomItems();
  }
};

window.closeDevAdminModal = function() {
  const modal = document.getElementById('devAdminModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.handleDevLogout = function() {
  sessionStorage.removeItem('dev_auth');
  closeDevAdminModal();
  alert('ออกจากระบบผู้พัฒนาเรียบร้อยแล้ว');
};

window.switchDevTab = function(tabName) {
  const tabs = document.querySelectorAll('.dev-tab-content');
  const btns = document.querySelectorAll('.dev-tab-btn');

  tabs.forEach(t => t.classList.add('hidden'));
  btns.forEach(b => {
    b.classList.remove('active', 'bg-slate-800', 'text-slate-100');
    b.classList.add('bg-slate-900/60', 'text-slate-400');
  });

  const activeTab = document.getElementById(`devTab-${tabName}`);
  const activeBtn = document.getElementById(`devTabBtn-${tabName}`);

  if (activeTab) activeTab.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-slate-800', 'text-slate-100');
    activeBtn.classList.remove('bg-slate-900/60', 'text-slate-400');
  }

  if (tabName === 'manage') {
    renderDevCustomItems();
  }
};

function handleAddCertificate(e) {
  e.preventDefault();
  const newCert = {
    id: `cert-custom-${Date.now()}`,
    title: document.getElementById('certTitle').value.trim(),
    organization: document.getElementById('certOrg').value.trim(),
    date: document.getElementById('certDate').value.trim(),
    category: document.getElementById('certCategory').value.trim(),
    badge: document.getElementById('certBadge').value.trim() || 'เกียรติบัตร',
    file: document.getElementById('certFile').value.trim() || '#',
    icon: 'fa-certificate',
    description: document.getElementById('certDesc').value.trim() || 'ผ่านการอบรมพัฒนาทักษะทางวิชาการ'
  };

  const customCerts = JSON.parse(localStorage.getItem('ck_custom_certs') || '[]');
  customCerts.unshift(newCert);
  localStorage.setItem('ck_custom_certs', JSON.stringify(customCerts));

  portfolioData.certificates.unshift(newCert);
  renderCertificates();

  document.getElementById('addCertForm').reset();
  alert('บันทึกเกียรติบัตรใหม่เรียบร้อยแล้ว!');
}

function handleAddActivity(e) {
  e.preventDefault();
  const newAct = {
    id: `act-custom-${Date.now()}`,
    title: document.getElementById('actTitle').value.trim(),
    organization: document.getElementById('actOrg').value.trim(),
    date: document.getElementById('actDate').value.trim(),
    description: document.getElementById('actDesc').value.trim() || 'กิจกรรมส่งเสริมทักษะวิชาการและสังคม',
    badge: document.getElementById('actBadge').value.trim() || 'กิจกรรม'
  };

  const customActivities = JSON.parse(localStorage.getItem('ck_custom_activities') || '[]');
  customActivities.unshift(newAct);
  localStorage.setItem('ck_custom_activities', JSON.stringify(customActivities));

  portfolioData.activities.unshift(newAct);
  renderActivities();

  document.getElementById('addActivityForm').reset();
  alert('บันทึกกิจกรรมใหม่เรียบร้อยแล้ว!');
}

function handleAddProject(e) {
  e.preventDefault();
  const tagsInput = document.getElementById('projTags').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['Project'];

  const newProj = {
    id: Date.now(),
    title: document.getElementById('projTitle').value.trim(),
    englishTitle: document.getElementById('projEngTitle').value.trim() || 'Computer Technology Project',
    category: document.getElementById('projCategory').value,
    categoryName: document.getElementById('projCategory').value === 'iot' ? 'IoT & Embedded' : (document.getElementById('projCategory').value === 'network' ? 'Network & Systems' : 'Software & Web'),
    image: 'assets/images/project-web.svg',
    summary: document.getElementById('projSummary').value.trim(),
    description: document.getElementById('projDesc').value.trim() || 'โครงการพัฒนาซอฟต์แวร์และฮาร์ดแวร์ประยุกต์',
    tags: tags,
    date: document.getElementById('projDate').value.trim() || '2026',
    github: '#',
    demo: '#'
  };

  const customProjects = JSON.parse(localStorage.getItem('ck_custom_projects') || '[]');
  customProjects.unshift(newProj);
  localStorage.setItem('ck_custom_projects', JSON.stringify(customProjects));

  portfolioData.projects.unshift(newProj);
  renderProjects('all');

  document.getElementById('addProjectForm').reset();
  alert('บันทึกโปรเจกต์ใหม่เรียบร้อยแล้ว!');
}

function renderDevCustomItems() {
  const container = document.getElementById('devCustomItemsList');
  if (!container) return;

  const customCerts = JSON.parse(localStorage.getItem('ck_custom_certs') || '[]');
  const customActs = JSON.parse(localStorage.getItem('ck_custom_activities') || '[]');
  const customProjs = JSON.parse(localStorage.getItem('ck_custom_projects') || '[]');

  const allCustoms = [
    ...customCerts.map(c => ({ ...c, itemType: 'cert', typeLabel: '🎓 เกียรติบัตร' })),
    ...customActs.map(a => ({ ...a, itemType: 'activity', typeLabel: '🏆 กิจกรรม' })),
    ...customProjs.map(p => ({ ...p, itemType: 'project', typeLabel: '📁 โปรเจกต์' }))
  ];

  if (allCustoms.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">ยังไม่มีข้อมูลใหม่ที่เพิ่มผ่านหน้าระบบ (ข้อมูลปัจจุบันเป็นข้อมูลเริ่มต้น)</p>`;
    return;
  }

  container.innerHTML = allCustoms.map(item => `
    <div class="glass-panel p-3 rounded-xl flex items-center justify-between text-xs">
      <div class="space-y-0.5">
        <span class="font-bold text-slate-200">${item.typeLabel}: ${item.title}</span>
        <span class="text-[11px] text-slate-400 block">${item.organization || item.categoryName || ''} (${item.date})</span>
      </div>
      <button onclick="deleteCustomItem('${item.itemType}', '${item.id}')" class="px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 transition-colors">
        <i class="fas fa-trash-alt mr-1"></i> ลบ
      </button>
    </div>
  `).join('');
}

window.deleteCustomItem = function(type, id) {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

  if (type === 'cert') {
    let certs = JSON.parse(localStorage.getItem('ck_custom_certs') || '[]');
    certs = certs.filter(c => String(c.id) !== String(id));
    localStorage.setItem('ck_custom_certs', JSON.stringify(certs));
    portfolioData.certificates = portfolioData.certificates.filter(c => String(c.id) !== String(id));
    renderCertificates();
  } else if (type === 'activity') {
    let acts = JSON.parse(localStorage.getItem('ck_custom_activities') || '[]');
    acts = acts.filter(a => String(a.id) !== String(id));
    localStorage.setItem('ck_custom_activities', JSON.stringify(acts));
    portfolioData.activities = portfolioData.activities.filter(a => String(a.id) !== String(id));
    renderActivities();
  } else if (type === 'project') {
    let projs = JSON.parse(localStorage.getItem('ck_custom_projects') || '[]');
    projs = projs.filter(p => String(p.id) !== String(id));
    localStorage.setItem('ck_custom_projects', JSON.stringify(projs));
    portfolioData.projects = portfolioData.projects.filter(p => String(p.id) !== String(id));
    renderProjects('all');
  }

  renderDevCustomItems();
};

window.copyDataJsCode = function() {
  const code = `const portfolioData = ${JSON.stringify(portfolioData, null, 2)};`;
  navigator.clipboard.writeText(code).then(() => {
    alert('คัดลอกโค้ด portfolioData เรียบร้อยแล้ว! สามารถนำไปวางทับในไฟล์ data.js ได้ทันที');
  }).catch(() => {
    alert('ไม่สามารถคัดลอกอัตโนมัติได้ ให้คัดลอกผ่านระบบแทน');
  });
};

/* ==========================================
   12. Search, Share & Resume Modal Handlers
   ========================================== */
window.openSearchModal = function() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('globalSearchInput');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (input) {
      input.value = '';
      input.focus();
      handleGlobalSearch('');
    }
  }
};

window.closeSearchModal = function() {
  const modal = document.getElementById('searchModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.openShareModal = function() {
  const modal = document.getElementById('shareModal');
  const input = document.getElementById('shareUrlInput');
  const qrImg = document.getElementById('shareQrImg');
  const currentUrl = window.location.href.split('#')[0];
  
  if (input) input.value = currentUrl;
  if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeShareModal = function() {
  const modal = document.getElementById('shareModal');
  const notice = document.getElementById('copyNoticeText');
  if (notice) notice.classList.add('hidden');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.copyShareUrl = function() {
  const input = document.getElementById('shareUrlInput');
  const notice = document.getElementById('copyNoticeText');
  if (input) {
    navigator.clipboard.writeText(input.value).then(() => {
      if (notice) notice.classList.remove('hidden');
    });
  }
};

window.openResumeModal = function() {
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeResumeModal = function() {
  const modal = document.getElementById('resumeModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

// Global Event Listener for Certificate Filter Buttons
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('cert-filter-btn')) {
    const filter = e.target.getAttribute('data-cert-filter');
    renderCertificates(filter);
  }
});

// Keydown listeners for Ctrl+K search shortcut and Escape modal close
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearchModal();
  }
  if (e.key === 'Escape') {
    closeSearchModal();
    closeShareModal();
    closeResumeModal();
    closeProjectModal();
  }
});

// Real-time Global Search Implementation
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('globalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleGlobalSearch(e.target.value.trim().toLowerCase());
    });
  }
});

function handleGlobalSearch(query) {
  const container = document.getElementById('searchResultsList');
  if (!container) return;

  if (!query) {
    container.innerHTML = `<p class="text-xs text-slate-400 text-center py-8">พิมพ์คีย์เวิร์ดเพื่อค้นหาทักษะ โปรเจกต์ หรือเกียรติบัตร...</p>`;
    return;
  }

  const results = [];

  // Search Projects
  portfolioData.projects.forEach(p => {
    const text = `${p.title} ${p.englishTitle} ${p.summary} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
    if (text.includes(query)) {
      results.push({
        type: '📁 ผลงานโปรเจกต์',
        title: p.title,
        subtitle: p.categoryName,
        action: `openProjectModal(${p.id}); closeSearchModal();`
      });
    }
  });

  // Search Certificates
  portfolioData.certificates.forEach(c => {
    const text = `${c.title} ${c.organization} ${c.category} ${c.badge} ${c.description}`.toLowerCase();
    if (text.includes(query)) {
      results.push({
        type: '🎓 เกียรติบัตร',
        title: c.title,
        subtitle: `${c.organization} (${c.date})`,
        link: c.file
      });
    }
  });

  // Search Skills
  portfolioData.skillCategories.forEach(cat => {
    cat.skills.forEach(s => {
      if (s.name.toLowerCase().includes(query)) {
        results.push({
          type: '⚡ ทักษะความเชี่ยวชาญ',
          title: s.name,
          subtitle: `${cat.title} (${s.level}%)`,
          anchor: '#skills'
        });
      }
    });
  });

  // Search Activities
  portfolioData.activities.forEach(a => {
    const text = `${a.title} ${a.organization} ${a.description}`.toLowerCase();
    if (text.includes(query)) {
      results.push({
        type: '🏆 กิจกรรม',
        title: a.title,
        subtitle: `${a.organization} (${a.date})`,
        anchor: '#activities'
      });
    }
  });

  if (results.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 text-center py-8">ไม่พบข้อมูลที่ตรงกับ "${query}"</p>`;
    return;
  }

  container.innerHTML = results.map(r => `
    <div class="glass-panel p-3.5 rounded-xl flex items-center justify-between hover:border-slate-500 transition-all text-xs">
      <div>
        <span class="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-semibold mb-1 inline-block">${r.type}</span>
        <h4 class="font-bold text-slate-100">${r.title}</h4>
        <p class="text-[11px] text-slate-400">${r.subtitle}</p>
      </div>
      ${r.action ? `<button onclick="${r.action}" class="btn-secondary-gray text-[11px] py-1 px-3">ดูรายละเอียด</button>` : ''}
      ${r.link ? `<a href="${encodeURI(r.link)}" target="_blank" class="btn-secondary-gray text-[11px] py-1 px-3 flex items-center gap-1"><i class="fas fa-file-pdf text-red-400"></i> เปิด PDF</a>` : ''}
      ${r.anchor ? `<a href="${r.anchor}" onclick="closeSearchModal()" class="btn-secondary-gray text-[11px] py-1 px-3">ไปยังส่วนนี้</a>` : ''}
    </div>
  `).join('');
}
