// ─────────────────────────────────────────
// TASK → REQUIRED SKILLS & DOMAINS MAPPING
// ─────────────────────────────────────────

export const TASK_REQUIREMENTS = {
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