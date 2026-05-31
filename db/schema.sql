-- ==========================================
-- BintangBelajar - Schema Kurikulum Clean
-- Khusus Kurikulum Calistung (Membaca, Menulis, Berhitung)
-- Level 1 (Dasar), Level 2 (Menengah), Level 3 (Tantangan Mahir)
-- ==========================================

-- Drop existing tables to recreate fresh
DROP TABLE IF EXISTS quiz_scores;
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    grade_level TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    jenjang TEXT NOT NULL,      -- Calistung
    grade TEXT NOT NULL,        -- Level 1, Level 2, Level 3
    mapel TEXT NOT NULL,        -- Membaca, Menulis, Berhitung
    semester INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    thumbnail_url TEXT
);

-- 3. Lessons Table
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,             -- YouTube URL
    video_type TEXT DEFAULT 'youtube',
    materi_text TEXT,           -- Ringkasan materi
    sort_order INTEGER NOT NULL
);

-- 4. Quizzes Table
CREATE TABLE quizzes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    questions_json TEXT NOT NULL -- Format: JSON Array [{"question":"...", "options":["..."], "answer": 0}]
);

-- 5. User Progress Table
CREATE TABLE user_progress (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id)
);

-- 6. Quiz Scores Table
CREATE TABLE quiz_scores (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    quiz_id TEXT REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INITIAL DATA: DEFAULT ADMIN USER
-- ==========================================
-- password_hash adalah SHA-256 dari 'admin123'
INSERT INTO users (id, name, email, password_hash, role, grade_level)
VALUES (
    'usr-admin', 
    'Admin BintangBelajar', 
    'admin@bintangbelajar.com', 
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 
    'admin', 
    'ADMIN'
);

-- ==========================================
-- INITIAL SEED DATA: COURSES
-- ==========================================
INSERT INTO courses (id, title, description, jenjang, grade, mapel, semester, sort_order, thumbnail_url)
VALUES 
('c-membaca', 'Pintar Membaca & Mengeja', 'Petualangan seru mengenal huruf vokal, suku kata bergambar, hingga membaca kalimat rahasia.', 'Calistung', 'Level 1-3', 'Membaca', 1, 1, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80'),
('c-menulis', 'Jago Menulis & Menggambar', 'Melatih kelenturan motorik dengan pola garis ajaib, menulis angka cantik, serta ukiran huruf alfabet.', 'Calistung', 'Level 1-3', 'Menulis', 1, 2, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80'),
('c-berhitung', 'Cerdas Berhitung Kreatif', 'Bermain menghitung apel manis, pesta penjumlahan buah tropis, dan teka-teki logika timbangan bergambar.', 'Calistung', 'Level 1-3', 'Berhitung', 1, 3, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80');

-- ==========================================
-- INITIAL SEED DATA: LESSONS
-- ==========================================
-- Membaca Lessons
INSERT INTO lessons (id, course_id, title, description, video_url, video_type, materi_text, sort_order)
VALUES 
('l-membaca-1', 'c-membaca', 'Detektif Huruf Vokal (A, I, U, E, O) - Level 1 (Mudah)', 'Ayo cari tahu huruf vokal rahasia di balik benda-benda sekitar kita! Tonton video tutorial pengerjaan dari Kakak Tutor dulu ya.', 'https://www.youtube.com/watch?v=NfUUlNsZBT8', 'youtube', 'Huruf vokal terdiri dari: A (Apel 🍎), I (Ikan 🐟), U (Ular 🐍), E (Ember 🪣), O (Obor 🪵). Klik huruf-huruf tersebut untuk mendengar pelafalan cara membacanya!', 1),
('l-membaca-2', 'c-membaca', 'Ekspedisi Menyambung Suku Kata - Level 2 (Sedang)', 'Gabungkan potongan-potongan suku kata untuk membentuk nama benda ajaib secara tepat!', 'https://www.youtube.com/watch?v=kYvH5tZ4mS0', 'youtube', 'Gabungan suku kata menghasilkan kata yang bermakna! Contoh: BO + LA = BOLA ⚽, BU + KU = BUKU 📖, TO + PI = TOPI 🧢.', 2),
('l-membaca-3', 'c-membaca', 'Detektif Kata & Kalimat Rahasia - Level 3 (Tantangan)', 'Pecahkan kode nama hewan yang acak-acakan dan bacalah kalimat instruksi pendek dengan cerdik!', 'https://www.youtube.com/watch?v=gTdfLle1sCs', 'youtube', 'Belajar membaca kalimat utuh secara perlahan. Contoh: "Budi suka membaca buku cerita di pagi hari bersama Ayah."', 3);

-- Menulis Lessons
INSERT INTO lessons (id, course_id, title, description, video_url, video_type, materi_text, sort_order)
VALUES 
('l-menulis-1', 'c-menulis', 'Petualangan Garis Ajaib & Bentuk - Level 1 (Mudah)', 'Melatih motorik halus tangan dengan menggambar garis lurus, bergelombang, dan melingkar di papan gambar digital!', 'https://www.youtube.com/watch?v=q6XWwF0P8F8', 'youtube', 'Latihlah tanganmu mengikuti pola garis zig-zag, garis melengkung seperti ombak, dan lingkaran bulat seperti balon gas.', 1),
('l-menulis-2', 'c-menulis', 'Lukisan Angka Cantik 1-10 - Level 2 (Sedang)', 'Tulis angka 1 sampai 10 di kanvas digital dengan mengikuti pola dot trace helper!', 'https://www.youtube.com/watch?v=9_6Uu6_j3wU', 'youtube', 'Angka 1 tegak seperti tiang, angka 2 meliuk seperti leher bebek berenang, angka 3 melengkung seperti sayap kupu-kupu.', 2),
('l-menulis-3', 'c-menulis', 'Ukiran Nama & Kata Istimewa - Level 3 (Tantangan)', 'Menulis huruf alfabet lengkap serta belajar menulis kata di papan coret digital.', 'https://www.youtube.com/watch?v=5Xy5O_p4Lzo', 'youtube', 'Tantangan menulis huruf kapital dan huruf kecil A-Z secara proporsional menggunakan jarimu di layar handphone atau tablet!', 3);

-- Berhitung Lessons
INSERT INTO lessons (id, course_id, title, description, video_url, video_type, materi_text, sort_order)
VALUES 
('l-berhitung-1', 'c-berhitung', 'Berhitung Apel Merah Lezat - Level 1 (Mudah)', 'Menghitung jumlah apel merah manis yang ada di dalam keranjang belanjaan dengan gembira!', 'https://www.youtube.com/watch?v=12t7E5uNeyM', 'youtube', 'Hitunglah gambar buah apel satu per satu secara visual: satu, dua, tiga, empat, lima!', 1),
('l-berhitung-2', 'c-berhitung', 'Pesta Penjumlahan Buah Tropis - Level 2 (Sedang)', 'Gabungkan buah stroberi merah dengan pisang kuning untuk menghasilkan penjumlahan buah manis!', 'https://www.youtube.com/watch?v=Vl03qZ-B7Yg', 'youtube', 'Penjumlahan menggabungkan dua kelompok benda menjadi satu kesatuan. Contoh: 3 Apel 🍎 + 2 Pisang 🍌 = 5 Buah keseluruhan.', 2),
('l-berhitung-3', 'c-berhitung', 'Teka-Teki Timbangan & Balon - Level 3 (Tantangan)', 'Memecahkan teka-teki logika timbangan buah serta menghitung sisa balon udara yang terbang tinggi!', 'https://www.youtube.com/watch?v=kYvH5tZ4mS0', 'youtube', 'Tantangan pengurangan dan logika timbangan. Jika ada 5 balon, lalu 2 balon meletus, berapakah balon yang masih utuh?', 3);

-- ==========================================
-- INITIAL SEED DATA: QUIZZES
-- ==========================================
-- Membaca Quizzes
INSERT INTO quizzes (id, lesson_id, title, questions_json)
VALUES 
('q-membaca-1', 'l-membaca-1', 'Kuis Detektif Huruf Vokal', '[
    {"question": "Manakah di bawah ini yang merupakan huruf vokal?", "options": ["B", "C", "A", "D"], "answer": 2},
    {"question": "Gambar APEL diawali dengan huruf vokal apa?", "options": ["I", "E", "O", "A"], "answer": 3},
    {"question": "Kata IKAN memiliki huruf vokal pertama yaitu?", "options": ["I", "U", "E", "O"], "answer": 0}
]'),
('q-membaca-2', 'l-membaca-2', 'Kuis Ekspedisi Suku Kata', '[
    {"question": "Jika kita menggabungkan BO dan LA, maka akan menjadi kata?", "options": ["BOLA ⚽", "BOBI 🐶", "BALON 🎈", "BOLU 🍰"], "answer": 0},
    {"question": "Benda BUKU 📖 terbentuk dari suku kata?", "options": ["BU + KA", "BU + KU", "BA + KU", "BI + KI"], "answer": 1},
    {"question": "Suku kata yang hilang pada TO + ... = TOPI 🧢 adalah?", "options": ["PA", "PE", "PI", "PU"], "answer": 2}
]'),
('q-membaca-3', 'l-membaca-3', 'Kuis Detektif Kalimat Rahasia', '[
    {"question": "Susun huruf acak ini menjadi nama hewan pemakan pisang: K - E - N - A - G - O", "options": ["KUCING", "KELINCI", "MONYET", "KANGURU"], "answer": 2},
    {"question": "Baca kalimat ini: \"Kucing hitam itu melompat tinggi.\" Siapakah yang melompat tinggi?", "options": ["Kucing hitam", "Kucing putih", "Anjing hitam", "Kelinci melompat"], "answer": 0},
    {"question": "Lengkapi kalimat ini: \"Adik minum ... hangat di pagi hari.\"", "options": ["Nasi", "Susu 🥛", "Buku", "Mainan"], "answer": 1}
]');

-- Menulis Quizzes
INSERT INTO quizzes (id, lesson_id, title, questions_json)
VALUES 
('q-menulis-1', 'l-menulis-1', 'Kuis Garis Ajaib & Bentuk', '[
    {"question": "Bentuk apakah yang mirip dengan buah apel merah?", "options": ["Segitiga", "Lingkaran 🔴", "Kotak", "Garis Lurus"], "answer": 1},
    {"question": "Garis yang naik turun seperti puncak gunung dinamakan garis...", "options": ["Lurus", "Melingkar", "Zig-zag ⛰️", "Tebal"], "answer": 2}
]'),
('q-menulis-2', 'l-menulis-2', 'Kuis Lukisan Angka Cantik', '[
    {"question": "Angka berapakah yang bentuknya mirip dengan leher bebek berenang?", "options": ["Angka 1", "Angka 2 🦆", "Angka 3", "Angka 4"], "answer": 1},
    {"question": "Berapa jumlah garis tegak lurus yang dibutuhkan untuk menulis angka 1?", "options": ["1 garis 📏", "2 garis", "3 garis", "Tidak ada"], "answer": 0}
]'),
('q-menulis-3', 'l-menulis-3', 'Kuis Ukiran Nama & Huruf', '[
    {"question": "Huruf pertama saat kita ingin menulis kata \"MATA\" adalah...", "options": ["N", "M", "W", "A"], "answer": 1},
    {"question": "Manakah penulisan kata \"IBU\" yang benar?", "options": ["U-B-I", "I-B-U 👩", "B-I-U", "I-U-B"], "answer": 1}
]');

-- Berhitung Quizzes
INSERT INTO quizzes (id, lesson_id, title, questions_json)
VALUES 
('q-berhitung-1', 'l-berhitung-1', 'Kuis Berhitung Apel Merah', '[
    {"question": "Ada 3 apel di atas meja, lalu ibu meletakkan 1 apel lagi. Berapa jumlah semua apel?", "options": ["3 apel", "4 apel 🍎", "5 apel", "2 apel"], "answer": 1},
    {"question": "Jika di keranjang ada 5 buah apel merah dan kita ambil 2, ada berapa apel tersisa di keranjang?", "options": ["1 apel", "2 apel", "3 apel 🍎", "4 apel"], "answer": 2}
]'),
('q-berhitung-2', 'l-berhitung-2', 'Kuis Pesta Penjumlahan', '[
    {"question": "3 Stroberi 🍓 + 4 Jeruk 🍊 sama dengan berapa buah keseluruhan?", "options": ["5 buah", "6 buah", "7 buah 🌟", "8 buah"], "answer": 2},
    {"question": "2 Pisang 🍌 + 2 Pisang 🍌 sama dengan...", "options": ["4 Pisang 🍌", "3 Pisang", "5 Pisang", "6 Pisang"], "answer": 0}
]'),
('q-berhitung-3', 'l-berhitung-3', 'Kuis Timbangan & Balon Misterius', '[
    {"question": "Ada 6 balon terbang 🎈. Tiba-tiba ada 3 balon meletus 💥. Berapa balon yang masih terbang indah?", "options": ["2 balon", "3 balon 🎈", "4 balon", "5 balon"], "answer": 1},
    {"question": "Di piring ada 8 biskuit 🍪. Dodi memakan 4 biskuit. Kemudian adik memakan 2 biskuit. Berapa biskuit tersisa?", "options": ["2 biskuit 🍪", "4 biskuit", "1 biskuit", "Tidak ada biskuit"], "answer": 0},
    {"question": "Jika 1 apel beratnya sama dengan 2 stroberi, maka 2 apel beratnya sama dengan berapa stroberi?", "options": ["2 stroberi", "3 stroberi", "4 stroberi 🍓", "5 stroberi"], "answer": 2}
]');
