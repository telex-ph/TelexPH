'use client'
import { useState } from 'react'

const BG        = '#FFFFFF'
const NEU_OUT   = '0 1px 3px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)'
const NEU_IN    = 'inset 2px 2px 6px #d1d1d1, inset -2px -2px 6px #ffffff'
const TEXT_MAIN = '#2a2a2a'
const TEXT_SUB  = '#888'
const PRIMARY   = '#800000'

const Ico = ({ d, d2, size = 16, sw = 1.4 }: { d: string; d2?: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />{d2 && <path d={d2} />}
  </svg>
)

// ─── TYPES ────────────────────────────────────────────────────────────────────
type QuestionType = 'multiple_choice' | 'true_false'

type Question = {
  id: number
  type: QuestionType
  question: string
  choices?: string[]
  correct: string | boolean
  points: number
}

type Exam = {
  id: number
  title: string
  category: string
  description: string
  timeLimit: number
  questions: Question[]
}

type ExamResult = {
  examId: number
  answers: Record<number, string | boolean>
  score: number
  total: number
  passed: boolean
  submitted: boolean
}

// ─── EXAM DATA ────────────────────────────────────────────────────────────────
const EXAMS: Exam[] = [
  {
    id: 1,
    title: 'General VA Skills Assessment',
    category: 'General',
    description: 'Covers communication, time management, and general VA responsibilities.',
    timeLimit: 20,
    questions: [
      { id: 1,  type: 'multiple_choice', question: 'What does "VA" stand for in the context of remote work?', choices: ['Virtual Assistant', 'Visual Aid', 'Verified Account', 'Virtual Agent'], correct: 'Virtual Assistant', points: 10 },
      { id: 2,  type: 'true_false',      question: 'A VA should always wait for the client to follow up before completing a task.', correct: false, points: 10 },
      { id: 3,  type: 'multiple_choice', question: 'Which tool is commonly used for project management by VAs?', choices: ['Asana', 'Photoshop', 'QuickBooks', 'AutoCAD'], correct: 'Asana', points: 10 },
      { id: 4,  type: 'multiple_choice', question: 'What is the best practice when you cannot meet a deadline?', choices: ['Wait and submit late', 'Inform the client ASAP', 'Ignore the task', 'Ask a colleague to submit for you'], correct: 'Inform the client ASAP', points: 10 },
      { id: 5,  type: 'true_false',      question: 'Confidentiality agreements (NDAs) are common when working as a VA.', correct: true, points: 10 },
      { id: 6,  type: 'multiple_choice', question: 'Which of the following is a time-tracking tool?', choices: ['Toggl', 'Canva', 'Grammarly', 'Mailchimp'], correct: 'Toggl', points: 10 },
      { id: 7,  type: 'multiple_choice', question: 'When scheduling a meeting across time zones, what should you consider first?', choices: ["The client's time zone", 'Your own schedule only', 'The weather', 'The meeting room size'], correct: "The client's time zone", points: 10 },
      { id: 8,  type: 'true_false',      question: "It is acceptable to use a client's confidential data for personal use.", correct: false, points: 10 },
      { id: 9,  type: 'multiple_choice', question: 'What does CRM stand for?', choices: ['Customer Relationship Management', 'Content Resource Manager', 'Client Record Module', 'Creative Revenue Model'], correct: 'Customer Relationship Management', points: 10 },
      { id: 10, type: 'multiple_choice', question: 'Which communication style is most professional in client emails?', choices: ['Clear and concise', 'Casual and informal', 'Long and detailed always', 'Using slang for friendliness'], correct: 'Clear and concise', points: 10 },
    ],
  },
  {
    id: 2,
    title: 'Social Media VA Assessment',
    category: 'Social Media',
    description: 'Tests knowledge in social media management, content creation, and analytics.',
    timeLimit: 15,
    questions: [
      { id: 1, type: 'multiple_choice', question: 'Which platform is best suited for B2B marketing?', choices: ['TikTok', 'LinkedIn', 'Snapchat', 'Pinterest'], correct: 'LinkedIn', points: 10 },
      { id: 2, type: 'true_false',      question: 'Hashtags on Instagram can help increase post reach.', correct: true, points: 10 },
      { id: 3, type: 'multiple_choice', question: 'What does "engagement rate" measure?', choices: ['How many followers you have', 'Interactions relative to reach/followers', 'Number of ads clicked', 'Post frequency'], correct: 'Interactions relative to reach/followers', points: 10 },
      { id: 4, type: 'multiple_choice', question: 'Which tool is used to schedule social media posts?', choices: ['Buffer', 'Figma', 'Slack', 'Notion'], correct: 'Buffer', points: 10 },
      { id: 5, type: 'true_false',      question: 'You should always post the same content across all platforms without customization.', correct: false, points: 10 },
      { id: 6, type: 'multiple_choice', question: 'What is a "content calendar"?', choices: ['A schedule for planning posts', 'A type of social media ad', 'A follower tracker', 'A photo editing tool'], correct: 'A schedule for planning posts', points: 10 },
      { id: 7, type: 'multiple_choice', question: 'What does CTR stand for in digital marketing?', choices: ['Click-Through Rate', 'Content Trend Report', 'Customer Traffic Ratio', 'Creative Tag Reach'], correct: 'Click-Through Rate', points: 10 },
      { id: 8, type: 'true_false',      question: "Responding to comments and DMs is part of a Social Media VA's job.", correct: true, points: 10 },
      { id: 9, type: 'multiple_choice', question: 'Which metric shows how many unique people saw your post?', choices: ['Reach', 'Impressions', 'Saves', 'Shares'], correct: 'Reach', points: 10 },
      { id: 10, type: 'true_false',     question: 'A social media audit involves reviewing current accounts and performance.', correct: true, points: 10 },
    ],
  },
  {
    id: 3,
    title: 'Data Entry VA Assessment',
    category: 'Data Entry',
    description: 'Covers accuracy, spreadsheet skills, and data management best practices.',
    timeLimit: 15,
    questions: [
      { id: 1, type: 'multiple_choice', question: 'What is the keyboard shortcut to select an entire column in Excel?', choices: ['Ctrl + Space', 'Shift + Space', 'Alt + Space', 'Ctrl + Shift'], correct: 'Ctrl + Space', points: 10 },
      { id: 2, type: 'true_false',      question: 'Double-checking data entries is an important practice for accuracy.', correct: true, points: 10 },
      { id: 3, type: 'multiple_choice', question: 'Which Excel formula counts cells that are not empty?', choices: ['=COUNTA()', '=COUNT()', '=SUM()', '=COUNTIF()'], correct: '=COUNTA()', points: 10 },
      { id: 4, type: 'multiple_choice', question: 'What does CSV stand for?', choices: ['Comma Separated Values', 'Cell Stored Values', 'Common Sheet View', 'Controlled Spreadsheet Version'], correct: 'Comma Separated Values', points: 10 },
      { id: 5, type: 'true_false',      question: 'Data validation in Excel helps prevent incorrect data from being entered.', correct: true, points: 10 },
      { id: 6, type: 'multiple_choice', question: 'What is the purpose of a VLOOKUP formula?', choices: ['Search for a value in a table', 'Sum a range of cells', 'Sort data alphabetically', 'Format cells'], correct: 'Search for a value in a table', points: 10 },
      { id: 7, type: 'multiple_choice', question: 'Which file format is best for preserving Excel formatting?', choices: ['.xlsx', '.txt', '.csv', '.pdf'], correct: '.xlsx', points: 10 },
      { id: 8, type: 'true_false',      question: 'It is safe to enter personal data in an unsecured public spreadsheet.', correct: false, points: 10 },
      { id: 9, type: 'multiple_choice', question: 'What does "data cleaning" involve?', choices: ['Fixing errors and inconsistencies', 'Deleting all data', 'Adding new columns only', 'Printing the spreadsheet'], correct: 'Fixing errors and inconsistencies', points: 10 },
      { id: 10, type: 'true_false',     question: 'Google Sheets allows real-time collaboration on spreadsheets.', correct: true, points: 10 },
    ],
  },
]

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent = false }: { label: string; value: string | number; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ background: BG, borderRadius: 20, padding: '16px 20px', boxShadow: NEU_OUT, display: 'flex', alignItems: 'center', gap: 14, flex: '1 1 140px', minWidth: 0 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: accent ? PRIMARY : BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: accent ? 'none' : NEU_IN, color: accent ? '#fff' : PRIMARY }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10.5, color: TEXT_SUB, marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: TEXT_MAIN, lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  )
}

