// ==========================================
// API Endpoint: /api/quizzes
// ==========================================

const mockQuizzes = {
    'l-membaca-1': {
        id: 'q-membaca-1',
        title: 'Kuis Detektif Huruf Vokal',
        questions: [
            { question: "Manakah di bawah ini yang merupakan huruf vokal?", options: ["B", "C", "A", "D"], answer: 2 },
            { question: "Gambar APEL diawali dengan huruf vokal apa?", options: ["I", "E", "O", "A"], answer: 3 },
            { question: "Kata IKAN memiliki huruf vokal pertama yaitu?", options: ["I", "U", "E", "O"], answer: 0 }
        ]
    },
    'l-membaca-2': {
        id: 'q-membaca-2',
        title: 'Kuis Ekspedisi Suku Kata',
        questions: [
            { question: "Jika kita menggabungkan BO dan LA, maka akan menjadi kata?", options: ["BOLA ⚽", "BOBI 🐶", "BALON 🎈", "BOLU 🍰"], answer: 0 },
            { question: "Benda BUKU 📖 terbentuk dari suku kata?", options: ["BU + KA", "BU + KU", "BA + KU", "BI + KI"], answer: 1 },
            { question: "Suku kata yang hilang pada TO + ... = TOPI 🧢 adalah?", options: ["PA", "PE", "PI", "PU"], answer: 2 }
        ]
    },
    'l-membaca-3': {
        id: 'q-membaca-3',
        title: 'Kuis Detektif Kalimat Rahasia',
        questions: [
            { question: "Susun huruf acak ini menjadi nama hewan pemakan pisang: K - E - N - A - G - O", options: ["KUCING", "KELINCI", "MONYET", "KANGURU"], answer: 2 },
            { question: "Baca kalimat ini: \"Kucing hitam itu melompat tinggi.\" Siapakah yang melompat tinggi?", options: ["Kucing hitam", "Kucing putih", "Anjing hitam", "Kelinci melompat"], answer: 0 },
            { question: "Lengkapi kalimat ini: \"Adik minum ... hangat di pagi hari.\"", options: ["Nasi", "Susu 🥛", "Buku", "Mainan"], answer: 1 }
        ]
    },
    'l-menulis-1': {
        id: 'q-menulis-1',
        title: 'Kuis Garis Ajaib & Bentuk',
        questions: [
            { question: "Bentuk apakah yang mirip dengan buah apel merah?", options: ["Segitiga", "Lingkaran 🔴", "Kotak", "Garis Lurus"], answer: 1 },
            { question: "Garis yang naik turun seperti puncak gunung dinamakan garis...", options: ["Lurus", "Melingkar", "Zig-zag ⛰️", "Tebal"], answer: 2 }
        ]
    },
    'l-menulis-2': {
        id: 'q-menulis-2',
        title: 'Kuis Lukisan Angka Cantik',
        questions: [
            { question: "Angka berapakah yang bentuknya mirip dengan leher bebek berenang?", options: ["Angka 1", "Angka 2 🦆", "Angka 3", "Angka 4"], answer: 1 },
            { question: "Berapa jumlah garis tegak lurus yang dibutuhkan untuk menulis angka 1?", options: ["1 garis 📏", "2 garis", "3 garis", "Tidak ada"], answer: 0 }
        ]
    },
    'l-menulis-3': {
        id: 'q-menulis-3',
        title: 'Kuis Ukiran Nama & Huruf',
        questions: [
            { question: "Huruf pertama saat kita ingin menulis kata \"MATA\" adalah...", options: ["N", "M", "W", "A"], answer: 1 },
            { question: "Manakah penulisan kata \"IBU\" yang benar?", options: ["U-B-I", "I-B-U 👩", "B-I-U", "I-U-B"], answer: 1 }
        ]
    },
    'l-berhitung-1': {
        id: 'q-berhitung-1',
        title: 'Kuis Berhitung Apel Merah',
        questions: [
            { question: "Ada 3 apel di atas meja, lalu ibu meletakkan 1 apel lagi. Berapa jumlah semua apel?", options: ["3 apel", "4 apel 🍎", "5 apel", "2 apel"], answer: 1 },
            { question: "Jika di keranjang ada 5 buah apel merah dan kita ambil 2, ada berapa apel tersisa di keranjang?", options: ["1 apel", "2 apel", "3 apel 🍎", "4 apel"], answer: 2 }
        ]
    },
    'l-berhitung-2': {
        id: 'q-berhitung-2',
        title: 'Kuis Pesta Penjumlahan',
        questions: [
            { question: "3 Stroberi 🍓 + 4 Jeruk 🍊 sama dengan berapa buah keseluruhan?", options: ["5 buah", "6 buah", "7 buah 🌟", "8 buah"], answer: 2 },
            { question: "2 Pisang 🍌 + 2 Pisang 🍌 sama dengan...", options: ["4 Pisang 🍌", "3 Pisang", "5 Pisang", "6 Pisang"], answer: 0 }
        ]
    },
    'l-berhitung-3': {
        id: 'q-berhitung-3',
        title: 'Kuis Timbangan & Balon Misterius',
        questions: [
            { question: "Ada 6 balon terbang 🎈. Tiba-tiba ada 3 balon meletus 💥. Berapa balon yang masih terbang indah?", options: ["2 balon", "3 balon 🎈", "4 balon", "5 balon"], answer: 1 },
            { question: "Di piring ada 8 biskuit 🍪. Dodi memakan 4 biskuit. Kemudian adik memakan 2 biskuit. Berapa biskuit tersisa?", options: ["2 biskuit 🍪", "4 biskuit", "1 biskuit", "Tidak ada biskuit"], answer: 0 },
            { question: "Jika 1 apel beratnya sama dengan 2 stroberi, maka 2 apel beratnya sama dengan berapa stroberi?", options: ["2 stroberi", "3 stroberi", "4 stroberi 🍓", "5 stroberi"], answer: 2 }
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
