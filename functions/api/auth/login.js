// ==========================================
// API Endpoint: /api/auth/login
// ==========================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function generateToken(payload) {
    const header = { alg: "HS256", typ: "JWT" };
    const stringifiedHeader = btoa(JSON.stringify(header));
    const stringifiedPayload = btoa(JSON.stringify(payload));
    const signature = btoa("signature-secret-verification"); // dev simplification
    return `${stringifiedHeader}.${stringifiedPayload}.${signature}`;
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const { email, password } = await request.json();
        
        if (!email || !password) {
            return new Response(JSON.stringify({ success: false, message: "Email dan password wajib diisi." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const db = env.DB;
        if (!db) {
            // Simulated fallback for testing when D1 is offline
            if (email === "admin@bintangbelajar.com" && password === "admin123") {
                const mockUser = { id: "usr-admin", name: "Admin BintangBelajar", email: "admin@bintangbelajar.com", grade_level: "ADMIN", role: "admin" };
                const token = generateToken(mockUser);
                return new Response(JSON.stringify({ success: true, user: mockUser, token }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }
            if (email === "budi@gmail.com" && password === "budi123") {
                const mockUser = { id: "usr-budi", name: "Budi Pratama", email: "budi@gmail.com", grade_level: "SD", role: "student" };
                const token = generateToken(mockUser);
                return new Response(JSON.stringify({ success: true, user: mockUser, token }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }
            return new Response(JSON.stringify({ success: false, message: "Email atau password salah. (Gunakan budi@gmail.com / budi123)" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 1. Fetch user from database
        const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (!user) {
            return new Response(JSON.stringify({ success: false, message: "Email atau password salah." }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 2. Match Hash
        const passwordHash = await hashPassword(password);
        if (user.password_hash !== passwordHash) {
            return new Response(JSON.stringify({ success: false, message: "Email atau password salah." }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 3. Generate credentials
        const userPayload = { id: user.id, name: user.name, email: user.email, grade_level: user.grade_level, role: user.role };
        const token = generateToken(userPayload);
        
        return new Response(JSON.stringify({ success: true, user: userPayload, token }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Login gagal.", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
