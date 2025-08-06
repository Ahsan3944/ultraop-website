/* -------------------------
   1. YouTube API Integration
-------------------------- */
const API_KEY = "AIzaSyCiLmlu43EKPMAqeKNHVHoRFl1XBvZRqG8"; // এখানে তোমার সিকিউর করা YouTube API Key বসাও
const channels = [
    "UCAxlmL3_721xzOjQVe5Klbg", // UltraOpLive
    "UC-KkWDruqOobwZgylSb4kwA"  // Op Earnings
];

// চ্যানেলের স্ট্যাটস ও ভিডিও লোড
async function fetchChannelData(channelId, statsId, videosId) {
    try {
        // চ্যানেল স্ট্যাটস
        const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`);
        const statsData = await statsRes.json();
        const stats = statsData.items[0].statistics;
        document.getElementById(statsId).innerHTML = `
            <p>Subscribers: ${stats.subscriberCount}</p>
            <p>Total Views: ${stats.viewCount}</p>
            <p>Videos: ${stats.videoCount}</p>
        `;

        // সর্বশেষ ভিডিও
        const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`);
        const videosData = await videosRes.json();
        let videosHTML = '';
        videosData.items.forEach(video => {
            if (video.id.videoId) {
                videosHTML += `<iframe width="300" height="200" src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>`;
            }
        });
        document.getElementById(videosId).innerHTML = videosHTML;

    } catch (error) {
        console.error("YouTube API Error:", error);
    }
}

// ডেটা লোড
fetchChannelData(channels[0], "stats-UltraOpLive", "videos-UltraOpLive");
fetchChannelData(channels[1], "stats-OpEarnings", "videos-OpEarnings");

/* -------------------------
   2. UltraOP Achievements Animated Counters
-------------------------- */
const counters = document.querySelectorAll('.counter');
let animated = false;

function animateCounters() {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            let count = parseInt(counter.innerText);
            const increment = target / 200;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

window.addEventListener('scroll', () => {
    const trivia = document.querySelector('#fun-trivia');
    const position = trivia.getBoundingClientRect().top;
    if (!animated && position < window.innerHeight) {
        animateCounters();
        animated = true;
    }
});

/* -------------------------
   3. Fans Showcase (Manual)
-------------------------- */
const fanVideos = [
    { link: "https://www.youtube.com/embed/NMg55_AgJHk", title: "Fan 1 - Awesome Montage" },
    { link: "https://www.youtube.com/embed/j1W0mpUMtYc", title: "Fan 2 - Epic Gameplay" }
];
let fanHTML = '';
fanVideos.forEach(video => {
    fanHTML += `
        <div class="fan-card">
            <iframe width="300" height="200" src="${video.link}" frameborder="0" allowfullscreen></iframe>
            <p>${video.title}</p>
        </div>
    `;
});
document.getElementById("fan-videos").innerHTML = fanHTML;

/* -------------------------
   4. Recent Videos Carousel (Sorted by Date)
-------------------------- */
async function loadRecentVideos() {
    let videoList = [];

    for (const channelId of channels) {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`);
        const data = await response.json();
        data.items.forEach(video => {
            if (video.id.videoId) {
                videoList.push({ id: video.id.videoId, date: video.snippet.publishedAt });
            }
        });
    }

    // ডেট অনুযায়ী সাজানো
    videoList.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Carousel-এ ভিডিও যোগ
    const wrapper = document.getElementById("recent-videos-carousel");
    videoList.slice(0, 15).forEach(video => {
        wrapper.innerHTML += `<iframe width="300" height="200" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>`;
    });
}
loadRecentVideos();

// Carousel Slide Control
const wrapper = document.getElementById("recent-videos-carousel");
let offset = 0;
document.getElementById("next").addEventListener("click", () => {
    offset -= 320;
    wrapper.style.transform = `translateX(${offset}px)`;
});
document.getElementById("prev").addEventListener("click", () => {
    offset += 320;
    wrapper.style.transform = `translateX(${offset}px)`;
});

/* -------------------------
   5. Firebase Comment Box
-------------------------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMMma4PBE8qIuuuxmfjldoS1pOrxJPjrQ",
    authDomain: "ultraop-web.firebaseapp.com",
    projectId: "ultraop-web",
    storageBucket: "ultraop-web.firebasestorage.app",
    messagingSenderId: "549149061567",
    appId: "1:549149061567:web:f571f50dd683d29044b10a",
    measurementId: "G-PDPHKT7R3D",
    databaseURL: "https://ultraop-web-default-rtdb.firebaseio.com/"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById("comment-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    push(ref(database, "comments/"), { name, email, message, timestamp: Date.now() });

    alert("Your comment has been submitted!");
    document.getElementById("comment-form").reset();
});

/* -------------------------
   6. Particle Background
-------------------------- */
const particlesContainer = document.getElementById("particles");
for (let i = 0; i < 40; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.position = "absolute";
    particle.style.width = "5px";
    particle.style.height = "5px";
    particle.style.background = "#0ff";
    particle.style.borderRadius = "50%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.opacity = Math.random();
    particlesContainer.appendChild(particle);
}
setInterval(() => {
    document.querySelectorAll(".particle").forEach(p => {
        p.style.top = Math.random() * 100 + "%";
        p.style.left = Math.random() * 100 + "%";
    });
}, 3000);
