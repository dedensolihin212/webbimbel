// ==========================================
// API Endpoint: /api/quizzes
// ==========================================

const mockQuizzes = {
    'l-membaca-1': {
        id: 'q-membaca-1',
        title: 'Kuis Detektif Huruf Vokal',
        questions: [
            { type: "voice_choice", question: "Manakah di bawah ini yang merupakan huruf vokal A?", options: ["Huruf B", "Huruf C", "Huruf A 🌟", "Huruf D"], answer: 2 },
            { type: "voice_choice", question: "Gambar APEL 🍎 diawali dengan huruf vokal apa?", options: ["Huruf I", "Huruf E", "Huruf O", "Huruf A 🍎"], answer: 3 },
            { type: "voice_choice", question: "Kata IKAN 🐟 memiliki huruf vokal pertama yaitu?", options: ["Huruf I 🐟", "Huruf U", "Huruf E", "Huruf O"], answer: 0 }
        ]
    },
    'l-membaca-2': {
        id: 'q-membaca-2',
        title: 'Kuis Ekspedisi Suku Kata',
        questions: [
            { type: "spell", question: "Gabungkan suku kata berikut menjadi kata BOLA ⚽", word: "BOLA", jumbled: ["LA", "BO"], options: ["BOLA ⚽", "BOBI 🐶", "BALON 🎈", "BOLU 🍰"], answer: 0 },
            { type: "spell", question: "Gabungkan suku kata berikut menjadi kata BUKU 📖", word: "BUKU", jumbled: ["KU", "BU"], options: ["BUKA 🚪", "BUKU 📖", "BAKU 📦", "BIKI 🍨"], answer: 1 },
            { type: "spell", question: "Suku kata yang hilang pada TO + ... = TOPI 🧢 adalah?", word: "PI", jumbled: ["PA", "PI"], options: ["TOPA 👒", "TOPE 🕶️", "TOPI 🧢", "TOPU 🧁"], answer: 2 }
        ]
    },
    'l-membaca-3': {
        id: 'q-membaca-3',
        title: 'Kuis Detektif Kalimat Rahasia',
        questions: [
            { type: "spell_letters", question: "Susun huruf acak berikut agar membentuk nama hewan pemakan pisang: MONYET 🐒", word: "MONYET", jumbled: ["Y", "E", "M", "N", "T", "O"], options: ["KUCING", "KELINCI", "MONYET 🐒", "KANGURU"], answer: 2 },
            { type: "voice_choice", question: "Baca kalimat ini: \"Kucing hitam itu melompat tinggi.\" Siapakah yang melompat tinggi?", options: ["Kucing hitam 🐈", "Kucing putih", "Anjing hitam", "Kelinci melompat"], answer: 0 },
            { type: "voice_choice", question: "Lengkapi kalimat ini: \"Adik minum ... hangat di pagi hari.\"", options: ["Nasi", "Susu 🥛", "Buku", "Mainan"], answer: 1 }
        ]
    },
    'l-menulis-1': {
        id: 'q-menulis-1',
        title: 'Kuis Garis Ajaib & Bentuk',
        questions: [
            { type: "trace", question: "Ikuti pola lingkaran bulat menyerupai buah apel merah! 🍎", watermark: "O", guide_path: "circle", options: ["Selesai Melukis 👍"], answer: 0 },
            { type: "trace", question: "Ikuti pola garis zig-zag naik turun seperti puncak gunung! ⛰️", watermark: "M", guide_path: "zigzag", options: ["Selesai Melukis 👍"], answer: 0 }
        ]
    },
    'l-menulis-2': {
        id: 'q-menulis-2',
        title: 'Kuis Lukisan Angka Cantik',
        questions: [
            { type: "trace", question: "Mari melukis angka 2 yang mirip dengan leher bebek berenang! 🦆", watermark: "2", guide_path: "number_2", options: ["Selesai Melukis 👍"], answer: 0 },
            { type: "trace", question: "Mari melukis angka 1 tegak lurus yang mirip dengan tiang bendera! 📏", watermark: "1", guide_path: "number_1", options: ["Selesai Melukis 👍"], answer: 0 }
        ]
    },
    'l-menulis-3': {
        id: 'q-menulis-3',
        title: 'Kuis Ukiran Nama & Huruf',
        questions: [
            { type: "trace", question: "Mari mengukir huruf pertama dari kata IBU, yaitu huruf I kapital! 👩", watermark: "I", guide_path: "letter_I", options: ["Selesai Melukis 👍"], answer: 0},
            { type: "trace", question: "Mari menulis kata lengkap IBU di papan tulis digital! 👩", watermark: "IBU", guide_path: "word_IBU", options: ["Selesai Melukis 👍"], answer: 0}
        ]
    },
    'l-berhitung-1': {
        id: 'q-berhitung-1',
        title: 'Kuis Berhitung Apel Merah',
        questions: [
            { type: "count", question: "Ada berapa buah apel merah lezat di dalam keranjang? 🍎", icon: "🍎", count: 3, options: ["2 Apel", "3 Apel 🍎", "4 Apel", "5 Apel"], answer: 1},
            { type: "count", question: "Ibu memasukkan buah apel baru ke keranjang! Coba hitung ada berapa apel sekarang? 🍎", icon: "🍎", count: 5, options: ["3 Apel", "4 Apel", "5 Apel 🍎", "6 Apel"], answer: 2}
        ]
    },
    'l-berhitung-2': {
        id: 'q-berhitung-2',
        title: 'Kuis Pesta Penjumlahan',
        questions: [
            { type: "sum", question: "Berapakah jumlah dari 3 stroberi manis ditambah 4 buah jeruk segar? 🍓🍊", left_icon: "🍓", left_count: 3, right_icon: "🍊", right_count: 4, options: ["5 Buah", "6 Buah", "7 Buah 🌟", "8 Buah"], answer: 2},
            { type: "sum", question: "Dodi membawa 2 pisang kuning, lalu adik membawa 2 pisang lagi. Berapakah jumlah seluruh pisang? 🍌", left_icon: "🍌", left_count: 2, right_icon: "🍌", right_count: 2, options: ["4 Pisang 🍌", "3 Pisang", "5 Pisang", "6 Pisang"], answer: 0}
        ]
    },
    'l-berhitung-3': {
        id: 'q-berhitung-3',
        title: 'Kuis Timbangan & Balon Misterius',
        questions: [
            { type: "count", question: "Ada 6 balon terbang 🎈. Tiba-tiba ada 3 balon meletus 💥. Berapa balon yang masih terbang indah? 🎈", icon: "🎈", count: 3, options: ["2 balon", "3 balon 🎈", "4 balon", "5 balon"], answer: 1},
            { type: "count", question: "Di piring ada 8 biskuit 🍪. Dodi memakan 4 biskuit, lalu adik memakan 2 biskuit. Berapa biskuit tersisa? 🍪", icon: "🍪", count: 2, options: ["2 biskuit 🍪", "4 biskuit", "1 biskuit", "Tidak ada biskuit"], answer: 0},
            { type: "scale", question: "Jika 1 apel 🍎 beratnya sama dengan 2 stroberi 🍓, maka 2 apel beratnya sama dengan berapa stroberi?", left_icon: "🍎", left_count: 2, right_icon: "🍓", right_count: 4, options: ["2 Stroberi", "3 Stroberi", "4 Stroberi 🍓", "5 Stroberi"], answer: 2}
        ]
    }
};

