-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'MEMBER');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "TaskFamily" AS ENUM ('THREE_D_DIGITAL', 'VISUAL_CREATIVE', 'PRODUCT_FABRICATION', 'IMMERSIVE');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('MODEL_3D_CLO3D_DXF', 'MODEL_3D_CLO3D_SCRATCH', 'SCAN_TISSU_3D', 'ANIMATION_3D_UNREAL', 'ANIMATION_3D_IA', 'SHOOTING_STYLESHOOT', 'PHOTOGRAPHIE_STUDIO', 'CONCEPT_GRAPHIQUE', 'IMAGE_IA', 'MOOD_BOARD', 'RECHERCHE_TENDANCE', 'FICHE_TECHNIQUE_IA', 'PROTO_PHYSIQUE', 'BRODERIE', 'SERIGRAPHIE', 'PRINT_ALLOVER', 'DIGITAL_PRINT_MONOLAYER', 'EXPERIENCE_VR', 'EXPERIENCE_AR');

-- CreateEnum
CREATE TYPE "SoftwareSkill" AS ENUM ('CLO3D', 'BLENDER', 'AFTER_EFFECTS', 'UNREAL_ENGINE', 'MIDJOURNEY_IA', 'ADOBE_SUITE', 'ZBRUSH', 'SUBSTANCE_PAINTER');

-- CreateEnum
CREATE TYPE "ExpertiseDomain" AS ENUM ('MODELISATION_3D', 'ANIMATION', 'IMPRESSION_TEXTILE', 'BRODERIE', 'PATRONAGE', 'PHOTOGRAPHIE', 'VR_AR', 'DIRECTION_ARTISTIQUE');

-- CreateEnum
CREATE TYPE "Background" AS ENUM ('DESIGN_MODE', 'ARTS_APPLIQUES', 'INGENIERIE_TEXTILE', 'INFOGRAPHIE', 'ARCHITECTURE', 'BEAUX_ARTS');

-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('CONGE', 'MALADIE', 'FORMATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "AbsenceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PrototypePhase" AS ENUM ('ESQUISSE', 'PATRONAGE', 'COUPE', 'ASSEMBLAGE', 'LAVAGE', 'QC');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('OVERLOAD', 'MISSING_SKILL', 'CRITICAL_DEADLINE', 'BOTTLENECK', 'LEAVE_CONFLICT', 'CASCADE_DELAY');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "avatar" TEXT,
    "background" "Background",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_skills" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "software" "SoftwareSkill" NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "user_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_expertises" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domain" "ExpertiseDomain" NOT NULL,

    CONSTRAINT "user_expertises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TaskType" NOT NULL,
    "family" "TaskFamily" NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "deadline" TIMESTAMP(3),
    "isHardDeadline" BOOLEAN NOT NULL DEFAULT false,
    "estimatedMin" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedUserId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_dependencies" (
    "id" TEXT NOT NULL,
    "blockedTaskId" TEXT NOT NULL,
    "blockingTaskId" TEXT NOT NULL,

    CONSTRAINT "task_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "type" "TaskType" NOT NULL,
    "actualMin" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_blocks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL,

    CONSTRAINT "planning_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AbsenceType" NOT NULL,
    "status" "AbsenceStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public_holidays" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'TN',
    "isRecurring" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "public_holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_boards" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "collection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mood_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_board_colors" (
    "id" TEXT NOT NULL,
    "moodBoardId" TEXT NOT NULL,
    "hex" TEXT NOT NULL,

    CONSTRAINT "mood_board_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mood_board_images" (
    "id" TEXT NOT NULL,
    "moodBoardId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "mood_board_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prototypes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collection" TEXT,
    "currentPhase" "PrototypePhase" NOT NULL DEFAULT 'ESQUISSE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prototypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prototype_phase_logs" (
    "id" TEXT NOT NULL,
    "prototypeId" TEXT NOT NULL,
    "phase" "PrototypePhase" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "prototype_phase_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "architectural_plans" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'EN_COURS',
    "fileUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "architectural_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_posts" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_comments" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "taskId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_skills_userId_software_key" ON "user_skills"("userId", "software");

-- CreateIndex
CREATE UNIQUE INDEX "user_expertises_userId_domain_key" ON "user_expertises"("userId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "task_dependencies_blockedTaskId_blockingTaskId_key" ON "task_dependencies"("blockedTaskId", "blockingTaskId");

-- AddForeignKey
ALTER TABLE "user_skills" ADD CONSTRAINT "user_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_expertises" ADD CONSTRAINT "user_expertises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_dependencies" ADD CONSTRAINT "task_dependencies_blockedTaskId_fkey" FOREIGN KEY ("blockedTaskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_dependencies" ADD CONSTRAINT "task_dependencies_blockingTaskId_fkey" FOREIGN KEY ("blockingTaskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_blocks" ADD CONSTRAINT "planning_blocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_blocks" ADD CONSTRAINT "planning_blocks_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absences" ADD CONSTRAINT "absences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_board_colors" ADD CONSTRAINT "mood_board_colors_moodBoardId_fkey" FOREIGN KEY ("moodBoardId") REFERENCES "mood_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mood_board_images" ADD CONSTRAINT "mood_board_images_moodBoardId_fkey" FOREIGN KEY ("moodBoardId") REFERENCES "mood_boards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prototype_phase_logs" ADD CONSTRAINT "prototype_phase_logs_prototypeId_fkey" FOREIGN KEY ("prototypeId") REFERENCES "prototypes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_comments" ADD CONSTRAINT "forum_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
