export type Role = "MANAGER" | "MEMBER";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type TaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type TaskFamily =
  | "THREE_D_DIGITAL"
  | "VISUAL_CREATIVE"
  | "PRODUCT_FABRICATION"
  | "IMMERSIVE";

export type AlertType =
  | "OVERLOAD"
  | "MISSING_SKILL"
  | "CRITICAL_DEADLINE"
  | "BOTTLENECK"
  | "LEAVE_CONFLICT"
  | "CASCADE_DELAY";

export type PrototypePhase =
  | "ESQUISSE"
  | "PATRONAGE"
  | "COUPE"
  | "ASSEMBLAGE"
  | "LAVAGE"
  | "QC";

export interface UserSkill {
  id: string;
  software: string;
  level: number;
}

export interface UserExpertise {
  id: string;
  domain: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  background?: string | null;
  avatar?: string | null;
  skills?: UserSkill[];
  expertises?: UserExpertise[];
  createdAt?: string;
}

export interface TaskUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  family: TaskFamily;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string | null;
  estimatedMin: number;
  assignedUserId?: string | null;
  assignedTo?: TaskUser | null;
  blockedBy?: Array<{
    blockingTask: { id: string; title: string; status: TaskStatus };
  }>;
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface MoodBoardColor {
  id: string;
  hex: string;
}

export interface MoodBoardImage {
  id: string;
  url: string;
  caption?: string | null;
}

export interface MoodBoard {
  id: string;
  title: string;
  collection?: string | null;
  colors: MoodBoardColor[];
  images: MoodBoardImage[];
}

export interface Prototype {
  id: string;
  name: string;
  collection?: string | null;
  currentPhase: PrototypePhase;
  createdAt: string;
  phases?: Array<{ phase: PrototypePhase; completedAt: string; note?: string | null }>;
}

export interface PlanningBlock {
  id: string;
  userId: string;
  taskId: string;
  date: string;
  startTime: string;
  endTime: string;
  user?: TaskUser;
  task?: { id: string; title: string; type: string; priority: TaskPriority; family: TaskFamily };
}

export interface Workload {
  totalMin: number;
  totalHours: string;
}

export interface ScoringCandidate {
  user: TaskUser;
  scores: {
    skill: number;
    domain: number;
    availability: number;
    history: number;
    total: number;
  };
  workloadHours: string;
}

export interface ScoringResult {
  task: { id: string; title: string; type: string };
  recommendations: ScoringCandidate[];
  weights: Record<string, number>;
}

export interface AuthResponse {
  user: User;
  token: string;
}
