/* -------------------------
   1. Mobile Navigation Toggle
-------------------------- */
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('#navbar ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('#navbar ul li a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

/* -------------------------
   2. YouTube API Integration
-------------------------- */
const API_KEY = "AIzaSyCiLmlu43EKPMAqeKNHVHoRFl1XBvZRqG8";
const channels = [
    { id: "UCAxlmL3_721xzOjQVe5Klbg", name: "UltraOpLive" },
    { id: "UC-KkWDruqOobwZgylSb4kwA", name: "OpEarnings" }
];

async function fetchChannelData(channelId, statsId, videosId) {
    try {
        // Channel stats
        const statsRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`);
        const statsData = await statsRes.json();
        
        if (statsData.items && statsData.items.length > 0) {
            const stats = statsData.items[0].statistics;
            document.getElementById(statsId).innerHTML = `
                <p><i class="fas fa-users"></i> Subscribers: ${formatNumber(stats.subscriberCount)}</p>
                <p><i class="fas fa-eye"></i> Views: ${formatNumber(stats.viewCount)}</p>
                <p><i class="fas fa-video"></i> Videos: ${formatNumber(stats.videoCount)}</p>
            `;
        }

        // Latest videos
        const videosRes = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3`);
        const videosData = await videosRes.json();
        
        let videosHTML = '';
        if (videosData.items && videosData.items.length > 0) {
            videosData.items.forEach(video => {
                if (video.id.videoId) {
                    videosHTML += `
                        <div class="video-item">
                            <iframe src="https://www.youtube.com/embed/${video.id.videoId}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen></iframe>
                            <p>${video.snippet.title}</p>
                        </div>
                    `;
                }
            });
            document.getElementById(videosId).innerHTML = videosHTML;
        }

    } catch (error) {
        console.error("YouTube API Error:", error);
        document.getElementById(statsId).innerHTML = `<p>Unable to load stats. Please try again later.</p>`;
    }
}

// Format large numbers with commas
function formatNumber(num) {
    return parseInt(num).toLocaleString();
}

// Load data for all channels
channels.forEach(channel => {
    fetchChannelData(channel.id, `stats-${channel.name}`, `videos-${channel.name}`);
});

/* -------------------------
   3. Animated Counters
-------------------------- */
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is faster
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = formatNumber(target);
        }
    });
}

// Trigger counters when section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    observer.observe(card);
});

/* -------------------------
   4. Fan Showcase
-------------------------- */
const fanVideos = [
    { 
        link: "https://www.youtube.com/embed/yL9SV1U7lDs", 
        title: " 4.56 Million DIAMOND Giveaway" 
    },
    { 
        link: "https://www.youtube.com/embed/I2SphYdtsSs", 
        title: "Heroic Rank Power ☠️💀" 
    },
    { 
        link: "https://www.youtube.com/embed/AACiD9vq0g8", 
        title: "Landmines Went Wrong - Crazy Kills" 
    }
];

function loadFanVideos() {
    const fanGrid = document.getElementById('fan-videos');
    let html = '';
    
    fanVideos.forEach(video => {
        html += `
            <div class="fan-card">
                <iframe src="${video.link}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>
                <p>${video.title}</p>
            </div>
        `;
    });
    
    fanGrid.innerHTML = html;
}

loadFanVideos();

/* -------------------------
   5. Recent Videos Carousel
-------------------------- */
async function loadRecentVideos() {
    let allVideos = [];
    
    try {
        // Fetch videos from all channels
        for (const channel of channels) {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channel.id}&part=snippet,id&order=date&maxResults=5`);
            const data = await response.json();
            
            if (data.items) {
                data.items.forEach(video => {
                    if (video.id.videoId) {
                        allVideos.push({
                            id: video.id.videoId,
                            date: video.snippet.publishedAt,
                            title: video.snippet.title,
                            channel: channel.name
                        });
                    }
                });
            }
        }
        
        // Sort by date (newest first)
        allVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display in carousel
        const carousel = document.getElementById('recent-videos-carousel');
        let html = '';
        
        allVideos.slice(0, 10).forEach(video => {
            html += `
                <div class="video-item">
                    <iframe src="https://www.youtube.com/embed/${video.id}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen></iframe>
                    <p>${video.title}</p>
                    <small>${video.channel}</small>
                </div>
            `;
        });
        
        carousel.innerHTML = html;
        
    } catch (error) {
        console.error("Error loading recent videos:", error);
    }
}

// Carousel navigation
document.getElementById('next').addEventListener('click', () => {
    const wrapper = document.querySelector('.video-wrapper');
    wrapper.scrollBy({ left: 300, behavior: 'smooth' });
});

document.getElementById('prev').addEventListener('click', () => {
    const wrapper = document.querySelector('.video-wrapper');
    wrapper.scrollBy({ left: -300, behavior: 'smooth' });
});

loadRecentVideos();

/* -------------------------
   6. Firebase Comment Integration
-------------------------- */
// Initialize Firebase (replace with your config)
const firebaseConfig = {
    apiKey: "AIzaSyAMMma4PBE8qIuuuxmfjldoS1pOrxJPjrQ",
    authDomain: "ultraop-web.firebaseapp.com",
    projectId: "ultraop-web",
    storageBucket: "ultraop-web.appspot.com",
    messagingSenderId: "549149061567",
    appId: "1:549149061567:web:f571f50dd683d29044b10a",
    measurementId: "G-PDPHKT7R3D",
    databaseURL: "https://ultraop-web-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Comment form submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (name && email && message) {
        // Save to Firebase
        database.ref('comments').push({
            name: name,
            email: email,
            message: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            alert('Thank you for your comment!');
            document.getElementById('comment-form').reset();
        }).catch(error => {
            console.error("Error saving comment:", error);
            alert('There was an error submitting your comment. Please try again.');
        });
    } else {
        alert('Please fill in all fields.');
    }
});

/* -------------------------
   7. Particle Background
-------------------------- */
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

/* -------------------------
   8. Smooth Scrolling for Anchor Links
-------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Account for fixed header
                behavior: 'smooth'
            });
        }
    });
});