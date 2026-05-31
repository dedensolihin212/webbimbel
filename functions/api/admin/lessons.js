// ==========================================
// API Endpoint: /api/admin/lessons
// ==========================================

// GET Request: Ambil daftar materi (opsional filter berdasarkan course_id)
export async function onRequestGet(context) {
    const { request, env } = context;
    const db = env.DB;
    const url = new URL(request.url);
    const courseId = url.searchParams.get("course_id");
    
    try {
        if (!db) {
            return new Response(JSON.stringify({ success: true, lessons: [] }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        let stmt;
        if (courseId) {
            stmt = db.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY sort_order").bind(courseId);
        } else {
            stmt = db.prepare("SELECT * FROM lessons ORDER BY course_id, sort_order");
        }
        
        const lessons = await stmt.all();
        return new Response(JSON.stringify({ success: true, lessons: lessons.results }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal mengambil data materi.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// POST Request: Tambah materi baru
export async function onRequestPost(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const body = await request.json();
        const { id, course_id, title, description, video_url, video_type, materi_text, sort_order } = body;
        
        if (!id || !course_id || !title) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "ID, Course ID, dan Judul materi wajib diisi." 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Materi berhasil ditambahkan (Simulator Offline)." 
            }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        await db.prepare(
            "INSERT INTO lessons (id, course_id, title, description, video_url, video_type, materi_text, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
            id, course_id, title, description || "", video_url || "", video_type || "youtube", materi_text || "", sort_order || 0
        ).run();
        
        return new Response(JSON.stringify({ success: true, message: "Materi berhasil ditambahkan." }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal menambahkan materi.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// PUT Request: Perbarui data materi
export async function onRequestPut(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const body = await request.json();
        const { id, course_id, title, description, video_url, video_type, materi_text, sort_order } = body;
        
        if (!id || !course_id || !title) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "ID, Course ID, dan Judul materi wajib diisi." 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Materi berhasil diperbarui (Simulator Offline)." 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        await db.prepare(
            "UPDATE lessons SET course_id = ?, title = ?, description = ?, video_url = ?, video_type = ?, materi_text = ?, sort_order = ? WHERE id = ?"
        ).bind(
            course_id, title, description || "", video_url || "", video_type || "youtube", materi_text || "", sort_order || 0, id
        ).run();
        
        return new Response(JSON.stringify({ success: true, message: "Materi berhasil diperbarui." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal memperbarui data materi.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// DELETE Request: Hapus materi
export async function onRequestDelete(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        
        if (!id) {
            return new Response(JSON.stringify({ success: false, message: "ID materi wajib dilampirkan." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Materi berhasil dihapus (Simulator Offline)." 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        await db.prepare("DELETE FROM lessons WHERE id = ?").bind(id).run();
        
        return new Response(JSON.stringify({ success: true, message: "Materi berhasil dihapus." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal menghapus data materi.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
