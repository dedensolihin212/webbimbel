-- ==========================================
-- BintangBelajar - Schema Kurikulum Clean
-- Kurikulum Merdeka: TK, SD Kelas 1-6, SMP Kelas 7-9
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
    jenjang TEXT NOT NULL,      -- TK, SD, SMP
    grade TEXT NOT NULL,        -- TK, 1,2,3,4,5,6 (SD), 7,8,9 (SMP)
    mapel TEXT NOT NULL,        -- Nama mata pelajaran
    semester INTEGER DEFAULT 1, -- 1 atau 2
    sort_order INTEGER DEFAULT 0,
    thumbnail_url TEXT
);

-- 3. Lessons Table
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,             -- YouTube URL atau direct video URL
    video_type TEXT DEFAULT 'youtube', -- youtube, direct, none
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