// GET Request: Fetch quiz content by lesson_id
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const lessonId = url.searchParams.get("lesson_id");
    const db = env.DB;

    if (!lessonId) {
        return new Response(JSON.stringify({ success: false, message: "Lesson ID wajib disertakan." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        if (!db) {
            // Standalone offline simulator fallback
            const quiz = mockQuizzes[lessonId];
            if (!quiz) {
                return new Response(JSON.stringify({ success: false, message: "Kuis tidak ditemukan untuk lesson ini." }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }
            return new Response(JSON.stringify({ success: true, quiz }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Fetch quiz by lesson relation
        const quiz = await db.prepare("SELECT * FROM quizzes WHERE lesson_id = ?").bind(lessonId).first();
        if (!quiz) {
            return new Response(JSON.stringify({ success: false, message: "Kuis tidak ditemukan." }), {
                status: 404,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Parse serialized JSON questions array
        const questions = JSON.parse(quiz.questions_json);
        return new Response(JSON.stringify({
            success: true,
            quiz: {
                id: quiz.id,
                title: quiz.title,
                questions
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Gagal mengambil data kuis.", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

// POST Request: Submit quiz scoring answers
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
        const { quiz_id, score, total_questions } = await request.json();

        if (!quiz_id || score === undefined || !total_questions) {
            return new Response(JSON.stringify({ success: false, message: "Parameter kuis tidak lengkap." }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (!db) {
            // Local client score simulation
            return new Response(JSON.stringify({ success: true, message: "Skor berhasil dicatat di local simulator." }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        const scoreId = `scr-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
        
        // Save score record to D1
        await db.prepare(
            "INSERT INTO quiz_scores (id, user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?, ?)"
        ).bind(scoreId, authUser.id, quiz_id, score, total_questions).run();

        return new Response(JSON.stringify({ success: true, message: "Skor berhasil disimpan ke D1.", score_id: scoreId }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: "Gagal menyimpan skor kuis.", error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
