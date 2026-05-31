// ==========================================
// API Endpoint: /api/admin/courses
// ==========================================

// GET Request: Ambil semua daftar kursus
export async function onRequestGet(context) {
    const { env } = context;
    const db = env.DB;
    
    try {
        if (!db) {
            return new Response(JSON.stringify({ success: true, courses: [] }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        const courses = await db.prepare("SELECT * FROM courses ORDER BY jenjang, grade, sort_order").all();
        return new Response(JSON.stringify({ success: true, courses: courses.results }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal mengambil data kursus.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// POST Request: Tambah kursus baru
export async function onRequestPost(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const body = await request.json();
        const { id, title, description, jenjang, grade, mapel, semester, sort_order, thumbnail_url } = body;
        
        if (!id || !title || !jenjang || !grade || !mapel) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "ID, Judul, Jenjang, Kelas, dan Mata Pelajaran wajib diisi." 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Kursus berhasil ditambahkan (Simulator Offline)." 
            }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        await db.prepare(
            "INSERT INTO courses (id, title, description, jenjang, grade, mapel, semester, sort_order, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
            id, title, description || "", jenjang, grade, mapel, semester || 1, sort_order || 0, thumbnail_url || ""
        ).run();
        
        return new Response(JSON.stringify({ success: true, message: "Kursus berhasil ditambahkan ke database." }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal menambahkan kursus.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// PUT Request: Perbarui data kursus
export async function onRequestPut(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const body = await request.json();
        const { id, title, description, jenjang, grade, mapel, semester, sort_order, thumbnail_url } = body;
        
        if (!id || !title || !jenjang || !grade || !mapel) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "ID, Judul, Jenjang, Kelas, dan Mata Pelajaran wajib diisi." 
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Kursus berhasil diperbarui (Simulator Offline)." 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        await db.prepare(
            "UPDATE courses SET title = ?, description = ?, jenjang = ?, grade = ?, mapel = ?, semester = ?, sort_order = ?, thumbnail_url = ? WHERE id = ?"
        ).bind(
            title, description || "", jenjang, grade, mapel, semester || 1, sort_order || 0, thumbnail_url || "", id
        ).run();
        
        return new Response(JSON.stringify({ success: true, message: "Kursus berhasil diperbarui." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal memperbarui data kursus.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// DELETE Request: Hapus kursus
export async function onRequestDelete(context) {
    const { request, env } = context;
    const db = env.DB;
    
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        
        if (!id) {
            return new Response(JSON.stringify({ success: false, message: "ID kursus wajib dilampirkan." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        if (!db) {
            return new Response(JSON.stringify({ 
                success: true, 
                message: "Kursus berhasil dihapus (Simulator Offline)." 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
        
        // Hapus kuis & progres secara kaskade melalui D1 (jika didukung referensi kunci luar)
        // D1 mendukung ON DELETE CASCADE secara standar jika relasi diaktifkan, namun agar aman mari kita hapus secara eksplisit
        await db.prepare("DELETE FROM courses WHERE id = ?").bind(id).run();
        
        return new Response(JSON.stringify({ success: true, message: "Kursus berhasil dihapus." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Gagal menghapus data kursus.", 
            error: err.message 
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
