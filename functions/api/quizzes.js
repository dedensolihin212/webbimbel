// ==========================================
// API Endpoint: /api/quizzes
// ==========================================

const mockQuizzes = {
    'l-cal-1': {
        id: 'q-cal-1',
        title: 'Kuis Seru Huruf Vokal',
        questions: [
            { question: "Manakah di bawah ini yang merupakan huruf vokal?", options: ["B", "C", "A", "D"], answer: 2 },
            { question: "Hewan APEL diawali dengan huruf vokal apa?", options: ["I", "E", "O", "A"], answer: 3 }
        ]
    },
    'l-sd-1': {
        id: 'q-sd-1',
        title: 'Uji Pemahaman Pecahan',
        questions: [
            { question: "Jika sebuah lingkaran dibagi menjadi 4 bagian sama besar, dan 1 bagian diarsir, berapa pecahannya?", options: ["1/2", "1/4", "3/4", "4/1"], answer: 1 },
            { question: "Pecahan 2/4 senilai dengan pecahan...", options: ["1/2", "1/3", "3/4", "2/5"], answer: 0 }
        ]
    },
    'l-mat-1': {
        id: 'q-mat-1',
        title: 'Kuis Aljabar Kilat',
        questions: [
            { question: "Jika 3x + 5 = 20, berapakah nilai x?", options: ["3", "4", "5", "6"], answer: 2 },
            { question: "Jika x + y = 10 dan x - y = 2, berapakah nilai x?", options: ["4", "5", "6", "8"], answer: 2 }
        ]
    },
    'l-smp-1': {
        id: 'q-smp-1',
        title: 'Kuis Tata Surya Terluas',
        questions: [
            { question: "Manakah planet terbesar dalam tata surya kita?", options: ["Bumi", "Mars", "Jupiter", "Saturnus"], answer: 2 },
            { question: "Planet yang dijuluki sebagai Planet Merah adalah...", options: ["Venus", "Mars", "Merkurius", "Neptunus"], answer: 1 }
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
