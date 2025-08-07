// Blog Data - In a real app, this would come from a CMS or database
const blogPosts = [
    {
        id: 1,
        title: "Top 5 Free Fire Strategies for Rank Push",
        excerpt: "Learn the best strategies to rank up quickly in Free Fire this season.",
        category: "gaming",
        image: "freefire-strategies.jpg",
        date: "2023-06-15",
        views: 12500,
        content: `
            <h2>Top 5 Free Fire Strategies for Rank Push</h2>
            <div class="post-meta">
                <span class="post-category">Gaming</span>
                <span>Posted on June 15, 2023</span>
                <span>12,500 views</span>
            </div>
            <p>Rank pushing in Free Fire requires more than just good aim. Here are the top strategies...</p>
            <!-- More content -->
        `
    },
    {
        id: 2,
        title: "How to Grow as a Gaming Content Creator",
        excerpt: "Essential tips for new gaming content creators looking to grow their audience.",
        category: "support",
        image: "creator-growth.jpg",
        date: "2023-06-10",
        views: 8400,
        content: `
            <h2>How to Grow as a Gaming Content Creator</h2>
            <div class="post-meta">
                <span class="post-category">Creators Support</span>
                <span>Posted on June 10, 2023</span>
                <span>8,400 views</span>
            </div>
            <p>Building an audience as a gaming creator takes time and strategy...</p>
            <!-- More content -->
        `
    },
    {
        id: 3,
        title: "Latest Free Fire Redeem Codes (June 2023)",
        excerpt: "Get the newest redeem codes for Free Fire with this exclusive generator.",
        category: "redeem",
        image: "redeem-codes.jpg",
        date: "2023-06-01",
        views: 35600,
        content: `
            <h2>Latest Free Fire Redeem Codes (June 2023)</h2>
            <div class="post-meta">
                <span class="post-category">Free Redeem Codes</span>
                <span>Posted on June 1, 2023</span>
                <span>35,600 views</span>
            </div>
            <p>Here are the latest redeem codes for Free Fire. Make sure to redeem them before they expire!</p>
            <p>To get your exclusive redeem code, use our generator below after watching a short ad.</p>
            <!-- More content -->
            <p>Remember to check back regularly as we update these codes frequently.</p>
        `
    },
    // Add more posts as needed
];

// DOM Elements
const postsContainer = document.getElementById('posts-container');
const singlePostSection = document.getElementById('single-post');
const postContent = document.getElementById('post-content');
const backToBlogBtn = document.getElementById('back-to-blog');
const tabButtons = document.querySelectorAll('.tab-btn');
const redeemSection = document.getElementById('redeem-section');
const generateCodeBtn = document.getElementById('generate-code-btn');
const codeDisplay = document.getElementById('code-display');
const adModal = document.getElementById('ad-modal');
const closeAdBtn = document.getElementById('close-ad');
const adTimer = document.getElementById('ad-timer');

// Current category filter
let currentCategory = 'all';

// Initialize the blog
function initBlog() {
    renderPosts();
    setupEventListeners();
}

// Render posts based on current category
function renderPosts() {
    postsContainer.innerHTML = '';
    
    const filteredPosts = currentCategory === 'all' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === currentCategory);
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '<p class="no-posts">No posts found in this category.</p>';
        return;
    }
    
    filteredPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <img src="images/${post.image}" alt="${post.title}" class="post-image">
            <div class="post-content">
                <span class="post-category">${formatCategory(post.category)}</span>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-meta">
                    <span>${formatDate(post.date)}</span>
                    <span>${post.views.toLocaleString()} views</span>
                </div>
            </div>
        `;
        
        postCard.addEventListener('click', () => showSinglePost(post.id));
        postsContainer.appendChild(postCard);
    });
}

// Show single post view
function showSinglePost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;
    
    // Update view count (in a real app, this would be server-side)
    post.views += 1;
    
    postContent.innerHTML = post.content;
    
    // Show redeem section only for redeem category
    if (post.category === 'redeem') {
        redeemSection.style.display = 'block';
    } else {
        redeemSection.style.display = 'none';
    }
    
    // Hide posts grid, show single post
    document.querySelector('.blog-posts').style.display = 'none';
    singlePostSection.style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Back to blog list view
function backToBlog() {
    document.querySelector('.blog-posts').style.display = 'block';
    singlePostSection.style.display = 'none';
}

// Format category for display
function formatCategory(category) {
    const categories = {
        gaming: 'Gaming',
        knowledge: 'General Knowledge',
        news: 'Gaming News',
        support: 'Creators Support',
        redeem: 'Free Redeem Codes'
    };
    return categories[category] || category;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Generate random redeem code
function generateRedeemCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
        if ((i + 1) % 4 === 0 && i !== 11) code += '-';
    }
    return code;
}

// Show full screen ad
function showFullScreenAd() {
    adModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    let secondsLeft = 90;
    adTimer.textContent = secondsLeft;
    closeAdBtn.textContent = `Close Ad (${secondsLeft}s)`;
    closeAdBtn.disabled = true;
    
    const timer = setInterval(() => {
        secondsLeft--;
        adTimer.textContent = secondsLeft;
        closeAdBtn.textContent = `Close Ad (${secondsLeft}s)`;
        
        if (secondsLeft <= 0) {
            clearInterval(timer);
            closeAdBtn.disabled = false;
            closeAdBtn.textContent = 'Close Ad';
        }
    }, 1000);
    
    return timer;
}

// Setup event listeners
function setupEventListeners() {
    // Tab buttons
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderPosts();
        });
    });
    
    // Back to blog button
    backToBlogBtn.addEventListener('click', backToBlog);
    
    // Generate code button
    generateCodeBtn.addEventListener('click', () => {
        const timer = showFullScreenAd();
        
        // In a real app, you would verify the ad was completed
        closeAdBtn.addEventListener('click', function handler() {
            if (!closeAdBtn.disabled) {
                // Generate and display code
                const code = generateRedeemCode();
                codeDisplay.textContent = code;
                codeDisplay.style.display = 'block';
                
                // Close modal
                adModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                clearInterval(timer);
                
                // Remove this event listener
                closeAdBtn.removeEventListener('click', handler);
            }
        }, { once: true });
    });
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', initBlog);