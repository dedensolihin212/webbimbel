-- ==========================================
-- BintangBelajar Database Schema & Seed Data
-- ==========================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- student, parent, admin
    grade_level TEXT NOT NULL, -- TK, SD, SMP
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- Calistung, SD, Matematika, IPA SMP
    difficulty_level TEXT NOT NULL, -- Easy, Medium, Hard
    thumbnail_url TEXT
);

-- 3. Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content_markdown TEXT,
    media_url TEXT, -- Path to R2 bucket or online URL
    media_type TEXT, -- video, pdf, interactive
    sort_order INTEGER NOT NULL
);

-- 4. Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    questions_json TEXT NOT NULL -- JSON array containing questions, options, and correct answers
);

-- 5. User Progress Table (Tracks completion)
CREATE TABLE IF NOT EXISTS user_progress (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id)
);

-- 6. Quiz Scores Table
CREATE TABLE IF NOT EXISTS quiz_scores (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA (MOCK DATA FOR TESTING)
-- ==========================================

-- Insert Sample Courses
INSERT OR REPLACE INTO courses (id, title, description, category, difficulty_level, thumbnail_url) VALUES 
('c-cal-01', 'Belajar Membaca & Menulis Ceria', 'Modul interaktif Calistung untuk mempersiapkan adik-adik TK masuk sekolah dasar dengan metode visual & audio.', 'Calistung', 'Easy', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80'),
('c-sd-01', 'Pecahan dan Bangun Datar Dasar', 'Pelajaran Matematika SD Kelas 4-5 yang dikemas seru dengan cerita dan kuis interaktif.', 'SD', 'Medium', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80'),
('c-mat-01', 'Trik Cepat Aljabar & Geometri', 'Rumus cepat dan trik menyelesaikan soal-soal matematika tersulit sekalipun.', 'Matematika', 'Hard', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80'),
('c-smp-01', 'Sistem Organ Tubuh & Tata Surya', 'Memahami materi Biologi dan Fisika SMP secara visual lengkap dengan simulasi sederhana.', 'IPA SMP', 'Medium', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80');

-- Insert Sample Lessons
INSERT OR REPLACE INTO lessons (id, course_id, title, content_markdown, media_url, media_type, sort_order) VALUES 
-- Calistung Lessons
('l-cal-1', 'c-cal-01', 'Mengenal Huruf Vokal (A, I, U, E, O)', 'Ayo adik-adik, mari kita sebutkan dan tulis huruf vokal bersama-sama! Klik huruf untuk mendengar suaranya.', '', 'interactive', 1),
('l-cal-2', 'c-cal-01', 'Latihan Menulis Angka 1 sampai 5', 'Pegang pensilmu (atau jarimu di layar) dan ikuti garis putus-putus untuk menulis angka 1-5!', '', 'interactive', 2),
('l-cal-3', 'c-cal-01', 'Kuis Menghitung Buah Apel', 'Mari berhitung! Berapa jumlah apel merah yang ada di keranjang?', '', 'interactive', 3),

-- SD Lessons
('l-sd-1', 'c-sd-01', 'Pengenalan Pecahan Sederhana', 'Pecahan menggambarkan bagian dari keseluruhan. Mari kita belah pizza imajiner kita menjadi 4 bagian!', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', 'video', 1),
('l-sd-2', 'c-sd-01', 'Mengenal Bangun Datar Segitiga & Persegi', 'Menghitung keliling dan luas bangun datar dasar dengan rumus yang menyenangkan.', '', 'pdf', 2),

-- Math Lessons
('l-mat-1', 'c-mat-01', 'Konsep Dasar Aljabar Linear', 'Menemukan nilai X dan Y tanpa ribet menggunakan trik visual eliminasi kilat.', 'https://images.unsplash.com/photo-1453733190148-c44698c265f8?auto=format&fit=crop&w=400&q=80', 'video', 1),

-- SMP Science Lessons
('l-smp-1', 'c-smp-01', 'Sistem Tata Surya & Planet-Planet', 'Mempelajari 8 planet dalam tata surya kita, orbitnya, dan mengapa Pluto tidak lagi dikategorikan sebagai planet utama.', 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80', 'video', 1),
('l-smp-2', 'c-smp-01', 'Hukum Newton I, II, dan III', 'Bagaimana gaya mempengaruhi gerak benda? Mengapa ketika bus direm mendadak tubuh kita terdorong ke depan?', '', 'pdf', 2);

-- Insert Sample Quizzes
INSERT OR REPLACE INTO quizzes (id, lesson_id, title, questions_json) VALUES 
('q-cal-1', 'l-cal-1', 'Kuis Seru Huruf Vokal', '[
  {"question": "Manakah di bawah ini yang merupakan huruf vokal?", "options": ["B", "C", "A", "D"], "answer": 2},
  {"question": "Hewan APEL diawali dengan huruf vokal apa?", "options": ["I", "E", "O", "A"], "answer": 3}
]'),
('q-sd-1', 'l-sd-1', 'Uji Pemahaman Pecahan', '[
  {"question": "Jika sebuah lingkaran dibagi menjadi 4 bagian sama besar, dan 1 bagian diarsir, berapa pecahannya?", "options": ["1/2", "1/4", "3/4", "4/1"], "answer": 1},
  {"question": "Pecahan 2/4 senilai dengan pecahan...", "options": ["1/2", "1/3", "3/4", "2/5"], "answer": 0}
]'),
('q-mat-1', 'l-mat-1', 'Kuis Aljabar Kilat', '[
  {"question": "Jika 3x + 5 = 20, berapakah nilai x?", "options": ["3", "4", "5", "6"], "answer": 2},
  {"question": "Jika x + y = 10 dan x - y = 2, berapakah nilai x?", "options": ["4", "5", "6", "8"], "answer": 2}
]'),
('q-smp-1', 'l-smp-1', 'Kuis Tata Surya Terluas', '[
  {"question": "Manakah planet terbesar dalam tata surya kita?", "options": ["Bumi", "Mars", "Jupiter", "Saturnus"], "answer": 2},
  {"question": "Planet yang dijuluki sebagai Planet Merah adalah...", "options": ["Venus", "Mars", "Merkurius", "Neptunus"], "answer": 1}
]');
