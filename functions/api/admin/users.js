// ==========================================
// API Endpoint: /api/admin/users
// ==========================================

export async function onRequestGet(context) {
    const { env } = context;
    const db = env.DB;
    
    try {
        if (!db) {
            // Mock offline data siswa untuk simulator
            return new Response(JSON.stringify({
                success: true,
                users: [
                    { 
                        id: 'usr-budi', 
                        name: 'Budi Pratama', 
                        email: 'budi@gmail.com', 
                        role: 'student', 
                        grade_level: 'SD-4', 
                        created_at: '2026-05-31 12:00:00' 
                    }
                ]
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // Ambil daftar siswa terdaftar, sembunyikan password hash
        const users = await db.prepare(
            "SELECT id, name, email, role, grade_level, created_at FROM users WHERE role = 'student' ORDER BY created_at DESC"
        ).all();
        
        return new Response(JSON.stringify({ success: true, users: users.results }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal mengambil data siswa.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
