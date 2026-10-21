/**
 * ELI5 Learning Progress Tracker & Quiz System
 * 
 * A comprehensive learning progress tracking and quiz system using localStorage.
 * Designed for use across all ELI5 visualization pages.
 * 
 * Features:
 * - Lesson completion tracking
 * - Time spent monitoring
 * - Study streak calculation
 * - Interactive quiz system with scoring
 * - Badge/achievement system
 * - Progress dashboard widget
 * - Quiz modal interface
 */

// ============================================================================
// CSS Styles (to be injected into pages)
// ============================================================================

const QUIZ_STYLES = `
  /* Progress Dashboard Styles */
  .progress-dashboard {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
  }
  
  .stat-card {
    text-align: center;
    padding: 15px;
    background: #f8f9ff;
    border-radius: 10px;
    transition: transform 0.2s ease;
  }
  
  .stat-card:hover {
    transform: translateY(-2px);
  }
  
  .stat-value {
    font-size: 2em;
    font-weight: bold;
    color: #667eea;
  }
  
  .stat-label {
    color: #666;
    font-size: 0.9em;
    margin-top: 5px;
  }
  
  .badges-section {
    margin-top: 20px;
  }
  
  .badges-section h4 {
    margin-bottom: 10px;
    color: #333;
  }
  
  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 15px;
    margin-top: 15px;
  }
  
  .badge-card {
    text-align: center;
    padding: 15px;
    border-radius: 10px;
    background: #f0f0f0;
    opacity: 0.5;
    transition: all 0.3s ease;
  }
  
  .badge-card.earned {
    opacity: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
  }
  
  .badge-icon {
    font-size: 2.5em;
    margin-bottom: 10px;
  }
  
  .badge-name {
    font-weight: bold;
    font-size: 0.9em;
    margin-bottom: 5px;
  }
  
  .badge-desc {
    font-size: 0.75em;
    line-height: 1.3;
  }
  
  /* Quiz Modal Styles */
  .quiz-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .quiz-content {
    background: white;
    border-radius: 20px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .quiz-close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    color: #666;
    transition: color 0.2s;
  }
  
  .quiz-close:hover {
    color: #333;
  }
  
  .quiz-header {
    margin-bottom: 20px;
  }
  
  .quiz-header h3 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  .quiz-progress {
    color: #667eea;
    font-weight: bold;
  }
  
  .quiz-body {
    margin: 20px 0;
  }
  
  .quiz-question {
    font-size: 1.1em;
    margin-bottom: 20px;
    color: #333;
    line-height: 1.5;
  }
  
  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;
  }
  
  .quiz-option {
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }
  
  .quiz-option:hover:not(.disabled) {
    border-color: #667eea;
    background: #f0f4ff;
  }
  
  .quiz-option.selected {
    border-color: #667eea;
    background: #e8eeff;
  }
  
  .quiz-option.correct {
    border-color: #4CAF50;
    background: #e8f5e9;
  }
  
  .quiz-option.incorrect {
    border-color: #f44336;
    background: #ffebee;
  }
  
  .quiz-option.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .quiz-explanation {
    margin-top: 15px;
    padding: 15px;
    background: #f8f9ff;
    border-left: 4px solid #667eea;
    border-radius: 5px;
    display: none;
  }
  
  .quiz-explanation.show {
    display: block;
    animation: fadeIn 0.3s ease;
  }
  
  .quiz-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
  
  .quiz-submit,
  .quiz-next {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .quiz-submit:hover:not(:disabled),
  .quiz-next:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .quiz-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .quiz-results {
    text-align: center;
    padding: 20px;
  }
  
  .quiz-results h3 {
    color: #333;
    margin-bottom: 15px;
  }
  
  .quiz-score {
    font-size: 3em;
    font-weight: bold;
    color: #667eea;
    margin: 20px 0;
  }
  
  .quiz-passed {
    color: #4CAF50;
  }
  
  .quiz-failed {
    color: #f44336;
  }
  
  .quiz-badge-notification {
    margin-top: 20px;
    padding: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 10px;
    animation: pulse 0.5s ease;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

// ============================================================================
// Badge Definitions
// ============================================================================

const BADGE_DEFINITIONS = {
  'perfect_score': {
    id: 'perfect_score',
    name: '完美主义者',
    description: '在测验中获得满分',
    icon: '🏆',
    color: '#FFD700'
  },
  'first_quiz': {
    id: 'first_quiz',
    name: '初次尝试',
    description: '完成第一个测验',
    icon: '🎯',
    color: '#4CAF50'
  },
  'quick_learner': {
    id: 'quick_learner',
    name: '快速学习者',
    description: '一次性答对所有问题',
    icon: '⚡',
    color: '#2196F3'
  },
  'streak_7': {
    id: 'streak_7',
    name: '持之以恒',
    description: '连续学习7天',
    icon: '🔥',
    color: '#FF5722'
  },
  'explorer': {
    id: 'explorer',
    name: '探索者',
    description: '浏览所有9个可视化页面',
    icon: '🗺️',
    color: '#9C27B0'
  },
  'master': {
    id: 'master',
    name: '编程大师',
    description: '完成所有测验且平均分超过80%',
    icon: '👑',
    color: '#FFD700'
  }
};

/**
 * Get all badge definitions
 * @returns {Array} Array of all badge objects
 */
function getAllBadges() {
  return Object.values(BADGE_DEFINITIONS);
}

/**
 * Get badges that have been earned by the user
 * @param {ProgressTracker} progressTracker - Instance of ProgressTracker
 * @returns {Array} Array of earned badge objects
 */
function getEarnedBadges(progressTracker) {
  return progressTracker.data.badges.map(id => BADGE_DEFINITIONS[id]).filter(Boolean);
}

// ============================================================================
// Progress Tracker Class
// ============================================================================

class ProgressTracker {
  /**
   * Initialize the ProgressTracker
   * Loads existing data from localStorage or creates default structure
   */
  constructor() {
    this.storageKey = 'eli5_learning_progress';
    this.data = this.load();
  }
  
  /**
   * Load progress data from localStorage
   * @returns {Object} Progress data object
   */
  load() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all required fields exist (for backward compatibility)
        return {
          completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
          quizScores: typeof parsed.quizScores === 'object' && parsed.quizScores !== null ? parsed.quizScores : {},
          totalTimeSpent: typeof parsed.totalTimeSpent === 'number' ? parsed.totalTimeSpent : 0,
          lastVisit: parsed.lastVisit || null,
          badges: Array.isArray(parsed.badges) ? parsed.badges : [],
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastStudyDate: parsed.lastStudyDate || null
        };
      }
    } catch (error) {
      console.warn('Failed to load progress data from localStorage:', error);
    }
    
    // Return default structure if no saved data or parsing failed
    return {
      completedLessons: [],
      quizScores: {},
      totalTimeSpent: 0,
      lastVisit: null,
      badges: [],
      streak: 0,
      lastStudyDate: null
    };
  }
  
  /**
   * Save current progress data to localStorage
   */
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save progress data to localStorage:', error);
    }
  }
  
  /**
   * Mark a lesson as viewed/completed
   * @param {string} lessonId - Unique identifier for the lesson
   */
  markLessonViewed(lessonId) {
    if (!this.data.completedLessons.includes(lessonId)) {
      this.data.completedLessons.push(lessonId);
      this.save();
      
      // Check for explorer badge
      this.checkExplorerBadge();
    }
  }
  
  /**
   * Track time spent studying (in seconds)
   * @param {number} seconds - Number of seconds to add
   */
  trackTime(seconds) {
    if (typeof seconds === 'number' && seconds > 0) {
      this.data.totalTimeSpent += seconds;
      this.save();
    }
  }
  
  /**
   * Update study streak based on current date
   * Increments streak if last study was yesterday, resets if gap is larger
   */
  updateStreak() {
    const today = new Date().toDateString();
    const lastDate = this.data.lastStudyDate ? new Date(this.data.lastStudyDate).toDateString() : null;
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        // Consecutive day - increment streak
        this.data.streak++;
      } else if (lastDate !== today) {
        // Not consecutive - reset streak to 1
        this.data.streak = 1;
      }
      
      this.data.lastStudyDate = new Date().toISOString();
      this.save();
      
      // Check for streak badge
      this.checkStreakBadge();
    }
  }
  
  /**
   * Check if user should receive the explorer badge
   */
  checkExplorerBadge() {
    if (this.data.completedLessons.length >= 9 && 
        !this.data.badges.includes('explorer')) {
      this.data.badges.push('explorer');
      this.save();
    }
  }
  
  /**
   * Check if user should receive the streak badge
   */
  checkStreakBadge() {
    if (this.data.streak >= 7 && 
        !this.data.badges.includes('streak_7')) {
      this.data.badges.push('streak_7');
      this.save();
    }
  }
  
  /**
   * Calculate average quiz score across all completed quizzes
   * @returns {number} Average percentage score (0-100)
   */
  calculateAverageScore() {
    const scores = Object.values(this.data.quizScores);
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, s) => acc + s.percentage, 0);
    return Math.round(sum / scores.length);
  }
  
  /**
   * Format seconds into human-readable time string
   * @param {number} seconds - Total seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}小时${minutes}分钟`;
    if (minutes > 0) return `${minutes}分钟`;
    return `${secs}秒`;
  }
  
  /**
   * Get comprehensive learning statistics
   * @returns {Object} Statistics object with various metrics
   */
  getStats() {
    return {
      completedCount: this.data.completedLessons.length,
      totalLessons: 9, // Current total number of lessons
      averageScore: this.calculateAverageScore(),
      totalTime: this.formatTime(this.data.totalTimeSpent),
      streak: this.data.streak,
      badgeCount: this.data.badges.length
    };
  }
  
  /**
   * Check if user qualifies for master badge
   * Requires all lessons completed and average score > 80%
   */
  checkMasterBadge() {
    const stats = this.getStats();
    if (stats.completedCount >= stats.totalLessons && 
        stats.averageScore > 80 && 
        !this.data.badges.includes('master')) {
      this.data.badges.push('master');
      this.save();
      return true;
    }
    return false;
  }
}