// ─── EXAM CARD ────────────────────────────────────────────────────────────────
function ExamCard({ exam, result, onStart }: { exam: Exam; result?: ExamResult; onStart: (exam: Exam) => void }) {
  const categoryColors: Record<string, string> = { General: '#7c3aed', 'Social Media': '#0369a1', 'Data Entry': '#065f46' }
  const color = categoryColors[exam.category] ?? PRIMARY
  const totalPts = exam.questions.reduce((a, q) => a + q.points, 0)

  return (
    <div style={{ background: BG, borderRadius: 20, padding: '20px', boxShadow: NEU_OUT }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: `${color}18`, color, marginBottom: 8, display: 'inline-block' }}>{exam.category}</span>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_MAIN }}>{exam.title}</div>
          <div style={{ fontSize: 11.5, color: TEXT_SUB, marginTop: 4, lineHeight: 1.5 }}>{exam.description}</div>
        </div>
        {result?.submitted && (
          <div style={{ textAlign: 'center', flexShrink: 0, background: BG, borderRadius: 14, padding: '10px 14px', boxShadow: NEU_IN }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: result.passed ? '#15803d' : '#991b1b' }}>{Math.round((result.score / result.total) * 100)}%</div>
            <div style={{ fontSize: 10, color: result.passed ? '#15803d' : '#991b1b', fontWeight: 700 }}>{result.passed ? 'PASSED' : 'FAILED'}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0z', label: `${exam.questions.length} questions` },
          { icon: 'M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', label: `${exam.timeLimit} min` },
          { icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', label: `${totalPts} pts total` },
        ].map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: TEXT_SUB }}>
            <Ico d={item.icon} size={12} sw={1.5} />{item.label}
          </span>
        ))}
      </div>

      <button onClick={() => !result?.submitted && onStart(exam)} disabled={result?.submitted}
        style={{ width: '100%', background: result?.submitted ? BG : PRIMARY, color: result?.submitted ? TEXT_SUB : '#fff', border: result?.submitted ? '1.5px solid #e5e5e5' : 'none', borderRadius: 12, padding: '11px', fontSize: 12, fontWeight: 600, cursor: result?.submitted ? 'not-allowed' : 'pointer', boxShadow: result?.submitted ? 'none' : `4px 4px 12px rgba(128,0,0,0.3)`, fontFamily: 'inherit', transition: 'all 0.15s', opacity: result?.submitted ? 0.6 : 1 }}>
        {result?.submitted ? '✓ Completed' : 'Start Exam →'}
      </button>
    </div>
  )
}

