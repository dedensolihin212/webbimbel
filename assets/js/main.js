// ==========================================
// BintangBelajar Core JS & Alpine.js Stores
// ==========================================

document.addEventListener('alpine:init', () => {
    
    // 1. Toast Notification Store
    Alpine.store('toast', {
        list: [],
        show(message, type = 'success', duration = 3000) {
            const id = Date.now();
            this.list.push({ id, message, type });
            setTimeout(() => {
                this.list = this.list.filter(item => item.id !== id);
            }, duration);
        },
        success(msg, dur) { this.show(msg, 'success', dur); },
        error(msg, dur) { this.show(msg, 'error', dur); },
        info(msg, dur) { this.show(msg, 'info', dur); },
        warning(msg, dur) { this.show(msg, 'warning', dur); }
    });

    // 2. Authentication & Client state Store
    Alpine.store('auth', {
        user: null,
        token: null,
        initialized: false,

        init() {
            // Load credentials from localStorage if present
            const storedUser = localStorage.getItem('bb_user');
            const storedToken = localStorage.getItem('bb_token');
            if (storedUser && storedToken) {
                this.user = JSON.parse(storedUser);
                this.token = storedToken;
            }
            this.initialized = true;
            this.checkSession();
        },

        async checkSession() {
            try {
                const res = await fetch('/api/auth/status', {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    this.setUser(data.user, this.token);
                }
            } catch (err) {
                // If offline or function not deployed, fallback gracefully
                console.log("Using local offline fallback authentication");
            }
        },

        setUser(user, token) {
            this.user = user;
            this.token = token;
            if (user) {
                localStorage.setItem('bb_user', JSON.stringify(user));
                localStorage.setItem('bb_token', token);
            } else {
                localStorage.removeItem('bb_user');
                localStorage.removeItem('bb_token');
            }
        },

        async login(email, password) {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    this.setUser(data.user, data.token);
                    Alpine.store('toast').success(`Selamat datang kembali, ${data.user.name}!`);
                    return { success: true };
                } else {
                    const err = await res.json();
                    return { success: false, message: err.message || 'Login gagal.' };
                }
            } catch (e) {
                // FALLBACK OFFLINE SIMULATION: So the app runs directly in the browser!
                return this.simulatedLogin(email, password);
            }
        },

        simulatedLogin(email, password) {
            console.log("Simulating local login...");
            const offlineUsers = JSON.parse(localStorage.getItem('bb_offline_users') || '[]');
            const user = offlineUsers.find(u => u.email === email);
            
            // Seed default users if none exist
            if (!user && email === 'admin@bintangbelajar.com' && password === 'admin123') {
                const seedAdmin = { id: 'usr-admin', name: 'Admin BintangBelajar', email: 'admin@bintangbelajar.com', grade_level: 'ADMIN', role: 'admin' };
                this.setUser(seedAdmin, 'mock-jwt-token-admin');
                Alpine.store('toast').success("Selamat datang, Administrator (Demo mode)!");
                return { success: true };
            }
            if (!user && email === 'budi@gmail.com' && password === 'budi123') {
                const seedUser = { id: 'usr-budi', name: 'Budi Pratama', email: 'budi@gmail.com', grade_level: 'SD', role: 'student' };
                this.setUser(seedUser, 'mock-jwt-token');
                Alpine.store('toast').success("Selamat datang kembali, Budi (Demo mode)!");
                return { success: true };
            } else if (user && password === 'bintang123') { // simple password rule for demo
                this.setUser(user, 'mock-jwt-token');
                Alpine.store('toast').success(`Selamat datang, ${user.name} (Demo mode)!`);
                return { success: true };
            }
            
            return { success: false, message: 'Email atau password salah. (Gunakan email: budi@gmail.com, pass: budi123 untuk Demo)' };
        },

        async register(name, email, password, grade_level) {
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, grade_level })
                });
                
                if (res.ok) {
                    const data = await res.json();
                    this.setUser(data.user, data.token);
                    Alpine.store('toast').success(`Registrasi berhasil! Selamat bergabung, ${name}.`);
                    return { success: true };
                } else {
                    const err = await res.json();
                    return { success: false, message: err.message || 'Registrasi gagal.' };
                }
            } catch (e) {
                // FALLBACK OFFLINE REGISTRATION
                console.log("Simulating local registration...");
                const offlineUsers = JSON.parse(localStorage.getItem('bb_offline_users') || '[]');
                
                if (offlineUsers.some(u => u.email === email) || email === 'budi@gmail.com') {
                    return { success: false, message: 'Email sudah terdaftar.' };
                }
                
                const newUser = { id: 'usr-' + Date.now(), name, email, grade_level, role: 'student' };
                offlineUsers.push(newUser);
                localStorage.setItem('bb_offline_users', JSON.stringify(offlineUsers));
                this.setUser(newUser, 'mock-jwt-token');
                Alpine.store('toast').success(`Registrasi Berhasil! Selamat datang, ${name} (Demo mode).`);
                return { success: true };
            }
        },

        logout() {
            this.setUser(null, null);
            Alpine.store('toast').info('Anda telah keluar.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    });
});

// ==========================================
// Client-Side Confetti Rain Effect
// ==========================================
window.triggerConfetti = function() {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;
    
    // Create element overlay for canvas particles
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#84cc16', '#eab308', '#f97316'];
    const particles = [];
    
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height - 20,
            r: Math.random() * 6 + 4,
            d: Math.random() * canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncremental: Math.random() * 0.07 + 0.02,
            tiltAngle: 0
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let remaining = false;
        particles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;
            
            if (p.y < canvas.height) {
                remaining = true;
            }
            
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        });
        
        if (remaining && Date.now() < end) {
            requestAnimationFrame(draw);
        } else {
            document.body.removeChild(canvas);
        }
    }
    
    draw();
};
