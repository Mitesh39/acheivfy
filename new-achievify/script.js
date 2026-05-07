document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENT SELECTIONS ---
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const authError = document.getElementById('auth-error');
    const logoutButton = document.getElementById('logout-button');
    const welcomeHeading = document.getElementById('welcome-heading');
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    // --- AUTHENTICATION LOGIC ---
    showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthView(false); });
    showLoginLink.addEventListener('click', (e) => { e.preventDefault(); toggleAuthView(true); });

    function toggleAuthView(isLogin) {
        loginView.classList.toggle('hidden', !isLogin);
        registerView.classList.toggle('hidden', isLogin);
        authError.textContent = '';
    }

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const users = JSON.parse(localStorage.getItem('achievifyUsers')) || [];
        if (users.find(user => user.email === email)) {
            authError.textContent = 'An account with this email already exists.';
            return;
        }
        users.push({ name, email, password });
        localStorage.setItem('achievifyUsers', JSON.stringify(users));
        alert('Registration successful! Please log in.');
        toggleAuthView(true);
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('achievifyUsers')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            showApp();
        } else {
            authError.textContent = 'Invalid email or password.';
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        showAuth();
    });

    // --- CORE APP NAVIGATION & STATE ---
    function showApp() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) return;
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        welcomeHeading.textContent = `Welcome, ${user.name}!`;
        showPage('home-page');
    }

    function showAuth() {
        appContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
    }

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) link.classList.add('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(link.dataset.page);
        });
    });

    // Make the new homepage CTA button work
    const planDayCta = document.getElementById('plan-day-cta');
    planDayCta.addEventListener('click', () => {
        showPage('planner-page');
    });

    // Initial check on page load to see if user is already logged in
    if (localStorage.getItem('loggedInUser')) {
        showApp();
    } else {
        showAuth();
    }

    // --- DYNAMIC PARTICLE BACKGROUND ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray;
    const particleColors = ['#2575fc', '#6a11cb', '#E94560'];
    class Particle { constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color; } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); } update() { if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX; if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY; this.x += this.directionX; this.y += this.directionY; this.draw(); } }
    function initParticles() { particlesArray = []; let numberOfParticles = (canvas.height * canvas.width) / 9000; for (let i = 0; i < numberOfParticles; i++) { let size = (Math.random() * 5) + 1; let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2); let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2); let directionX = (Math.random() * .4) - .2; let directionY = (Math.random() * .4) - .2; let color = particleColors[Math.floor(Math.random() * particleColors.length)]; particlesArray.push(new Particle(x, y, directionX, directionY, size, color)); } }
    function animateParticles() { requestAnimationFrame(animateParticles); ctx.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); } }
    initParticles();
    animateParticles();
    window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; initParticles(); });

    // --- ENHANCED DAY PLANNER ---
    const todoInput = document.getElementById('todo-input');
    const todoPriority = document.getElementById('todo-priority');
    const addTaskButton = document.getElementById('add-task-button');
    const todoList = document.getElementById('todo-list');
    let tasks = [];
    function renderTasks() { todoList.innerHTML = ''; tasks.forEach((task, index) => { const li = document.createElement('li'); li.className = task.completed ? 'completed' : ''; li.innerHTML = `<span class="task-content">${task.text} <span class="priority-tag ${task.priority}">${task.priority}</span></span><button class="delete-btn" data-index="${index}">Delete</button>`; todoList.appendChild(li); }); updateStats(); }
    function updateStats() { document.getElementById('tasks-today-stat').textContent = tasks.length; document.getElementById('tasks-completed-stat').textContent = tasks.filter(t => t.completed).length; }
    addTaskButton.addEventListener('click', () => { if (todoInput.value.trim() === '') return; tasks.push({ text: todoInput.value, priority: todoPriority.value, completed: false }); todoInput.value = ''; renderTasks(); });
    todoList.addEventListener('click', (e) => { if (e.target.classList.contains('delete-btn')) { tasks.splice(e.target.dataset.index, 1); } if (e.target.classList.contains('task-content')) { const index = Array.from(todoList.children).indexOf(e.target.parentElement); tasks[index].completed = !tasks[index].completed; } renderTasks(); });

    // --- TIMETABLE DISPLAY ---
    const timetableFile = document.getElementById('timetable-file');
    const timetableDisplay = document.getElementById('timetable-display');
    const timetablePlaceholder = document.getElementById('timetable-placeholder');
    timetableFile.addEventListener('change', function() { const file = this.files[0]; if (file) { const reader = new FileReader(); reader.onload = function(e) { timetableDisplay.src = e.target.result; timetableDisplay.style.display = 'block'; timetablePlaceholder.style.display = 'none'; }; reader.readAsDataURL(file); } });

    // --- DYNAMIC MOTIVATION & GALLERY GRIDS ---
    function populateMotivationGrid() {
        const grid = document.getElementById('motivation-grid');
        grid.innerHTML = '';
        const quotes = [
            { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { text: "Strive for progress, not perfection.", author: "Unknown" },
            { text: "Your limitation is only your imagination.", author: "Unknown" },
            { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
            { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
            { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
            { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
            { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
            { text: "The man who does not read has no advantage over the man who cannot read.", author: "Mark Twain" }
        ];
        quotes.forEach(q => {
            const card = document.createElement('div');
            card.className = 'quote-card';
            card.innerHTML = `
                <p class="quote-text">${q.text}</p>
                <p class="quote-author">${q.author}</p>
            `;
            grid.appendChild(card);
        });
    }

   function populateImageGrid() {
        const grid = document.getElementById('image-gallery-grid');
        grid.innerHTML = ''; // Clear previous content
        const imageItems = [
            { type: 'img', src: 'https://th.bing.com/th/id/OIG4.FU_k.hW5pW.nE0rbLN0Y?w=270&h=270&c=6&r=0&o=5&dpr=2&pid=ImgGn', alt: 'Student studying with books' },
            { type: 'img', src: 'https://th.bing.com/th/id/OIG3.piBat7rbhQA2GxDMrJWR?w=270&h=270&c=6&r=0&o=5&dpr=2&pid=ImgGn', alt: 'A library of books' },
            { type: 'img', src: 'https://th.bing.com/th/id/OIG2.Vkkqz25jLe7C2ST4HyEH?w=270&h=270&c=6&r=0&o=5&dpr=2&pid=ImgGn', alt: 'A classroom with desks' },
            { type: 'img', src: 'https://th.bing.com/th/id/OIG1.A1IrsMDZyibKiJwMHis_?w=270&h=270&c=6&r=0&o=5&dpr=2&pid=ImgGn', alt: 'Students laughing and collaborating' },
            { type: 'img', src: 'https://th.bing.com/th/id/OIG3.dxeEvfezH.cv6ASgsxjZ?w=270&h=270&c=6&r=0&o=5&dpr=2&pid=ImgGn', alt: 'A person holding a book from a library shelf' },
        ];
        imageItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'masonry-item';
            el.innerHTML = `<img src="${item.src}" alt="${item.alt}">`;
            grid.appendChild(el);
        });
    }

    function populateVideoGrid() {
        const grid = document.getElementById('video-gallery-grid');
        grid.innerHTML = ''; // Clear previous content
        const videoItems = [
            { type: 'iframe', src: 'https://www.youtube.com/embed/jfKfPfyJRdk' },
            { type: 'iframe', src: 'https://www.youtube.com/embed/Tuw8hxrFBH8' },
            { type: 'iframe', src: 'https://www.youtube.com/embed/W6wVU5b5nQk' },
        ];
        videoItems.forEach(item => {
            const el = document.createElement('div');
            el.className = 'masonry-item'; // We can reuse the same class for the container
            el.innerHTML = `<iframe src="${item.src}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            grid.appendChild(el);
        });
    }

    populateMotivationGrid();
    populateImageGrid();
    populateVideoGrid();

    // --- FUNCTIONAL CONTACT FORM (EmailJS) ---
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-form-status');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        contactStatus.textContent = 'Sending...';

        const serviceID = 'YOUR_SERVICE_ID';
        const templateID = 'YOUR_TEMPLATE_ID';
        const publicKey = 'YOUR_PUBLIC_KEY';

        emailjs.init(publicKey);

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                contactStatus.textContent = 'Message sent successfully!';
                contactStatus.style.color = 'var(--success-color)';
                contactForm.reset();
            }, (err) => {
                contactStatus.textContent = 'Failed to send. Please try again.';
                contactStatus.style.color = 'var(--accent-color)';
                alert(JSON.stringify(err));
            });
    });

});