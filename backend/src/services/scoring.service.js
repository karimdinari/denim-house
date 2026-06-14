import { prisma } from '../lib/prisma.js'

// ─────────────────────────────────────────
// TASK → REQUIRED SKILLS & DOMAINS MAPPING
// ─────────────────────────────────────────

const TASK_REQUIREMENTS = {
  MODEL_3D_CLO3D_DXF:       { skills: [{ software: 'CLO3D', minLevel: 3 }],         domains: ['MODELISATION_3D'] },
  MODEL_3D_CLO3D_SCRATCH:   { skills: [{ software: 'CLO3D', minLevel: 4 }],         domains: ['MODELISATION_3D'] },
  SCAN_TISSU_3D:            { skills: [{ software: 'CLO3D', minLevel: 2 }],         domains: ['MODELISATION_3D', 'IMPRESSION_TEXTILE'] },
  ANIMATION_3D_UNREAL:      { skills: [{ software: 'UNREAL_ENGINE', minLevel: 3 }], domains: ['ANIMATION'] },
  ANIMATION_3D_IA:          { skills: [{ software: 'MIDJOURNEY_IA', minLevel: 3 }], domains: ['ANIMATION'] },

  SHOOTING_STYLESHOOT:      { skills: [{ software: 'ADOBE_SUITE', minLevel: 2 }],   domains: ['PHOTOGRAPHIE', 'DIRECTION_ARTISTIQUE'] },
  PHOTOGRAPHIE_STUDIO:      { skills: [{ software: 'ADOBE_SUITE', minLevel: 2 }],   domains: ['PHOTOGRAPHIE'] },
  CONCEPT_GRAPHIQUE:        { skills: [{ software: 'ADOBE_SUITE', minLevel: 3 }],   domains: ['DIRECTION_ARTISTIQUE'] },
  IMAGE_IA:                 { skills: [{ software: 'MIDJOURNEY_IA', minLevel: 2 }], domains: ['DIRECTION_ARTISTIQUE'] },
  MOOD_BOARD:               { skills: [{ software: 'ADOBE_SUITE', minLevel: 2 }],   domains: ['DIRECTION_ARTISTIQUE'] },
  RECHERCHE_TENDANCE:       { skills: [],                                            domains: ['DIRECTION_ARTISTIQUE'] },

  FICHE_TECHNIQUE_IA:       { skills: [{ software: 'MIDJOURNEY_IA', minLevel: 2 }], domains: ['IMPRESSION_TEXTILE'] },
  PROTO_PHYSIQUE:           { skills: [],                                            domains: ['PATRONAGE'] },
  BRODERIE:                 { skills: [],                                            domains: ['BRODERIE'] },
  SERIGRAPHIE:              { skills: [{ software: 'ADOBE_SUITE', minLevel: 2 }],   domains: ['IMPRESSION_TEXTILE'] },
  PRINT_ALLOVER:            { skills: [{ software: 'ADOBE_SUITE', minLevel: 3 }],   domains: ['IMPRESSION_TEXTILE'] },
  DIGITAL_PRINT_MONOLAYER:  { skills: [{ software: 'ADOBE_SUITE', minLevel: 3 }],   domains: ['IMPRESSION_TEXTILE'] },

  EXPERIENCE_VR:            { skills: [{ software: 'UNREAL_ENGINE', minLevel: 4 }], domains: ['VR_AR'] },
  EXPERIENCE_AR:            { skills: [{ software: 'UNREAL_ENGINE', minLevel: 3 }], domains: ['VR_AR'] },
}

// ─────────────────────────────────────────
// WEIGHTS
// ─────────────────────────────────────────

const WEIGHTS = {
  skill:       0.35,
  domain:      0.25,
  availability: 0.25,
  history:     0.15,
}

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function isAbsentOnDate(absences, date) {
  return absences.some(a => {
    const start = new Date(a.startDate)
    const end   = new Date(a.endDate)
    const d     = new Date(date)
    return a.status === 'APPROVED' && d >= start && d <= end
  })
}

