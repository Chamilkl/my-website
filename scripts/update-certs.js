/**
 * Auto-update Certificates Script (scripts/update-certs.js)
 * สแกนไฟล์เกียรติบัตรในโฟลเดอร์ cer/ และอัปเดตลง assets/js/data.js อัตโนมัติ
 * รองรับทั้งเกียรติบัตรที่มีข้อมูลแล้ว และไฟล์ใหม่ที่เพิ่งเพิ่มเข้ามา
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CER_DIR = path.join(ROOT_DIR, 'cer');
const DATA_JS_PATH = path.join(ROOT_DIR, 'assets', 'js', 'data.js');
const META_PATH = path.join(CER_DIR, 'metadata.json');
const SW_PATH = path.join(ROOT_DIR, 'sw.js');

const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

function getThaiToday() {
  const d = new Date();
  const day = d.getDate();
  const month = THAI_MONTHS[d.getMonth()];
  const year = d.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

function cleanFilenameToTitle(name) {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/^Certificate[-_]?/i, '')
    .replace(/[-_]/g, ' ')
    .trim();
}

function inferCategory(fileName, title) {
  const s = (fileName + ' ' + title).toLowerCase();
  if (s.includes('tcer') || s.includes('คุณวุฒิ') || s.includes('tpqi level')) return 'คุณวุฒิวิชาชีพ';
  if (s.includes('finance') || s.includes('เงิน') || s.includes('ลงทุน') || s.includes('bmd') || s.includes('set')) {
    if (s.includes('startup') || s.includes('bmd') || s.includes('growth')) return 'การบริหาร & สตาร์ทอัพ';
    return 'ความฉลาดรู้ทางการเงิน';
  }
  if (s.includes('จิตอาสา') || s.includes('volunteer') || s.includes('mirror') || s.includes('krajok')) return 'จิตอาสา';
  return 'ทักษะดิจิทัล';
}

function inferBadge(fileName, category) {
  const s = fileName.toLowerCase();
  if (s.includes('tpqi') || s.includes('tcer')) return 'TPQI Certified';
  if (s.includes('set') || s.includes('bmd')) return 'SET e-Learning';
  if (s.includes('dga') || s.includes('mooc')) return 'Thai MOOC';
  if (s.includes('krajok') || s.includes('mirror')) return 'จิตอาสา & บริการสังคม';
  if (s.includes('finance')) return 'Financial Literacy';
  if (category === 'ทักษะดิจิทัล') return 'Digital Skill';
  return 'วุฒิบัตรรับรอง';
}

function inferIcon(category, title) {
  const s = (category + ' ' + title).toLowerCase();
  if (s.includes('solar') || s.includes('ไฟฟ้า')) return 'fa-solar-panel';
  if (s.includes('word')) return 'fa-file-word';
  if (s.includes('sway') || s.includes('present')) return 'fa-presentation';
  if (s.includes('cyber') || s.includes('security') || s.includes('ความมั่นคง')) return 'fa-shield-alt';
  if (s.includes('finance') || s.includes('เงิน') || s.includes('coins')) return 'fa-coins';
  if (s.includes('startup') || s.includes('growth') || s.includes('chart')) return 'fa-chart-line';
  if (s.includes('จิตอาสา') || s.includes('volunteer') || s.includes('mirror')) return 'fa-hand-holding-heart';
  if (s.includes('users') || s.includes('diversity')) return 'fa-users';
  return 'fa-certificate';
}

function inferOrg(fileName) {
  const s = fileName.toLowerCase();
  if (s.includes('tcer') || s.includes('tpqi') || s.includes('ms0') || s.includes('dl3')) return 'สถาบันคุณวุฒิวิชาชีพ (องค์การมหาชน) - TPQI';
  if (s.includes('set') || s.includes('bmd')) return 'ตลาดหลักทรัพย์แห่งประเทศไทย (SET)';
  if (s.includes('dga') || s.includes('mooc')) return 'Thai MOOC / กระทรวง อว.';
  if (s.includes('krajok') || s.includes('mirror')) return 'มูลนิธิกระจกเงา (The Mirror Foundation)';
  if (s.includes('financial')) return 'คุรุสภา (TPDI) x ก.ล.ต. x ธปท.';
  return 'สถาบันพัฒนาทักษะวิชาชีพ';
}

function main() {
  console.log('========================================================');
  console.log('  🎓 ระบบอัปเดตเกียรติบัตรอัตโนมัติ (Update Certificates)');
  console.log('========================================================\n');

  if (!fs.existsSync(CER_DIR)) {
    console.error('❌ ไม่พบโฟลเดอร์ cer/:', CER_DIR);
    process.exit(1);
  }

  // 1. Read files in cer/
  const validExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'];
  const files = fs.readdirSync(CER_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return validExts.includes(ext) && f !== 'metadata.json';
  });

  if (files.length === 0) {
    console.warn('⚠️ ไม่พบไฟล์เกียรติบัตรในโฟลเดอร์ cer/');
    return;
  }

  console.log(`📁 พบไฟล์เกียรติบัตรทั้งหมด ${files.length} ไฟล์ใน cer/`);

  // 2. Read metadata.json
  let metadata = {};
  if (fs.existsSync(META_PATH)) {
    try {
      metadata = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
    } catch(e) {
      console.warn('⚠️ ไม่สามารถอ่าน metadata.json ได้ จะสร้างใหม่:', e.message);
      metadata = {};
    }
  }

  let hasMetaChanged = false;
  const certItems = [];

  // 3. Process each file
  files.forEach((file, index) => {
    let itemMeta = metadata[file];

    if (!itemMeta) {
      // Auto-generate metadata for new files
      const rawTitle = cleanFilenameToTitle(file);
      const category = inferCategory(file, rawTitle);
      const badge = inferBadge(file, category);
      const org = inferOrg(file);
      const icon = inferIcon(category, rawTitle);
      const date = getThaiToday();
      const id = 'cert-' + Buffer.from(file).toString('hex').slice(0, 8);

      itemMeta = {
        id: id,
        title: rawTitle,
        organization: org,
        date: date,
        category: category,
        badge: badge,
        icon: icon,
        description: `วุฒิบัตรรับรองการเข้าร่วมและสำเร็จการอบรม ${rawTitle} จาก ${org}`
      };

      metadata[file] = itemMeta;
      hasMetaChanged = true;
      console.log(`  ➕ เพิ่มไฟล์ใหม่: "${file}" -> "${itemMeta.title}"`);
    } else {
      console.log(`  ✓ โหลดข้อมูลเดิม: "${file}" (${itemMeta.title})`);
    }

    certItems.push({
      id: itemMeta.id || `cert-${index + 1}`,
      title: itemMeta.title,
      organization: itemMeta.organization,
      date: itemMeta.date,
      category: itemMeta.category,
      badge: itemMeta.badge,
      file: `cer/${file}`,
      icon: itemMeta.icon || 'fa-certificate',
      description: itemMeta.description
    });
  });

  // Save metadata.json if updated
  if (hasMetaChanged) {
    fs.writeFileSync(META_PATH, JSON.stringify(metadata, null, 2), 'utf8');
    console.log('\n💾 อัปเดตไฟล์ cer/metadata.json เรียบร้อยแล้ว');
  }

  // 4. Update assets/js/data.js
  if (!fs.existsSync(DATA_JS_PATH)) {
    console.error('❌ ไม่พบไฟล์ data.js ที่:', DATA_JS_PATH);
    process.exit(1);
  }

  const dataJsContent = fs.readFileSync(DATA_JS_PATH, 'utf8');
  const certRegex = /certificates:\s*\[[\s\S]*?\](\s*\}\s*;)/;

  if (!certRegex.test(dataJsContent)) {
    console.error('❌ ไม่พบส่วน certificates ในไฟล์ data.js');
    process.exit(1);
  }

  const certsJsonStr = JSON.stringify(certItems, null, 4);
  const indentedCerts = certsJsonStr
    .split('\n')
    .map((line, i) => i === 0 ? line : '  ' + line)
    .join('\n');

  const updatedDataJs = dataJsContent.replace(
    certRegex,
    `certificates: ${indentedCerts}$1`
  );

  fs.writeFileSync(DATA_JS_PATH, updatedDataJs, 'utf8');
  console.log(`✅ อัปเดตรายการเกียรติบัตรลง assets/js/data.js สำเร็จ (${certItems.length} รายการ)!`);

  // 5. Bump Service Worker cache version if sw.js exists
  if (fs.existsSync(SW_PATH)) {
    try {
      let swContent = fs.readFileSync(SW_PATH, 'utf8');
      const vMatch = swContent.match(/CACHE_NAME\s*=\s*['"]chamil-portfolio-v([\d.]+)['"]/);
      if (vMatch) {
        const oldVer = vMatch[1];
        const verParts = oldVer.split('.').map(Number);
        verParts[verParts.length - 1] = (verParts[verParts.length - 1] || 0) + 1;
        const newVer = verParts.join('.');
        swContent = swContent.replace(
          /CACHE_NAME\s*=\s*['"]chamil-portfolio-v[\d.]+['"]/,
          `CACHE_NAME = 'chamil-portfolio-v${newVer}'`
        );
        fs.writeFileSync(SW_PATH, swContent, 'utf8');
        console.log(`🚀 ปรับเวอร์ชันแคช Service Worker (sw.js) เป็น v${newVer}`);
      }
    } catch(e) {
      console.warn('⚠️ ไม่สามารถอัปเดต sw.js ได้:', e.message);
    }
  }

  console.log('\n========================================================');
  console.log('  🎉 อัปเดตข้อมูลเกียรติบัตรเสร็จสมบูรณ์ 100%!');
  console.log('  ขั้นตอนถัดไป:');
  console.log('  👉 ดับเบิ้ลคลิกไฟล์ "เมื่อแก้ไข.cmd" เพื่อส่งขึ้น GitHub / Web ทันที');
  console.log('========================================================');
}

main();
