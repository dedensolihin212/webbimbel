// ==========================================
// API Endpoint: /api/courses
// ==========================================

// Mock fallbacks for standalone/offline HTML demo execution
const mockCourses = [
    {
        id: 'c-membaca',
        title: 'Pintar Membaca & Mengeja',
        description: 'Petualangan seru mengenal huruf vokal, suku kata bergambar, hingga membaca kalimat rahasia.',
        category: 'Membaca',
        difficulty_level: 'Level 1-3',
        thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'c-menulis',
        title: 'Jago Menulis & Menggambar',
        description: 'Melatih kelenturan motorik dengan pola garis ajaib, menulis angka cantik, serta ukiran huruf alfabet.',
        category: 'Menulis',
        difficulty_level: 'Level 1-3',
        thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'c-berhitung',
        title: 'Cerdas Berhitung Kreatif',
        description: 'Bermain menghitung apel manis, pesta penjumlahan buah tropis, dan teka-teki logika timbangan bergambar.',
        category: 'Berhitung',
        difficulty_level: 'Level 1-3',
        thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80'
    }
];

const mockLessons = {
    'c-membaca': [
        { id: 'l-membaca-1', title: 'Detektif Huruf Vokal (A, I, U, E, O) - Level 1 (Mudah)', content_markdown: 'Huruf vokal terdiri dari: A (Apel 🍎), I (Ikan 🐟), U (Ular 🐍), E (Ember 🪣), O (Obor 🪵). Klik huruf-huruf tersebut untuk mendengar pelafalan cara membacanya!', media_url: 'https://www.youtube.com/watch?v=NfUUlNsZBT8', media_type: 'video', sort_order: 1 },
        { id: 'l-membaca-2', title: 'Ekspedisi Menyambung Suku Kata - Level 2 (Sedang)', content_markdown: 'Gabungan suku kata menghasilkan kata yang bermakna! Contoh: BO + LA = BOLA ⚽, BU + KU = BUKU 📖, TO + PI = TOPI 🧢.', media_url: 'https://www.youtube.com/watch?v=kYvH5tZ4mS0', media_type: 'video', sort_order: 2 },
        { id: 'l-membaca-3', title: 'Detektif Kata & Kalimat Rahasia - Level 3 (Tantangan)', content_markdown: 'Belajar membaca kalimat utuh secara perlahan. Contoh: "Budi suka membaca buku cerita di pagi hari bersama Ayah."', media_url: 'https://www.youtube.com/watch?v=gTdfLle1sCs', media_type: 'video', sort_order: 3 }
    ],
    'c-menulis': [
        { id: 'l-menulis-1', title: 'Petualangan Garis Ajaib & Bentuk - Level 1 (Mudah)', content_markdown: 'Latihlah tanganmu mengikuti pola garis zig-zag, garis melengkung seperti ombak, dan lingkaran bulat seperti balon gas.', media_url: 'https://www.youtube.com/watch?v=q6XWwF0P8F8', media_type: 'video', sort_order: 1 },
        { id: 'l-menulis-2', title: 'Lukisan Angka Cantik 1-10 - Level 2 (Sedang)', content_markdown: 'Angka 1 tegak seperti tiang, angka 2 meliuk seperti leher bebek berenang, angka 3 melengkung seperti sayap kupu-kupu.', media_url: 'https://www.youtube.com/watch?v=9_6Uu6_j3wU', media_type: 'video', sort_order: 2 },
        { id: 'l-menulis-3', title: 'Ukiran Nama & Kata Istimewa - Level 3 (Tantangan)', content_markdown: 'Tantangan menulis huruf kapital dan huruf kecil A-Z secara proporsional menggunakan jarimu di layar handphone atau tablet!', media_url: 'https://www.youtube.com/watch?v=5Xy5O_p4Lzo', media_type: 'video', sort_order: 3 }
    ],
    'c-berhitung': [
        { id: 'l-berhitung-1', title: 'Berhitung Apel Merah Lezat - Level 1 (Mudah)', content_markdown: 'Hitunglah gambar buah apel satu per satu secara visual: satu, dua, tiga, empat, lima!', media_url: 'https://www.youtube.com/watch?v=12t7E5uNeyM', media_type: 'video', sort_order: 1 },
        { id: 'l-berhitung-2', title: 'Pesta Penjumlahan Buah Tropis - Level 2 (Sedang)', content_markdown: 'Penjumlahan menggabungkan dua kelompok benda menjadi satu kesatuan. Contoh: 3 Apel 🍎 + 2 Pisang 🍌 = 5 Buah keseluruhan.', media_url: 'https://www.youtube.com/watch?v=Vl03qZ-B7Yg', media_type: 'video', sort_order: 2 },
        { id: 'l-berhitung-3', title: 'Teka-Teki Timbangan & Balon - Level 3 (Tantangan)', content_markdown: 'Tantangan pengurangan dan logika timbangan. Jika ada 5 balon, lalu 2 balon meletus, berapakah balon yang masih utuh?', media_url: 'https://www.youtube.com/watch?v=kYvH5tZ4mS0', media_type: 'video', sort_order: 3 }
    ]
};

