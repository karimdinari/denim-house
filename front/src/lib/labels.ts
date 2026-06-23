import type { AlertType, PrototypePhase, TaskFamily, TaskPriority } from "./types";

export const FAMILY_LABELS: Record<TaskFamily, string> = {
  THREE_D_DIGITAL: "3D & Digital",
  VISUAL_CREATIVE: "Visual & Creative",
  PRODUCT_FABRICATION: "Product & Fabrication",
  IMMERSIVE: "Immersive",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Med",
  LOW: "Low",
};

export const SOFTWARE_LABELS: Record<string, string> = {
  CLO3D: "CLO3D",
  BLENDER: "Blender",
  AFTER_EFFECTS: "After Effects",
  UNREAL_ENGINE: "Unreal",
  MIDJOURNEY_IA: "IA Image",
  ADOBE_SUITE: "Adobe",
  ZBRUSH: "ZBrush",
  SUBSTANCE_PAINTER: "Substance",
};

export const DOMAIN_LABELS: Record<string, string> = {
  MODELISATION_3D: "3D Modelling",
  ANIMATION: "Animation",
  IMPRESSION_TEXTILE: "Textile Print",
  BRODERIE: "Broderie",
  PATRONAGE: "Patronage",
  PHOTOGRAPHIE: "Photo",
  VR_AR: "VR/AR",
  DIRECTION_ARTISTIQUE: "Direction",
};

export const BACKGROUND_LABELS: Record<string, string> = {
  DESIGN_MODE: "Design Mode",
  ARTS_APPLIQUES: "Arts Appliqués",
  INGENIERIE_TEXTILE: "Textile Engineering",
  INFOGRAPHIE: "Infographie",
  ARCHITECTURE: "Architecture",
  BEAUX_ARTS: "Beaux-Arts",
};

export const PHASE_LABELS: Record<PrototypePhase, string> = {
  ESQUISSE: "Esquisse",
  PATRONAGE: "Patronage",
  COUPE: "Coupe",
  ASSEMBLAGE: "Assemblage",
  LAVAGE: "Lavage",
  QC: "QC",
};

export const PHASES_ORDER: PrototypePhase[] = [
  "ESQUISSE",
  "PATRONAGE",
  "COUPE",
  "ASSEMBLAGE",
  "LAVAGE",
  "QC",
];

export const ALERT_KIND: Record<AlertType, string> = {
  CASCADE_DELAY: "Cascade",
  OVERLOAD: "Overload",
  MISSING_SKILL: "Skill gap",
  CRITICAL_DEADLINE: "Deadline",
  BOTTLENECK: "Bottleneck",
  LEAVE_CONFLICT: "Leave conflict",
};

export function alertTone(type: AlertType): "selvedge" | "stitch" | "indigo" {
  if (type === "CASCADE_DELAY" || type === "BOTTLENECK" || type === "CRITICAL_DEADLINE")
    return "selvedge";
  if (type === "OVERLOAD" || type === "LEAVE_CONFLICT") return "stitch";
  return "indigo";
}

export function taskRef(id: string): string {
  return `DH-${id.slice(-6).toUpperCase()}`;
}

export function userName(u: { firstName: string; lastName: string }): string {
  return `${u.firstName} ${u.lastName}`;
}

export function userInitials(u: { firstName: string; lastName: string }): string {
  return `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase();
}

export function formatDeadline(deadline?: string | null): string {
  if (!deadline) return "—";
  const d = new Date(deadline);
  const now = new Date();
  const diffH = Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60));
  if (diffH < 0) return "Overdue";
  if (diffH < 24) return `${diffH}h`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function startOfWeek(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
