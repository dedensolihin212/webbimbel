// ==========================================
// API Endpoint: /api/auth/register
// ==========================================

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

// Simple JWT generation (HS256 mock/lightweight signed payload for serverless)
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
        const { name, email, password, grade_level } = await request.json();
        
        if (!name || !email || !password || !grade_level) {
            return new Response(JSON.stringify({ success: false, message: "Semua kolom wajib diisi." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const db = env.DB;
        if (!db) {
            // Simulated fallback if local environment isn't bound to D1 yet
            const mockUser = { id: `usr-${Date.now()}`, name, email, grade_level, role: "student" };
            const token = generateToken(mockUser);
            return new Response(JSON.stringify({ success: true, user: mockUser, token }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 1. Check if user already exists
        const existing = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
        if (existing) {
            return new Response(JSON.stringify({ success: false, message: "Email sudah terdaftar." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // 2. Hash Password
        const passwordHash = await hashPassword(password);
        const userId = `usr-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
        
        // 3. Insert into D1
        await db.prepare(
            "INSERT INTO users (id, name, email, password_hash, grade_level, role) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(userId, name, email, passwordHash, grade_level, "student").run();
        
        const userPayload = { id: userId, name, email, grade_level, role: "student" };
        const token = generateToken(userPayload);
        
        return new Response(JSON.stringify({ success: true, user: userPayload, token }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Registrasi gagal.", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