function isHoliday(holidays, date) {
  return holidays.some(h => {
    const hd = new Date(h.date)
    const d  = new Date(date)
    return hd.toDateString() === d.toDateString()
  })
}

// Score 0-100 based on software skill levels
function scoreSkill(userSkills, requiredSkills) {
  if (!requiredSkills.length) return 100

  let total = 0
  for (const req of requiredSkills) {
    const found = userSkills.find(s => s.software === req.software)
    if (!found) {
      total += 0
    } else {
      // Level 1-5 → score out of 100, penalize if below minLevel
      const ratio = found.level >= req.minLevel
        ? 100
        : (found.level / req.minLevel) * 60 // partial credit
      total += ratio
    }
  }
  return total / requiredSkills.length
}

// Score 0-100 based on expertise domains
function scoreDomain(userExpertises, requiredDomains) {
  if (!requiredDomains.length) return 100

  const userDomains = userExpertises.map(e => e.domain)
  const matched = requiredDomains.filter(d => userDomains.includes(d))
  return (matched.length / requiredDomains.length) * 100
}

// Score 0-100 based on current workload
function scoreAvailability(workloadMin, isAbsent) {
  if (isAbsent) return 0

  const MAX_DAILY_MIN = 8 * 60 // 480 min
  const used = Math.min(workloadMin, MAX_DAILY_MIN)
  return ((MAX_DAILY_MIN - used) / MAX_DAILY_MIN) * 100
}

// Score 0-100 based on task history of same type
function scoreHistory(taskHistory, taskType) {
  const relevant = taskHistory.filter(h => h.type === taskType)
  if (!relevant.length) return 50 // neutral if no history

  const successRate = relevant.filter(h => h.success).length / relevant.length
  return successRate * 100
}

// ─────────────────────────────────────────
// MAIN SCORING ENGINE
// ─────────────────────────────────────────

export const scoringService = {

  async getTopCandidates(taskId, targetDate = new Date()) {
    const task = await prisma.task.findUnique({ where: { id: taskId } })
    if (!task) throw new Error('Task not found')

    const requirements = TASK_REQUIREMENTS[task.type]
    if (!requirements) throw new Error(`No requirements mapped for task type: ${task.type}`)

    const holidays = await prisma.publicHoliday.findMany()

    const users = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: {
        skills: true,
        expertises: true,
        absences: { where: { status: 'APPROVED' } },
        taskHistory: true,
        tasks: {
          where: { status: { in: ['TODO', 'IN_PROGRESS', 'IN_REVIEW'] } },
          select: { estimatedMin: true }
        }
      }
    })

    const holidayFlag = isHoliday(holidays, targetDate)

    const scored = users.map(user => {
      const absent = isAbsentOnDate(user.absences, targetDate) || holidayFlag

      const workloadMin = user.tasks.reduce((sum, t) => sum + t.estimatedMin, 0)

      const skillScore        = scoreSkill(user.skills, requirements.skills)
      const domainScore       = scoreDomain(user.expertises, requirements.domains)
      const availabilityScore = scoreAvailability(workloadMin, absent)
      const historyScore      = scoreHistory(user.taskHistory, task.type)

      const total =
        skillScore        * WEIGHTS.skill +
        domainScore       * WEIGHTS.domain +
        availabilityScore * WEIGHTS.availability +
        historyScore      * WEIGHTS.history

      return {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
        },
        scores: {
          skill:        Math.round(skillScore),
          domain:       Math.round(domainScore),
          availability: Math.round(availabilityScore),
          history:      Math.round(historyScore),
          total:        Math.round(total),
        },
        isAbsent: absent,
        workloadHours: (workloadMin / 60).toFixed(1),
      }
    })

    // Sort by total score, exclude absent members
    const ranked = scored
      .filter(s => !s.isAbsent)
      .sort((a, b) => b.scores.total - a.scores.total)
      .slice(0, 3)

    return {
      task: { id: task.id, title: task.title, type: task.type },
      recommendations: ranked,
      weights: WEIGHTS,
    }
  }
}