// GET Request handler: fetch all courses or a single course detail
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const db = env.DB;
    
    // Auth user if available
    const authUser = context.data.user;

    try {
        if (!db) {
            // Standalone client mock fallback
            if (id) {
                const course = mockCourses.find(c => c.id === id);
                if (!course) {
                    return new Response(JSON.stringify({ success: false, message: "Course tidak ditemukan" }), { status: 404, headers: { "Content-Type": "application/json" } });
                }
                const lessons = mockLessons[id] || [];
                return new Response(JSON.stringify({ success: true, course, lessons, completed: [] }), { status: 200, headers: { "Content-Type": "application/json" } });
            }
            return new Response(JSON.stringify({ success: true, courses: mockCourses }), { status: 200, headers: { "Content-Type": "application/json" } });
        }

        // 1. Fetching Single Course Detail
        if (id) {
            const course = await db.prepare("SELECT * FROM courses WHERE id = ?").bind(id).first();
            if (!course) {
                return new Response(JSON.stringify({ success: false, message: "Course tidak ditemukan." }), { status: 404, headers: { "Content-Type": "application/json" } });
            }
            
            // Get all lessons for this course
            const lessons = await db.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY sort_order").bind(id).all();
            
            // Track completed lessons for this specific user
            let completed = [];
            if (authUser) {
                const completions = await db.prepare(
                    "SELECT lesson_id FROM user_progress WHERE user_id = ?"
                ).bind(authUser.id).all();
                completed = completions.results.map(r => r.lesson_id);
            }
            
            return new Response(JSON.stringify({ success: true, course, lessons: lessons.results, completed }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 2. Fetching All Courses
        const courses = await db.prepare("SELECT * FROM courses").all();
        return new Response(JSON.stringify({ success: true, courses: courses.results }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Gagal mengambil data course.", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// POST Request handler: mark a lesson as completed
export async function onRequestPost(context) {
    const { request, env } = context;
    const authUser = context.data.user;
    const db = env.DB;
    
    if (!authUser) {
        return new Response(JSON.stringify({ success: false, message: "Akses ditolak. Silakan login terlebih dahulu." }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { lesson_id } = await request.json();
        
        if (!lesson_id) {
            return new Response(JSON.stringify({ success: false, message: "Lesson ID wajib diisi." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (!db) {
            // Local client completion simulation
            return new Response(JSON.stringify({ success: true, message: "Progress disimpan di local simulator." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Insert completion marker into D1
        await db.prepare(
            "INSERT OR IGNORE INTO user_progress (user_id, lesson_id) VALUES (?, ?)"
        ).bind(authUser.id, lesson_id).run();

        return new Response(JSON.stringify({ success: true, message: "Progress pembelajaran berhasil disimpan." }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Gagal memperbarui progress.", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
