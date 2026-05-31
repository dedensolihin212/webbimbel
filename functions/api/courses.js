// ==========================================
// API Endpoint: /api/courses
// ==========================================

// Mock fallbacks for standalone/offline HTML demo execution
const mockCourses = [
    {
        id: 'c-cal-01',
        title: 'Belajar Membaca & Menulis Ceria',
        description: 'Modul interaktif Calistung untuk mempersiapkan adik-adik TK masuk sekolah dasar dengan metode visual & audio.',
        category: 'Calistung',
        difficulty_level: 'Easy',
        thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'c-sd-01',
        title: 'Pecahan dan Bangun Datar Dasar',
        description: 'Pelajaran Matematika SD Kelas 4-5 yang dikemas seru dengan cerita dan kuis interaktif.',
        category: 'SD',
        difficulty_level: 'Medium',
        thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'c-mat-01',
        title: 'Trik Cepat Aljabar & Geometri',
        description: 'Rumus cepat dan trik menyelesaikan soal-soal matematika tersulit sekalipun.',
        category: 'Matematika',
        difficulty_level: 'Hard',
        thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: 'c-smp-01',
        title: 'Sistem Organ Tubuh & Tata Surya',
        description: 'Memahami materi Biologi dan Fisika SMP secara visual lengkap dengan simulasi sederhana.',
        category: 'IPA SMP',
        difficulty_level: 'Medium',
        thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80'
    }
];

const mockLessons = {
    'c-cal-01': [
        { id: 'l-cal-1', title: 'Mengenal Huruf Vokal (A, I, U, E, O)', content_markdown: 'Ayo adik-adik, mari kita sebutkan dan tulis huruf vokal bersama-sama! Klik huruf untuk mendengar suaranya.', media_url: '', media_type: 'interactive', sort_order: 1 },
        { id: 'l-cal-2', title: 'Latihan Menulis Angka 1 sampai 5', content_markdown: 'Pegang pensilmu (atau jarimu di layar) dan ikuti garis putus-putus untuk menulis angka 1-5!', media_url: '', media_type: 'interactive', sort_order: 2 },
        { id: 'l-cal-3', title: 'Kuis Menghitung Buah Apel', content_markdown: 'Mari berhitung! Berapa jumlah apel merah yang ada di keranjang?', media_url: '', media_type: 'interactive', sort_order: 3 }
    ],
    'c-sd-01': [
        { id: 'l-sd-1', title: 'Pengenalan Pecahan Sederhana', content_markdown: 'Pecahan menggambarkan bagian dari keseluruhan. Mari kita belah pizza imajiner kita menjadi 4 bagian!', media_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', media_type: 'video', sort_order: 1 },
        { id: 'l-sd-2', title: 'Mengenal Bangun Datar Segitiga & Persegi', content_markdown: 'Menghitung keliling dan luas bangun datar dasar dengan rumus yang menyenangkan.', media_url: '', media_type: 'pdf', sort_order: 2 }
    ],
    'c-mat-01': [
        { id: 'l-mat-1', title: 'Konsep Dasar Aljabar Linear', content_markdown: 'Menemukan nilai X dan Y tanpa ribet menggunakan trik visual eliminasi kilat.', media_url: 'https://images.unsplash.com/photo-1453733190148-c44698c265f8?auto=format&fit=crop&w=400&q=80', media_type: 'video', sort_order: 1 }
    ],
    'c-smp-01': [
        { id: 'l-smp-1', title: 'Sistem Tata Surya & Planet-Planet', content_markdown: 'Mempelajari 8 planet dalam tata surya kita, orbitnya, dan mengapa Pluto tidak lagi dikategorikan sebagai planet utama.', media_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80', media_type: 'video', sort_order: 1 },
        { id: 'l-smp-2', title: 'Hukum Newton I, II, dan III', content_markdown: 'Bagaimana gaya mempengaruhi gerak benda? Mengapa ketika bus direm mendadak tubuh kita terdorong ke depan?', media_url: '', media_type: 'pdf', sort_order: 2 }
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