// ─── EXAM MODAL ───────────────────────────────────────────────────────────────
function ExamModal({ exam, onClose, onSubmit }: { exam: Exam; onClose: () => void; onSubmit: (result: ExamResult) => void }) {
  const [answers, setAnswers]     = useState<Record<number, string | boolean>>({})
  const [currentQ, setCurrentQ]   = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult]       = useState<ExamResult | null>(null)
  const [timeLeft, setTimeLeft]   = useState(exam.timeLimit * 60)

  const timerRef = useState<ReturnType<typeof setInterval> | null>(null)
  useState(() => {
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); doSubmit(answers); return 0 }
        return prev - 1
      })
    }, 1000)
    timerRef[0] = t
    return () => clearInterval(t)
  })

  const doSubmit = (ans: Record<number, string | boolean>) => {
    let score = 0
    exam.questions.forEach(q => {
      if (ans[q.id] !== undefined && ans[q.id] === q.correct) score += q.points
    })
    const total = exam.questions.reduce((a, q) => a + q.points, 0)
    const r: ExamResult = { examId: exam.id, answers: ans, score, total, passed: score / total >= 0.75, submitted: true }
    setResult(r)
    setSubmitted(true)
  }

  const q        = exam.questions[currentQ]
  const answered = Object.keys(answers).length
  const pct      = Math.round((answered / exam.questions.length) * 100)
  const mins     = Math.floor(timeLeft / 60)
  const secs     = timeLeft % 60
  const warning  = timeLeft < 120

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: BG, borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>

        {/* ── Results Screen ── */}
        {submitted && result && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>{result.passed ? '🎉' : '😔'}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: TEXT_MAIN, marginBottom: 4 }}>{result.passed ? 'Congratulations!' : 'Keep practicing!'}</div>
            <div style={{ fontSize: 12, color: TEXT_SUB, marginBottom: 24 }}>{exam.title}</div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 120, height: 120, position: 'relative' }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50" fill="none"
                    stroke={result.passed ? '#15803d' : '#991b1b'} strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * (result.score / result.total)} ${2 * Math.PI * 50}`}
                    strokeDashoffset={2 * Math.PI * 50 * 0.25} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: result.passed ? '#15803d' : '#991b1b' }}>{Math.round((result.score / result.total) * 100)}%</span>
                  <span style={{ fontSize: 10, color: TEXT_SUB }}>{result.score}/{result.total} pts</span>
                </div>
              </div>
            </div>

            <div style={{ background: BG, borderRadius: 14, padding: '10px 20px', border: '1.5px solid #e5e5e5', display: 'inline-block', marginBottom: 24 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: result.passed ? '#15803d' : '#991b1b' }}>
                {result.passed ? '✓ PASSED — Score ≥ 75%' : '✗ FAILED — Score < 75%'}
              </span>
            </div>

            <div style={{ textAlign: 'left', marginBottom: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TEXT_MAIN, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Answer Review</div>
              {exam.questions.map((qs, i) => {
                const userAns   = result.answers[qs.id]
                const isCorrect = userAns === qs.correct
                return (
                  <div key={qs.id} style={{ background: '#fafafa', borderRadius: 12, padding: '12px 14px', marginBottom: 8, border: '1px solid #ebebeb', borderLeft: `3px solid ${isCorrect ? '#15803d' : '#991b1b'}` }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: TEXT_MAIN, marginBottom: 5 }}>Q{i + 1}. {qs.question}</div>
                    <div style={{ fontSize: 11, color: isCorrect ? '#15803d' : '#991b1b' }}>
                      Your answer: <b>{userAns === undefined ? 'Not answered' : String(userAns)}</b>
                    </div>
                    {!isCorrect && (
                      <div style={{ fontSize: 11, color: '#15803d', marginTop: 2 }}>Correct answer: <b>{String(qs.correct)}</b></div>
                    )}
                  </div>
                )
              })}
            </div>

            <button onClick={() => { onSubmit(result); onClose() }}
              style={{ background: PRIMARY, color: '#fff', border: 'none', borderRadius: 12, padding: '12px 36px', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: `4px 4px 12px rgba(128,0,0,0.3)`, fontFamily: 'inherit' }}>
              Done
            </button>
          </div>
        )}

        {/* ── Exam Screen ── */}
        {!submitted && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_MAIN }}>{exam.title}</div>
                <div style={{ fontSize: 11, color: TEXT_SUB, marginTop: 1 }}>Question {currentQ + 1} / {exam.questions.length}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: BG, borderRadius: 12, padding: '8px 14px', border: warning ? `2px solid #991b1b` : '1.5px solid #e5e5e5', fontSize: 14, fontWeight: 700, color: warning ? '#991b1b' : TEXT_MAIN, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Ico d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={13} sw={1.5} />
                  {mins}:{secs.toString().padStart(2, '0')}
                </div>
                <button onClick={onClose}
                  style={{ background: BG, border: '1.5px solid #e5e5e5', borderRadius: 10, width: 32, height: 32, cursor: 'pointer', color: TEXT_SUB, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ico d="M18 6L6 18M6 6l12 12" size={14} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: TEXT_SUB, marginBottom: 5 }}>
                <span>{answered} of {exam.questions.length} answered</span><span>{pct}%</span>
              </div>
              <div style={{ height: 6, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${PRIMARY}, #b91c1c)`, borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
            </div>

            <div style={{ background: '#fafafa', borderRadius: 16, padding: '18px', border: '1px solid #ebebeb', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MAIN, lineHeight: 1.6 }}>
                  Q{currentQ + 1}. {q.question}
                </div>
                <span style={{ fontSize: 10.5, color: PRIMARY, fontWeight: 700, flexShrink: 0 }}>{q.points} pts</span>
              </div>

              {q.type === 'multiple_choice' && q.choices && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.choices.map(choice => {
                    const selected = answers[q.id] === choice
                    return (
                      <button key={choice} onClick={() => setAnswers(p => ({ ...p, [q.id]: choice }))}
                        style={{ background: selected ? '#fff0f0' : BG, border: `1.5px solid ${selected ? PRIMARY : '#e5e5e5'}`, borderRadius: 12, padding: '11px 16px', fontSize: 12, fontWeight: selected ? 600 : 400, color: selected ? PRIMARY : TEXT_MAIN, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.15s' }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selected ? PRIMARY : '#ccc'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: BG }}>
                          {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: PRIMARY, display: 'block' }} />}
                        </span>
                        {choice}
                      </button>
                    )
                  })}
                </div>
              )}

              {q.type === 'true_false' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  {([true, false] as const).map(val => {
                    const selected = answers[q.id] === val
                    return (
                      <button key={String(val)} onClick={() => setAnswers(p => ({ ...p, [q.id]: val }))}
                        style={{ flex: 1, background: selected ? (val ? '#f0fdf4' : '#fff1f2') : BG, border: `1.5px solid ${selected ? (val ? '#15803d' : '#991b1b') : '#e5e5e5'}`, borderRadius: 12, padding: '13px', fontSize: 13, fontWeight: selected ? 700 : 500, color: selected ? (val ? '#15803d' : '#991b1b') : TEXT_MAIN, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                        {val ? '✓  True' : '✗  False'}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0}
                style={{ background: BG, border: '1.5px solid #e5e5e5', borderRadius: 12, padding: '10px 18px', fontSize: 12, fontWeight: 600, color: TEXT_SUB, cursor: currentQ === 0 ? 'not-allowed' : 'pointer', opacity: currentQ === 0 ? 0.5 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ico d="M15 18l-6-6 6-6" size={13} /> Prev
              </button>
              {currentQ < exam.questions.length - 1 ? (
                (() => {
                  const notAnswered = answers[q.id] === undefined
                  return (
                    <button
                      onClick={() => { if (!notAnswered) setCurrentQ(p => p + 1) }}
                      disabled={notAnswered}
                      title={notAnswered ? 'Please answer this question first' : ''}
                      style={{ flex: 1, background: notAnswered ? '#f0f0f0' : PRIMARY, color: notAnswered ? TEXT_SUB : '#fff', border: 'none', borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 600, cursor: notAnswered ? 'not-allowed' : 'pointer', boxShadow: notAnswered ? 'none' : `4px 4px 12px rgba(128,0,0,0.3)`, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: notAnswered ? 0.6 : 1, transition: 'all 0.15s' }}>
                      Next <Ico d="M9 18l6-6-6-6" size={13} />
                    </button>
                  )
                })()
              ) : (
                (() => {
                  const notAnswered = answers[q.id] === undefined
                  return (
                    <button
                      onClick={() => { if (!notAnswered) doSubmit(answers) }}
                      disabled={notAnswered}
                      title={notAnswered ? 'Please answer this question first' : ''}
                      style={{ flex: 1, background: notAnswered ? '#f0f0f0' : PRIMARY, color: notAnswered ? TEXT_SUB : '#fff', border: 'none', borderRadius: 12, padding: '10px', fontSize: 12, fontWeight: 600, cursor: notAnswered ? 'not-allowed' : 'pointer', boxShadow: notAnswered ? 'none' : `4px 4px 12px rgba(128,0,0,0.3)`, fontFamily: 'inherit', opacity: notAnswered ? 0.6 : 1, transition: 'all 0.15s' }}>
                      Submit Exam
                    </button>
                  )
                })()
              )}
            </div>

            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {exam.questions.map((_, i) => {
                const isAnswered   = answers[exam.questions[i].id] !== undefined
                const isAccessible = i === 0 || answers[exam.questions[i - 1].id] !== undefined
                const canGo        = i <= currentQ || isAnswered || isAccessible
                return (
                  <button key={i}
                    onClick={() => { if (canGo) setCurrentQ(i) }}
                    title={!canGo ? 'Answer previous questions first' : ''}
                    style={{ width: 28, height: 28, borderRadius: 8, background: i === currentQ ? '#fff0f0' : isAnswered ? '#f0fdf4' : BG, border: `1.5px solid ${i === currentQ ? PRIMARY : isAnswered ? '#15803d' : '#e5e5e5'}`, cursor: canGo ? 'pointer' : 'not-allowed', fontSize: 10.5, fontWeight: 600, color: i === currentQ ? PRIMARY : isAnswered ? '#15803d' : TEXT_SUB, fontFamily: 'inherit', opacity: !canGo ? 0.4 : 1 }}>
                    {i + 1}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function VAassesment() {
  const [activeExam, setActiveExam] = useState<Exam | null>(null)
  const [results, setResults]       = useState<Record<number, ExamResult>>({})

  const taken    = Object.values(results).filter(r => r.submitted).length
  const passed   = Object.values(results).filter(r => r.passed).length
  const avgScore = taken > 0
    ? Math.round(Object.values(results).reduce((a, r) => a + Math.round((r.score / r.total) * 100), 0) / taken)
    : 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        html, body, #__next, #root { background-color: #ffffff !important; }
      `}</style>

      <div style={{ fontFamily: "'Poppins', sans-serif", background: '#ffffff', minHeight: '100vh', width: '100%' }}>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_MAIN }}>VA Assessments</div>
          <div style={{ fontSize: 11.5, color: TEXT_SUB, marginTop: 3 }}>Take exams to validate your skills. Passing score is 75%.</div>
        </div>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <StatCard label="Available Exams" value={EXAMS.length} accent
            icon={<Ico d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" size={17} />}
          />
          <StatCard label="Exams Taken" value={taken}
            icon={<Ico d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" size={17} />}
          />
          <StatCard label="Passed" value={passed}
            icon={<Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14" d2="M22 4L12 14.01l-3-3" size={17} />}
          />
          <StatCard label="Avg Score" value={taken > 0 ? `${avgScore}%` : '—'}
            icon={<Ico d="M18 20V10M12 20V4M6 20v-6" size={17} />}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {EXAMS.map(exam => (
            <ExamCard key={exam.id} exam={exam} result={results[exam.id]} onStart={setActiveExam} />
          ))}
        </div>

        {activeExam && (
          <ExamModal
            exam={activeExam}
            onClose={() => setActiveExam(null)}
            onSubmit={r => setResults(p => ({ ...p, [r.examId]: r }))}
          />
        )}
      </div>
    </>
  )
}