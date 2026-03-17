import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHsow_1xhst-NG4M0TX5nt2bXfxJ0LhQg",
    authDomain: "yapuyaapp.firebaseapp.com",
    projectId: "yapuyaapp",
    storageBucket: "yapuyaapp.firebasestorage.app",
    messagingSenderId: "861406844734",
    appId: "1:861406844734:web:adcc9f9d8890f3f440fe6f",
    measurementId: "G-JTYP8WJCTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Weather Logic
const weatherApiKey = "ใส่_OPENWEATHER_API_KEY_ตรงนี้"; // สมัครฟรีที่ openweathermap.org
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=th`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert("ไม่พบชื่อเมือง กรุณาลองใหม่");
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function displayWeather(data) {
    document.getElementById('weatherResult').style.display = 'block';
    document.getElementById('cityName').innerText = data.name;
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('temp').innerText = Math.round(data.main.temp);
    document.getElementById('humidity').innerText = data.main.humidity;
}
