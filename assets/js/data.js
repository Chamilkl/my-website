/**
 * Chamil Kalong - Personal Portfolio Data
 * มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย สงขลา
 * คอบ. สาขาวิศวกรรมไฟฟ้า วิชาเอกเทคนิคคอมพิวเตอร์
 */

const portfolioData = {
  personalInfo: {
    nameTh: "ชามิล กาหลง",
    nameEn: "Chamil Kalong",
    nickname: "มิล (Mil)",
    role: "นักศึกษาชั้นปีที่ 2 สาขาวิศวกรรมไฟฟ้า วิชาเอกเทคนิคคอมพิวเตอร์",
    subtitle: "Computer Technology Major | Electrical Engineering Student (Year 2)",
    university: "มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย สงขลา (RUTS)",
    faculty: "คณะวิศวกรรมศาสตร์ / ครุศาสตร์อุตสาหกรรมและเทคโนโลยี",
    degree: "ครุศาสตร์อุตสาหกรรมบัณฑิต (คอบ.) สาขาวิศวกรรมไฟฟ้า (ชั้นปีที่ 2)",
    major: "วิชาเอกเทคนิคคอมพิวเตอร์ (Computer Technology)",
    location: "อ.เมือง จ.สงขลา, ประเทศไทย",
    email: "chamil.k@rmutsvmail.com",
    phone: "+66 8X-XXX-XXXX",
    avatarImage: "assets/images/profile-avatar.svg",
    bio: "ผมเป็นนักศึกษาชั้นปีที่ 2 หลักสูตร คอบ. สาขาวิศวกรรมไฟฟ้า วิชาเอกเทคนิคคอมพิวเตอร์ มทร.ศรีวิชัย สงขลา ผ่านการศึกษาด้านเทคนิคคอมพิวเตอร์ระดับ ปวช. จากวิทยาลัยเทคนิคปัตตานี มีความมุ่งมั่นและหลงใหลในเทคโนโลยีคอมพิวเตอร์ ไมโครคอนโทรลเลอร์ ระบบฝังตัว (Embedded Systems) การพัฒนาระบบเครือข่าย และซอฟต์แวร์ประยุกต์",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      facebook: "https://facebook.com",
      emailLink: "mailto:chamil.k@rmutsvmail.com"
    },
    stats: [
      { label: "ระดับการศึกษา", value: "ปริญญาตรี ปี 2 (คอบ.)", icon: "fa-graduation-cap" },
      { label: "วิชาเอก", value: "เทคนิคคอมพิวเตอร์", icon: "fa-microchip" },
      { label: "สถาบัน", value: "มทร.ศรีวิชัย สงขลา", icon: "fa-university" },
      { label: "ความสนใจหลัก", value: "IoT, Embedded & Web", icon: "fa-code" }
    ]
  },

  education: [
    {
      period: "2567 - ปัจจุบัน (ปี 2)",
      degree: "หลักสูตรครุศาสตร์อุตสาหกรรมบัณฑิต (คอบ.)",
      major: "สาขาวิศวกรรมไฟฟ้า วิชาเอกเทคนิคคอมพิวเตอร์",
      institution: "มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย สงขลา",
      description: "วิศวกรรมไฟฟ้า เทคนิคคอมพิวเตอร์ ระบบฝังตัว IoT และระบบเครือข่าย",
      highlights: ["วิศวกรรมไฟฟ้า & เทคนิคคอมพิวเตอร์"]
    },
    {
      period: "2565 - 2567",
      degree: "ประกาศนียบัตรวิชาชีพ (ปวช.)",
      major: "สาขาเทคนิคคอมพิวเตอร์",
      institution: "วิทยาลัยเทคนิคปัตตานี",
      description: "ซ่อมบำรุงคอมพิวเตอร์ วงจรอิเล็กทรอนิกส์ และระบบเครือข่าย",
      highlights: ["ช่างเทคนิคคอมพิวเตอร์ & อิเล็กทรอนิกส์"]
    },
    {
      period: "2562 - 2564",
      degree: "มัธยมศึกษาตอนต้น (ม.1 - ม.3)",
      major: "ห้องเรียนพิเศษวิทยาศาสตร์ - คณิตศาสตร์",
      institution: "โรงเรียนมูลนิธิอาซิซสถาน",
      description: "ห้องเรียนพิเศษวิทยาศาสตร์-คณิตศาสตร์",
      highlights: ["โครงการห้องเรียนพิเศษวิทย์-คณิต"]
    }
  ],

  skillCategories: [
    {
      id: "programming",
      title: "การเขียนโปรแกรม & ซอฟต์แวร์ (Programming & Software)",
      skills: [
        { name: "C / C++ (Embedded Systems)", level: 85, icon: "fa-code" },
        { name: "Python", level: 80, icon: "fab fa-python" },
        { name: "HTML5 / CSS3 / JavaScript (ES6+)", level: 85, icon: "fab fa-js" },
        { name: "Tailwind CSS & Responsive UI", level: 90, icon: "fa-palette" },
        { name: "SQL / Database Fundamentals", level: 75, icon: "fa-database" },
        { name: "Git / GitHub Version Control", level: 80, icon: "fab fa-git-alt" }
      ]
    },
    {
      id: "hardware",
      title: "ฮาร์ดแวร์ & ไมโครคอนโทรลเลอร์ (Hardware & Embedded)",
      skills: [
        { name: "ESP32 / ESP8266 Microcontrollers", level: 90, icon: "fa-microchip" },
        { name: "Arduino Architecture & Sensor Interfacing", level: 92, icon: "fa-plug" },
        { name: "Digital Circuits & PCB Schematic Logic", level: 80, icon: "fa-project-diagram" },
        { name: "Programmable Logic Controller (PLC)", level: 75, icon: "fa-industry" },
        { name: "Electrical Measurement & Instrumentation", level: 82, icon: "fa-bolt" }
      ]
    },
    {
      id: "network",
      title: "ระบบเครือข่าย & ไอที (Network & IT Infrastructure)",
      skills: [
        { name: "Computer Networking (TCP/IP, IPv4/IPv6)", level: 85, icon: "fa-network-wired" },
        { name: "Cisco Packet Tracer Network Simulation", level: 88, icon: "fa-server" },
        { name: "Linux OS System Administration Basics", level: 78, icon: "fab fa-linux" },
        { name: "Router & Switch Configuration (VLAN/OSPF)", level: 82, icon: "fa-route" }
      ]
    }
  ],

  projects: [
    {
      id: 1,
      title: "ระบบเฝ้าระวังและตรวจวัดพลังงานไฟฟ้า IoT อัจฉริยะ",
      englishTitle: "IoT Smart Electrical Energy & Environment Monitor",
      category: "iot",
      categoryName: "IoT & Embedded",
      image: "assets/images/project-iot.svg",
      summary: "ระบบตรวจวัดกระแสไฟฟ้า แรงดันไฟฟ้า และสภาพแวดล้อมแบบเรียลไทม์ด้วย ESP32 ส่งข้อมูลผ่านโปรโตคอล MQTT และแสดงผลบน Web Dashboard",
      description: "โครงการพัฒนาระบบเฝ้าระวังพลังงานไฟฟ้าและสภาพแวดล้อม ใช้บอร์ดไมโครคอนโทรลเลอร์ ESP32 เชื่อมต่อกับเซนเซอร์ PZEM-004T และ DHT22 ส่งข้อมูลไปยัง Cloud Server และเรียกดึงข้อมูลมาแสดงผลบนเว็บพอร์ตโฟลิโอ/แดชบอร์ดพร้อมระบบการแจ้งเตือนเมื่อเกิดค่าแรงดันเกิน",
      tags: ["ESP32", "C++", "MQTT", "HTML/CSS/JS", "Sensor Interfacing"],
      date: "2025",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "แบบจำลองระบบเครือข่ายองค์กรขนาดใหญ่ (Enterprise Campus Network)",
      englishTitle: "Enterprise Campus Network Simulation",
      category: "network",
      categoryName: "Network & Systems",
      image: "assets/images/project-network.svg",
      summary: "ออกแบบและจำลองโครงสร้างระบบเครือข่ายระดับองค์กรโดยใช้ Cisco Packet Tracer พร้อมการกำหนด VLAN, Inter-VLAN Routing, OSPF และ Access Control Lists (ACL)",
      description: "ออกแบบระบบเครือข่ายคอมพิวเตอร์จำลองสำหรับอาคารเรียนและห้องปฏิบัติการคอมพิวเตอร์ มทร.ศรีวิชัย มีการแบ่ง VLAN ตามแผนกงาน กำหนดนโยบายความปลอดภัยด้วย ACL และตั้งค่าระบบจ่ายไอพีอัตโนมัติ DHCP Relay รวมทั้ง redundant gateway (HSRP)",
      tags: ["Cisco Packet Tracer", "VLAN", "OSPF", "ACL", "Network Security"],
      date: "2024",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "เว็บไซต์ระบบสารสนเทศและพอร์ตโฟลิโอส่วนตัว เทคนิคคอมพิวเตอร์",
      englishTitle: "Modern Computer Tech Portfolio & Department Hub",
      category: "web",
      categoryName: "Software & Web",
      image: "assets/images/project-web.svg",
      summary: "พัฒนาเว็บไซต์แบบ Responsive เน้นดีไซน์เรียบหรูโทนสีเทา (Modern Slate Theme) รวบรวมผลงาน ข้อมูลการศึกษา และทักษะทางเทคนิคคอมพิวเตอร์",
      description: "พัฒนาเว็บแอปพลิเคชันสำหรับนำเสนอประวัติส่วนตัว (Personal Portfolio) ด้วย HTML5, CSS3 (Tailwind CSS Framework), Vanilla JavaScript และระบบจัดการข้อมูลเชิงโมดูล รองรับการทำงานทั้ง Dark Mode และ Light Mode ในโทนสีเทาที่สวยงามอ่านง่าย",
      tags: ["HTML5", "Tailwind CSS", "JavaScript", "Responsive Design", "UI/UX"],
      date: "2026",
      github: "#",
      demo: "#"
    },
    {
      id: 4,
      title: "ระบบควบคุมการเปิด-ปิดประตูด้วยบัตร RFID และชีวภาพ (Smart RFID Access Control)",
      englishTitle: "Microcontroller RFID Access Control System",
      category: "iot",
      categoryName: "IoT & Embedded",
      image: "assets/images/project-rfid.svg",
      summary: "ออกแบบและสร้างชุดควบคุมความปลอดภัยการเข้า-ออกห้องปฏิบัติการคอมพิวเตอร์ ควบคุมด้วย Arduino UNO ร่วมกับโมดูล RFID RC522 และจอแสดงผล OLED",
      description: "สร้างอุปกรณ์ควบคุมการเข้าออกห้องปฏิบัติการคอมพิวเตอร์ ใช้การยืนยันตัวตนผ่านบัตรประจำตัว RFID ควบคุมกลไก Solenoid Door Lock และบันทึกเวลาการเข้า-ออก พร้อมสัญญาณเตือนด้วย Buzzer และไฟ LED แสดงสถานะ",
      tags: ["Arduino C++", "RFID RC522", "Digital Logic", "Solenoid Lock", "OLED Display"],
      date: "2024",
      github: "#",
      demo: "#"
    }
  ],

  activities: [
    {
      title: "การแข่งขันทักษะทางวิชาการและทักษะวิชาชีพวิศวกรรมไฟฟ้า",
      organization: "สาขาวิศวกรรมไฟฟ้า มทร.ศรีวิชัย สงขลา",
      date: "2025",
      description: "เข้าร่วมแข่งขันการเขียนโปรแกรมควบคุมไมโครคอนโทรลเลอร์และการต่อวงจรเทคนิคคอมพิวเตอร์ระดับสถาบัน",
      badge: "วิชาการ & ทักษะ"
    },
    {
      title: "อบรมเชิงปฏิบัติการ Advanced Embedded Systems & Smart IoT Application",
      organization: "ศูนย์ฝึกอบรมเทคโนโลยีคอมพิวเตอร์",
      date: "2024",
      description: "ผ่านการฝึกอบรมการพัฒนาแอปพลิเคชันไอโอที การเชื่อมต่อคลาวด์โปรโตคอล MQTT และการประยุกต์ใช้งานเซนเซอร์อุตสาหกรรม",
      badge: "เกียรติบัตรอบรม"
    },
    {
      title: "โครงการค่ายจิตอาสาบริการวิชาการตรวจเช็กและซ่อมบำรุงคอมพิวเตอร์ชุมชน",
      organization: "ชุมนุมนักศึกษาครุศาสตร์อุตสาหกรรม มทร.ศรีวิชัย",
      date: "2024",
      description: "ร่วมทำกิจกรรมลงพื้นที่บริการซ่อมแซม ปรับปรุงระบบเครือข่าย และคอมพิวเตอร์ให้แก่โรงเรียนและชุมชนในจังหวัดสงขลา",
      badge: "จิตอาสา & บริการสังคม"
    }
  ],

  certificates: [
    {
      id: "cert-tcer002",
      title: "ผู้ปฏิบัติงานด้านการขายระบบผลิตไฟฟ้าจากเซลล์แสงอาทิตย์ ระดับ 3",
      organization: "สถาบันคุณวุฒิวิชาชีพ (องค์การมหาชน) - TPQI",
      date: "17 กุมภาพันธ์ 2569",
      category: "คุณวุฒิวิชาชีพ",
      badge: "TPQI Level 3",
      file: "cer/Certificate-TCER002-L3-TH.pdf",
      icon: "fa-solar-panel",
      description: "วุฒิบัตรการฝึกอบรมตามมาตรฐานอาชีพและคุณวุฒิวิชาชีพ สาขาวิชาชีพพลังงานและพลังงานทดแทน สาขาพลังงานไฟฟ้าจากเซลล์แสงอาทิตย์"
    },
    {
      id: "cert-ms05",
      title: "การพัฒนาสมรรถนะ Digital Literacy (2 ชั่วโมง)",
      organization: "สถาบันคุณวุฒิวิชาชีพ (องค์การมหาชน) - TPQI",
      date: "17 กุมภาพันธ์ 2569",
      category: "ทักษะดิจิทัล",
      badge: "TPQI Digital",
      file: "cer/Certificate-MS05-TH.pdf",
      icon: "fa-laptop-code",
      description: "วุฒิบัตรการฝึกอบรมผ่านระบบการเรียนรู้สมรรถนะบุคคลด้านความเข้าใจและใช้เทคโนโลยีดิจิทัล ตามมาตรฐานอาชีพและคุณวุฒิวิชาชีพ"
    },
    {
      id: "cert-bmd1006",
      title: "Growth Management for Startup (SET e-Learning)",
      organization: "ตลาดหลักทรัพย์แห่งประเทศไทย (SET)",
      date: "17 กุมภาพันธ์ 2569",
      category: "การบริหาร & สตาร์ทอัพ",
      badge: "SET e-Learning",
      file: "cer/Certificate-BMD1006-TH.pdf",
      icon: "fa-chart-line",
      description: "ผ่านการเรียน e-Learning ครบถ้วนตามหลักสูตรการจัดการการเติบโตสำหรับธุรกิจสตาร์ทอัพ (ระยะเวลา 50 นาที)"
    },
    {
      id: "cert-fin-lit",
      title: "วางแผนลงทุนเป็น (Financial Literacy สำหรับนิสิต/นักศึกษาครู)",
      organization: "คุรุสภา (TPDI) x ก.ล.ต. x ธนาคารแห่งประเทศไทย",
      date: "14 ตุลาคม 2568",
      category: "ความฉลาดรู้ทางการเงิน",
      badge: "คุรุสภา & ก.ล.ต.",
      file: "cer/Certificate หน่วยการเรียนรู้ 4 วางแผนลงทุนเป็น หลักสูตรเสริมสร้างความฉลาดรู้ด้านการเงิน (Financial Literacy) สำหรับนิสิต_นักศึกษาครู.pdf",
      icon: "fa-coins",
      description: "ผ่านการอบรมหน่วยการเรียนรู้ที่ 4 ตามหลักสูตรเสริมสร้างความฉลาดรู้ด้านการเงิน โดยคุรุสภา สำนักงาน ก.ล.ต. และธนาคารแห่งประเทศไทย"
    },
    {
      id: "cert-mirror-267",
      title: "อาสาสมัครจัดเตรียมสิ่งของช่วยเหลือผู้ประสบภัยน้ำท่วม (13 ธ.ค. 2568)",
      organization: "มูลนิธิกระจกเงา (The Mirror Foundation)",
      date: "14 ธันวาคม 2568",
      category: "จิตอาสา",
      badge: "จิตอาสา & บริการสังคม",
      file: "cer/ชามิล กาหลง 267 (13 ธันวา).pdf",
      icon: "fa-hand-holding-heart",
      description: "หนังสือรับรองการปฏิบัติหน้าที่อาสาสมัครจัดเตรียมสิ่งของบรรเทาทุกข์ช่วยเหลือผู้ประสบภัยน้ำท่วม"
    },
    {
      id: "cert-mirror-279",
      title: "อาสาสมัครจัดเตรียมสิ่งของช่วยเหลือผู้ประสบภัยน้ำท่วม (20 ธ.ค. 2568)",
      organization: "มูลนิธิกระจกเงา (The Mirror Foundation)",
      date: "21 ธันวาคม 2568",
      category: "จิตอาสา",
      badge: "จิตอาสา & บริการสังคม",
      file: "cer/ชามิล กาหลง 279.pdf",
      icon: "fa-hands-helping",
      description: "หนังสือรับรองการเป็นอาสาสมัครกับมูลนิธิกระจกเงาในการจัดเตรียมและส่งมอบสิ่งของช่วยเหลือผู้ประสบภัย"
    }
  ]
};