// ============================================================================
// Quiz System Class
// ============================================================================

class QuizSystem {
  /**
   * Initialize a quiz for a specific lesson
   * @param {string} lessonId - Unique identifier for the lesson
   * @param {Array} questions - Array of question objects
   */
  constructor(lessonId, questions) {
    this.lessonId = lessonId;
    this.questions = questions;
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    this.selectedAnswer = null;
  }
  
  /**
   * Start or restart the quiz
   * Resets all state and shows first question
   */
  startQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.answers = [];
    this.selectedAnswer = null;
    return this.showQuestion(0);
  }
  
  /**
   * Get data for the current question to render in UI
   * @param {number} index - Question index (defaults to current)
   * @returns {Object} Question data object
   */
  showQuestion(index = this.currentQuestion) {
    if (index < 0 || index >= this.questions.length) {
      throw new Error(`Question index ${index} out of range`);
    }
    
    const q = this.questions[index];
    return {
      question: q.question,
      options: q.options,
      current: index + 1,
      total: this.questions.length,
      difficulty: q.difficulty || 'medium'
    };
  }
  
  /**
   * Submit an answer for the current question
   * @param {number} answerIndex - Index of selected answer option
   * @returns {Object} Result with correctness and explanation
   */
  submitAnswer(answerIndex) {
    if (answerIndex < 0 || answerIndex >= this.questions[this.currentQuestion].options.length) {
      throw new Error(`Invalid answer index: ${answerIndex}`);
    }
    
    const q = this.questions[this.currentQuestion];
    const isCorrect = answerIndex === q.correctAnswer;
    
    this.answers.push({
      questionId: q.id,
      userAnswer: answerIndex,
      correct: isCorrect,
      timestamp: Date.now()
    });
    
    if (isCorrect) {
      this.score++;
    }
    
    this.selectedAnswer = answerIndex;
    
    return {
      correct: isCorrect,
      explanation: q.explanation,
      correctAnswer: q.correctAnswer
    };
  }
  
  /**
   * Move to next question or finish quiz if at end
   * @returns {Object|null} Next question data or final results
   */
  nextQuestion() {
    this.currentQuestion++;
    this.selectedAnswer = null;
    
    if (this.currentQuestion < this.questions.length) {
      return this.showQuestion(this.currentQuestion);
    } else {
      return this.finishQuiz();
    }
  }
  
  /**
   * Complete the quiz and save results
   * @returns {Object} Final quiz results
   */
  finishQuiz() {
    const percentage = (this.score / this.questions.length) * 100;
    
    // Save score to progress tracker
    const progressTracker = new ProgressTracker();
    progressTracker.data.quizScores[this.lessonId] = {
      score: this.score,
      total: this.questions.length,
      percentage: percentage,
      date: new Date().toISOString(),
      answers: this.answers
    };
    progressTracker.save();
    
    // Check for badges
    const newBadges = this.checkBadges(progressTracker, percentage);
    
    // Check for master badge
    progressTracker.checkMasterBadge();
    
    return {
      score: this.score,
      total: this.questions.length,
      percentage: percentage,
      passed: percentage >= 70,
      newBadges: newBadges
    };
  }
  
  /**
   * Check and award badges based on quiz performance
   * @param {ProgressTracker} progressTracker - Progress tracker instance
   * @param {number} percentage - Quiz score percentage
   * @returns {Array} Array of newly earned badges
   */
  checkBadges(progressTracker, percentage) {
    const badges = [];
    
    // Perfect score badge
    if (percentage === 100 && !progressTracker.data.badges.includes('perfect_score')) {
      badges.push({
        id: 'perfect_score',
        name: '完美主义者',
        description: '在测验中获得满分',
        icon: '🏆'
      });
      progressTracker.data.badges.push('perfect_score');
    }
    
    // First quiz badge
    if (Object.keys(progressTracker.data.quizScores).length === 1 && 
        !progressTracker.data.badges.includes('first_quiz')) {
      badges.push({
        id: 'first_quiz',
        name: '初次尝试',
        description: '完成第一个测验',
        icon: '🎯'
      });
      progressTracker.data.badges.push('first_quiz');
    }
    
    // Quick learner badge (all correct on first try)
    const allCorrect = this.answers.every(a => a.correct);
    if (allCorrect && !progressTracker.data.badges.includes('quick_learner')) {
      badges.push({
        id: 'quick_learner',
        name: '快速学习者',
        description: '一次性答对所有问题',
        icon: '⚡'
      });
      progressTracker.data.badges.push('quick_learner');
    }
    
    progressTracker.save();
    return badges;
  }
}

