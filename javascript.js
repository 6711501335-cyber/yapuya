// นำเข้า Firebase SDK จาก CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ตั้งค่า Firebase ตามที่คุณให้มา
const firebaseConfig = {
  apiKey: "AIzaSyBHsow_1xhst-NG4M0TX5nt2bXfxJ0LhQg",
  authDomain: "yapuyaapp.firebaseapp.com",
  projectId: "yapuyaapp",
  storageBucket: "yapuyaapp.firebasestorage.app",
  messagingSenderId: "861406844734",
  appId: "1:861406844734:web:adcc9f9d8890f3f440fe6f",
  measurementId: "G-JTYP8WJCTG"
};

// เริ่มต้นใช้งาน Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ประกาศตัวแปรเก็บรายการยาในหน่วยความจำเพื่อเช็คเวลา
let medicationsList = [];
let triggeredAlarms = new Set(); // เก็บ ID ยาที่แจ้งเตือนไปแล้วในนาทีนั้นเพื่อกันการแจ้งเตือนซ้ำรัวๆ

// ฟังก์ชันสลับหน้า (เพื่อให้เรียกจาก HTML ได้ ต้องจับยึดกับ window)
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
};

// 1. จัดการการเพิ่มข้อมูลเมื่อกด "บันทึกข้อมูล"
document.getElementById('medForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ
    
    const patientName = document.getElementById('patientName').value;
    const medName = document.getElementById('medName').value;
    const medTime = document.getElementById('medTime').value;

    try {
        // บันทึกลง Firestore ในคอลเลกชันชื่อ 'medications'
        await addDoc(collection(db, "medications"), {
            patientName: patientName,
            medName: medName,
            time: medTime,
            createdAt: new Date()
        });
        
        // ล้างฟอร์ม
        document.getElementById('medForm').reset();
        
        // เด้งไปหน้าที่ 2 ทันที
        window.showPage('page2');
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
});

// 2. โหลดข้อมูลจาก Firebase แบบ Real-time
const q = query(collection(db, "medications"), orderBy("time", "asc"));
onSnapshot(q, (querySnapshot) => {
    const medListElement = document.getElementById('medList');
    medListElement.innerHTML = ''; // ล้างของเก่าก่อนใส่ของใหม่
    medicationsList = []; // รีเซ็ต array ในหน่วยความจำ

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        
        // เก็บไว้เช็คเวลา
        medicationsList.push({ id, ...data });

        // สร้าง HTML ใส่ในหน้า 2
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="med-time"><i class="fas fa-clock"></i> ${data.time} น.</div>
            <div class="med-info">
                <strong>ชื่อยา:</strong> ${data.medName} <br>
                <strong>ผู้ป่วย:</strong> ${data.patientName}
            </div>
        `;
        medListElement.appendChild(li);
    });
});

// 3. ระบบเช็คเวลาและแจ้งเตือน (เช็คทุกๆ 1 วินาที)
setInterval(() => {
    const now = new Date();
    // ดึงเวลาปัจจุบันในรูปแบบ HH:MM (เช่น 08:30)
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeString = `${currentHours}:${currentMinutes}`;
    const currentSeconds = now.getSeconds();

    // รีเซ็ตการแจ้งเตือนเมื่อขึ้นนาทีใหม่ (เพื่อให้พรุ่งนี้เวลาเดิมยังแจ้งเตือนได้)
    if (currentSeconds === 0) {
        triggeredAlarms.clear();
    }

    medicationsList.forEach(med => {
        if (med.time === currentTimeString) {
            // ถ้าเวลาตรงกันและยังไม่ได้แจ้งเตือนในนาทีนี้
            if (!triggeredAlarms.has(med.id)) {
                triggerAlarm(med);
                triggeredAlarms.add(med.id);
            }
        }
    });
}, 1000);

// ฟังก์ชันสั่งสั่นและเล่นเสียง
function triggerAlarm(med) {
    // 1. สั่งให้เล่นเสียง
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.play().catch(error => {
        console.log("บราวเซอร์บล็อคเสียงเนื่องจากผู้ใช้ยังไม่โต้ตอบกับหน้าเว็บ", error);
    });

    // 2. สั่งให้สั่น (สั่น 500ms, หยุด 250ms, สั่น 500ms)
    if ("vibrate" in navigator) {
        navigator.vibrate([500, 250, 500, 250, 500]);
    }

    // 3. แจ้งเตือนทางหน้าจอ
    alert(`ได้เวลาทานยาแล้ว!\nยา: ${med.medName}\nผู้ป่วย: ${med.patientName}`);
}
