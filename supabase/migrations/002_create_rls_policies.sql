-- ============================================
-- Row Level Security Policies
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- MODULES (public read)
CREATE POLICY "Modules are viewable by everyone"
  ON modules FOR SELECT USING (is_published = true);

-- LESSONS (public read)
CREATE POLICY "Lessons are viewable by everyone"
  ON lessons FOR SELECT USING (is_published = true);

-- QUIZZES (public read)
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT USING (true);

-- USER_PROGRESS
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- USER_QUIZ_RESULTS
CREATE POLICY "Users can view own quiz results"
  ON user_quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results"
  ON user_quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ACHIEVEMENTS
CREATE POLICY "Non-secret achievements viewable by everyone"
  ON achievements FOR SELECT USING (
    is_secret = false
    OR EXISTS (
      SELECT 1 FROM user_achievements ua
      WHERE ua.achievement_id = achievements.id AND ua.user_id = auth.uid()
    )
  );

-- USER_ACHIEVEMENTS
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