// ============================================================================
// Dashboard Widget Functions
// ============================================================================

/**
 * Create and render a progress dashboard in a container element
 * @param {string} containerId - ID of the container DOM element
 */
function createProgressDashboard(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with ID "${containerId}" not found`);
    return;
  }
  
  const tracker = new ProgressTracker();
  const stats = tracker.getStats();
  
  container.innerHTML = `
    <div class="progress-dashboard">
      <h3>📊 学习进度</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.completedCount}/${stats.totalLessons}</div>
          <div class="stat-label">已完成课程</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.averageScore}%</div>
          <div class="stat-label">平均分数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTime}</div>
          <div class="stat-label">学习时长</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.streak}天</div>
          <div class="stat-label">连续学习</div>
        </div>
      </div>
      <div class="badges-section">
        <h4>🏅 已获徽章 (${stats.badgeCount})</h4>
        <div class="badges-grid">
          ${renderBadges(tracker)}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render badge cards showing earned and locked badges
 * @param {ProgressTracker} tracker - Progress tracker instance
 * @returns {string} HTML string of badge cards
 */
function renderBadges(tracker) {
  const earned = getEarnedBadges(tracker);
  const all = getAllBadges();
  
  return all.map(badge => {
    const isEarned = earned.some(b => b.id === badge.id);
    return `
      <div class="badge-card ${isEarned ? 'earned' : 'locked'}" title="${badge.description}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.description}</div>
      </div>
    `;
  }).join('');
}

