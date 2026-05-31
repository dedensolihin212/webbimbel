// ==========================================
// API Endpoint: /api/admin/quizzes
// ==========================================

// GET Request: Ambil kuis berdasarkan lesson_id
export async function onRequestGet(context) {
    const { request, env } = context;
    const db = env.DB;
    const url = new URL(request.url);
    const lessonId = url.searchParams.get("lesson_id");
    
    if (!lessonId) {
        return new Response(JSON.stringify({ success: false, message: "Lesson ID wajib dilampirkan." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
    
    try {
        if (!db) {
            return new Response(JSON.stringify({ success: true, quiz: null }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const quiz = await db.prepare("SELECT * FROM quizzes WHERE lesson_id = ?").bind(lessonId).first();
        return new Response(JSON.stringify({ success: true, quiz }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal mengambil data kuis.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// POST Request: Simpan atau Perbarui Kuis per Materi (Upsert Pattern)
export async function onRequestPost(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const body = await request.json();
        const { id, lesson_id, title, questions_json } = body;
        
        if (!lesson_id || !title || !questions_json) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "Lesson ID, Judul kuis, dan data soal (questions_json) wajib diisi." 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // Pastikan questions_json adalah valid JSON array
        try {
            const parsed = JSON.parse(questions_json);
            if (!Array.isArray(parsed)) {
                throw new Error("Kuis harus berupa Array!");
            }
        } catch (e) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "Format soal tidak valid. Harus berupa JSON Array: " + e.message 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Kuis berhasil disimpan (Simulator Offline)." 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // Cari tahu apakah sudah ada kuis untuk materi ini
        const existing = await db.prepare("SELECT id FROM quizzes WHERE lesson_id = ?").bind(lesson_id).first();
        
        if (existing) {
            // Update jika sudah ada
            await db.prepare(
                "UPDATE quizzes SET title = ?, questions_json = ? WHERE lesson_id = ?"
            ).bind(title, questions_json, lesson_id).run();
            
            return new Response(JSON.stringify({ success: true, message: "Kuis berhasil diperbarui." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // Insert baru
            const quizId = id || `q-${lesson_id}`;
            await db.prepare(
                "INSERT INTO quizzes (id, lesson_id, title, questions_json) VALUES (?, ?, ?, ?)"
            ).bind(quizId, lesson_id, title, questions_json).run();
            
            return new Response(JSON.stringify({ success: true, message: "Kuis baru berhasil dibuat." }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal menyimpan kuis.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// DELETE Request: Hapus kuis
export async function onRequestDelete(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const url = new URL(request.url);
        const lessonId = url.searchParams.get("lesson_id");
        
        if (!lessonId) {
            return new Response(JSON.stringify({ success: false, message: "Lesson ID wajib dilampirkan." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Kuis berhasil dihapus (Simulator Offline)." 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        await db.prepare("DELETE FROM quizzes WHERE lesson_id = ?").bind(lessonId).run();
        
        return new Response(JSON.stringify({ success: true, message: "Kuis berhasil dihapus." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal menghapus kuis.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
