// ==========================================
// API Endpoint: /api/admin/stats
// ==========================================

export async function onRequestGet(context) {
    const { env } = context;
    const db = env.DB;
    
    try {
        if (!db) {
            // Mock offline statistics untuk pengembangan
            return new Response(JSON.stringify({
                success: true,
                stats: {
                    usersCount: 1,
                    coursesCount: 0,
                    lessonsCount: 0,
                    quizzesCount: 0
                }
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // Menghitung jumlah dari database
        const usersCountRes = await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").first();
        const coursesCountRes = await db.prepare("SELECT COUNT(*) as count FROM courses").first();
        const lessonsCountRes = await db.prepare("SELECT COUNT(*) as count FROM lessons").first();
        const quizzesCountRes = await db.prepare("SELECT COUNT(*) as count FROM quizzes").first();
        
        return new Response(JSON.stringify({
            success: true,
            stats: {
                usersCount: usersCountRes?.count || 0,
                coursesCount: coursesCountRes?.count || 0,
                lessonsCount: lessonsCountRes?.count || 0,
                quizzesCount: quizzesCountRes?.count || 0
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
        
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal mengambil data statistik.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