// ============================================================================
// Quiz Modal Functions
// ============================================================================

/**
 * Show a quiz modal with questions for a specific lesson
 * @param {string} lessonId - Unique identifier for the lesson
 * @param {Array} questions - Array of question objects
 */
function showQuizModal(lessonId, questions) {
  if (!questions || questions.length === 0) {
    console.error('No questions provided for quiz');
    return;
  }
  
  const quiz = new QuizSystem(lessonId, questions);
  
  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'quiz-modal';
  modal.innerHTML = `
    <div class="quiz-content">
      <button class="quiz-close">&times;</button>
      <div class="quiz-header">
        <h3>📝 知识测验</h3>
        <div class="quiz-progress">
          <span class="quiz-step">1/${questions.length}</span>
        </div>
      </div>
      <div class="quiz-body">
        <!-- Question content will be inserted here -->
      </div>
      <div class="quiz-footer">
        <button class="quiz-submit" disabled>提交答案</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Inject styles if not already present
  injectStyles();
  
  // Add event listeners and initialize quiz
  initializeQuizUI(modal, quiz);
}

/**
 * Inject quiz styles into the document if not already present
 */
function injectStyles() {
  if (!document.getElementById('quiz-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'quiz-styles';
    styleTag.textContent = QUIZ_STYLES;
    document.head.appendChild(styleTag);
  }
}

/**
 * Initialize the quiz modal UI with event handlers
 * @param {HTMLElement} modal - Modal DOM element
 * @param {QuizSystem} quiz - Quiz system instance
 */
function initializeQuizUI(modal, quiz) {
  const closeBtn = modal.querySelector('.quiz-close');
  const submitBtn = modal.querySelector('.quiz-submit');
  const quizBody = modal.querySelector('.quiz-body');
  
  // Close button handler
  closeBtn.addEventListener('click', () => {
    modal.remove();
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Start the quiz
  renderQuestion(quizBody, quiz, modal);
  
  // Submit button handler
  submitBtn.addEventListener('click', () => {
    handleAnswerSubmission(quizBody, quiz, modal, submitBtn);
  });
}

/**
 * Render a question in the quiz body
 * @param {HTMLElement} quizBody - Quiz body DOM element
 * @param {QuizSystem} quiz - Quiz system instance
 * @param {HTMLElement} modal - Modal DOM element
 */
function renderQuestion(quizBody, quiz, modal) {
  const questionData = quiz.showQuestion();
  const submitBtn = modal.querySelector('.quiz-submit');
  
  // Reset submit button
  submitBtn.textContent = '提交答案';
  submitBtn.disabled = true;
  
  // Build question HTML
  let html = `
    <div class="quiz-question">${questionData.question}</div>
    <div class="quiz-options">
  `;
  
  questionData.options.forEach((option, index) => {
    html += `<div class="quiz-option" data-index="${index}">${option}</div>`;
  });
  
  html += `
    </div>
    <div class="quiz-explanation"></div>
  `;
  
  quizBody.innerHTML = html;
  
  // Add option click handlers
  const options = quizBody.querySelectorAll('.quiz-option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      // Remove previous selection
      options.forEach(opt => opt.classList.remove('selected'));
      
      // Select clicked option
      option.classList.add('selected');
      
      // Enable submit button
      submitBtn.disabled = false;
    });
  });
  
  // Update progress indicator
  const progressSpan = modal.querySelector('.quiz-step');
  if (progressSpan) {
    progressSpan.textContent = `${questionData.current}/${questionData.total}`;
  }
}

/**
 * Handle answer submission
 * @param {HTMLElement} quizBody - Quiz body DOM element
 * @param {QuizSystem} quiz - Quiz system instance
 * @param {HTMLElement} modal - Modal DOM element
 * @param {HTMLElement} submitBtn - Submit button element
 */
function handleAnswerSubmission(quizBody, quiz, modal, submitBtn) {
  const selectedOption = quizBody.querySelector('.quiz-option.selected');
  if (!selectedOption) return;
  
  const answerIndex = parseInt(selectedOption.dataset.index);
  const result = quiz.submitAnswer(answerIndex);
  
  // Disable all options
  const options = quizBody.querySelectorAll('.quiz-option');
  options.forEach(opt => {
    opt.classList.add('disabled');
    opt.style.pointerEvents = 'none';
    
    const optIndex = parseInt(opt.dataset.index);
    if (optIndex === result.correctAnswer) {
      opt.classList.add('correct');
    } else if (optIndex === answerIndex && !result.correct) {
      opt.classList.add('incorrect');
    }
  });
  
  // Show explanation
  const explanationDiv = quizBody.querySelector('.quiz-explanation');
  explanationDiv.innerHTML = `
    <strong>${result.correct ? '✓ 正确!' : '✗ 错误'}</strong><br>
    ${result.explanation}
  `;
  explanationDiv.classList.add('show');
  
  // Change button to "Next" or "Finish"
  if (quiz.currentQuestion < quiz.questions.length - 1) {
    submitBtn.textContent = '下一题';
  } else {
    submitBtn.textContent = '查看结果';
  }
  
  // Change handler to next question
  submitBtn.onclick = () => {
    const nextResult = quiz.nextQuestion();
    
    if (nextResult && typeof nextResult === 'object' && 'percentage' in nextResult) {
      // Quiz finished
      showQuizResults(quizBody, modal, nextResult);
    } else {
      // Show next question
      renderQuestion(quizBody, quiz, modal);
    }
  };
}

/**
 * Show quiz results after completion
 * @param {HTMLElement} quizBody - Quiz body DOM element
 * @param {HTMLElement} modal - Modal DOM element
 * @param {Object} results - Quiz results object
 */
function showQuizResults(quizBody, modal, results) {
  const submitBtn = modal.querySelector('.quiz-submit');
  submitBtn.style.display = 'none';
  
  const passedClass = results.passed ? 'quiz-passed' : 'quiz-failed';
  const message = results.passed ? '恭喜！你通过了测验！' : '继续努力，下次一定能行！';
  
  let badgeHtml = '';
  if (results.newBadges && results.newBadges.length > 0) {
    badgeHtml = `
      <div class="quiz-badge-notification">
        <strong>🎉 获得新徽章！</strong><br>
        ${results.newBadges.map(b => `${b.icon} ${b.name}`).join('<br>')}
      </div>
    `;
  }
  
  quizBody.innerHTML = `
    <div class="quiz-results">
      <h3>${message}</h3>
      <div class="quiz-score ${passedClass}">
        ${results.score}/${results.total}
      </div>
      <p>正确率: ${results.percentage.toFixed(1)}%</p>
      ${badgeHtml}
    </div>
  `;
  
  // Add close button
  const footer = modal.querySelector('.quiz-footer');
  footer.innerHTML = '<button class="quiz-next">关闭</button>';
  footer.querySelector('.quiz-next').addEventListener('click', () => {
    modal.remove();
  });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format seconds into human-readable time string
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (e.g., "2小时30分钟")
 */
function formatTime(seconds) {
  if (typeof seconds !== 'number' || seconds < 0) {
    return '0秒';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) return `${hours}小时${minutes}分钟`;
  if (minutes > 0) return `${minutes}分钟`;
  return `${secs}秒`;
}

/**
 * Calculate average score across all quizzes
 * @param {Object} data - Progress data object
 * @returns {number} Average percentage (0-100)
 */
function calculateAverageScore(data) {
  if (!data || !data.quizScores) return 0;
  
  const scores = Object.values(data.quizScores);
  if (scores.length === 0) return 0;
  
  const sum = scores.reduce((acc, s) => acc + s.percentage, 0);
  return Math.round(sum / scores.length);
}

// ============================================================================
// Module Exports (for Node.js environments)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ProgressTracker,
    QuizSystem,
    BADGE_DEFINITIONS,
    getAllBadges,
    getEarnedBadges,
    createProgressDashboard,
    showQuizModal,
    formatTime,
    calculateAverageScore,
    QUIZ_STYLES
  };
}
