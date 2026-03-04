// นำเข้า Firebase Modules ผ่าน CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ข้อมูลการเชื่อมต่อ Firebase ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBHsow_1xhst-NG4M0TX5nt2bXfxJ0LhQg",
  authDomain: "yapuyaapp.firebaseapp.com",
  projectId: "yapuyaapp",
  storageBucket: "yapuyaapp.firebasestorage.app",
  messagingSenderId: "861406844734",
  appId: "1:861406844734:web:adcc9f9d8890f3f440fe6f",
  measurementId: "G-JTYP8WJCTG"
};

// เริ่มต้นใช้งาน Firebase และ Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// อ้างอิงไปยัง Collection ชื่อ 'medications' (ถ้าไม่มี Firebase จะสร้างให้เอง)
const medCollection = collection(db, "medications");

// อ้างอิง Element ใน HTML
const form = document.getElementById("medication-form");
const medList = document.getElementById("medication-list");

// ฟังก์ชันสำหรับบันทึกข้อมูล
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บ

    const name = document.getElementById("medName").value;
    const dose = document.getElementById("medDose").value;
    const time = document.getElementById("medTime").value;

    try {
        // เพิ่มข้อมูลลง Firestore
        await addDoc(medCollection, {
            name: name,
            dose: dose,
            time: time,
            createdAt: new Date()
        });
        
        // ล้างค่าในฟอร์มหลังจากบันทึกเสร็จ
        form.reset();
        alert("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
});

// ฟังก์ชันสำหรับดึงข้อมูลมาแสดงแบบ Real-time เรียงตามเวลาที่ต้องทาน
const q = query(medCollection, orderBy("time", "asc"));

onSnapshot(q, (snapshot) => {
    medList.innerHTML = ""; // ล้างข้อมูลเก่าก่อนอัปเดตใหม่
    
    if (snapshot.empty) {
        medList.innerHTML = "<p>ยังไม่มีรายการยาที่ต้องทาน</p>";
        return;
    }

    snapshot.forEach((doc) => {
        const med = doc.data();
        
        // สร้าง HTML สำหรับแสดงรายการยา
        const medCard = document.createElement("div");
        medCard.className = "med-card";
        medCard.innerHTML = `
            <h3>💊 ${med.name}</h3>
            <p><strong>ขนาด:</strong> ${med.dose}</p>
            <p class="med-time">⏰ เวลา: ${med.time} น.</p>
        `;
        
        medList.appendChild(medCard);
    });
});
