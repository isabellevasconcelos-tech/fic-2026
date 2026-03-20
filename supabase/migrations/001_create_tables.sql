-- ============================================
-- MoneyQuest - Database Schema
-- ============================================

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_emoji TEXT NOT NULL DEFAULT '🚀',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Modules (trilhas de aprendizado)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '📚',
  color TEXT NOT NULL DEFAULT '#00FF88',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  total_xp INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Lessons (aulas dentro de cada modulo)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content_markdown TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  duration_minutes INTEGER NOT NULL DEFAULT 5,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(module_id, slug)
);

-- 4. Quizzes (perguntas de quiz por aula)
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. User Progress (aulas completadas)
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- 6. User Quiz Results
CREATE TABLE user_quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '[]',
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Achievements (conquistas disponiveis)
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL DEFAULT 'general',
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL DEFAULT 1,
  xp_bonus INTEGER NOT NULL DEFAULT 25,
  is_secret BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. User Achievements (conquistas desbloqueadas)
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX idx_user_quiz_results_user_id ON user_quiz_results(user_id);
CREATE INDEX idx_user_quiz_results_lesson_id ON user_quiz_results(lesson_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_quizzes_lesson_id ON quizzes(lesson_id);
CREATE INDEX idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX idx_modules_order ON modules(order_index);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);

-- ============================================
-- Leaderboard View
-- ============================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id,
  p.username,
  p.full_name,
  p.avatar_emoji,
  p.xp,
  p.level,
  p.streak_days,
  RANK() OVER (ORDER BY p.xp DESC) AS rank,
  (SELECT COUNT(*) FROM user_progress up WHERE up.user_id = p.id) AS lessons_completed,
  (SELECT COUNT(*) FROM user_achievements ua WHERE ua.user_id = p.id) AS achievements_count
FROM profiles p
ORDER BY p.xp DESC;
