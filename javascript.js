// นำเข้าฟังก์ชันที่จำเป็นจาก Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

// เริ่มต้นใช้งาน Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// อ้างอิงไปยังคอลเลกชัน "portfolios" ในฐานข้อมูล
const colRef = collection(db, 'portfolios');

// จัดการการส่งฟอร์มเพื่อเพิ่มข้อมูล
const form = document.getElementById('portfolio-form');
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช

    // ดึงค่าจากฟอร์ม
    const titleValue = document.getElementById('title').value;
    const descValue = document.getElementById('description').value;
    const linkValue = document.getElementById('link').value;

    try {
        // เพิ่มข้อมูลลง Firestore
        await addDoc(colRef, {
            title: titleValue,
            description: descValue,
            link: linkValue,
            createdAt: serverTimestamp() // บันทึกเวลาที่สร้าง
        });
        
        // ล้างข้อมูลในฟอร์มหลังจากบันทึกเสร็จ
        form.reset();
        alert("บันทึกผลงานเรียบร้อยแล้ว!");
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก: ", error);
        alert("ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
    }
});

// แสดงข้อมูลแบบเรียลไทม์
const container = document.getElementById('portfolio-container');
// เรียงลำดับจากข้อมูลที่สร้างล่าสุด
const q = query(colRef, orderBy('createdAt', 'desc'));

onSnapshot(q, (snapshot) => {
    let html = '';
    snapshot.forEach((doc) => {
        const data = doc.data();
        html += `
            <div class="portfolio-card">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                ${data.link ? `<a href="${data.link}" target="_blank">ดูผลงาน</a>` : ''}
            </div>
        `;
    });
    container.innerHTML = html;
});
