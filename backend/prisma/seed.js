// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

function daysFromNow(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d
}

function timeOn(date, hh, mm = 0) {
  const d = new Date(date)
  d.setHours(hh, mm, 0, 0)
  return d
}

// ─────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────

async function main() {
  console.log('🌱  Seeding Denim House …')

  // ── 1. CLEAN ──────────────────────────
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.alert.deleteMany(),
    prisma.forumComment.deleteMany(),
    prisma.forumPost.deleteMany(),
    prisma.planningBlock.deleteMany(),
    prisma.taskHistory.deleteMany(),
    prisma.taskDependency.deleteMany(),
    prisma.task.deleteMany(),
    prisma.absence.deleteMany(),
    prisma.publicHoliday.deleteMany(),
    prisma.moodBoardImage.deleteMany(),
    prisma.moodBoardColor.deleteMany(),
    prisma.moodBoard.deleteMany(),
    prisma.prototypePhaseLog.deleteMany(),
    prisma.prototype.deleteMany(),
    prisma.architecturalPlan.deleteMany(),
    prisma.userSkill.deleteMany(),
    prisma.userExpertise.deleteMany(),
    prisma.user.deleteMany(),
  ])
  console.log('  ✓ Cleaned existing data')

  // ── 2. USERS ──────────────────────────
  const hash = (pw) => bcrypt.hash(pw, 10)

  const [manager, adam, sofia, karim, lina, nour, mehdi] = await Promise.all([
    prisma.user.create({
      data: {
        email: 'manager@denim.house',
        password: await hash('manager123'),
        firstName: 'Sarah',
        lastName: 'Benali',
        role: 'MANAGER',
        background: 'DESIGN_MODE',
        skills: {
          create: [
            { software: 'ADOBE_SUITE', level: 5 },
            { software: 'CLO3D',       level: 3 },
          ]
        },
        expertises: {
          create: [
            { domain: 'DIRECTION_ARTISTIQUE' },
            { domain: 'MODELISATION_3D' },
          ]
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'adam@denim.house',
        password: await hash('member123'),
        firstName: 'Adam',
        lastName: 'Cherni',
        role: 'MEMBER',
        background: 'INFOGRAPHIE',
        skills: {
          create: [
            { software: 'CLO3D',        level: 4 },
            { software: 'BLENDER',      level: 3 },
            { software: 'ADOBE_SUITE',  level: 3 },
          ]
        },
        expertises: {
          create: [
            { domain: 'MODELISATION_3D' },
            { domain: 'ANIMATION' },
          ]
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'sofia@denim.house',
        password: await hash('member123'),
        firstName: 'Sofia',
        lastName: 'Mansouri',
        role: 'MEMBER',
        background: 'ARTS_APPLIQUES',
        skills: {
          create: [
            { software: 'ADOBE_SUITE',   level: 5 },
            { software: 'MIDJOURNEY_IA', level: 4 },
          ]
        },
        expertises: {
          create: [
            { domain: 'DIRECTION_ARTISTIQUE' },
            { domain: 'PHOTOGRAPHIE' },
          ]
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'karim@denim.house',
        password: await hash('member123'),
        firstName: 'Karim',
        lastName: 'Trabelsi',
        role: 'MEMBER',
        background: 'INGENIERIE_TEXTILE',
        skills: {
          create: [
            { software: 'CLO3D',        level: 5 },
            { software: 'ADOBE_SUITE',  level: 4 },
          ]
        },
        expertises: {
          create: [
            { domain: 'MODELISATION_3D' },
            { domain: 'IMPRESSION_TEXTILE' },
            { domain: 'PATRONAGE' },
          ]
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'lina@denim.house',
        password: await hash('member123'),
        firstName: 'Lina',
        lastName: 'Hamdi',
        role: 'MEMBER',
        background: 'BEAUX_ARTS',
        skills: {
          create: [
            { software: 'UNREAL_ENGINE', level: 4 },
            { software: 'AFTER_EFFECTS', level: 3 },
          ]
        },
        expertises: {
          create: [
            { domain: 'ANIMATION' },
            { domain: 'VR_AR' },
          ]
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'nour@denim.house',
        password: await hash('member123'),
        firstName: 'Nour',
        lastName: 'Sfar',
        role: 'MEMBER',
        background: 'DESIGN_MODE',
        skills: {
          create: [
            { software: 'ADOBE_SUITE',   level: 3 },
            { software: 'MIDJOURNEY_IA', level: 3 },
          ]
        },
        expertises: {
          create: [
            { domain: 'IMPRESSION_TEXTILE' },
            { domain: 'BRODERIE' },
          ]
        }
      }
    }),

    prisma.user.create({
      data: {
        email: 'mehdi@denim.house',
        password: await hash('member123'),
        firstName: 'Mehdi',
        lastName: 'Jemli',
        role: 'MEMBER',
        background: 'ARCHITECTURE',
        skills: {
          create: [
            { software: 'UNREAL_ENGINE',       level: 5 },
            { software: 'SUBSTANCE_PAINTER',   level: 4 },
            { software: 'BLENDER',             level: 4 },
          ]
        },
        expertises: {
          create: [
            { domain: 'VR_AR' },
            { domain: 'ANIMATION' },
            { domain: 'MODELISATION_3D' },
          ]
        }
      }
    }),
  ])

  console.log('  ✓ Users created (1 manager + 6 members)')

  // ── 3. PUBLIC HOLIDAYS (Tunisia 2025) ─
  await prisma.publicHoliday.createMany({
    data: [
      { name: 'Jour de An',                  date: new Date('2025-01-01'), country: 'TN' },
      { name: 'Fête de la Révolution',       date: new Date('2025-01-14'), country: 'TN' },
      { name: 'Fête de la Jeunesse',         date: new Date('2025-03-20'), country: 'TN' },
      { name: 'Fête des Martyrs',            date: new Date('2025-04-09'), country: 'TN' },
      { name: 'Fête du Travail',             date: new Date('2025-05-01'), country: 'TN' },
      { name: 'Fête Nationale (République)', date: new Date('2025-07-25'), country: 'TN' },
      { name: 'Fête de la Femme',            date: new Date('2025-08-13'), country: 'TN' },
      { name: 'Fête de l\'Évacuation',       date: new Date('2025-10-15'), country: 'TN' },
    ]
  })
  console.log('  ✓ Public holidays seeded (Tunisia 2025)')

  // ── 4. ABSENCES ───────────────────────
  await prisma.absence.createMany({
    data: [
      // Adam on leave next week
      {
        userId:    adam.id,
        type:      'CONGE',
        status:    'APPROVED',
        startDate: daysFromNow(7),
        endDate:   daysFromNow(11),
        note:      'Vacances d\'été',
      },
      // Nour — sick leave (pending)
      {
        userId:    nour.id,
        type:      'MALADIE',
        status:    'PENDING',
        startDate: daysFromNow(2),
        endDate:   daysFromNow(3),
        note:      'Consultation médicale',
      },
      // Lina — training (approved)
      {
        userId:    lina.id,
        type:      'FORMATION',
        status:    'APPROVED',
        startDate: daysFromNow(14),
        endDate:   daysFromNow(16),
        note:      'Formation Unreal Engine 5',
      },
    ]
  })
  console.log('  ✓ Absences seeded')

  // ── 5. TASKS ─────────────────────────
  // Collection SS-2026 workflow — realistic dependency chain

  const taskTendance = await prisma.task.create({
    data: {
      title:        'Recherche tendances SS-2026',
      description:  'Analyser les tendances mode printemps-été 2026 (matières, couleurs, silhouettes)',
      type:         'RECHERCHE_TENDANCE',
      family:       'VISUAL_CREATIVE',
      priority:     'HIGH',
      status:       'DONE',
      estimatedMin: 180,
      deadline:     daysFromNow(-5),
      assignedUserId: sofia.id,
    }
  })

  const taskMoodboard = await prisma.task.create({
    data: {
      title:        'Création Mood Board collection SS-2026',
      description:  'Assembler un mood board visuel basé sur la recherche tendances',
      type:         'MOOD_BOARD',
      family:       'VISUAL_CREATIVE',
      priority:     'HIGH',
      status:       'IN_PROGRESS',
      estimatedMin: 120,
      deadline:     daysFromNow(2),
      assignedUserId: sofia.id,
    }
  })

  const taskConcept = await prisma.task.create({
    data: {
      title:        'Concept graphique — veste denim oversized',
      description:  'Développer le concept graphique de la pièce phare de la collection',
      type:         'CONCEPT_GRAPHIQUE',
      family:       'VISUAL_CREATIVE',
      priority:     'HIGH',
      status:       'TODO',
      estimatedMin: 240,
      deadline:     daysFromNow(5),
      assignedUserId: sofia.id,
    }
  })

  const taskModel3D = await prisma.task.create({
    data: {
      title:        'Modèle 3D CLO3D — veste denim',
      description:  'Créer le modèle 3D complet depuis le fichier DXF patronage',
      type:         'MODEL_3D_CLO3D_DXF',
      family:       'THREE_D_DIGITAL',
      priority:     'CRITICAL',
      status:       'TODO',
      estimatedMin: 360,
      deadline:     daysFromNow(8),
      isHardDeadline: true,
      assignedUserId: adam.id,
    }
  })

  const taskScanTissu = await prisma.task.create({
    data: {
      title:        'Scan tissu 3D — denim stretch 12oz',
      description:  'Scanner le tissu pour intégration fidèle dans CLO3D',
      type:         'SCAN_TISSU_3D',
      family:       'THREE_D_DIGITAL',
      priority:     'HIGH',
      status:       'TODO',
      estimatedMin: 90,
      deadline:     daysFromNow(6),
      assignedUserId: karim.id,
    }
  })

  const taskProto = await prisma.task.create({
    data: {
      title:        'Lancement proto physique — veste denim',
      description:  'Préparer et lancer la fabrication du prototype physique',
      type:         'PROTO_PHYSIQUE',
      family:       'PRODUCT_FABRICATION',
      priority:     'CRITICAL',
      status:       'TODO',
      estimatedMin: 480,
      deadline:     daysFromNow(12),
      isHardDeadline: true,
    }
  })

  const taskPrint = await prisma.task.create({
    data: {
      title:        'Print allover — motif wax géométrique',
      description:  'Développer le print allover pour la ligne t-shirts',
      type:         'PRINT_ALLOVER',
      family:       'PRODUCT_FABRICATION',
      priority:     'MEDIUM',
      status:       'TODO',
      estimatedMin: 300,
      deadline:     daysFromNow(10),
      assignedUserId: nour.id,
    }
  })

  const taskBroderie = await prisma.task.create({
    data: {
      title:        'Développement broderie — logo collection',
      description:  'Créer le fichier broderie pour le logo SS-2026',
      type:         'BRODERIE',
      family:       'PRODUCT_FABRICATION',
      priority:     'MEDIUM',
      status:       'TODO',
      estimatedMin: 180,
      deadline:     daysFromNow(9),
      assignedUserId: nour.id,
    }
  })

  const taskVR = await prisma.task.create({
    data: {
      title:        'Expérience VR — défilé virtuel SS-2026',
      description:  'Développer l\'environnement VR pour présenter la collection en immersif',
      type:         'EXPERIENCE_VR',
      family:       'IMMERSIVE',
      priority:     'LOW',
      status:       'TODO',
      estimatedMin: 960,
      deadline:     daysFromNow(30),
      assignedUserId: mehdi.id,
    }
  })

  const taskImageIA = await prisma.task.create({
    data: {
      title:        'Création images IA — visuels campagne',
      description:  'Générer des visuels campagne via Midjourney pour les réseaux sociaux',
      type:         'IMAGE_IA',
      family:       'VISUAL_CREATIVE',
      priority:     'MEDIUM',
      status:       'TODO',
      estimatedMin: 120,
      deadline:     daysFromNow(15),
      assignedUserId: sofia.id,
    }
  })

  // Overdue task to trigger cascade delay alert
  const taskOverdue = await prisma.task.create({
    data: {
      title:        'Fiche technique IA — pantalon cargo',
      description:  'Générer fiche technique complète via Midjourney IA',
      type:         'FICHE_TECHNIQUE_IA',
      family:       'PRODUCT_FABRICATION',
      priority:     'HIGH',
      status:       'IN_PROGRESS',
      estimatedMin: 90,
      deadline:     daysFromNow(-3), // overdue!
      assignedUserId: karim.id,
    }
  })

  // Unassigned bottleneck tasks (same type × 3)
  await prisma.task.createMany({
    data: [
      {
        title: 'Modèle 3D CLO3D — pantalon cargo',
        type: 'MODEL_3D_CLO3D_DXF', family: 'THREE_D_DIGITAL',
        priority: 'MEDIUM', status: 'TODO', estimatedMin: 300, deadline: daysFromNow(20),
      },
      {
        title: 'Modèle 3D CLO3D — chemise lin oversize',
        type: 'MODEL_3D_CLO3D_DXF', family: 'THREE_D_DIGITAL',
        priority: 'MEDIUM', status: 'TODO', estimatedMin: 270, deadline: daysFromNow(22),
      },
      {
        title: 'Modèle 3D CLO3D — short baggy',
        type: 'MODEL_3D_CLO3D_DXF', family: 'THREE_D_DIGITAL',
        priority: 'LOW', status: 'TODO', estimatedMin: 240, deadline: daysFromNow(25),
      },
    ]
  })

  console.log('  ✓ Tasks seeded (12 tasks across 4 families)')

  // ── 6. DEPENDENCIES ───────────────────
  await prisma.taskDependency.createMany({
    data: [
      // mood board depends on research (already done)
      { blockedTaskId: taskMoodboard.id, blockingTaskId: taskTendance.id },
      // concept depends on mood board
      { blockedTaskId: taskConcept.id,  blockingTaskId: taskMoodboard.id },
      // 3D model depends on concept + scan
      { blockedTaskId: taskModel3D.id,  blockingTaskId: taskConcept.id },
      { blockedTaskId: taskModel3D.id,  blockingTaskId: taskScanTissu.id },
      // proto depends on 3D model
      { blockedTaskId: taskProto.id,    blockingTaskId: taskModel3D.id },
      // VR depends on proto
      { blockedTaskId: taskVR.id,       blockingTaskId: taskProto.id },
    ]
  })
  console.log('  ✓ Task dependencies seeded')

  // ── 7. TASK HISTORY ───────────────────
  await prisma.taskHistory.createMany({
    data: [
      // Sofia's past work
      { userId: sofia.id, taskId: taskTendance.id, type: 'RECHERCHE_TENDANCE', actualMin: 200, success: true },
      // Adam's history
      { userId: adam.id,  taskId: taskTendance.id, type: 'MODEL_3D_CLO3D_DXF', actualMin: 350, success: true },
      { userId: adam.id,  taskId: taskTendance.id, type: 'MODEL_3D_CLO3D_DXF', actualMin: 400, success: true },
      { userId: adam.id,  taskId: taskTendance.id, type: 'SCAN_TISSU_3D',      actualMin: 80,  success: true },
      // Karim's history
      { userId: karim.id, taskId: taskTendance.id, type: 'MODEL_3D_CLO3D_DXF', actualMin: 320, success: false },
      { userId: karim.id, taskId: taskTendance.id, type: 'PROTO_PHYSIQUE',      actualMin: 500, success: true },
      // Mehdi's history
      { userId: mehdi.id, taskId: taskTendance.id, type: 'EXPERIENCE_VR', actualMin: 1000, success: true },
      { userId: mehdi.id, taskId: taskTendance.id, type: 'EXPERIENCE_VR', actualMin: 900,  success: true },
    ]
  })
  console.log('  ✓ Task history seeded')

  // ── 8. PLANNING BLOCKS ────────────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const dayAfter = new Date(today)
  dayAfter.setDate(dayAfter.getDate() + 2)

  await prisma.planningBlock.createMany({
    data: [
      // Sofia today — mood board (3h)
      {
        userId: sofia.id, taskId: taskMoodboard.id,
        date: today,
        startTime: timeOn(today, 9),
        endTime:   timeOn(today, 12),
        durationMin: 180,
      },
      // Sofia today — image IA (2h)
      {
        userId: sofia.id, taskId: taskImageIA.id,
        date: today,
        startTime: timeOn(today, 14),
        endTime:   timeOn(today, 16),
        durationMin: 120,
      },
      // Karim today — scan tissu (1.5h)
      {
        userId: karim.id, taskId: taskScanTissu.id,
        date: today,
        startTime: timeOn(today, 8),
        endTime:   timeOn(today, 9, 30),
        durationMin: 90,
      },
      // Adam tomorrow — 3D model (6h → near overload)
      {
        userId: adam.id, taskId: taskModel3D.id,
        date: tomorrow,
        startTime: timeOn(tomorrow, 8),
        endTime:   timeOn(tomorrow, 14),
        durationMin: 360,
      },
      // Mehdi tomorrow — VR (4h)
      {
        userId: mehdi.id, taskId: taskVR.id,
        date: tomorrow,
        startTime: timeOn(tomorrow, 9),
        endTime:   timeOn(tomorrow, 13),
        durationMin: 240,
      },
      // Nour — broderie (3h day after tomorrow)
      {
        userId: nour.id, taskId: taskBroderie.id,
        date: dayAfter,
        startTime: timeOn(dayAfter, 10),
        endTime:   timeOn(dayAfter, 13),
        durationMin: 180,
      },
    ]
  })
  console.log('  ✓ Planning blocks seeded')

  // ── 9. ALERTS ─────────────────────────
  await prisma.alert.createMany({
    data: [
      {
        type:    'CRITICAL_DEADLINE',
        message: 'Task "Création Mood Board collection SS-2026" has a critical deadline within 48h',
        taskId:  taskMoodboard.id,
        userId:  sofia.id,
      },
      {
        type:    'CASCADE_DELAY',
        message: 'Task "Fiche technique IA — pantalon cargo" is overdue and is blocking downstream tasks',
        taskId:  taskOverdue.id,
      },
      {
        type:    'LEAVE_CONFLICT',
        message: 'Adam Cherni is on leave but has task "Modèle 3D CLO3D — veste denim" due during absence',
        userId:  adam.id,
        taskId:  taskModel3D.id,
      },
      {
        type:    'BOTTLENECK',
        message: 'Bottleneck detected: 3 unassigned tasks of type MODEL_3D_CLO3D_DXF',
      },
    ]
  })
  console.log('  ✓ Alerts seeded')

  // ── 10. NOTIFICATIONS ─────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId:  adam.id,
        message: 'You have been assigned to task: "Modèle 3D CLO3D — veste denim"',
        link:    '/tasks',
      },
      {
        userId:  sofia.id,
        message: 'Deadline approaching for "Création Mood Board collection SS-2026" — due in 2 days',
        link:    '/tasks',
      },
      {
        userId:  karim.id,
        message: 'You have been assigned to task: "Scan tissu 3D — denim stretch 12oz"',
        link:    '/tasks',
      },
      {
        userId:  nour.id,
        message: 'You have been assigned to task: "Développement broderie — logo collection"',
        link:    '/tasks',
      },
      {
        userId:  nour.id,
        message: 'You have been assigned to task: "Print allover — motif wax géométrique"',
        link:    '/tasks',
      },
      {
        userId:  mehdi.id,
        message: 'You have been assigned to task: "Expérience VR — défilé virtuel SS-2026"',
        link:    '/tasks',
      },
    ]
  })
  console.log('  ✓ Notifications seeded')

  // ── 11. MOOD BOARDS ───────────────────
  await prisma.moodBoard.create({
    data: {
      title:      'SS-2026 — Wabi-Sabi Denim',
      collection: 'SS-2026',
      colors: {
        create: [
          { hex: '#C8B89A' }, // sand
          { hex: '#3D3530' }, // dark denim
          { hex: '#7A8C6E' }, // sage
          { hex: '#E8DDD0' }, // off-white
          { hex: '#5C6B7A' }, // stone blue
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', caption: 'Texture denim brut' },
          { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', caption: 'Silhouette oversize référence' },
          { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', caption: 'Inspiration wabi-sabi japon' },
        ]
      }
    }
  })

  await prisma.moodBoard.create({
    data: {
      title:      'AW-2026 — Urban Industrial',
      collection: 'AW-2026',
      colors: {
        create: [
          { hex: '#1A1A2E' },
          { hex: '#16213E' },
          { hex: '#C0392B' },
          { hex: '#BDC3C7' },
          { hex: '#2C3E50' },
        ]
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800', caption: 'Mood urbain industriel' },
        ]
      }
    }
  })
  console.log('  ✓ Mood boards seeded')

  // ── 12. PROTOTYPES ────────────────────
  const proto1 = await prisma.prototype.create({
    data: {
      name:         'Veste Denim Oversized #001',
      collection:   'SS-2026',
      currentPhase: 'PATRONAGE',
      phases: {
        create: [
          { phase: 'ESQUISSE', note: 'Esquisse validée par la direction artistique' },
        ]
      }
    }
  })

  await prisma.prototype.create({
    data: {
      name:         'Pantalon Cargo Wide Leg #002',
      collection:   'SS-2026',
      currentPhase: 'ESQUISSE',
    }
  })

  await prisma.prototype.create({
    data: {
      name:         'Chemise Lin Oversize #003',
      collection:   'SS-2026',
      currentPhase: 'COUPE',
      phases: {
        create: [
          { phase: 'ESQUISSE',  note: 'Approuvé' },
          { phase: 'PATRONAGE', note: 'Patronage terminé, taille 38 référence' },
        ]
      }
    }
  })
  console.log('  ✓ Prototypes seeded')

  // ── 13. ARCHITECTURAL PLANS ───────────
  await prisma.architecturalPlan.createMany({
    data: [
      { title: 'Plan atelier principal — Zone coupe',    version: 3, status: 'VALIDÉ',   fileUrl: null },
      { title: 'Plan atelier principal — Zone broderie', version: 1, status: 'EN_COURS', fileUrl: null },
      { title: 'Plan showroom SS-2026',                  version: 2, status: 'EN_COURS', fileUrl: null },
    ]
  })
  console.log('  ✓ Architectural plans seeded')

  // ── 14. FORUM ─────────────────────────
  const post1 = await prisma.forumPost.create({
    data: {
      authorId: manager.id,
      title:    '📌 Guidelines créatives SS-2026 — à lire par tous',
      content:  'Bonjour à tous,\n\nVoici les grandes lignes créatives de notre collection SS-2026 "Wabi-Sabi Denim".\n\nOn mise sur la légèreté, les textures naturelles et les silhouettes oversize. Le denim reste notre matière centrale, mais on l\'associe cette saison avec du lin et du coton biologique.\n\nPalette de couleurs : sable, stone blue, off-white, vert sauge.\n\nDes questions ? N\'hésitez pas à commenter !',
      likes:    5,
    }
  })

  const post2 = await prisma.forumPost.create({
    data: {
      authorId: adam.id,
      title:    'Retour expérience CLO3D — simulation tissu stretch',
      content:  'Salut,\n\nJe voulais partager quelques astuces pour la simulation du denim stretch dans CLO3D.\n\n1. Utiliser un mesh density de 15mm pour les zones de tension\n2. Activer "Elastic" dans les propriétés tissu\n3. Le paramètre Weft/Warp à 0.65 donne un résultat très réaliste pour notre 12oz\n\nN\'hésitez pas à tester et à me faire vos retours.',
      likes:    3,
    }
  })

  await prisma.forumPost.create({
    data: {
      authorId: sofia.id,
      title:    'Midjourney v7 — tips pour visuels mode réalistes',
      content:  'Après plusieurs semaines de tests, voici mes prompts préférés pour générer des visuels mode réalistes avec MJ v7.\n\nStyle de base : "editorial fashion photography, denim collection, natural light, wabi-sabi aesthetic, film grain, --ar 4:5 --style raw --v 7"\n\nPour les plans rapprochés texture : rajouter "macro textile detail, fabric texture close-up"\n\nBon courage à tous pour vos visuels campagne !',
      likes:    7,
    }
  })

  // Comments
  await prisma.forumComment.createMany({
    data: [
      {
        postId: post1.id, authorId: adam.id,
        content: 'Merci Sarah ! Le direction wabi-sabi est vraiment inspirante, ça va bien avec nos recherches tendances de Sofia.',
      },
      {
        postId: post1.id, authorId: karim.id,
        content: 'Top ! Une question : est-ce qu\'on a déjà la liste des matières validées pour passer commande ?',
      },
      {
        postId: post1.id, authorId: manager.id,
        content: 'Karim, oui ! Je t\'envoie la liste par mail aujourd\'hui.',
      },
      {
        postId: post2.id, authorId: karim.id,
        content: 'Super utile Adam ! Je vais tester le paramètre Weft/Warp ce soir pour le scan tissu.',
      },
      {
        postId: post2.id, authorId: mehdi.id,
        content: 'Est-ce que ces paramètres fonctionnent aussi pour l\'export vers Unreal Engine ? Je prépare l\'environnement VR.',
      },
    ]
  })
  console.log('  ✓ Forum seeded (3 posts, 5 comments)')

  // ── SUMMARY ───────────────────────────
  console.log('\n✅  Seed complete!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔑  Login credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Manager : manager@denim.house / manager123')
  console.log('  Adam    : adam@denim.house     / member123')
  console.log('  Sofia   : sofia@denim.house    / member123')
  console.log('  Karim   : karim@denim.house    / member123')
  console.log('  Lina    : lina@denim.house     / member123')
  console.log('  Nour    : nour@denim.house     / member123')
  console.log('  Mehdi   : mehdi@denim.house    / member123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())  