import { useEffect, useMemo, useState } from 'react';
import './App.css';

const CURRENT_USER = 'Sarah';
const FG_MAX_LIMIT_MM = 0.3;

const NAV_ITEMS = [
  'Dashboard',
  'Dossiers',
  'Demandes',
  'Sessions',
  'Vérification',
  'Rapports',
  'Documentation',
  'Référentiels',
];

const DASHBOARD_SERVICES = [
  { key: 'Sessions', title: 'Acquisition', subtitle: 'Nouveaux clichés' },
  { key: 'Rapports', title: 'Rapports', subtitle: 'Audit & Export' },
  { key: 'Documentation', title: 'Maintenance', subtitle: 'Parc matériel' },
  { key: 'Référentiels', title: 'Archives', subtitle: 'Historique CND' },
];

const MOBILE_NAV = [
  { key: 'Dashboard', label: 'Dashboard' },
  { key: 'Demandes', label: 'Recherche' },
  { key: 'Sessions', label: '+' },
  { key: 'Dossiers', label: 'Projets' },
  { key: 'Référentiels', label: 'Réglages' },
];

const PIECES_BY_TECHNIQUE = {
  RX: ['Tube', 'Tôle', 'Soudage', 'Soudure bout à bout', 'Soudure angle', 'Fonderie'],
  Gamma: ['Canalisation épaisse', 'Soudure circonférentielle', 'Réservoir', 'Charpente', 'Tube'],
};

const RX_MATERIAL_GROUPS = [
  {
    label: 'ACIERS',
    options: [
      'Acier carbone',
      'Acier faiblement allié',
      'Acier inox austénitique (304, 316)',
      'Acier inox ferritique',
      'Acier inox martensitique',
      'Duplex / Superduplex',
    ],
  },
  {
    label: 'FONTES',
    options: ['Fonte grise', 'Fonte nodulaire', 'Fonte blanche'],
  },
  {
    label: 'ALUMINIUM ET ALLIAGES',
    options: ['Aluminium pur', 'Al-Mg', 'Al-Si', 'Al-Cu', 'Al-Zn'],
  },
  {
    label: 'CUIVRE ET ALLIAGES',
    options: ['Cuivre pur', 'Laiton', 'Bronze', 'Cupro-nickel'],
  },
  {
    label: 'NICKEL ET SUPERALLIAGES',
    options: ['Nickel pur', 'Inconel', 'Monel', 'Hastelloy', 'Incoloy'],
  },
  {
    label: 'TITANE ET ALLIAGES',
    options: ['Titane pur', 'Ti-6Al-4V', 'Autres alliages Ti'],
  },
  {
    label: 'MAGNÉSIUM',
    options: ['Magnésium pur', 'Alliages Mg-Al'],
  },
  {
    label: 'ZINC',
    options: ['Zinc pur', 'Zamak'],
  },
  {
    label: 'COBALT',
    options: ['Cobalt pur', 'Stellite'],
  },
  {
    label: 'MÉTAUX LOURDS (RX HAUTE ÉNERGIE)',
    options: ['Plomb', 'Tungstène', 'Uranium appauvri'],
  },
  {
    label: 'PLASTIQUES',
    options: ['PE', 'PVC', 'PTFE', 'ABS'],
  },
  {
    label: 'COMPOSITES',
    options: ['Fibre de verre', 'Fibre carbone composite', 'Sandwich nid d’abeille'],
  },
  {
    label: 'AUTRES NON MÉTALLIQUES',
    options: ['Bois', 'Béton', 'Céramique technique', 'Caoutchouc'],
  },
];

const SOURCE_OPTIONS_BY_TECHNIQUE = {
  RX: ['Tube RX microfoyer', 'Tube RX standard', 'Générateur numérique'],
  Gamma: ['Ir-192', 'Se-75', 'Co-60'],
};

const SHOT_TYPES_BY_TECHNIQUE = {
  RX: {
    default: ['Simple paroi simple image', 'Simple paroi double image', 'Double paroi simple image'],
    bySource: {
      'Tube RX microfoyer': ['Microfoyer HD', 'Simple paroi simple image'],
      'Tube RX standard': ['Simple paroi simple image', 'Double paroi simple image'],
      'Générateur numérique': ['Numérique direct', 'Simple paroi simple image'],
    },
  },
  Gamma: {
    default: [
      'Simple paroi simple image',
      'Simple paroi double image',
      'Double paroi simple image',
      'Double paroi double image',
      'Plan sur plan',
      'Panoramique',
      'Panoramique circonférentielle',
      'Tangentiel',
      'Elliptique',
      'Oblique',
      'Axial',
      'Profil',
      'Multi-expositions',
      'Contrôle contact',
      'Forte épaisseur',
      'Faible épaisseur',
    ],
    bySource: {
      'Ir-192': [],
      'Se-75': [],
      'Co-60': [],
    },
  },
};

const IR192_ABAQUE_POINTS = [
  { epaisseur: 0, q: 3.3 },
  { epaisseur: 5, q: 4.2 },
  { epaisseur: 10, q: 5.5 },
  { epaisseur: 15, q: 6.9 },
  { epaisseur: 20, q: 8.5 },
  { epaisseur: 25, q: 10.5 },
  { epaisseur: 30, q: 13 },
  { epaisseur: 35, q: 16.5 },
  { epaisseur: 40, q: 22 },
  { epaisseur: 45, q: 29 },
  { epaisseur: 50, q: 38 },
  { epaisseur: 55, q: 50 },
  { epaisseur: 60, q: 66 },
  { epaisseur: 65, q: 87 },
  { epaisseur: 70, q: 112 },
  { epaisseur: 75, q: 145 },
  { epaisseur: 80, q: 188 },
  { epaisseur: 85, q: 245 },
  { epaisseur: 90, q: 318 },
  { epaisseur: 95, q: 410 },
  { epaisseur: 100, q: 520 },
];

const RX_ABAQUE_REFERENCE_DSF_MM = 700;

const RX_ABAQUE_CURVES_BY_KV = {
  80: [
    { epaisseur: 0, q: 6 },
    { epaisseur: 5, q: 8 },
    { epaisseur: 10, q: 10.5 },
    { epaisseur: 15, q: 14 },
    { epaisseur: 20, q: 18.5 },
    { epaisseur: 25, q: 24 },
    { epaisseur: 30, q: 31 },
    { epaisseur: 35, q: 39 },
    { epaisseur: 40, q: 48 },
    { epaisseur: 45, q: 50 },
  ],
  100: [
    { epaisseur: 0, q: 4.8 },
    { epaisseur: 5, q: 6.2 },
    { epaisseur: 10, q: 8.2 },
    { epaisseur: 15, q: 10.9 },
    { epaisseur: 20, q: 14.5 },
    { epaisseur: 25, q: 19 },
    { epaisseur: 30, q: 25 },
    { epaisseur: 35, q: 32 },
    { epaisseur: 40, q: 40 },
    { epaisseur: 45, q: 49 },
  ],
  120: [
    { epaisseur: 0, q: 3.9 },
    { epaisseur: 5, q: 5 },
    { epaisseur: 10, q: 6.6 },
    { epaisseur: 15, q: 8.8 },
    { epaisseur: 20, q: 11.7 },
    { epaisseur: 25, q: 15.5 },
    { epaisseur: 30, q: 20.4 },
    { epaisseur: 35, q: 26.8 },
    { epaisseur: 40, q: 35 },
    { epaisseur: 45, q: 45 },
  ],
  140: [
    { epaisseur: 0, q: 3.2 },
    { epaisseur: 5, q: 4.1 },
    { epaisseur: 10, q: 5.4 },
    { epaisseur: 15, q: 7.2 },
    { epaisseur: 20, q: 9.6 },
    { epaisseur: 25, q: 12.8 },
    { epaisseur: 30, q: 16.9 },
    { epaisseur: 35, q: 22.4 },
    { epaisseur: 40, q: 29.7 },
    { epaisseur: 45, q: 39 },
  ],
  160: [
    { epaisseur: 0, q: 2.7 },
    { epaisseur: 5, q: 3.4 },
    { epaisseur: 10, q: 4.5 },
    { epaisseur: 15, q: 6 },
    { epaisseur: 20, q: 8 },
    { epaisseur: 25, q: 10.6 },
    { epaisseur: 30, q: 14.1 },
    { epaisseur: 35, q: 18.6 },
    { epaisseur: 40, q: 24.7 },
    { epaisseur: 45, q: 32.7 },
  ],
  180: [
    { epaisseur: 0, q: 2.3 },
    { epaisseur: 5, q: 2.9 },
    { epaisseur: 10, q: 3.8 },
    { epaisseur: 15, q: 5.1 },
    { epaisseur: 20, q: 6.8 },
    { epaisseur: 25, q: 9 },
    { epaisseur: 30, q: 12 },
    { epaisseur: 35, q: 15.8 },
    { epaisseur: 40, q: 21 },
    { epaisseur: 45, q: 27.8 },
  ],
  200: [
    { epaisseur: 0, q: 2 },
    { epaisseur: 5, q: 2.5 },
    { epaisseur: 10, q: 3.3 },
    { epaisseur: 15, q: 4.4 },
    { epaisseur: 20, q: 5.9 },
    { epaisseur: 25, q: 7.8 },
    { epaisseur: 30, q: 10.3 },
    { epaisseur: 35, q: 13.7 },
    { epaisseur: 40, q: 18.1 },
    { epaisseur: 45, q: 24 },
  ],
};

const FILM_K_BY_AGFA = {
  D7: 1,
  D5: 1.6,
  D4: 3,
  D3: 4,
};

const GAMMA_FILM_OPTIONS = ['AGFA D3', 'AGFA D4', 'AGFA D5', 'AGFA D7'];

const GAMMA_MATERIAL_GROUPS = [
  {
    label: 'ACIERS',
    options: [
      'Acier carbone',
      'Acier faiblement allié',
      'Acier inox austénitique (304, 316)',
      'Acier inox ferritique',
      'Acier inox martensitique',
      'Duplex / Superduplex',
    ],
  },
  {
    label: 'FONTES',
    options: ['Fonte grise', 'Fonte nodulaire', 'Fonte blanche'],
  },
  {
    label: 'ALLIAGES D’ALUMINIUM',
    options: ['Aluminium pur', 'Al-Mg', 'Al-Si', 'Al-Cu', 'Al-Zn'],
  },
  {
    label: 'ALLIAGES DE CUIVRE',
    options: ['Cuivre pur', 'Laiton', 'Bronze', 'Cupro-nickel'],
  },
  {
    label: 'ALLIAGES DE NICKEL',
    options: ['Nickel pur', 'Inconel', 'Monel', 'Hastelloy', 'Incoloy'],
  },
  {
    label: 'ALLIAGES DE TITANE',
    options: ['Titane pur', 'Ti-6Al-4V', 'Autres alliages Ti'],
  },
  {
    label: 'ALLIAGES DE MAGNÉSIUM',
    options: ['Magnésium pur', 'Alliages Mg-Al'],
  },
  {
    label: 'ALLIAGES DE COBALT',
    options: ['Cobalt pur', 'Stellite'],
  },
  {
    label: 'ALLIAGES DE ZINC',
    options: ['Zinc pur', 'Zamak'],
  },
  {
    label: 'MÉTAUX LOURDS',
    options: ['Plomb', 'Tungstène', 'Uranium appauvri'],
  },
  {
    label: 'MATÉRIAUX NON MÉTALLIQUES',
    options: [
      'Polyéthylène (PE)',
      'PVC',
      'PTFE',
      'Résine époxy',
      'Fibre de verre',
      'Fibre carbone composite',
      'Béton',
      'Céramique technique',
    ],
  },
];

const GAMMA_MATERIAL_OPTIONS = GAMMA_MATERIAL_GROUPS.flatMap((group) => group.options);
const DEFAULT_GAMMA_MATERIAL = GAMMA_MATERIAL_OPTIONS[0];
const RX_MATERIAL_OPTIONS = RX_MATERIAL_GROUPS.flatMap((group) => group.options);
const RX_MATERIAL_ALIASES = {
  'Aciers alliés': 'Acier faiblement allié',
  'Aciers inox': 'Acier inox austénitique (304, 316)',
  'Aciers outils': 'Acier carbone',
  Cuivre: 'Cuivre pur',
  'Mg et alliages': 'Alliages Mg-Al',
  Zinc: 'Zinc pur',
  'Fibre carbone': 'Fibre carbone composite',
  'Céramiques techniques': 'Céramique technique',
};

const GAMMA_MATERIAL_DENSITY_BY_NAME = {
  'Acier carbone': 7.85,
  'Acier faiblement allié': 7.85,
  'Acier inox austénitique (304, 316)': 7.85,
  'Acier inox ferritique': 7.85,
  'Acier inox martensitique': 7.85,
  'Duplex / Superduplex': 7.85,

  'Fonte grise': 7.15,
  'Fonte nodulaire': 7.2,
  'Fonte nodulaire (ductile)': 7.2,
  'Fonte blanche': 7.4,

  'Aluminium pur': 2.7,
  'Al-Mg': 2.7,
  'Al-Si': 2.7,
  'Al-Cu': 2.8,
  'Al-Zn': 2.8,
  'Alliage Al-Mg': 2.7,
  'Alliage Al-Si': 2.7,
  'Alliage Al-Cu': 2.8,
  'Alliage Al-Zn': 2.8,

  'Cuivre pur': 8.96,
  Laiton: 8.5,
  Bronze: 8.8,
  'Laiton (Cu-Zn)': 8.5,
  'Bronze (Cu-Sn)': 8.8,
  'Cupro-nickel': 8.9,

  'Nickel pur': 8.9,
  Inconel: 8.35,
  Monel: 8.8,
  Hastelloy: 8.95,
  Incoloy: 8.1,
  'Alloy 625 / 718': 8.35,

  'Titane pur': 4.51,
  'Ti-6Al-4V': 4.43,
  'Autres alliages Ti': 4.5,
  'Alliages Ti': 4.5,

  'Magnésium pur': 1.74,
  'Alliages Mg-Al': 1.8,
  'Alliage Mg-Al': 1.8,

  'Cobalt pur': 8.9,
  Stellite: 8.45,
  'Stellite (Co-Cr)': 8.45,

  'Zinc pur': 7.14,
  Zamak: 6.7,

  Plomb: 11.34,
  'Tungstène': 19.3,
  'Uranium appauvri': 18.9,

  'Polyéthylène (PE)': 0.95,
  PVC: 1.35,
  PTFE: 2.2,
  'Résine époxy': 1.2,
  'Fibre de verre': 1.9,
  'Fibre de verre composite': 1.9,
  'Fibre carbone composite': 1.6,
  'Béton': 2.4,
  'Céramique technique': 4.25,
};

const GAMMA_MATERIAL_ALIASES = {
  'Fonte nodulaire (ductile)': 'Fonte nodulaire',
  'Alliage Al-Mg': 'Al-Mg',
  'Alliage Al-Si': 'Al-Si',
  'Alliage Al-Cu': 'Al-Cu',
  'Alliage Al-Zn': 'Al-Zn',
  'Laiton (Cu-Zn)': 'Laiton',
  'Bronze (Cu-Sn)': 'Bronze',
  'Alliages Ti': 'Autres alliages Ti',
  'Alliage Mg-Al': 'Alliages Mg-Al',
  'Stellite (Co-Cr)': 'Stellite',
  'Fibre de verre composite': 'Fibre de verre',
};

const GAMMA_DENSITY_REFERENCE_GROUPS = [
  {
    label: 'ACIERS',
    examValue: 'Conversion examen : 7,85',
    rows: [
      { material: 'Acier carbone', rho: '7,85', conversion: 7.85 },
      { material: 'Acier faiblement allié', rho: '7,8 – 7,9', conversion: 7.85 },
      { material: 'Acier inox austénitique (304, 316)', rho: '7,9 – 8,0', conversion: 7.85 },
      { material: 'Acier inox ferritique', rho: '7,7 – 7,8', conversion: 7.85 },
      { material: 'Acier inox martensitique', rho: '7,7 – 7,8', conversion: 7.85 },
      { material: 'Duplex / Superduplex', rho: '7,8 – 7,9', conversion: 7.85 },
    ],
  },
  {
    label: 'FONTES',
    rows: [
      { material: 'Fonte grise', rho: '7,0 – 7,3', conversion: 7.15 },
      { material: 'Fonte nodulaire', rho: '7,1 – 7,3', conversion: 7.2 },
      { material: 'Fonte blanche', rho: '7,4', conversion: 7.4 },
    ],
  },
  {
    label: 'ALUMINIUM & ALLIAGES',
    examValue: 'Valeur examen : 2,7',
    rows: [
      { material: 'Aluminium pur', rho: '2,70', conversion: 2.7 },
      { material: 'Al-Mg', rho: '2,65 – 2,75', conversion: 2.7 },
      { material: 'Al-Si', rho: '2,65 – 2,75', conversion: 2.7 },
      { material: 'Al-Cu', rho: '2,75 – 2,85', conversion: 2.8 },
      { material: 'Al-Zn', rho: '2,75 – 2,85', conversion: 2.8 },
    ],
  },
  {
    label: 'CUIVRE & ALLIAGES',
    rows: [
      { material: 'Cuivre pur', rho: '8,96', conversion: 8.96 },
      { material: 'Laiton', rho: '8,3 – 8,7', conversion: 8.5 },
      { material: 'Bronze', rho: '8,7 – 8,9', conversion: 8.8 },
      { material: 'Cupro-nickel', rho: '8,9', conversion: 8.9 },
    ],
  },
  {
    label: 'NICKEL & SUPERALLIAGES',
    rows: [
      { material: 'Nickel pur', rho: '8,90', conversion: 8.9 },
      { material: 'Inconel', rho: '8,2 – 8,5', conversion: 8.35 },
      { material: 'Monel', rho: '8,8', conversion: 8.8 },
      { material: 'Hastelloy', rho: '8,7 – 9,2', conversion: 8.95 },
      { material: 'Incoloy', rho: '8,0 – 8,2', conversion: 8.1 },
    ],
  },
  {
    label: 'TITANE',
    examValue: 'Valeur examen : 4,5',
    rows: [
      { material: 'Titane pur', rho: '4,51', conversion: 4.51 },
      { material: 'Ti-6Al-4V', rho: '4,43', conversion: 4.43 },
      { material: 'Autres alliages Ti', rho: '4,4 – 4,6', conversion: 4.5 },
    ],
  },
  {
    label: 'MAGNÉSIUM',
    rows: [
      { material: 'Magnésium pur', rho: '1,74', conversion: 1.74 },
      { material: 'Alliages Mg-Al', rho: '1,75 – 1,85', conversion: 1.8 },
    ],
  },
  {
    label: 'ZINC',
    rows: [
      { material: 'Zinc pur', rho: '7,14', conversion: 7.14 },
      { material: 'Zamak', rho: '6,6 – 6,8', conversion: 6.7 },
    ],
  },
  {
    label: 'COBALT',
    rows: [
      { material: 'Cobalt pur', rho: '8,90', conversion: 8.9 },
      { material: 'Stellite', rho: '8,3 – 8,6', conversion: 8.45 },
    ],
  },
  {
    label: 'MÉTAUX LOURDS',
    rows: [
      { material: 'Plomb', rho: '11,34', conversion: 11.34 },
      { material: 'Tungstène', rho: '19,30', conversion: 19.3 },
      { material: 'Uranium appauvri', rho: '18,9', conversion: 18.9 },
    ],
  },
  {
    label: 'MATÉRIAUX NON MÉTALLIQUES',
    rows: [
      { material: 'Polyéthylène (PE)', rho: '0,95', conversion: 0.95 },
      { material: 'PVC', rho: '1,3 – 1,4', conversion: 1.35 },
      { material: 'PTFE', rho: '2,2', conversion: 2.2 },
      { material: 'Résine époxy', rho: '1,1 – 1,3', conversion: 1.2 },
      { material: 'Fibre de verre', rho: '1,8 – 2,0', conversion: 1.9 },
      { material: 'Fibre carbone composite', rho: '1,5 – 1,7', conversion: 1.6 },
      { material: 'Béton', rho: '2,3 – 2,5', conversion: 2.4 },
      { material: 'Céramique technique', rho: '2,5 – 6 (selon type)', conversion: 4.25 },
    ],
  },
];

const DENSITE_N_TABLE = {
  simple: [
    { densite: 1.5, n: 0.73 },
    { densite: 2, n: 1 },
    { densite: 2.5, n: 1.2 },
    { densite: 3, n: 1.4 },
    { densite: 3.5, n: 1.7 },
  ],
  double: [
    { densite: 2.5, n: 0.6 },
    { densite: 3, n: 0.73 },
    { densite: 3.5, n: 0.85 },
    { densite: 4, n: 1 },
    { densite: 4.5, n: 1.12 },
  ],
};

function formatDate(value) {
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function calculateFg(d, e, dsf) {
  if (!d || !e || !dsf || dsf <= e) {
    return null;
  }
  return (d * e) / (dsf - e);
}

function getIr192QFactor(epaisseurMm) {
  const x = Number(epaisseurMm);
  if (!Number.isFinite(x) || x < 0) {
    return null;
  }

  const first = IR192_ABAQUE_POINTS[0];
  const last = IR192_ABAQUE_POINTS[IR192_ABAQUE_POINTS.length - 1];
  if (x <= first.epaisseur) {
    return first.q;
  }
  if (x >= last.epaisseur) {
    return last.q;
  }

  for (let index = 0; index < IR192_ABAQUE_POINTS.length - 1; index += 1) {
    const left = IR192_ABAQUE_POINTS[index];
    const right = IR192_ABAQUE_POINTS[index + 1];
    if (x >= left.epaisseur && x <= right.epaisseur) {
      const t = (x - left.epaisseur) / (right.epaisseur - left.epaisseur);
      const q = Math.exp(Math.log(left.q) + t * (Math.log(right.q) - Math.log(left.q)));
      return q;
    }
  }

  return null;
}

function interpolateLinearPoints(points, xValue) {
  const x = Number(xValue);
  if (!Number.isFinite(x) || x < 0 || !Array.isArray(points) || points.length === 0) {
    return null;
  }

  const first = points[0];
  const last = points[points.length - 1];
  if (x <= first.epaisseur) {
    return first.q;
  }
  if (x >= last.epaisseur) {
    return last.q;
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    const left = points[index];
    const right = points[index + 1];
    if (x >= left.epaisseur && x <= right.epaisseur) {
      const t = (x - left.epaisseur) / (right.epaisseur - left.epaisseur);
      return left.q + t * (right.q - left.q);
    }
  }

  return null;
}

function getRxQFactor(epaisseurMm, kvValue) {
  const epaisseur = Number(epaisseurMm);
  const kv = Number(kvValue);
  if (!Number.isFinite(epaisseur) || epaisseur < 0 || !Number.isFinite(kv) || kv <= 0) {
    return null;
  }

  const availableKv = Object.keys(RX_ABAQUE_CURVES_BY_KV)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);
  if (availableKv.length === 0) {
    return null;
  }

  const minKv = availableKv[0];
  const maxKv = availableKv[availableKv.length - 1];
  const clampedKv = Math.max(minKv, Math.min(maxKv, kv));

  let lowerKv = minKv;
  let upperKv = maxKv;
  for (let index = 0; index < availableKv.length; index += 1) {
    const currentKv = availableKv[index];
    if (currentKv <= clampedKv) {
      lowerKv = currentKv;
    }
    if (currentKv >= clampedKv) {
      upperKv = currentKv;
      break;
    }
  }

  const qLower = interpolateLinearPoints(RX_ABAQUE_CURVES_BY_KV[lowerKv], epaisseur);
  const qUpper = interpolateLinearPoints(RX_ABAQUE_CURVES_BY_KV[upperKv], epaisseur);
  if (qLower === null || qUpper === null) {
    return null;
  }

  if (lowerKv === upperKv) {
    return qLower;
  }
  const ratioKv = (clampedKv - lowerKv) / (upperKv - lowerKv);
  return qLower + ratioKv * (qUpper - qLower);
}

function calculateRxExposureSeconds({ qFactor, ma, dsfMm }) {
  const q = Number(qFactor);
  const intensity = Number(ma);
  const dsf = Number(dsfMm);

  if (!Number.isFinite(q) || !Number.isFinite(intensity) || !Number.isFinite(dsf)) {
    return null;
  }
  if (q <= 0 || intensity <= 0 || dsf <= 0) {
    return null;
  }

  const distanceCorrection = (dsf / RX_ABAQUE_REFERENCE_DSF_MM) ** 2;
  return ((q * distanceCorrection) / intensity) * 60;
}

function getNearestRxCurveKv(kvValue) {
  const kv = Number(kvValue);
  const availableKv = Object.keys(RX_ABAQUE_CURVES_BY_KV)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);

  if (!availableKv.length) {
    return null;
  }
  if (!Number.isFinite(kv)) {
    return availableKv[availableKv.length - 1];
  }

  return availableKv.reduce((best, current) =>
    Math.abs(current - kv) < Math.abs(best - kv) ? current : best
  );
}

function getDefaultGammaSourceByThickness(epaisseurMm) {
  const epaisseur = Number(epaisseurMm);
  if (!Number.isFinite(epaisseur) || epaisseur < 0) {
    return null;
  }
  if (epaisseur < 20) {
    return 'Se-75';
  }
  if (epaisseur < 80) {
    return 'Ir-192';
  }
  if (epaisseur <= 200) {
    return 'Co-60';
  }
  return null;
}

function parseActivityCi(value) {
  const match = String(value || '').replace(',', '.').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function calculateIrExposureHours({ qFactor, dsfMm, filmK, densityN, activityCi }) {
  const q = Number(qFactor);
  const dsfMeters = Number(dsfMm) / 1000;
  const k = Number(filmK);
  const n = Number(densityN);
  const a = Number(activityCi);

  if (!Number.isFinite(q) || !Number.isFinite(dsfMeters) || !Number.isFinite(k) || !Number.isFinite(n) || !Number.isFinite(a)) {
    return null;
  }
  if (q <= 0 || dsfMeters <= 0 || k <= 0 || n <= 0 || a <= 0) {
    return null;
  }

  return (q * dsfMeters * dsfMeters * k * n) / a;
}

function formatHoursToMinutesSeconds(hoursValue) {
  const hours = Number(hoursValue);
  if (!Number.isFinite(hours) || hours < 0) {
    return 'N/A';
  }
  const totalSeconds = Math.round(hours * 3600);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes} min ${String(seconds).padStart(2, '0')} s`;
}

function formatMinutesToMinutesSeconds(minutesValue) {
  const minutes = Number(minutesValue);
  if (!Number.isFinite(minutes) || minutes < 0) {
    return null;
  }
  const totalSeconds = Math.round(minutes * 60);
  const wholeMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${wholeMinutes} min ${String(seconds).padStart(2, '0')} s`;
}

function formatGammaTimeDisplay(value) {
  const normalized = normalizeGammaTimeValue(value);
  return normalized || '-';
}

function normalizeGammaTimeValue(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }
  if (raw.toLowerCase().includes('min')) {
    return raw;
  }
  const numericMinutes = Number(raw.replace(',', '.'));
  if (Number.isFinite(numericMinutes)) {
    return formatMinutesToMinutesSeconds(numericMinutes) || raw;
  }
  return raw;
}

function parseGammaTimeToMinutes(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return null;
  }
  const match = raw.match(/(\d+(?:[\.,]\d+)?)\s*min(?:\s*(\d{1,2})\s*s)?/i);
  if (match) {
    const minutes = Number(String(match[1]).replace(',', '.'));
    const seconds = match[2] ? Number(match[2]) : 0;
    if (Number.isFinite(minutes) && Number.isFinite(seconds)) {
      return minutes + seconds / 60;
    }
  }
  const numericMinutes = Number(raw.replace(',', '.'));
  return Number.isFinite(numericMinutes) ? numericMinutes : null;
}

function getAgfaFilmCode(value) {
  const normalized = String(value || '').toUpperCase();
  if (normalized.includes('AGFA D7')) {
    return 'D7';
  }
  if (normalized.includes('AGFA D5')) {
    return 'D5';
  }
  if (normalized.includes('AGFA D4')) {
    return 'D4';
  }
  if (normalized.includes('AGFA D3')) {
    return 'D3';
  }
  return null;
}

function getFilmKFromLabel(value) {
  const code = getAgfaFilmCode(value);
  return code ? FILM_K_BY_AGFA[code] ?? null : null;
}

function normalizeGammaFilmDetector(value) {
  const code = getAgfaFilmCode(value);
  return code ? `AGFA ${code}` : 'AGFA D4';
}

function normalizeGammaMaterial(value) {
  const exact = String(value || '').trim();
  const canonical = GAMMA_MATERIAL_ALIASES[exact] || exact;
  return GAMMA_MATERIAL_OPTIONS.includes(canonical) ? canonical : DEFAULT_GAMMA_MATERIAL;
}

function normalizeRxMaterial(value) {
  const exact = String(value || '').trim();
  const canonical = RX_MATERIAL_ALIASES[exact] || exact;
  return RX_MATERIAL_OPTIONS.includes(canonical) ? canonical : '';
}

function getGammaMaterialDensity(material) {
  const exact = String(material || '').trim();
  if (exact && Object.prototype.hasOwnProperty.call(GAMMA_MATERIAL_DENSITY_BY_NAME, exact)) {
    return GAMMA_MATERIAL_DENSITY_BY_NAME[exact];
  }

  const value = exact.toLowerCase();
  if (!value) {
    return null;
  }

  if (value.includes('acier') || value.includes('inox')) {
    return 7.85;
  }
  if (value.includes('fonte blanche')) {
    return 7.4;
  }
  if (value.includes('fonte')) {
    return 7.2;
  }
  if (value.includes('al-cu') || value.includes('al-zn')) {
    return 2.8;
  }
  if (value.includes('aluminium') || value.includes('alliage al-')) {
    return 2.7;
  }
  if (value.includes('cuivre')) {
    return 8.96;
  }
  if (value.includes('laiton')) {
    return 8.5;
  }
  if (value.includes('bronze')) {
    return 8.8;
  }
  if (value.includes('cupro')) {
    return 8.9;
  }
  if (
    value.includes('nickel pur') ||
    value.includes('inconel') ||
    value.includes('monel') ||
    value.includes('hastelloy') ||
    value.includes('incoloy') ||
    value.includes('alloy 625') ||
    value.includes('alloy 718') ||
    value.includes('superalliage')
  ) {
    return 8.4;
  }
  if (value.includes('titane') || value.includes('ti-6al-4v')) {
    return value.includes('ti-6al-4v') ? 4.43 : 4.5;
  }
  if (value.includes('mg-') || value.includes('magnésium')) {
    return value.includes('magnésium pur') ? 1.74 : 1.8;
  }
  if (value.includes('stellite') || value.includes('co-cr') || value.includes('cobalt')) {
    return value.includes('cobalt pur') ? 8.9 : 8.45;
  }
  if (value.includes('zinc pur')) {
    return 7.14;
  }
  if (value.includes('zamak') || value.includes('zn-al') || value.includes('zinc')) {
    return value.includes('zinc') ? 7.14 : 6.7;
  }
  if (value.includes('plomb')) {
    return 11.34;
  }
  if (value.includes('tungstène')) {
    return 19.3;
  }
  if (value.includes('uranium')) {
    return 18.9;
  }
  if (value.includes('polyéthylène') || value.includes('pe')) {
    return 0.95;
  }
  if (value.includes('ptfe')) {
    return 2.2;
  }
  if (value.includes('pvc')) {
    return 1.35;
  }
  if (value.includes('résine époxy') || value.includes('resine epoxy')) {
    return 1.2;
  }
  if (value.includes('fibre de verre')) {
    return 1.9;
  }
  if (value.includes('fibre carbone')) {
    return 1.6;
  }
  if (value.includes('plastique')) {
    return 1.4;
  }
  if (value.includes('résine')) {
    return 1.2;
  }
  if (value.includes('composite')) {
    return 1.8;
  }
  if (value.includes('caoutchouc')) {
    return 1.1;
  }
  if (value.includes('bois')) {
    return 0.7;
  }
  if (value.includes('béton')) {
    return 2.4;
  }
  if (value.includes('céramique')) {
    return 3.2;
  }

  return null;
}

function getSteelEquivalentThickness(epaisseurMateriauMm, material) {
  const epaisseur = Number(epaisseurMateriauMm);
  const rho = getGammaMaterialDensity(material);
  if (!Number.isFinite(epaisseur) || epaisseur <= 0 || !Number.isFinite(rho) || rho <= 0) {
    return null;
  }
  return (epaisseur * rho) / 7.85;
}

function getDensityN(mode, densiteValue) {
  const table = mode === 'double' ? DENSITE_N_TABLE.double : DENSITE_N_TABLE.simple;
  const densite = Number(densiteValue);
  if (!Number.isFinite(densite)) {
    return null;
  }
  if (densite <= table[0].densite) {
    return table[0].n;
  }
  if (densite >= table[table.length - 1].densite) {
    return table[table.length - 1].n;
  }

  for (let index = 0; index < table.length - 1; index += 1) {
    const left = table[index];
    const right = table[index + 1];
    if (densite >= left.densite && densite <= right.densite) {
      const ratio = (densite - left.densite) / (right.densite - left.densite);
      return left.n + ratio * (right.n - left.n);
    }
  }
  return null;
}

function projectIrAbaquePoint(epaisseur, q, chart) {
  const clampedX = Math.max(chart.minEpaisseur, Math.min(chart.maxEpaisseur, Number(epaisseur)));
  const clampedQ = Math.max(chart.minQ, Math.min(chart.maxQ, Number(q)));
  const x =
    chart.padding +
    ((clampedX - chart.minEpaisseur) / (chart.maxEpaisseur - chart.minEpaisseur)) * (chart.width - 2 * chart.padding);
  const yLog =
    (Math.log(clampedQ) - Math.log(chart.minQ)) / (Math.log(chart.maxQ) - Math.log(chart.minQ));
  const y = chart.height - chart.padding - yLog * (chart.height - 2 * chart.padding);
  return { x, y };
}

function buildIrAbaquePath(points, chart) {
  return points
    .map((point, index) => {
      const projected = projectIrAbaquePoint(point.epaisseur, point.q, chart);
      return `${index === 0 ? 'M' : 'L'} ${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`;
    })
    .join(' ');
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getPieceCategory(pieceType = '') {
  const value = pieceType.toLowerCase();
  if (value.includes('tôle') || value.includes('plaque') || value.includes('bout à bout')) {
    return 'plane';
  }
  if (value.includes('tube') || value.includes('canalisation') || value.includes('circonf')) {
    return 'tube';
  }
  if (value.includes('virole') || value.includes('réservoir') || value.includes('bac')) {
    return 'shell';
  }
  if (value.includes('fonderie')) {
    return 'casting';
  }
  return 'other';
}

function prioritizeTypes(types, prioritized) {
  return [...prioritized.filter((item) => types.includes(item)), ...types.filter((item) => !prioritized.includes(item))];
}

function computeFilmCount(rayon, longueurFilm, recouvrement) {
  const usableFilm = Number(longueurFilm) - Number(recouvrement);
  if (!rayon || !usableFilm || usableFilm <= 0) {
    return null;
  }
  return Math.ceil((2 * Math.PI * Number(rayon)) / usableFilm);
}

function computeDiametreExterieur({ pieceType, diametreInterne, epaisseur }) {
  const di = Number(diametreInterne);
  const e = Number(epaisseur);
  if (di <= 0 || e <= 0) {
    return null;
  }
  return getPieceCategory(pieceType) === 'tube' ? di + 2 * e : di + e;
}

function getDpdiProjectionRule({ pieceType, diametreInterne, epaisseur }) {
  const category = getPieceCategory(pieceType);
  if (category !== 'tube') {
    return {
      applies: false,
      ratio: null,
      diametreExterieur: null,
      projectionModes: [],
      minDsf: null,
    };
  }

  const de = computeDiametreExterieur({ pieceType, diametreInterne, epaisseur });
  const e = Number(epaisseur);
  if (de === null || e <= 0) {
    return {
      applies: true,
      ratio: null,
      diametreExterieur: de,
      projectionModes: ['Plan sur plan', 'Elliptique'],
      minDsf: null,
    };
  }

  const ratio = de / e;
  const projectionModes = ratio <= 10 ? ['Plan sur plan'] : ['Plan sur plan', 'Elliptique'];

  return {
    applies: true,
    ratio,
    diametreExterieur: de,
    projectionModes,
    minDsf: 10 * de,
  };
}

function getPlanPlanSpsiRule({ pieceType, diametreExterieur }) {
  const category = getPieceCategory(pieceType);
  const d = Number(diametreExterieur);
  const applies = category === 'tube' && d > 0 && d < 88.9;

  return {
    applies,
    allowedTypes: applies ? ['Plan sur plan', 'Elliptique', 'Double paroi double image', 'Simple paroi simple image'] : [],
  };
}

function getMidDiameterContactRule({ pieceType, diametreExterieur, epaisseur, interieurAccessible }) {
  const category = getPieceCategory(pieceType);
  const d = Number(diametreExterieur);
  const applies = category === 'tube' && d >= 88.9 && d <= 170;
  const e = Number(epaisseur);
  const ratio = e > 0 ? d / e : null;
  const mode =
    !applies || ratio === null ? null : ratio <= 5 && interieurAccessible ? 'spsi-interieur' : 'dpsi-exterieur';

  return {
    applies,
    ratio,
    mode,
    minExpositions: mode === 'spsi-interieur' ? 4 : null,
    angle: mode === 'spsi-interieur' ? 90 : null,
    contactRequired: applies,
    allowedTypes:
      mode === 'dpsi-exterieur'
        ? ['Double paroi simple image']
        : mode === 'spsi-interieur'
          ? ['Simple paroi simple image']
          : applies
            ? ['Double paroi simple image', 'Simple paroi simple image']
            : [],
  };
}

function getLargeDiameterPanoramicRule({ pieceType, diametreExterieur }) {
  const category = getPieceCategory(pieceType);
  const d = Number(diametreExterieur);
  return {
    applies: category === 'tube' && d > 170,
  };
}

function getDpSimpleImageContactRule({ shotType, diametreExterieur, epaisseur }) {
  const d = Number(diametreExterieur);
  const e = Number(epaisseur);
  if (shotType !== 'Double paroi simple image' || d <= 0 || e <= 0) {
    return { applies: false, ratio: null };
  }

  const ratio = d / e;
  return {
    applies: ratio > 5,
    ratio,
  };
}

function getAutoDsfRule({ pieceType, shotType, diametreExterieur, longueurPiece }) {
  const isSimpleWallSingleImage = shotType === 'Simple paroi simple image';
  if (!isSimpleWallSingleImage) {
    return { applies: false, minDsf: null, reason: '' };
  }

  const normalizedPiece = (pieceType || '').toLowerCase();
  const isButtWeld = normalizedPiece.includes('bout à bout');
  const isTubeSmallDiameter = getPieceCategory(pieceType) === 'tube' && Number(diametreExterieur) > 0 && Number(diametreExterieur) < 88.9;

  if (!isButtWeld && !isTubeSmallDiameter) {
    return { applies: false, minDsf: null, reason: '' };
  }

  const longueur = Number(longueurPiece);
  const minDsf = longueur > 0 ? 1.5 * longueur : null;

  return {
    applies: true,
    minDsf,
    reason: isButtWeld
      ? 'Soudure bout à bout en simple paroi simple image'
      : 'Tube en simple paroi simple image avec diamètre extérieur < 88,9 mm',
  };
}

function getShotTypeOptions(technique, source, criteria = {}) {
  const config = SHOT_TYPES_BY_TECHNIQUE[technique] || SHOT_TYPES_BY_TECHNIQUE.RX;

  if (technique !== 'Gamma') {
    return config.bySource[source] || config.default;
  }

  let options = [...config.default];

  if (!criteria.interieurAccessible) {
    options = options.filter((type) => !type.toLowerCase().includes('panoramique'));
  }

  if (!criteria.superpositionAcceptable) {
    options = ['Elliptique', ...options.filter((type) => type !== 'Elliptique')];
  }

  const category = getPieceCategory(criteria.pieceType);
  if (category === 'plane') {
    options = options.filter((type) => !['Elliptique', 'Panoramique', 'Panoramique circonférentielle'].includes(type));
    options = prioritizeTypes(options, ['Simple paroi simple image', 'Simple paroi double image']);
  }

  if (category === 'tube') {
    const d = Number(criteria.diametreTube);
    const e = Number(criteria.epaisseur);
    const ratio = d > 0 && e > 0 ? d / e : null;
    const planPlanSpsiRule = getPlanPlanSpsiRule({
      pieceType: criteria.pieceType,
      diametreExterieur: criteria.diametreTube,
    });
    const midDiameterContactRule = getMidDiameterContactRule({
      pieceType: criteria.pieceType,
      diametreExterieur: criteria.diametreTube,
      epaisseur: criteria.epaisseur,
      interieurAccessible: criteria.interieurAccessible,
    });
    const largeDiameterPanoramicRule = getLargeDiameterPanoramicRule({
      pieceType: criteria.pieceType,
      diametreExterieur: criteria.diametreTube,
    });

    if (planPlanSpsiRule.applies) {
      const allowedTypes = [...planPlanSpsiRule.allowedTypes];
      if (ratio !== null && ratio <= 10) {
        options = options.filter((type) => type !== 'Elliptique');
      }
      options = options.filter((type) => allowedTypes.includes(type));
      options = prioritizeTypes(options, ['Plan sur plan', 'Double paroi double image', 'Simple paroi simple image', 'Elliptique']);
    } else if (midDiameterContactRule.applies) {
      options = options.filter((type) => midDiameterContactRule.allowedTypes.includes(type));
      options = prioritizeTypes(options, ['Double paroi simple image', 'Simple paroi simple image']);
    } else if (largeDiameterPanoramicRule.applies) {
      options = options.filter((type) => ['Panoramique', 'Simple paroi simple image'].includes(type));
      options = prioritizeTypes(options, ['Panoramique', 'Simple paroi simple image']);
    } else {
      const dpdiRule = getDpdiProjectionRule({
        pieceType: criteria.pieceType,
        diametreInterne: criteria.diametreInterne,
        epaisseur: criteria.epaisseur,
      });
      if (dpdiRule.applies) {
        options = options.filter(
          (type) => type === 'Double paroi double image' || dpdiRule.projectionModes.includes(type)
        );
        options = prioritizeTypes(options, ['Double paroi double image', ...dpdiRule.projectionModes]);
      }
    }
  }

  if (category === 'shell') {
    if (criteria.interieurAccessible) {
      options = prioritizeTypes(options, ['Panoramique circonférentielle', 'Panoramique']);
    }
    options = prioritizeTypes(options, ['Simple paroi simple image', 'Panoramique circonférentielle']);
  }

  if (category === 'casting') {
    options = prioritizeTypes(options, ['Multi-expositions', 'Profil', 'Oblique']);
  }

  if (criteria.contactControle) {
    options = prioritizeTypes(options, ['Contrôle contact']);
  }

  return Array.from(new Set(options));
}

function getGammaGuidance({
  pieceType,
  shotType,
  diametreTube,
  diametreInterne,
  interieurAccessible,
  eTraversee,
  source,
  superpositionAcceptable,
  fgConforme,
  collimateur,
  dsf,
  dimSource,
  longueurFilm,
  recouvrement,
  rayon,
  contactControle,
}) {
  const hints = [];
  const category = getPieceCategory(pieceType);

  const a = Number(dsf) - Number(eTraversee);
  const b = Number(eTraversee);
  const f = Number(dimSource);
  if (f > 0 && b > 0 && a > 0) {
    const ug = (f * b) / a;
    hints.push(
      `Flou géométrique Fg = d×e/(DSF−e) = ${ug.toFixed(3)} mm (d=${f}, e=${b}, DSF=${Number(dsf).toFixed(1)}).`
    );
  }

  if (category === 'plane') {
    hints.push('Pièce plane : l’épaisseur est prioritaire, le diamètre n’est pas discriminant.');
    hints.push('Ajuster source, temps de pose et distance source-film selon e et largeur de zone.');
  }

  if (category === 'tube') {
    hints.push('Tube/soudure circulaire : diamètre + épaisseur pilotent le choix du type de tir.');
  }

  const planPlanSpsiRule = getPlanPlanSpsiRule({
    pieceType,
    diametreExterieur: diametreTube,
  });
  const midDiameterContactRule = getMidDiameterContactRule({
    pieceType,
    diametreExterieur: diametreTube,
    epaisseur: eTraversee,
    interieurAccessible,
  });
  const largeDiameterPanoramicRule = getLargeDiameterPanoramicRule({
    pieceType,
    diametreExterieur: diametreTube,
  });

  if (planPlanSpsiRule.applies) {
    const ratio = Number(diametreTube) > 0 && Number(eTraversee) > 0 ? Number(diametreTube) / Number(eTraversee) : null;
    hints.push('Ø < 88,9 mm : deux stratégies possibles.');
    hints.push(
      ratio !== null && ratio > 10
        ? 'Option DPDI plan/plan : projection plan sur plan ou elliptique, DSF > 10 × Øext, 2 expositions à 90°, interprétation simultanée des deux parois.'
        : 'Option DPDI plan/plan : projection plan sur plan, DSF > 10 × Øext, 2 expositions à 90°, interprétation simultanée des deux parois.'
    );
    hints.push('Option SPSI plan/plan : minimum 4 expositions à 90°.');
  }
  if (midDiameterContactRule.applies) {
    if (midDiameterContactRule.mode === 'dpsi-exterieur') {
      hints.push(
        `Ø compris entre 88,9 et 170 mm : DPSI au contact extérieur (Ø/e = ${midDiameterContactRule.ratio?.toFixed(2)} > 5).`
      );
    } else if (midDiameterContactRule.mode === 'spsi-interieur') {
      hints.push(
        `Ø compris entre 88,9 et 170 mm : SPSI au contact intérieur (Ø/e = ${midDiameterContactRule.ratio?.toFixed(2)} ≤ 5, accès intérieur).`
      );
      hints.push('Dans ce cas : minimum 4 expositions à 90°.');
    }
  }
  if (largeDiameterPanoramicRule.applies) {
    hints.push('Ø > 170 mm : exposition panoramique SPSI, source centrée.');
  }

  hints.push(
    interieurAccessible
      ? 'Intérieur accessible : tir panoramique possible.'
      : 'Intérieur non accessible : éviter les tirs panoramiques.'
  );

  if (Number(eTraversee) >= 20) {
    hints.push(
      source === 'Co-60'
        ? 'Épaisseur forte : Co-60 adapté.'
        : 'Épaisseur forte : préférer Co-60 ou augmenter la distance source-film (D).'
    );
  }

  if (!superpositionAcceptable) {
    hints.push('Superposition non acceptable : choisir un tir elliptique.');
  }

  if (category === 'shell') {
    const filmCount = computeFilmCount(rayon, longueurFilm, recouvrement);
    hints.push('Virole/réservoir : contrôler rayon/diamètre, recouvrement et longueur de soudure.');
    if (interieurAccessible && filmCount !== null) {
      hints.push(`Panoramique possible : nombre de films estimé = ${filmCount}.`);
    }
  }

  if (category === 'casting') {
    hints.push('Fonderie : surveiller variations d’épaisseur, centrage et distance source.');
  }

  if (contactControle) {
    hints.push('Contrôle contact : flou très sensible, optimiser distance source-film et taille source.');
  }

  if (!fgConforme) {
    hints.push('Flou géométrique élevé : augmenter la distance source-film (DSF).');
  }

  if (!collimateur) {
    hints.push('Sécurité : collimateur requis avant tir gamma.');
  }

  return hints;
}

function App() {
  const now = new Date().toISOString();
  const today = new Date().toISOString().slice(0, 10);
  const [active, setActive] = useState('Dashboard');
  const [flash, setFlash] = useState('');
  const [irHoverPoint, setIrHoverPoint] = useState(null);
  const [irPinnedPoint, setIrPinnedPoint] = useState(null);
  const [rxHoverPoint, setRxHoverPoint] = useState(null);
  const [rxPinnedPoint, setRxPinnedPoint] = useState(null);
  const [rxChartCurveMode, setRxChartCurveMode] = useState('auto');
  const [selectedSessionIdForDocument, setSelectedSessionIdForDocument] = useState('');
  const [selectedSessionIdForDossier, setSelectedSessionIdForDossier] = useState('');
  const [dossierImportShotMode, setDossierImportShotMode] = useState('last');

  const [dossier, setDossier] = useState({
    id: 'RT-2026-001',
    client: 'ACME Industrie',
    orderRef: 'CMD-7842',
    partRef: 'P-19A',
    partType: 'Soudage',
    materialPiece: '',
    norme: 'ISO 17636-2',
    procedure: 'PR-RT-05',
    technique: 'RX',
    eRef: 24,
    status: 'Brouillon',
    createdAt: now,
    createdBy: CURRENT_USER,
    updatedAt: now,
    updatedBy: CURRENT_USER,
    locked: false,
  });

  const [demande, setDemande] = useState({
    norme: 'ISO 17636-2',
    iqi: 'EN IQI fil 10',
    sensibilite: '2%',
    fgMax: FG_MAX_LIMIT_MM,
    nbVues: 2,
    technique: 'RX',
    dateAttendue: '2026-02-25',
    sourceMail: '',
  });

  const [sessions, setSessions] = useState([
    {
      id: 'S-01',
      date: '2026-02-18',
      shots: [
        {
          id: 'T-001',
          technique: 'RX',
          source: 'Tube RX 3 mm',
          typeTir: 'Simple paroi simple image',
          d: 3,
          dsf: 700,
          e: 24,
          kv: 200,
          ma: 4.5,
          time: 45,
          gammaSource: '',
          activite: '',
          gammaTime: '',
          iqi: 'EN IQI fil 10',
          sensibilite: '2%',
          images: 'img_001.dcm',
          indications: 'Aucune',
        },
      ],
    },
  ]);

  const [newShot, setNewShot] = useState({
    technique: 'RX',
    source: 'Tube RX standard',
    materialPiece: '',
    typeTir: 'Simple paroi simple image',
    diametreTube: 88.9,
    diametreInterne: 66.9,
    longueurPiece: 10,
    nombreExpositions: 2,
    angleExpositions: 90,
    sourceAuContact: true,
    positionSource: 'Extérieur',
    interieurAccessible: true,
    superpositionAcceptable: true,
    collimateur: true,
    contactControle: false,
    rayon: 250,
    longueurFilm: 300,
    recouvrement: 20,
    d: 3,
    dsf: 700,
    e: 24,
    kv: 200,
    ma: 4.5,
    time: 45,
    gammaSource: '',
    activite: '8,23 Ci',
    gammaTime: '',
    filmDetecteur: 'AGFA D4',
    densiteMode: 'simple',
    densiteVoulue: 2,
    iqi: 'EN IQI fil 10',
    sensibilite: '2%',
    images: '',
    indications: '',
  });

  const [creationPhysique, setCreationPhysique] = useState({
    source: 'Tube RX standard',
    materialPiece: '',
    typeTir: 'Simple paroi simple image',
    interieurAccessible: true,
    superpositionAcceptable: true,
    collimateur: true,
    contactControle: false,
    dateMesure: today,
    activite: '8,23 Ci',
    gammaTemps: 4,
    rxKv: 200,
    rxMa: 4.5,
    rxTemps: 45,
    geometrie: 'Tube',
    diametre: 88.9,
    diametreInterne: 66.9,
    hauteur: 10,
    nombreExpositions: 2,
    angleExpositions: 90,
    sourceAuContact: true,
    positionSource: 'Extérieur',
    ePrime: 5.49,
    eTraversee: 10.98,
    dsf: 400,
    dimSource: 2.5,
    rayon: 250,
    longueurFilm: 300,
    recouvrement: 20,
    filmDetecteur: 'AGFA D4',
    densiteMode: 'simple',
    densiteVoulue: 2,
  });
  const [creationGammaSourceAuto, setCreationGammaSourceAuto] = useState(true);
  const [sessionGammaSourceAuto, setSessionGammaSourceAuto] = useState(true);

  const [dossierFiles, setDossierFiles] = useState([]);

  const [checklist, setChecklist] = useState({
    identification: false,
    iqi: false,
    parametres: false,
    fg: false,
  });

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      timestamp: now,
      user: CURRENT_USER,
      action: 'Création dossier',
      details: 'Dossier initialisé en brouillon',
    },
  ]);

  const sessionCount = sessions.length;
  const shotCount = sessions.reduce((sum, session) => sum + session.shots.length, 0);
  const allShots = sessions.flatMap((session) => session.shots);
  const reportShotsChrono = useMemo(
    () =>
      sessions
        .flatMap((session, sessionIndex) =>
          session.shots.map((shot, shotIndex) => ({
            ...shot,
            _sessionDate: session.date,
            _sessionIndex: sessionIndex,
            _shotIndex: shotIndex,
          }))
        )
        .sort((left, right) => {
          const dateDiff = new Date(left._sessionDate).getTime() - new Date(right._sessionDate).getTime();
          if (dateDiff !== 0) {
            return dateDiff;
          }
          if (left._sessionIndex !== right._sessionIndex) {
            return left._sessionIndex - right._sessionIndex;
          }
          return left._shotIndex - right._shotIndex;
        }),
    [sessions]
  );

  const checks = useMemo(() => {
    const firstShot = allShots[0];
    const fgValues = allShots
      .map((shot) => calculateFg(Number(shot.d), Number(shot.e), Number(shot.dsf)))
      .filter((value) => value !== null);
    const maxFg = fgValues.length ? Math.max(...fgValues) : null;

    const items = [
      {
        key: 'Technique',
        expected: demande.technique,
        actual: firstShot?.technique || '-',
        compliant: Boolean(firstShot && firstShot.technique === demande.technique),
      },
      {
        key: 'Épaisseur',
        expected: `${dossier.eRef} mm`,
        actual: firstShot ? `${firstShot.e} mm` : '-',
        compliant: Boolean(firstShot && Number(firstShot.e) === Number(dossier.eRef)),
      },
      {
        key: 'Fg',
        expected: `≤ ${FG_MAX_LIMIT_MM}`,
        actual: maxFg === null ? '-' : maxFg.toFixed(3),
        compliant: maxFg !== null && maxFg <= FG_MAX_LIMIT_MM,
      },
      {
        key: 'IQI',
        expected: demande.iqi,
        actual: firstShot?.iqi || '-',
        compliant: Boolean(firstShot && firstShot.iqi === demande.iqi),
      },
      {
        key: 'Sensibilité',
        expected: demande.sensibilite,
        actual: firstShot?.sensibilite || '-',
        compliant: Boolean(firstShot && firstShot.sensibilite === demande.sensibilite),
      },
      {
        key: 'Nb tirs',
        expected: `≥ ${demande.nbVues}`,
        actual: String(shotCount),
        compliant: shotCount >= Number(demande.nbVues),
      },
    ];

    return items;
  }, [allShots, demande, dossier.eRef, shotCount]);

  const nonConformities = checks.filter((item) => !item.compliant);
  const creationFg = calculateFg(
    Number(creationPhysique.dimSource),
    Number(creationPhysique.ePrime),
    Number(creationPhysique.dsf)
  );
  const creationFgConforme = creationFg !== null && creationFg <= FG_MAX_LIMIT_MM;
  const isGammaCreation = dossier.technique === 'Gamma';
  const pieceOptions = PIECES_BY_TECHNIQUE[dossier.technique] || PIECES_BY_TECHNIQUE.RX;
  const creationSourceOptions = SOURCE_OPTIONS_BY_TECHNIQUE[dossier.technique] || SOURCE_OPTIONS_BY_TECHNIQUE.RX;
  const creationShotTypeOptions = getShotTypeOptions(dossier.technique, creationPhysique.source, {
    diametreTube: creationPhysique.diametre,
    diametreInterne: creationPhysique.diametreInterne,
    epaisseur: creationPhysique.ePrime,
    interieurAccessible: creationPhysique.interieurAccessible,
    superpositionAcceptable: creationPhysique.superpositionAcceptable,
    pieceType: creationPhysique.geometrie,
    contactControle: creationPhysique.contactControle,
  });
  const sessionSourceOptions = SOURCE_OPTIONS_BY_TECHNIQUE[newShot.technique] || SOURCE_OPTIONS_BY_TECHNIQUE.RX;
  const sessionShotTypeOptions = getShotTypeOptions(newShot.technique, newShot.source, {
    diametreTube: newShot.diametreTube,
    diametreInterne: newShot.diametreInterne,
    epaisseur: newShot.e,
    interieurAccessible: newShot.interieurAccessible,
    superpositionAcceptable: newShot.superpositionAcceptable,
    pieceType: dossier.partType,
    contactControle: newShot.contactControle,
  });
  const creationGammaGuidance = isGammaCreation
    ? getGammaGuidance({
        shotType: creationPhysique.typeTir,
        diametreTube: creationPhysique.diametre,
      diametreInterne: creationPhysique.diametreInterne,
        interieurAccessible: creationPhysique.interieurAccessible,
        eTraversee: creationPhysique.ePrime,
        source: creationPhysique.source,
        superpositionAcceptable: creationPhysique.superpositionAcceptable,
        fgConforme: creationFgConforme,
        collimateur: creationPhysique.collimateur,
        dsf: creationPhysique.dsf,
        dimSource: creationPhysique.dimSource,
        rayon: creationPhysique.rayon,
        longueurFilm: creationPhysique.longueurFilm,
        recouvrement: creationPhysique.recouvrement,
        pieceType: creationPhysique.geometrie,
        contactControle: creationPhysique.contactControle,
      })
    : [];

  const creationSteelEquivalentThickness =
    dossier.technique === 'Gamma'
      ? getSteelEquivalentThickness(creationPhysique.ePrime, creationPhysique.materialPiece)
      : null;
  const creationIrQFactor =
    dossier.technique === 'Gamma' && creationPhysique.source === 'Ir-192'
      ? getIr192QFactor(creationSteelEquivalentThickness)
      : null;
  const creationActiviteCi = parseActivityCi(creationPhysique.activite);

  const sessionSteelEquivalentThickness =
    newShot.technique === 'Gamma' ? getSteelEquivalentThickness(newShot.e, newShot.materialPiece) : null;
  const sessionIrQFactor =
    newShot.technique === 'Gamma' && newShot.source === 'Ir-192' ? getIr192QFactor(sessionSteelEquivalentThickness) : null;
  const sessionActiviteCi = parseActivityCi(newShot.activite);

  const creationRxSteelEquivalentThickness =
    dossier.technique === 'RX'
      ? getSteelEquivalentThickness(creationPhysique.ePrime, creationPhysique.materialPiece)
      : null;
  const creationRxQFactor =
    dossier.technique === 'RX'
      ? getRxQFactor(creationRxSteelEquivalentThickness, creationPhysique.rxKv)
      : null;
  const creationRxExposureSeconds =
    dossier.technique === 'RX'
      ? calculateRxExposureSeconds({
          qFactor: creationRxQFactor,
          ma: creationPhysique.rxMa,
          dsfMm: creationPhysique.dsf,
        })
      : null;

  const sessionRxSteelEquivalentThickness =
    newShot.technique === 'RX' ? getSteelEquivalentThickness(newShot.e, newShot.materialPiece) : null;
  const sessionRxQFactor =
    newShot.technique === 'RX' ? getRxQFactor(sessionRxSteelEquivalentThickness, newShot.kv) : null;
  const sessionRxExposureSeconds =
    newShot.technique === 'RX'
      ? calculateRxExposureSeconds({
          qFactor: sessionRxQFactor,
          ma: newShot.ma,
          dsfMm: newShot.dsf,
        })
      : null;

  const creationFilmK = getFilmKFromLabel(creationPhysique.filmDetecteur);
  const creationDensityN = getDensityN(creationPhysique.densiteMode, creationPhysique.densiteVoulue);
  const sessionFilmK = getFilmKFromLabel(newShot.filmDetecteur);
  const sessionDensityN = getDensityN(newShot.densiteMode, newShot.densiteVoulue);

  const creationIrExposureHours =
    dossier.technique === 'Gamma' && creationPhysique.source === 'Ir-192'
      ? calculateIrExposureHours({
          qFactor: creationIrQFactor,
          dsfMm: creationPhysique.dsf,
          filmK: creationFilmK,
          densityN: creationDensityN,
          activityCi: creationActiviteCi,
        })
      : null;
  const sessionIrExposureHours =
    newShot.technique === 'Gamma' && newShot.source === 'Ir-192'
      ? calculateIrExposureHours({
          qFactor: sessionIrQFactor,
          dsfMm: newShot.dsf,
          filmK: sessionFilmK,
          densityN: sessionDensityN,
          activityCi: sessionActiviteCi,
        })
      : null;
  const creationIrExposureMinutes =
    creationIrExposureHours === null ? null : Number((creationIrExposureHours * 60).toFixed(2));
  const sessionIrExposureMinutesSeconds =
    sessionIrExposureHours === null ? 'N/A' : formatHoursToMinutesSeconds(sessionIrExposureHours);
  const creationExposureDisplay =
    dossier.technique === 'Gamma'
      ? creationPhysique.source === 'Ir-192' && creationIrExposureHours !== null
        ? formatHoursToMinutesSeconds(creationIrExposureHours)
        : `${Math.max(1, Math.round(Number(creationPhysique.eTraversee) / 3))} min`
      : creationRxExposureSeconds !== null
        ? `${Math.max(1, Math.round(creationRxExposureSeconds))} s`
        : `${Math.max(20, Math.round((Number(creationPhysique.eTraversee) / 2) * 10))} s`;
  const latestGammaShot = [...reportShotsChrono].reverse().find((shot) => shot.technique === 'Gamma') || null;
  const latestGammaTimeDisplay = latestGammaShot ? formatGammaTimeDisplay(latestGammaShot.gammaTime) : '-';
  const rxAvailableCurveKv = useMemo(
    () =>
      Object.keys(RX_ABAQUE_CURVES_BY_KV)
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
        .sort((left, right) => left - right),
    []
  );
  const creationRxCurveKv = getNearestRxCurveKv(creationPhysique.rxKv);
  const sessionRxCurveKv = getNearestRxCurveKv(newShot.kv);
  const autoRxHoverCurveKv =
    creationRxCurveKv || sessionRxCurveKv || (rxAvailableCurveKv.length ? rxAvailableCurveKv[rxAvailableCurveKv.length - 1] : null);
  const rxHoverCurveKv =
    rxChartCurveMode === 'auto' ? autoRxHoverCurveKv : getNearestRxCurveKv(Number(rxChartCurveMode));

  const irAbaqueChart = useMemo(() => {
    const chart = {
      width: 680,
      height: 320,
      padding: 36,
      minEpaisseur: 0,
      maxEpaisseur: 100,
      minQ: 1,
      maxQ: 520,
    };

    return {
      ...chart,
      path: buildIrAbaquePath(IR192_ABAQUE_POINTS, chart),
      creationPoint:
        creationIrQFactor !== null
          ? projectIrAbaquePoint(creationSteelEquivalentThickness, creationIrQFactor, chart)
          : null,
      sessionPoint:
        sessionIrQFactor !== null ? projectIrAbaquePoint(sessionSteelEquivalentThickness, sessionIrQFactor, chart) : null,
    };
  }, [creationIrQFactor, sessionIrQFactor, creationSteelEquivalentThickness, sessionSteelEquivalentThickness]);

  const rxAbaqueChart = useMemo(() => {
    const curves = Object.entries(RX_ABAQUE_CURVES_BY_KV)
      .map(([kv, points]) => ({ kv: Number(kv), points }))
      .filter((entry) => Number.isFinite(entry.kv) && entry.points?.length)
      .sort((left, right) => left.kv - right.kv);

    const allPoints = curves.flatMap((entry) => entry.points);
    const chart = {
      width: 680,
      height: 320,
      padding: 36,
      minEpaisseur: allPoints.length ? Math.min(...allPoints.map((point) => point.epaisseur)) : 0,
      maxEpaisseur: allPoints.length ? Math.max(...allPoints.map((point) => point.epaisseur)) : 45,
      minQ: allPoints.length ? Math.min(...allPoints.map((point) => point.q)) : 1,
      maxQ: allPoints.length ? Math.max(...allPoints.map((point) => point.q)) : 50,
    };

    return {
      ...chart,
      curves: curves.map((entry) => ({
        ...entry,
        path: buildIrAbaquePath(entry.points, chart),
      })),
    };
  }, []);
  const creationRxChartPoint =
    creationRxSteelEquivalentThickness !== null && creationRxQFactor !== null
      ? {
          ...projectIrAbaquePoint(creationRxSteelEquivalentThickness, creationRxQFactor, rxAbaqueChart),
          kv: creationPhysique.rxKv,
        }
      : null;
  const sessionRxChartPoint =
    sessionRxSteelEquivalentThickness !== null && sessionRxQFactor !== null
      ? {
          ...projectIrAbaquePoint(sessionRxSteelEquivalentThickness, sessionRxQFactor, rxAbaqueChart),
          kv: newShot.kv,
        }
      : null;

  const handleIrAbaqueMouseMove = (event) => {
    if (irPinnedPoint) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) {
      return;
    }

    const mouseX = ((event.clientX - bounds.left) / bounds.width) * irAbaqueChart.width;
    const clampedX = Math.max(
      irAbaqueChart.padding,
      Math.min(irAbaqueChart.width - irAbaqueChart.padding, mouseX)
    );
    const ratio =
      (clampedX - irAbaqueChart.padding) /
      (irAbaqueChart.width - 2 * irAbaqueChart.padding);
    const epaisseur =
      irAbaqueChart.minEpaisseur + ratio * (irAbaqueChart.maxEpaisseur - irAbaqueChart.minEpaisseur);
    const q = getIr192QFactor(epaisseur);
    if (q === null) {
      setIrHoverPoint(null);
      return;
    }

    const projected = projectIrAbaquePoint(epaisseur, q, irAbaqueChart);
    setIrHoverPoint({
      epaisseur,
      q,
      x: projected.x,
      y: projected.y,
    });
  };

  const clearIrAbaqueHover = () => {
    if (!irPinnedPoint) {
      setIrHoverPoint(null);
    }
  };

  const toggleIrAbaquePinnedPoint = (event) => {
    if (irPinnedPoint) {
      setIrPinnedPoint(null);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) {
      return;
    }
    const mouseX = ((event.clientX - bounds.left) / bounds.width) * irAbaqueChart.width;
    const clampedX = Math.max(
      irAbaqueChart.padding,
      Math.min(irAbaqueChart.width - irAbaqueChart.padding, mouseX)
    );
    const ratio =
      (clampedX - irAbaqueChart.padding) /
      (irAbaqueChart.width - 2 * irAbaqueChart.padding);
    const epaisseur =
      irAbaqueChart.minEpaisseur + ratio * (irAbaqueChart.maxEpaisseur - irAbaqueChart.minEpaisseur);
    const q = getIr192QFactor(epaisseur);
    if (q === null) {
      return;
    }
    const projected = projectIrAbaquePoint(epaisseur, q, irAbaqueChart);
    setIrPinnedPoint({
      epaisseur,
      q,
      x: projected.x,
      y: projected.y,
    });
    setIrHoverPoint({
      epaisseur,
      q,
      x: projected.x,
      y: projected.y,
    });
  };

  const clearRxAbaqueHover = () => {
    if (!rxPinnedPoint) {
      setRxHoverPoint(null);
    }
  };

  const handleRxAbaqueMouseMove = (event) => {
    if (rxPinnedPoint || !rxHoverCurveKv) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) {
      return;
    }

    const mouseX = ((event.clientX - bounds.left) / bounds.width) * rxAbaqueChart.width;
    const clampedX = Math.max(
      rxAbaqueChart.padding,
      Math.min(rxAbaqueChart.width - rxAbaqueChart.padding, mouseX)
    );
    const ratio =
      (clampedX - rxAbaqueChart.padding) /
      (rxAbaqueChart.width - 2 * rxAbaqueChart.padding);
    const epaisseur =
      rxAbaqueChart.minEpaisseur + ratio * (rxAbaqueChart.maxEpaisseur - rxAbaqueChart.minEpaisseur);
    const q = getRxQFactor(epaisseur, rxHoverCurveKv);
    if (q === null) {
      setRxHoverPoint(null);
      return;
    }

    const projected = projectIrAbaquePoint(epaisseur, q, rxAbaqueChart);
    setRxHoverPoint({
      epaisseur,
      q,
      kv: rxHoverCurveKv,
      x: projected.x,
      y: projected.y,
    });
  };

  const toggleRxAbaquePinnedPoint = (event) => {
    if (rxPinnedPoint) {
      setRxPinnedPoint(null);
      return;
    }
    if (!rxHoverCurveKv) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) {
      return;
    }

    const mouseX = ((event.clientX - bounds.left) / bounds.width) * rxAbaqueChart.width;
    const clampedX = Math.max(
      rxAbaqueChart.padding,
      Math.min(rxAbaqueChart.width - rxAbaqueChart.padding, mouseX)
    );
    const ratio =
      (clampedX - rxAbaqueChart.padding) /
      (rxAbaqueChart.width - 2 * rxAbaqueChart.padding);
    const epaisseur =
      rxAbaqueChart.minEpaisseur + ratio * (rxAbaqueChart.maxEpaisseur - rxAbaqueChart.minEpaisseur);
    const q = getRxQFactor(epaisseur, rxHoverCurveKv);
    if (q === null) {
      return;
    }

    const projected = projectIrAbaquePoint(epaisseur, q, rxAbaqueChart);
    const pinned = {
      epaisseur,
      q,
      kv: rxHoverCurveKv,
      x: projected.x,
      y: projected.y,
    };
    setRxPinnedPoint(pinned);
    setRxHoverPoint(pinned);
  };
  const sessionGammaFg = calculateFg(Number(newShot.d), Number(newShot.e), Number(newShot.dsf));
  const sessionGammaFgConforme = sessionGammaFg !== null && sessionGammaFg <= FG_MAX_LIMIT_MM;
  const sessionGammaGuidance =
    newShot.technique === 'Gamma'
      ? getGammaGuidance({
          shotType: newShot.typeTir,
          diametreTube: newShot.diametreTube,
          diametreInterne: newShot.diametreInterne,
          interieurAccessible: newShot.interieurAccessible,
          eTraversee: newShot.e,
          source: newShot.source,
          superpositionAcceptable: newShot.superpositionAcceptable,
          fgConforme: sessionGammaFgConforme,
          collimateur: newShot.collimateur,
          dsf: newShot.dsf,
          dimSource: newShot.d,
          pieceType: dossier.partType,
          contactControle: newShot.contactControle,
          rayon: newShot.rayon,
          longueurFilm: newShot.longueurFilm,
          recouvrement: newShot.recouvrement,
        })
      : [];

  const creationAutoDsfRule = getAutoDsfRule({
    pieceType: creationPhysique.geometrie,
    shotType: creationPhysique.typeTir,
    diametreExterieur: creationPhysique.diametre,
    longueurPiece: creationPhysique.hauteur,
  });
  const creationAutoDsfConforme =
    !creationAutoDsfRule.applies ||
    creationAutoDsfRule.minDsf === null ||
    Number(creationPhysique.dsf) >= creationAutoDsfRule.minDsf;

  const creationPlanPlanSpsiRule = getPlanPlanSpsiRule({
    pieceType: creationPhysique.geometrie,
    diametreExterieur: creationPhysique.diametre,
  });
  const creationMidDiameterContactRule = getMidDiameterContactRule({
    pieceType: creationPhysique.geometrie,
    diametreExterieur: creationPhysique.diametre,
    epaisseur: creationPhysique.ePrime,
    interieurAccessible: creationPhysique.interieurAccessible,
  });
  const creationDpsiContactRule = getDpSimpleImageContactRule({
    shotType: creationPhysique.typeTir,
    diametreExterieur: creationPhysique.diametre,
    epaisseur: creationPhysique.ePrime,
  });
  const creationLargeDiameterPanoramicRule = getLargeDiameterPanoramicRule({
    pieceType: creationPhysique.geometrie,
    diametreExterieur: creationPhysique.diametre,
  });
  const creationDiameterRatio =
    Number(creationPhysique.diametre) > 0 && Number(creationPhysique.ePrime) > 0
      ? Number(creationPhysique.diametre) / Number(creationPhysique.ePrime)
      : null;
  const creationSmallDpdiMode =
    creationPlanPlanSpsiRule.applies && ['Plan sur plan', 'Elliptique', 'Double paroi double image'].includes(creationPhysique.typeTir);
  const creationSmallDpdiMinDsf =
    creationSmallDpdiMode && Number(creationPhysique.diametre) > 0 ? 10 * Number(creationPhysique.diametre) : 0;
  const creationCombinedMinDsf = Math.max(
    creationAutoDsfRule.applies && creationAutoDsfRule.minDsf !== null ? creationAutoDsfRule.minDsf : 0,
    creationSmallDpdiMinDsf
  );

  const sessionAutoDsfRule = getAutoDsfRule({
    pieceType: dossier.partType,
    shotType: newShot.typeTir,
    diametreExterieur: newShot.diametreTube,
    longueurPiece: newShot.longueurPiece,
  });

  const sessionPlanPlanSpsiRule = getPlanPlanSpsiRule({
    pieceType: dossier.partType,
    diametreExterieur: newShot.diametreTube,
  });
  const sessionMidDiameterContactRule = getMidDiameterContactRule({
    pieceType: dossier.partType,
    diametreExterieur: newShot.diametreTube,
    epaisseur: newShot.e,
    interieurAccessible: newShot.interieurAccessible,
  });
  const sessionDpsiContactRule = getDpSimpleImageContactRule({
    shotType: newShot.typeTir,
    diametreExterieur: newShot.diametreTube,
    epaisseur: newShot.e,
  });
  const sessionLargeDiameterPanoramicRule = getLargeDiameterPanoramicRule({
    pieceType: dossier.partType,
    diametreExterieur: newShot.diametreTube,
  });
  const sessionDiameterRatio =
    Number(newShot.diametreTube) > 0 && Number(newShot.e) > 0 ? Number(newShot.diametreTube) / Number(newShot.e) : null;
  const sessionSmallDpdiMode =
    sessionPlanPlanSpsiRule.applies && ['Plan sur plan', 'Elliptique', 'Double paroi double image'].includes(newShot.typeTir);
  const sessionSmallDpdiMinDsf =
    sessionSmallDpdiMode && Number(newShot.diametreTube) > 0 ? 10 * Number(newShot.diametreTube) : 0;
  const sessionCombinedMinDsf = Math.max(
    sessionAutoDsfRule.applies && sessionAutoDsfRule.minDsf !== null ? sessionAutoDsfRule.minDsf : 0,
    sessionSmallDpdiMinDsf
  );

  useEffect(() => {
    if (dossier.locked || creationCombinedMinDsf <= 0) {
      return;
    }
    setCreationPhysique((prev) => {
      if (Number(prev.dsf) > creationCombinedMinDsf) {
        return prev;
      }
      return {
        ...prev,
        dsf: Number((creationCombinedMinDsf + 0.1).toFixed(1)),
      };
    });
  }, [dossier.locked, creationCombinedMinDsf]);

  useEffect(() => {
    if (dossier.locked || sessionCombinedMinDsf <= 0) {
      return;
    }
    setNewShot((prev) => {
      if (Number(prev.dsf) > sessionCombinedMinDsf) {
        return prev;
      }
      return {
        ...prev,
        dsf: Number((sessionCombinedMinDsf + 0.1).toFixed(1)),
      };
    });
  }, [dossier.locked, sessionCombinedMinDsf]);

  useEffect(() => {
    if (dossier.locked || !creationPlanPlanSpsiRule.applies) {
      return;
    }
    setCreationPhysique((prev) => ({
      ...prev,
      typeTir:
        prev.typeTir === 'Elliptique' && creationDiameterRatio !== null && creationDiameterRatio <= 10
          ? 'Plan sur plan'
          : creationPlanPlanSpsiRule.allowedTypes.includes(prev.typeTir)
            ? prev.typeTir
            : 'Plan sur plan',
    }));
  }, [dossier.locked, creationPlanPlanSpsiRule.applies, creationPlanPlanSpsiRule.allowedTypes, creationDiameterRatio]);

  useEffect(() => {
    if (dossier.locked || !sessionPlanPlanSpsiRule.applies) {
      return;
    }
    setNewShot((prev) => ({
      ...prev,
      typeTir:
        prev.typeTir === 'Elliptique' && sessionDiameterRatio !== null && sessionDiameterRatio <= 10
          ? 'Plan sur plan'
          : sessionPlanPlanSpsiRule.allowedTypes.includes(prev.typeTir)
            ? prev.typeTir
            : 'Plan sur plan',
    }));
  }, [dossier.locked, sessionPlanPlanSpsiRule.applies, sessionPlanPlanSpsiRule.allowedTypes, sessionDiameterRatio]);

  useEffect(() => {
    if (dossier.locked || !creationMidDiameterContactRule.applies) {
      return;
    }
    setCreationPhysique((prev) => ({
      ...prev,
      typeTir: creationMidDiameterContactRule.allowedTypes.includes(prev.typeTir)
        ? prev.typeTir
        : creationMidDiameterContactRule.mode === 'spsi-interieur'
          ? 'Simple paroi simple image'
          : 'Double paroi simple image',
      nombreExpositions:
        creationMidDiameterContactRule.mode === 'spsi-interieur'
          ? Math.max(Number(prev.nombreExpositions) || 0, 4)
          : prev.nombreExpositions,
      angleExpositions: creationMidDiameterContactRule.mode === 'spsi-interieur' ? 90 : prev.angleExpositions,
      sourceAuContact: true,
      positionSource: creationMidDiameterContactRule.mode === 'spsi-interieur' ? 'Intérieur' : 'Extérieur',
    }));
  }, [
    dossier.locked,
    creationMidDiameterContactRule.applies,
    creationMidDiameterContactRule.allowedTypes,
    creationMidDiameterContactRule.mode,
  ]);

  useEffect(() => {
    if (dossier.locked || !sessionMidDiameterContactRule.applies) {
      return;
    }
    setNewShot((prev) => ({
      ...prev,
      typeTir: sessionMidDiameterContactRule.allowedTypes.includes(prev.typeTir)
        ? prev.typeTir
        : sessionMidDiameterContactRule.mode === 'spsi-interieur'
          ? 'Simple paroi simple image'
          : 'Double paroi simple image',
      nombreExpositions:
        sessionMidDiameterContactRule.mode === 'spsi-interieur'
          ? Math.max(Number(prev.nombreExpositions) || 0, 4)
          : prev.nombreExpositions,
      angleExpositions: sessionMidDiameterContactRule.mode === 'spsi-interieur' ? 90 : prev.angleExpositions,
      sourceAuContact: true,
      positionSource: sessionMidDiameterContactRule.mode === 'spsi-interieur' ? 'Intérieur' : 'Extérieur',
    }));
  }, [
    dossier.locked,
    sessionMidDiameterContactRule.applies,
    sessionMidDiameterContactRule.allowedTypes,
    sessionMidDiameterContactRule.mode,
  ]);

  useEffect(() => {
    if (dossier.locked || !creationLargeDiameterPanoramicRule.applies) {
      return;
    }
    setCreationPhysique((prev) => ({
      ...prev,
      typeTir: 'Panoramique',
      sourceAuContact: false,
      positionSource: 'Centrée',
    }));
  }, [dossier.locked, creationLargeDiameterPanoramicRule.applies]);

  useEffect(() => {
    if (dossier.locked || !sessionLargeDiameterPanoramicRule.applies) {
      return;
    }
    setNewShot((prev) => ({
      ...prev,
      typeTir: 'Panoramique',
      sourceAuContact: false,
      positionSource: 'Centrée',
    }));
  }, [dossier.locked, sessionLargeDiameterPanoramicRule.applies]);

  useEffect(() => {
    if (dossier.locked || !creationDpsiContactRule.applies) {
      return;
    }
    setCreationPhysique((prev) => ({ ...prev, sourceAuContact: true, positionSource: 'Extérieur' }));
  }, [dossier.locked, creationDpsiContactRule.applies]);

  useEffect(() => {
    if (dossier.locked || !sessionDpsiContactRule.applies) {
      return;
    }
    setNewShot((prev) => ({ ...prev, sourceAuContact: true, positionSource: 'Extérieur' }));
  }, [dossier.locked, sessionDpsiContactRule.applies]);

  useEffect(() => {
    if (!sessions.length) {
      if (selectedSessionIdForDocument !== '') {
        setSelectedSessionIdForDocument('');
      }
      return;
    }
    const exists = sessions.some((session) => session.id === selectedSessionIdForDocument);
    if (!exists) {
      setSelectedSessionIdForDocument(sessions[sessions.length - 1].id);
    }
  }, [sessions, selectedSessionIdForDocument]);

  useEffect(() => {
    if (!sessions.length) {
      if (selectedSessionIdForDossier !== '') {
        setSelectedSessionIdForDossier('');
      }
      return;
    }
    const exists = sessions.some((session) => session.id === selectedSessionIdForDossier);
    if (!exists) {
      setSelectedSessionIdForDossier(sessions[sessions.length - 1].id);
    }
  }, [sessions, selectedSessionIdForDossier]);

  useEffect(() => {
    if (dossier.locked || dossier.technique !== 'Gamma' || creationPhysique.source !== 'Ir-192') {
      return;
    }
    if (creationIrExposureMinutes === null) {
      return;
    }
    setCreationPhysique((prev) => {
      if (Number(prev.gammaTemps) === creationIrExposureMinutes) {
        return prev;
      }
      return {
        ...prev,
        gammaTemps: creationIrExposureMinutes,
      };
    });
  }, [dossier.locked, dossier.technique, creationPhysique.source, creationIrExposureMinutes]);

  useEffect(() => {
    if (dossier.locked || newShot.technique !== 'Gamma' || newShot.source !== 'Ir-192') {
      return;
    }
    if (sessionIrExposureHours === null) {
      return;
    }
    const autoText = formatHoursToMinutesSeconds(sessionIrExposureHours);
    setNewShot((prev) => {
      if (prev.gammaTime === autoText) {
        return prev;
      }
      return {
        ...prev,
        gammaTime: autoText,
      };
    });
  }, [dossier.locked, newShot.technique, newShot.source, sessionIrExposureHours]);

  useEffect(() => {
    if (dossier.locked || dossier.technique !== 'RX' || creationRxExposureSeconds === null) {
      return;
    }
    const autoSeconds = Number(creationRxExposureSeconds.toFixed(1));
    setCreationPhysique((prev) => {
      if (Number(prev.rxTemps) === autoSeconds) {
        return prev;
      }
      return {
        ...prev,
        rxTemps: autoSeconds,
      };
    });
  }, [dossier.locked, dossier.technique, creationRxExposureSeconds]);

  useEffect(() => {
    if (dossier.locked || newShot.technique !== 'RX' || sessionRxExposureSeconds === null) {
      return;
    }
    const autoSeconds = Number(sessionRxExposureSeconds.toFixed(1));
    setNewShot((prev) => {
      if (Number(prev.time) === autoSeconds) {
        return prev;
      }
      return {
        ...prev,
        time: autoSeconds,
      };
    });
  }, [dossier.locked, newShot.technique, sessionRxExposureSeconds]);

  useEffect(() => {
    if (dossier.locked || dossier.technique !== 'Gamma' || !creationGammaSourceAuto) {
      return;
    }
    const defaultSource =
      getDefaultGammaSourceByThickness(creationPhysique.eTraversee) ||
      getDefaultGammaSourceByThickness(creationPhysique.ePrime);
    if (!defaultSource) {
      return;
    }
    setCreationPhysique((prev) => {
      if (prev.source === defaultSource) {
        return prev;
      }
      const options = getShotTypeOptions('Gamma', defaultSource, {
        diametreTube: prev.diametre,
        diametreInterne: prev.diametreInterne,
        epaisseur: prev.ePrime,
        interieurAccessible: prev.interieurAccessible,
        superpositionAcceptable: prev.superpositionAcceptable,
        pieceType: prev.geometrie,
        contactControle: prev.contactControle,
      });
      return {
        ...prev,
        source: defaultSource,
        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
      };
    });
  }, [
    dossier.locked,
    dossier.technique,
    creationGammaSourceAuto,
    creationPhysique.eTraversee,
    creationPhysique.ePrime,
  ]);

  useEffect(() => {
    if (dossier.locked || newShot.technique !== 'Gamma' || !sessionGammaSourceAuto) {
      return;
    }
    const defaultSource = getDefaultGammaSourceByThickness(newShot.e);
    if (!defaultSource) {
      return;
    }
    setNewShot((prev) => {
      if (prev.source === defaultSource) {
        return prev;
      }
      const options = getShotTypeOptions('Gamma', defaultSource, {
        diametreTube: prev.diametreTube,
        diametreInterne: prev.diametreInterne,
        epaisseur: prev.e,
        interieurAccessible: prev.interieurAccessible,
        superpositionAcceptable: prev.superpositionAcceptable,
        pieceType: dossier.partType,
        contactControle: prev.contactControle,
      });
      return {
        ...prev,
        source: defaultSource,
        gammaSource: defaultSource,
        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
      };
    });
  }, [dossier.locked, dossier.partType, newShot.technique, newShot.e, sessionGammaSourceAuto]);

  useEffect(() => {
    setRxHoverPoint(null);
    setRxPinnedPoint(null);
  }, [rxHoverCurveKv]);

  const registerChange = (action, details) => {
    const timestamp = new Date().toISOString();
    setDossier((prev) => ({
      ...prev,
      updatedAt: timestamp,
      updatedBy: CURRENT_USER,
    }));
    setAuditLogs((prev) => [
      {
        id: prev.length + 1,
        timestamp,
        user: CURRENT_USER,
        action,
        details,
      },
      ...prev,
    ]);
  };

  const updateStatus = (status) => {
    if (dossier.locked) {
      setFlash('Dossier verrouillé après validation.');
      return;
    }
    if (status === 'Soumis') {
      const checklistDone = Object.values(checklist).every(Boolean);
      if (!checklistDone) {
        setFlash('Soumission bloquée : checklist incomplète.');
        return;
      }
    }
    if (status === 'Validé' && dossier.status !== 'Soumis') {
      setFlash('Validation possible uniquement après soumission.');
      return;
    }
    setDossier((prev) => ({
      ...prev,
      status,
      locked: status === 'Validé',
    }));
    registerChange('Changement statut', `Nouveau statut : ${status}`);
    setFlash(status === 'Validé' ? 'Dossier validé et verrouillé.' : `Statut changé : ${status}`);
  };

  const addSession = () => {
    if (dossier.locked) {
      return;
    }
    const newId = `S-${String(sessions.length + 1).padStart(2, '0')}`;
    setSessions((prev) => [...prev, { id: newId, date: new Date().toISOString().slice(0, 10), shots: [] }]);
    registerChange('Ajout session', `Session ${newId} ajoutée`);
  };

  const addShot = () => {
    if (dossier.locked || !sessions.length) {
      return;
    }
    const fg = calculateFg(Number(newShot.d), Number(newShot.e), Number(newShot.dsf));
    if (fg === null) {
      setFlash('Impossible de calculer Fg : vérifier d, e et DSF (DSF > e).');
      return;
    }
    if (sessionAutoDsfRule.applies && sessionAutoDsfRule.minDsf !== null && Number(newShot.dsf) < sessionAutoDsfRule.minDsf) {
      setFlash(`DSF insuffisante : minimum ${sessionAutoDsfRule.minDsf.toFixed(1)} mm selon la règle automatique.`);
      return;
    }
    if (sessionPlanPlanSpsiRule.applies) {
      if (!['Plan sur plan', 'Elliptique', 'Double paroi double image', 'Simple paroi simple image'].includes(newShot.typeTir)) {
        setFlash('Ø < 88,9 mm : type de tir attendu = plan sur plan / elliptique / SPSI plan sur plan.');
        return;
      }
      if (newShot.typeTir === 'Elliptique' && (sessionDiameterRatio === null || sessionDiameterRatio <= 10)) {
        setFlash('Ø < 88,9 mm : projection elliptique autorisée uniquement si Ø/e > 10.');
        return;
      }
      if (['Plan sur plan', 'Elliptique', 'Double paroi double image'].includes(newShot.typeTir)) {
        const dsfMin = 10 * Number(newShot.diametreTube || 0);
        if (!(Number(newShot.dsf) > dsfMin)) {
          setFlash(`Ø < 88,9 mm (mode DPDI) : DSF > 10×Øext, soit > ${dsfMin.toFixed(1)} mm.`);
          return;
        }
        if (Number(newShot.nombreExpositions) < 2 || Number(newShot.angleExpositions) !== 90) {
          setFlash('Ø < 88,9 mm (mode DPDI) : minimum 2 expositions à 90°.');
          return;
        }
      }
      if (newShot.typeTir === 'Simple paroi simple image') {
        if (Number(newShot.nombreExpositions) < 4 || Number(newShot.angleExpositions) !== 90) {
          setFlash('Ø < 88,9 mm (mode SPSI) : minimum 4 expositions à 90°.');
          return;
        }
      }
    }

    if (sessionMidDiameterContactRule.applies) {
      if (sessionMidDiameterContactRule.mode === 'dpsi-exterieur') {
        if (newShot.typeTir !== 'Double paroi simple image') {
          setFlash('Ø 88,9–170 mm et Ø/e > 5 : type de tir requis = Double paroi simple image.');
          return;
        }
        if (newShot.positionSource !== 'Extérieur' || !newShot.sourceAuContact) {
          setFlash('Ø 88,9–170 mm et Ø/e > 5 : source au contact extérieur obligatoire.');
          return;
        }
      }
      if (sessionMidDiameterContactRule.mode === 'spsi-interieur') {
        if (newShot.typeTir !== 'Simple paroi simple image') {
          setFlash('Ø 88,9–170 mm et Ø/e ≤ 5 : type de tir requis = SPSI.');
          return;
        }
        if (!newShot.interieurAccessible) {
          setFlash('Ø 88,9–170 mm et Ø/e ≤ 5 : accès intérieur requis pour SPSI au contact intérieur.');
          return;
        }
        if (newShot.positionSource !== 'Intérieur' || !newShot.sourceAuContact) {
          setFlash('Ø 88,9–170 mm et Ø/e ≤ 5 : source au contact intérieur obligatoire.');
          return;
        }
        if (Number(newShot.nombreExpositions) < 4 || Number(newShot.angleExpositions) !== 90) {
          setFlash('Ø 88,9–170 mm et Ø/e ≤ 5 : minimum 4 expositions à 90°.');
          return;
        }
      }
    }

    if (sessionLargeDiameterPanoramicRule.applies) {
      if (newShot.typeTir !== 'Panoramique') {
        setFlash('Ø > 170 mm : type de tir requis = Panoramique (SPSI).');
        return;
      }
      if (newShot.positionSource !== 'Centrée') {
        setFlash('Ø > 170 mm : source centrée obligatoire.');
        return;
      }
    }
    const shotId = `T-${String(shotCount + 1).padStart(3, '0')}`;
    const enteredGammaTime = String(newShot.gammaTime || '').trim();
    const enteredGammaMinutes = Number(enteredGammaTime.replace(',', '.'));
    const normalizedManualGammaTime =
      enteredGammaTime && Number.isFinite(enteredGammaMinutes)
        ? formatMinutesToMinutesSeconds(enteredGammaMinutes) || enteredGammaTime
        : enteredGammaTime;
    const normalizedGammaTime =
      newShot.technique === 'Gamma'
        ? newShot.source === 'Ir-192' && sessionIrExposureHours !== null
          ? formatHoursToMinutesSeconds(sessionIrExposureHours)
          : normalizedManualGammaTime
        : '';
    const payload = { ...newShot, id: shotId, gammaTime: normalizedGammaTime };
    setSessions((prev) => {
      const next = [...prev];
      next[next.length - 1] = {
        ...next[next.length - 1],
        shots: [...next[next.length - 1].shots, payload],
      };
      return next;
    });
    registerChange('Ajout tir', `${shotId} ajouté dans ${sessions[sessions.length - 1].id}`);
    setFlash(`Tir ${shotId} ajouté (Fg = ${fg.toFixed(3)}).`);
  };

  const updateDemandeFromImport = () => {
    if (!demande.sourceMail || dossier.locked) {
      return;
    }
    const text = demande.sourceMail.toLowerCase();
    const guessedTechnique = text.includes('gamma') ? 'Gamma' : 'RX';
    setDemande((prev) => ({
      ...prev,
      technique: guessedTechnique,
      norme: text.includes('17636') ? 'ISO 17636-2' : prev.norme,
    }));
    registerChange('Import demande', 'Mapping automatique appliqué depuis texte brut');
    setFlash('Demande importée et mappée.');
  };

  const handleDossierFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length || dossier.locked) {
      return;
    }

    const allowedFiles = selectedFiles.filter(
      (file) => file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    if (!allowedFiles.length) {
      setFlash('Formats autorisés : images et PDF.');
      return;
    }

    const newFiles = allowedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setDossierFiles((prev) => [...prev, ...newFiles]);
    registerChange('Ajout pièce jointe', `${newFiles.length} fichier(s) ajouté(s)`);
    setFlash(`${newFiles.length} pièce(s) jointe(s) importée(s).`);
    event.target.value = '';
  };

  const handleSessionImport = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || dossier.locked) {
      event.target.value = '';
      return;
    }

    try {
      const content = await selectedFile.text();
      const parsed = JSON.parse(content);
      const importedSessions = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.sessions)
          ? parsed.sessions
          : null;

      if (!importedSessions || importedSessions.length === 0) {
        setFlash('Import session: format invalide. Attendu: tableau de sessions ou objet { sessions: [...] }.');
        return;
      }

      let nextSessionNumber = sessions.length + 1;
      let nextShotNumber = shotCount + 1;

      const normalizedSessions = importedSessions.map((session) => {
        const rawShots = Array.isArray(session?.shots) ? session.shots : [];
        const normalizedShots = rawShots.map((shot) => {
          const technique = shot?.technique === 'Gamma' || shot?.technique === 'RX' ? shot.technique : dossier.technique;
          const gammaDefaultSource = getDefaultGammaSourceByThickness(shot?.e) || 'Ir-192';
          const source = shot?.source || (technique === 'Gamma' ? gammaDefaultSource : 'Tube RX standard');
          const kv = Number(shot?.kv);
          const ma = Number(shot?.ma);
          const time = Number(shot?.time);
          const gammaTime = technique === 'Gamma' ? normalizeGammaTimeValue(shot?.gammaTime) : '';
          const shotId = shot?.id || `T-${String(nextShotNumber).padStart(3, '0')}`;
          nextShotNumber += 1;

          return {
            ...newShot,
            ...shot,
            id: shotId,
            technique,
            source,
            materialPiece:
              technique === 'Gamma'
                ? normalizeGammaMaterial(shot?.materialPiece)
                : shot?.materialPiece || newShot.materialPiece,
            gammaSource: technique === 'Gamma' ? shot?.gammaSource || source : '',
            activite: technique === 'Gamma' ? shot?.activite || '8,23 Ci' : '',
            gammaTime,
            filmDetecteur:
              technique === 'Gamma'
                ? normalizeGammaFilmDetector(shot?.filmDetecteur)
                : shot?.filmDetecteur || newShot.filmDetecteur,
            kv: technique === 'RX' ? (Number.isFinite(kv) && kv > 0 ? kv : 200) : '',
            ma: technique === 'RX' ? (Number.isFinite(ma) && ma > 0 ? ma : 4.5) : '',
            time: technique === 'RX' ? (Number.isFinite(time) && time > 0 ? time : 45) : '',
          };
        });

        const sessionId = session?.id || `S-${String(nextSessionNumber).padStart(2, '0')}`;
        nextSessionNumber += 1;

        return {
          id: sessionId,
          date: session?.date || new Date().toISOString().slice(0, 10),
          shots: normalizedShots,
        };
      });

      const importedShotCount = normalizedSessions.reduce((sum, session) => sum + session.shots.length, 0);
      setSessions((prev) => [...prev, ...normalizedSessions]);
      registerChange(
        'Import sessions',
        `${normalizedSessions.length} session(s), ${importedShotCount} tir(s) importé(s) depuis ${selectedFile.name}`
      );
      setFlash(`Import réussi : ${normalizedSessions.length} session(s), ${importedShotCount} tir(s).`);
    } catch (error) {
      setFlash('Import session impossible : fichier JSON invalide.');
    } finally {
      event.target.value = '';
    }
  };

  const removeDossierFile = (fileId) => {
    setDossierFiles((prev) => {
      const target = prev.find((entry) => entry.id === fileId);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((entry) => entry.id !== fileId);
    });
    registerChange('Suppression pièce jointe', `Fichier supprimé (${fileId})`);
    setFlash('Pièce jointe supprimée.');
  };

  const attachSessionToDocument = () => {
    if (dossier.locked) {
      return;
    }
    const targetSession = sessions.find((session) => session.id === selectedSessionIdForDocument);
    if (!targetSession) {
      setFlash('Aucune session sélectionnée à ajouter au document.');
      return;
    }

    const exportPayload = JSON.stringify({ sessions: [targetSession] }, null, 2);
    const baseName = `session-${targetSession.id}-${targetSession.date}.json`;
    const duplicateCount = dossierFiles.filter((entry) => entry.file.name.startsWith(baseName)).length;
    const fileName = duplicateCount === 0 ? baseName : `session-${targetSession.id}-${targetSession.date}-${duplicateCount + 1}.json`;
    const file = new File([exportPayload], fileName, { type: 'application/json' });

    setDossierFiles((prev) => [
      ...prev,
      {
        id: `${Date.now()}-session-${targetSession.id}`,
        file,
        previewUrl: URL.createObjectURL(file),
      },
    ]);
    registerChange('Ajout session au document', `${targetSession.id} ajoutée en pièce jointe JSON`);
    setFlash(`Session ${targetSession.id} ajoutée au document.`);
  };

  const loadSessionIntoNewShot = () => {
    if (dossier.locked) {
      return;
    }
    const targetSession = sessions.find((session) => session.id === selectedSessionIdForDocument);
    if (!targetSession) {
      setFlash('Aucune session sélectionnée à charger.');
      return;
    }
    if (!Array.isArray(targetSession.shots) || targetSession.shots.length === 0) {
      setFlash(`La session ${targetSession.id} ne contient aucun tir.`);
      return;
    }

    const sourceShot =
      dossierImportShotMode === 'first'
        ? targetSession.shots[0]
        : targetSession.shots[targetSession.shots.length - 1];
    setNewShot((prev) => {
      const technique = sourceShot.technique === 'Gamma' || sourceShot.technique === 'RX' ? sourceShot.technique : prev.technique;
      const sourceOptions = SOURCE_OPTIONS_BY_TECHNIQUE[technique] || SOURCE_OPTIONS_BY_TECHNIQUE.RX;
      const source = sourceOptions.includes(sourceShot.source) ? sourceShot.source : sourceOptions[0];
      const kv = Number(sourceShot.kv);
      const ma = Number(sourceShot.ma);
      const time = Number(sourceShot.time);

      const merged = {
        ...prev,
        ...sourceShot,
        technique,
        source,
        materialPiece:
          technique === 'Gamma'
            ? normalizeGammaMaterial(sourceShot.materialPiece)
            : sourceShot.materialPiece || prev.materialPiece,
        gammaSource: technique === 'Gamma' ? sourceShot.gammaSource || source : '',
        activite: technique === 'Gamma' ? sourceShot.activite || '8,23 Ci' : prev.activite,
        gammaTime: technique === 'Gamma' ? normalizeGammaTimeValue(sourceShot.gammaTime) : '',
        filmDetecteur:
          technique === 'Gamma'
            ? normalizeGammaFilmDetector(sourceShot.filmDetecteur)
            : sourceShot.filmDetecteur || prev.filmDetecteur,
        kv: technique === 'RX' ? (Number.isFinite(kv) && kv > 0 ? kv : 200) : '',
        ma: technique === 'RX' ? (Number.isFinite(ma) && ma > 0 ? ma : 4.5) : '',
        time: technique === 'RX' ? (Number.isFinite(time) && time > 0 ? time : 45) : '',
      };

      const typeOptions = getShotTypeOptions(technique, source, {
        diametreTube: merged.diametreTube,
        diametreInterne: merged.diametreInterne,
        epaisseur: merged.e,
        interieurAccessible: merged.interieurAccessible,
        superpositionAcceptable: merged.superpositionAcceptable,
        pieceType: dossier.partType,
        contactControle: merged.contactControle,
      });

      return {
        ...merged,
        typeTir: typeOptions.includes(merged.typeTir) ? merged.typeTir : typeOptions[0],
      };
    });
    setSessionGammaSourceAuto(false);

    registerChange('Charger session', `${targetSession.id} chargée dans Nouveau tir`);
    setFlash(`Session ${targetSession.id} chargée dans Nouveau tir (dernier tir).`);
  };

  const importSessionIntoDossier = () => {
    if (dossier.locked) {
      return;
    }

    const targetSession = sessions.find((session) => session.id === selectedSessionIdForDossier);
    if (!targetSession) {
      setFlash('Aucune session sélectionnée pour préremplir le dossier.');
      return;
    }
    if (!Array.isArray(targetSession.shots) || targetSession.shots.length === 0) {
      setFlash(`La session ${targetSession.id} ne contient aucun tir.`);
      return;
    }

    const sourceShot = targetSession.shots[targetSession.shots.length - 1];
    const technique = sourceShot.technique === 'Gamma' || sourceShot.technique === 'RX' ? sourceShot.technique : dossier.technique;
    const sourceOptions = SOURCE_OPTIONS_BY_TECHNIQUE[technique] || SOURCE_OPTIONS_BY_TECHNIQUE.RX;
    const source = sourceOptions.includes(sourceShot.source) ? sourceShot.source : sourceOptions[0];
    const candidateGeometry = sourceShot.pieceType || sourceShot.geometrie || sourceShot.partType || creationPhysique.geometrie;
    const geometrie = PIECES_BY_TECHNIQUE[technique].includes(candidateGeometry)
      ? candidateGeometry
      : PIECES_BY_TECHNIQUE[technique].includes(creationPhysique.geometrie)
        ? creationPhysique.geometrie
        : PIECES_BY_TECHNIQUE[technique][0];
    const mappedE = Number(sourceShot.e);
    const mappedDsf = Number(sourceShot.dsf);
    const mappedD = Number(sourceShot.d);
    const mappedKv = Number(sourceShot.kv);
    const mappedMa = Number(sourceShot.ma);
    const mappedRxTime = Number(sourceShot.time);
    const mappedGammaMinutes = parseGammaTimeToMinutes(sourceShot.gammaTime);

    const baseCreation = {
      ...creationPhysique,
      source,
      materialPiece:
        technique === 'Gamma'
          ? normalizeGammaMaterial(sourceShot.materialPiece || creationPhysique.materialPiece)
          : sourceShot.materialPiece || creationPhysique.materialPiece,
      dateMesure: targetSession.date || creationPhysique.dateMesure,
      geometrie,
      diametre: Number.isFinite(Number(sourceShot.diametreTube)) ? Number(sourceShot.diametreTube) : creationPhysique.diametre,
      diametreInterne: Number.isFinite(Number(sourceShot.diametreInterne))
        ? Number(sourceShot.diametreInterne)
        : creationPhysique.diametreInterne,
      hauteur: Number.isFinite(Number(sourceShot.longueurPiece)) ? Number(sourceShot.longueurPiece) : creationPhysique.hauteur,
      nombreExpositions: Number.isFinite(Number(sourceShot.nombreExpositions))
        ? Number(sourceShot.nombreExpositions)
        : creationPhysique.nombreExpositions,
      angleExpositions: Number.isFinite(Number(sourceShot.angleExpositions))
        ? Number(sourceShot.angleExpositions)
        : creationPhysique.angleExpositions,
      sourceAuContact: typeof sourceShot.sourceAuContact === 'boolean' ? sourceShot.sourceAuContact : creationPhysique.sourceAuContact,
      positionSource: sourceShot.positionSource || creationPhysique.positionSource,
      interieurAccessible:
        typeof sourceShot.interieurAccessible === 'boolean'
          ? sourceShot.interieurAccessible
          : creationPhysique.interieurAccessible,
      superpositionAcceptable:
        typeof sourceShot.superpositionAcceptable === 'boolean'
          ? sourceShot.superpositionAcceptable
          : creationPhysique.superpositionAcceptable,
      collimateur: typeof sourceShot.collimateur === 'boolean' ? sourceShot.collimateur : creationPhysique.collimateur,
      contactControle:
        typeof sourceShot.contactControle === 'boolean' ? sourceShot.contactControle : creationPhysique.contactControle,
      ePrime: Number.isFinite(mappedE) && mappedE > 0 ? mappedE : creationPhysique.ePrime,
      eTraversee: Number.isFinite(mappedE) && mappedE > 0 ? mappedE : creationPhysique.eTraversee,
      dsf: Number.isFinite(mappedDsf) && mappedDsf > 0 ? mappedDsf : creationPhysique.dsf,
      dimSource: Number.isFinite(mappedD) && mappedD > 0 ? mappedD : creationPhysique.dimSource,
      rayon: Number.isFinite(Number(sourceShot.rayon)) ? Number(sourceShot.rayon) : creationPhysique.rayon,
      longueurFilm: Number.isFinite(Number(sourceShot.longueurFilm))
        ? Number(sourceShot.longueurFilm)
        : creationPhysique.longueurFilm,
      recouvrement: Number.isFinite(Number(sourceShot.recouvrement))
        ? Number(sourceShot.recouvrement)
        : creationPhysique.recouvrement,
      activite: technique === 'Gamma' ? sourceShot.activite || creationPhysique.activite || '8,23 Ci' : creationPhysique.activite,
      gammaTemps:
        technique === 'Gamma' && mappedGammaMinutes !== null ? Number(mappedGammaMinutes.toFixed(2)) : creationPhysique.gammaTemps,
      rxKv: technique === 'RX' ? (Number.isFinite(mappedKv) && mappedKv > 0 ? mappedKv : 200) : creationPhysique.rxKv,
      rxMa: technique === 'RX' ? (Number.isFinite(mappedMa) && mappedMa > 0 ? mappedMa : 4.5) : creationPhysique.rxMa,
      rxTemps: technique === 'RX' ? (Number.isFinite(mappedRxTime) && mappedRxTime > 0 ? mappedRxTime : 45) : creationPhysique.rxTemps,
      filmDetecteur:
        technique === 'Gamma'
          ? normalizeGammaFilmDetector(sourceShot.filmDetecteur || creationPhysique.filmDetecteur)
          : sourceShot.filmDetecteur || creationPhysique.filmDetecteur,
      densiteMode:
        sourceShot.densiteMode === 'simple' || sourceShot.densiteMode === 'double'
          ? sourceShot.densiteMode
          : creationPhysique.densiteMode,
      densiteVoulue: Number.isFinite(Number(sourceShot.densiteVoulue))
        ? Number(sourceShot.densiteVoulue)
        : creationPhysique.densiteVoulue,
    };

    const options = getShotTypeOptions(technique, source, {
      diametreTube: baseCreation.diametre,
      diametreInterne: baseCreation.diametreInterne,
      epaisseur: baseCreation.ePrime,
      interieurAccessible: baseCreation.interieurAccessible,
      superpositionAcceptable: baseCreation.superpositionAcceptable,
      pieceType: baseCreation.geometrie,
      contactControle: baseCreation.contactControle,
    });

    const nextType = options.includes(sourceShot.typeTir) ? sourceShot.typeTir : options[0];

    setDossier((prev) => ({
      ...prev,
      technique,
      partType: geometrie,
      materialPiece: baseCreation.materialPiece,
      eRef: baseCreation.ePrime,
    }));
    setDemande((prev) => ({ ...prev, technique }));
    setCreationPhysique({
      ...baseCreation,
      typeTir: nextType,
    });
    setCreationGammaSourceAuto(false);

    setNewShot((prev) => ({
      ...prev,
      ...sourceShot,
      technique,
      source,
      materialPiece: baseCreation.materialPiece,
      typeTir: nextType,
      gammaSource: technique === 'Gamma' ? sourceShot.gammaSource || source : '',
      activite: technique === 'Gamma' ? sourceShot.activite || '8,23 Ci' : '',
      gammaTime: technique === 'Gamma' ? normalizeGammaTimeValue(sourceShot.gammaTime) : '',
      filmDetecteur:
        technique === 'Gamma'
          ? normalizeGammaFilmDetector(sourceShot.filmDetecteur || prev.filmDetecteur)
          : sourceShot.filmDetecteur || prev.filmDetecteur,
      kv: technique === 'RX' ? (Number.isFinite(mappedKv) && mappedKv > 0 ? mappedKv : 200) : '',
      ma: technique === 'RX' ? (Number.isFinite(mappedMa) && mappedMa > 0 ? mappedMa : 4.5) : '',
      time: technique === 'RX' ? (Number.isFinite(mappedRxTime) && mappedRxTime > 0 ? mappedRxTime : 45) : '',
    }));
    setSessionGammaSourceAuto(false);

    const shotModeLabel = dossierImportShotMode === 'first' ? 'premier tir' : 'dernier tir';
    registerChange('Import session dossier', `${targetSession.id} importée pour préremplir le dossier (${shotModeLabel})`);
    setFlash(`Session ${targetSession.id} importée dans Dossiers (${shotModeLabel}).`);
  };

  const updateCreationTechnique = (technique) => {
    if (dossier.locked) {
      return;
    }

    setDossier((prev) => ({
      ...prev,
      technique,
      partType: PIECES_BY_TECHNIQUE[technique].includes(prev.partType)
        ? prev.partType
        : PIECES_BY_TECHNIQUE[technique][0],
    }));
    setDemande((prev) => ({ ...prev, technique }));
    setCreationGammaSourceAuto(technique === 'Gamma');
    setCreationPhysique((prev) => ({
      ...prev,
      source: (() => {
        const gammaDefault =
          getDefaultGammaSourceByThickness(prev.eTraversee) ||
          getDefaultGammaSourceByThickness(prev.ePrime) ||
          'Ir-192';
        return technique === 'Gamma'
          ? prev.source.includes('Tube')
            ? gammaDefault
            : prev.source
          : prev.source.includes('Tube')
            ? prev.source
            : 'Tube RX standard';
      })(),
      typeTir: (() => {
        const gammaDefault =
          getDefaultGammaSourceByThickness(prev.eTraversee) ||
          getDefaultGammaSourceByThickness(prev.ePrime) ||
          'Ir-192';
        const nextSource =
          technique === 'Gamma'
            ? prev.source.includes('Tube')
              ? gammaDefault
              : prev.source
            : prev.source.includes('Tube')
              ? prev.source
              : 'Tube RX standard';
        const nextTypeOptions = getShotTypeOptions(technique, nextSource, {
          diametreTube: prev.diametre,
          diametreInterne: prev.diametreInterne,
          epaisseur: prev.ePrime,
          interieurAccessible: prev.interieurAccessible,
          superpositionAcceptable: prev.superpositionAcceptable,
          pieceType: prev.geometrie,
          contactControle: prev.contactControle,
        });
        return nextTypeOptions.includes(prev.typeTir) ? prev.typeTir : nextTypeOptions[0];
      })(),
      geometrie: PIECES_BY_TECHNIQUE[technique].includes(prev.geometrie)
        ? prev.geometrie
        : PIECES_BY_TECHNIQUE[technique][0],
      activite: technique === 'Gamma' ? prev.activite || '8,23 Ci' : prev.activite,
      rxKv: technique === 'RX' ? Number(prev.rxKv) || 200 : prev.rxKv,
      rxMa: technique === 'RX' ? Number(prev.rxMa) || 4.5 : prev.rxMa,
      filmDetecteur: technique === 'Gamma' ? normalizeGammaFilmDetector(prev.filmDetecteur) : prev.filmDetecteur,
      materialPiece: technique === 'Gamma' ? normalizeGammaMaterial(prev.materialPiece) : prev.materialPiece,
    }));
  };

  const checklistDone = Object.values(checklist).every(Boolean);

  const renderDashboard = () => (
    <section className="dashboard-mobile">
      <div className="dashboard-title">
        <h2>Tableau de Bord</h2>
        <p>Plateforme Radiographie Industrielle</p>
      </div>

      <div className="stats-grid mobile-stats">
        <article>
          <span>📁</span>
          <strong>12</strong>
          <small>EN COURS</small>
        </article>
        <article>
          <span>⚗️</span>
          <strong>{String(sessionCount).padStart(2, '0')}</strong>
          <small>SESSIONS</small>
        </article>
      </div>

      <h3 className="section-label">Modules services</h3>
      <div className="service-grid">
        {DASHBOARD_SERVICES.map((service, index) => (
          <button
            key={service.key}
            className={index === 0 ? 'service-card active' : 'service-card'}
            onClick={() => setActive(service.key)}
          >
            <span className="service-icon">◻</span>
            <strong>{service.title}</strong>
            <small>{service.subtitle}</small>
          </button>
        ))}
      </div>

      <div className="journal-header">
        <h3>Journal d&apos;audit</h3>
        <button className="link-action" onClick={() => setActive('Vérification')}>
          Voir tout
        </button>
      </div>
      <div className="audit-preview">
        {auditLogs.slice(0, 3).map((log) => (
          <article key={log.id}>
            <p>{log.action}</p>
            <span>{formatDate(log.timestamp)}</span>
          </article>
        ))}
      </div>
    </section>
  );

  const renderDossiers = () => (
    <section className="module creation-dossier">
      <h2>Création Dossier RT</h2>

      <div className="stepper">
        <div className="step done">
          <span>✓</span>
          <small>Identification</small>
        </div>
        <div className="step active">
          <span>2</span>
          <small>Physique</small>
        </div>
        <div className="step">
          <span>3</span>
          <small>Résultats</small>
        </div>
      </div>

      <div className="creation-card">
        <h3>Identification</h3>
        <div className="form-grid creation-grid">
          <label>
            Réf dossier
            <input
              value={dossier.id}
              disabled={dossier.locked}
              onChange={(event) => setDossier((prev) => ({ ...prev, id: event.target.value }))}
            />
          </label>
          <label>
            Client
            <input
              value={dossier.client}
              disabled={dossier.locked}
              onChange={(event) => setDossier((prev) => ({ ...prev, client: event.target.value }))}
            />
          </label>
          <label>
            Norme
            <input
              value={dossier.norme}
              disabled={dossier.locked}
              onChange={(event) => setDossier((prev) => ({ ...prev, norme: event.target.value }))}
            />
          </label>
          <label>
            Référence commande
            <input
              value={dossier.orderRef}
              disabled={dossier.locked}
              onChange={(event) => setDossier((prev) => ({ ...prev, orderRef: event.target.value }))}
            />
          </label>
          <label>
            Référence pièce
            <input
              value={dossier.partRef}
              disabled={dossier.locked}
              onChange={(event) => setDossier((prev) => ({ ...prev, partRef: event.target.value }))}
            />
          </label>
          <label>
            Procédure
            <input
              value={dossier.procedure}
              disabled={dossier.locked}
              onChange={(event) => setDossier((prev) => ({ ...prev, procedure: event.target.value }))}
            />
          </label>
        </div>
      </div>

      <div className="creation-card">
        <h3>Importer une session existante</h3>
        <div className="action-row">
          <select
            value={selectedSessionIdForDossier}
            disabled={dossier.locked || sessions.length === 0}
            onChange={(event) => setSelectedSessionIdForDossier(event.target.value)}
          >
            {sessions.length === 0 ? (
              <option value="">Aucune session disponible</option>
            ) : (
              sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.id} · {session.date}
                </option>
              ))
            )}
          </select>
          <select
            value={dossierImportShotMode}
            disabled={dossier.locked || sessions.length === 0}
            onChange={(event) => setDossierImportShotMode(event.target.value)}
          >
            <option value="last">Dernier tir</option>
            <option value="first">Premier tir</option>
          </select>
          <button onClick={importSessionIntoDossier} disabled={dossier.locked || sessions.length === 0}>
            Importer dans dossier
          </button>
        </div>
        <p className="creation-note">
          Préremplit le dossier et les paramètres physiques à partir du tir sélectionné (premier ou dernier) de la session.
        </p>
      </div>

      <div className="creation-card">
        <h3>Type de rayonnement</h3>
        <div className="segmented">
          <button
            type="button"
            className={dossier.technique === 'RX' ? 'segmented-item active' : 'segmented-item'}
            disabled={dossier.locked}
            onClick={() => updateCreationTechnique('RX')}
          >
            X-Ray
          </button>
          <button
            type="button"
            className={dossier.technique === 'Gamma' ? 'segmented-item active' : 'segmented-item'}
            disabled={dossier.locked}
            onClick={() => updateCreationTechnique('Gamma')}
          >
            Gamma
          </button>
        </div>
        <p className="creation-note">
          {isGammaCreation
            ? 'Mode Gamma : source radio, activité et temps de pose gamma.'
            : 'Mode X-Ray : paramètres générateur RX (kV, mA, temps de pose).'}
        </p>
      </div>

      <div className="creation-card">
        <h3>Source & géométrie</h3>
        <div className="form-grid creation-grid">
          <label>
            Source
            <select
              value={creationPhysique.source}
              disabled={dossier.locked}
              onChange={(event) => {
                const source = event.target.value;
                if (dossier.technique === 'Gamma') {
                  setCreationGammaSourceAuto(false);
                }
                setCreationPhysique((prev) => {
                  const options = getShotTypeOptions(dossier.technique, source, {
                    diametreTube: prev.diametre,
                    diametreInterne: prev.diametreInterne,
                    epaisseur: prev.ePrime,
                    interieurAccessible: prev.interieurAccessible,
                    superpositionAcceptable: prev.superpositionAcceptable,
                    pieceType: prev.geometrie,
                    contactControle: prev.contactControle,
                  });
                  return {
                    ...prev,
                    source,
                    typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                  };
                });
              }}
            >
              {creationSourceOptions.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
            {isGammaCreation && <em>Adaptez la sélection en fonction de la source réellement utilisée.</em>}
          </label>
          <label>
            Matériau pièce
            {isGammaCreation ? (
              <select
                value={normalizeGammaMaterial(creationPhysique.materialPiece)}
                disabled={dossier.locked}
                onChange={(event) =>
                  setCreationPhysique((prev) => ({ ...prev, materialPiece: event.target.value }))
                }
              >
                {GAMMA_MATERIAL_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <select
                value={normalizeRxMaterial(creationPhysique.materialPiece)}
                disabled={dossier.locked}
                onChange={(event) =>
                  setCreationPhysique((prev) => ({ ...prev, materialPiece: event.target.value }))
                }
              >
                <option value="">Sélectionner un matériau</option>
                {RX_MATERIAL_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </label>
          <label>
            Type de tir
            <select
              value={creationPhysique.typeTir}
              disabled={dossier.locked}
              onChange={(event) => setCreationPhysique((prev) => ({ ...prev, typeTir: event.target.value }))}
            >
              {creationShotTypeOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <label>
            Date mesure
            <input
              type="date"
              value={creationPhysique.dateMesure}
              disabled={dossier.locked}
              onChange={(event) => setCreationPhysique((prev) => ({ ...prev, dateMesure: event.target.value }))}
            />
          </label>
          {isGammaCreation ? (
            <>
              <label>
                Activité (Ci/Bq)
                <input
                  value={creationPhysique.activite}
                  disabled={dossier.locked}
                  onChange={(event) => setCreationPhysique((prev) => ({ ...prev, activite: event.target.value }))}
                />
              </label>
              <label>
                Temps de pose Gamma (min)
                <input
                  type="number"
                  value={creationPhysique.gammaTemps}
                  disabled={dossier.locked || (isGammaCreation && creationPhysique.source === 'Ir-192')}
                  onChange={(event) =>
                    setCreationPhysique((prev) => ({ ...prev, gammaTemps: Number(event.target.value) }))
                  }
                />
              </label>
              {creationPhysique.source === 'Ir-192' && (
                <label>
                  Temps auto Ir (min:s)
                  <input
                    value={
                      creationIrExposureHours === null ? 'N/A' : formatHoursToMinutesSeconds(creationIrExposureHours)
                    }
                    disabled
                  />
                </label>
              )}
            </>
          ) : (
            <>
              <label>
                Tension RX (kV)
                <input
                  type="number"
                  value={creationPhysique.rxKv}
                  disabled={dossier.locked}
                  onChange={(event) => setCreationPhysique((prev) => ({ ...prev, rxKv: Number(event.target.value) }))}
                />
              </label>
              <label>
                Intensité RX (mA)
                <input
                  type="number"
                  value={creationPhysique.rxMa}
                  disabled={dossier.locked}
                  onChange={(event) => setCreationPhysique((prev) => ({ ...prev, rxMa: Number(event.target.value) }))}
                />
              </label>
              <label>
                Temps de pose RX (s)
                <input
                  type="number"
                  value={creationPhysique.rxTemps}
                  disabled={dossier.locked}
                  onChange={(event) =>
                    setCreationPhysique((prev) => ({ ...prev, rxTemps: Number(event.target.value) }))
                  }
                />
              </label>
              <label>
                Facteur Q RX auto (mA·min)
                <input value={creationRxQFactor === null ? 'N/A' : creationRxQFactor.toFixed(2)} disabled />
              </label>
              <label>
                Temps auto RX (s)
                <input
                  value={creationRxExposureSeconds === null ? 'N/A' : creationRxExposureSeconds.toFixed(1)}
                  disabled
                />
              </label>
            </>
          )}
          <label>
            Type pièce
            <select
              value={creationPhysique.geometrie}
              disabled={dossier.locked}
              onChange={(event) => {
                const value = event.target.value;
                setCreationPhysique((prev) => {
                  const options = getShotTypeOptions(dossier.technique, prev.source, {
                    diametreTube: prev.diametre,
                    diametreInterne: prev.diametreInterne,
                    epaisseur: prev.ePrime,
                    interieurAccessible: prev.interieurAccessible,
                    superpositionAcceptable: prev.superpositionAcceptable,
                    pieceType: value,
                    contactControle: prev.contactControle,
                  });
                  return {
                    ...prev,
                    geometrie: value,
                    typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                  };
                });
                setDossier((prev) => ({ ...prev, partType: value }));
              }}
            >
              {pieceOptions.map((piece) => (
                <option key={piece}>{piece}</option>
              ))}
            </select>
          </label>
          <label>
            Diamètre interne (mm)
            <input
              type="number"
              value={creationPhysique.diametreInterne}
              disabled={dossier.locked}
              onChange={(event) =>
                setCreationPhysique((prev) => ({ ...prev, diametreInterne: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Diamètre tube (mm)
            <input
              type="number"
              value={creationPhysique.diametre}
              disabled={dossier.locked}
              onChange={(event) => {
                const diametre = Number(event.target.value);
                setCreationPhysique((prev) => {
                  const options = getShotTypeOptions(dossier.technique, prev.source, {
                    diametreTube: diametre,
                    diametreInterne: prev.diametreInterne,
                    epaisseur: prev.ePrime,
                    interieurAccessible: prev.interieurAccessible,
                    superpositionAcceptable: prev.superpositionAcceptable,
                    pieceType: prev.geometrie,
                    contactControle: prev.contactControle,
                  });
                  return {
                    ...prev,
                    diametre,
                    typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                  };
                });
              }}
            />
          </label>
          <label>
            Longueur pièce (mm)
            <input
              type="number"
              value={creationPhysique.hauteur}
              disabled={dossier.locked}
              onChange={(event) => setCreationPhysique((prev) => ({ ...prev, hauteur: Number(event.target.value) }))}
            />
          </label>
          <label>
            Nombre expositions
            <input
              type="number"
                  min={creationMidDiameterContactRule.mode === 'spsi-interieur' ? 4 : 2}
              value={creationPhysique.nombreExpositions}
              disabled={dossier.locked}
              onChange={(event) =>
                setCreationPhysique((prev) => ({ ...prev, nombreExpositions: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            Angle entre expositions (°)
            <input
              type="number"
              value={creationPhysique.angleExpositions}
              disabled={dossier.locked}
              onChange={(event) =>
                setCreationPhysique((prev) => ({ ...prev, angleExpositions: Number(event.target.value) }))
              }
            />
          </label>
          {isGammaCreation && (
            <>
              <label>
                Position source
                <select
                  value={creationPhysique.positionSource}
                  disabled={
                    dossier.locked ||
                    creationDpsiContactRule.applies ||
                    creationMidDiameterContactRule.applies ||
                    creationLargeDiameterPanoramicRule.applies
                  }
                  onChange={(event) =>
                    setCreationPhysique((prev) => ({
                      ...prev,
                      positionSource: event.target.value,
                      sourceAuContact: event.target.value !== 'Centrée',
                    }))
                  }
                >
                  <option>Extérieur</option>
                  <option>Intérieur</option>
                  <option>Centrée</option>
                </select>
              </label>
              <label>
                Intérieur accessible ?
                <select
                  value={creationPhysique.interieurAccessible ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const interieurAccessible = event.target.value === 'Oui';
                    setCreationPhysique((prev) => {
                      const options = getShotTypeOptions(dossier.technique, prev.source, {
                        diametreTube: prev.diametre,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.ePrime,
                        interieurAccessible,
                        superpositionAcceptable: prev.superpositionAcceptable,
                        pieceType: prev.geometrie,
                        contactControle: prev.contactControle,
                      });
                      return {
                        ...prev,
                        interieurAccessible,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </label>
              <label>
                Superposition acceptable ?
                <select
                  value={creationPhysique.superpositionAcceptable ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const superpositionAcceptable = event.target.value === 'Oui';
                    setCreationPhysique((prev) => {
                      const options = getShotTypeOptions(dossier.technique, prev.source, {
                        diametreTube: prev.diametre,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.ePrime,
                        interieurAccessible: prev.interieurAccessible,
                        superpositionAcceptable,
                        pieceType: prev.geometrie,
                        contactControle: prev.contactControle,
                      });
                      return {
                        ...prev,
                        superpositionAcceptable,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </label>
              <label>
                Collimateur en place ?
                <select
                  value={creationPhysique.collimateur ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) =>
                    setCreationPhysique((prev) => ({ ...prev, collimateur: event.target.value === 'Oui' }))
                  }
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </label>
              <label>
                Contrôle contact ?
                <select
                  value={creationPhysique.contactControle ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const contactControle = event.target.value === 'Oui';
                    setCreationPhysique((prev) => {
                      const options = getShotTypeOptions(dossier.technique, prev.source, {
                        diametreTube: prev.diametre,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.ePrime,
                        interieurAccessible: prev.interieurAccessible,
                        superpositionAcceptable: prev.superpositionAcceptable,
                        pieceType: prev.geometrie,
                        contactControle,
                      });
                      return {
                        ...prev,
                        contactControle,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                >
                  <option>Non</option>
                  <option>Oui</option>
                </select>
              </label>
              {(getPieceCategory(creationPhysique.geometrie) === 'shell' ||
                getPieceCategory(creationPhysique.geometrie) === 'tube') && (
                <>
                  <label>
                    Rayon / Ø repère (mm)
                    <input
                      type="number"
                      value={creationPhysique.rayon}
                      disabled={dossier.locked}
                      onChange={(event) =>
                        setCreationPhysique((prev) => ({ ...prev, rayon: Number(event.target.value) }))
                      }
                    />
                  </label>
                  <label>
                    Longueur film (mm)
                    <input
                      type="number"
                      value={creationPhysique.longueurFilm}
                      disabled={dossier.locked}
                      onChange={(event) =>
                        setCreationPhysique((prev) => ({ ...prev, longueurFilm: Number(event.target.value) }))
                      }
                    />
                  </label>
                  <label>
                    Recouvrement (mm)
                    <input
                      type="number"
                      value={creationPhysique.recouvrement}
                      disabled={dossier.locked}
                      onChange={(event) =>
                        setCreationPhysique((prev) => ({ ...prev, recouvrement: Number(event.target.value) }))
                      }
                    />
                  </label>
                </>
              )}
            </>
          )}
        </div>
        {isGammaCreation && creationGammaGuidance.length > 0 && (
          <ul className="creation-hints">
            {creationGammaGuidance.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="creation-card">
        <h3>Épaisseurs</h3>
        <div className="form-grid creation-grid">
          <label>
            Épaisseur e&apos; (mm)
            <input
              type="number"
              step="0.01"
              value={creationPhysique.ePrime}
              disabled={dossier.locked}
              onChange={(event) => setCreationPhysique((prev) => ({ ...prev, ePrime: Number(event.target.value) }))}
            />
          </label>
          <label>
            Épaisseur traversée (mm)
            <input
              type="number"
              step="0.01"
              value={creationPhysique.eTraversee}
              disabled={dossier.locked}
              onChange={(event) =>
                setCreationPhysique((prev) => ({ ...prev, eTraversee: Number(event.target.value) }))
              }
            />
          </label>
        </div>
      </div>

      <div className="creation-card">
        <h3>Exposition & sensibilité</h3>
        <div className="form-grid creation-grid">
          <label>
            DSF (mm)
            <input
              type="number"
              value={creationPhysique.dsf}
              disabled={dossier.locked}
              onChange={(event) => setCreationPhysique((prev) => ({ ...prev, dsf: Number(event.target.value) }))}
            />
          </label>
          <label>
            Dimensions source (mm)
            <input
              type="number"
              step="0.1"
              value={creationPhysique.dimSource}
              disabled={dossier.locked}
              onChange={(event) => setCreationPhysique((prev) => ({ ...prev, dimSource: Number(event.target.value) }))}
            />
          </label>
          <label>
            Type de film / détecteur
            {isGammaCreation ? (
              <select
                value={normalizeGammaFilmDetector(creationPhysique.filmDetecteur)}
                disabled={dossier.locked}
                onChange={(event) =>
                  setCreationPhysique((prev) => ({ ...prev, filmDetecteur: event.target.value }))
                }
              >
                {GAMMA_FILM_OPTIONS.map((film) => (
                  <option key={film} value={film}>
                    {film}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={creationPhysique.filmDetecteur}
                disabled={dossier.locked}
                onChange={(event) =>
                  setCreationPhysique((prev) => ({ ...prev, filmDetecteur: event.target.value }))
                }
              />
            )}
          </label>
          <label>
            Type densité
            <select
              value={creationPhysique.densiteMode}
              disabled={dossier.locked}
              onChange={(event) =>
                setCreationPhysique((prev) => ({ ...prev, densiteMode: event.target.value }))
              }
            >
              <option value="simple">Film simple</option>
              <option value="double">Double film</option>
            </select>
          </label>
          <label>
            Densité voulue (Δ)
            <input
              type="number"
              step="0.1"
              value={creationPhysique.densiteVoulue}
              disabled={dossier.locked}
              onChange={(event) =>
                setCreationPhysique((prev) => ({ ...prev, densiteVoulue: Number(event.target.value) }))
              }
            />
          </label>
          <label>
            K film (auto)
            <input value={creationFilmK === null ? 'N/A' : String(creationFilmK)} disabled />
          </label>
          <label>
            N densité (auto)
            <input value={creationDensityN === null ? 'N/A' : creationDensityN.toFixed(2)} disabled />
          </label>
        </div>
      </div>

      <div className="fg-sim-card">
        <div className="fg-sim-head">
          <p>Flou géométrique (Fg)</p>
          <div>
            <span className="engine-badge">Smart engine</span>
            {creationMidDiameterContactRule.applies && (
              <span className="engine-badge">Règle 88,9–170 active</span>
            )}
            {creationPlanPlanSpsiRule.applies && (
              <span className="engine-badge">Règle &lt; 88,9 active</span>
            )}
          </div>
        </div>

        <p className="creation-note">Formule : Fg = d (dimension source) × e (une seule épaisseur) / (DSF − e).</p>

        <div className="fg-sim-main">
          <div>
            <small>Fg calculé</small>
            <strong>{creationFg === null ? 'N/A' : `${creationFg.toFixed(2)} mm`}</strong>
          </div>
          <div>
            <small>Seuil</small>
            <strong>{FG_MAX_LIMIT_MM.toFixed(2)} mm</strong>
          </div>
          <div>
            <small>Verdict</small>
            <strong className={creationFgConforme ? 'ok-pill' : 'ko-pill'}>
              {creationFg === null ? 'Incomplet' : creationFgConforme ? 'Conforme' : 'À corriger'}
            </strong>
          </div>
        </div>

        <div className="fg-sim-meta">
          <span>
            Temps de pose estimé :{' '}
            {creationExposureDisplay}
          </span>
          <span>
            DSF mini auto :{' '}
            {creationCombinedMinDsf > 0
              ? `${creationCombinedMinDsf.toFixed(1)} mm`
              : 'N/A'}
          </span>
          <span>
            Précision : {creationFg === null ? 'N/A' : `${Math.max(80, Math.round(100 - creationFg * 8))}%`}
          </span>
        </div>

        {creationAutoDsfRule.applies && creationAutoDsfRule.minDsf !== null && (
          <p className="creation-note">
            Règle auto active ({creationAutoDsfRule.reason}) : DSF minimale = 1,5 × longueur pièce ={' '}
            {creationAutoDsfRule.minDsf.toFixed(1)} mm · {creationAutoDsfConforme ? 'conforme' : 'à corriger'}.
          </p>
        )}

        {creationPlanPlanSpsiRule.applies && creationSmallDpdiMode && (
          <p className="creation-note">
            Règle &lt; 88,9 mm (mode DPDI) : Ø/e {creationDiameterRatio?.toFixed(2) || 'N/A'} · projection{' '}
            {creationDiameterRatio !== null && creationDiameterRatio > 10 ? 'plan sur plan ou elliptique' : 'plan sur plan'}
            {' '}· DSF &gt; {(10 * Number(creationPhysique.diametre || 0)).toFixed(1)} mm ·
            minimum 2 expositions à 90° · interprétation simultanée des deux parois.
          </p>
        )}

        {creationPlanPlanSpsiRule.applies && creationPhysique.typeTir === 'Simple paroi simple image' && (
          <p className="creation-note">
            Règle &lt; 88,9 mm (mode SPSI) : plan/plan avec minimum 4 expositions à 90°.
          </p>
        )}

        {creationMidDiameterContactRule.applies && creationMidDiameterContactRule.mode === 'spsi-interieur' && (
          <p className="creation-note">
            Règle 88,9–170 mm : SPSI au contact intérieur (Ø/e ≤ 5, accès intérieur) · minimum 4 expositions à 90°.
          </p>
        )}

        {creationLargeDiameterPanoramicRule.applies && (
          <p className="creation-note">
            Règle &gt; 170 mm : panoramique SPSI avec source centrée.
          </p>
        )}

        {creationDpsiContactRule.applies && (
          <p className="creation-note">
            Règle DPSI : Ø/e {creationDpsiContactRule.ratio?.toFixed(2) || 'N/A'} &gt; 5 · source au contact
            obligatoire.
          </p>
        )}

        <button
          className="primary simulate-btn"
          disabled={dossier.locked || creationFg === null}
          onClick={() => {
            registerChange(
              'Simulation FG',
              `Simulation ${creationFgConforme ? 'conforme' : 'non conforme'} (${creationFg?.toFixed(3)})`
            );
            setFlash(
              creationFgConforme
                ? `Simulation validée : Fg ${creationFg?.toFixed(3)} conforme.`
                : `Simulation : Fg ${creationFg?.toFixed(3)} au-dessus du seuil.`
            );
          }}
        >
          Simuler le temps de pose
        </button>
      </div>

      <div className="creation-card">
        <h3>Pièces jointes</h3>
        <label className="upload-input">
          Importer images ou PDF
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            disabled={dossier.locked}
            onChange={handleDossierFiles}
          />
        </label>
        <label className="upload-input">
          Importer session(s) de tir (JSON)
          <input
            type="file"
            accept=".json,application/json"
            disabled={dossier.locked}
            onChange={handleSessionImport}
          />
        </label>
        <p className="creation-note">Format attendu : tableau de sessions ou objet {'{ sessions: [...] }'}.</p>

        {dossierFiles.length === 0 ? (
          <p className="upload-empty">Aucun document importé.</p>
        ) : (
          <ul className="upload-list">
            {dossierFiles.map((entry) => (
              <li key={entry.id}>
                <div className="upload-file-main">
                  <a href={entry.previewUrl} target="_blank" rel="noreferrer" className="upload-thumb-link">
                    {entry.file.type === 'application/pdf' ? (
                      <div className="upload-thumb upload-thumb-pdf" aria-hidden="true">
                        PDF
                      </div>
                    ) : (
                      <img src={entry.previewUrl} alt={entry.file.name} className="upload-thumb" />
                    )}
                  </a>
                  <div>
                    <strong>{entry.file.name}</strong>
                    <small>
                      {entry.file.type === 'application/pdf' ? 'PDF' : 'Image'} · {formatFileSize(entry.file.size)}
                    </small>
                  </div>
                </div>
                <div className="upload-actions">
                  <a href={entry.previewUrl} target="_blank" rel="noreferrer">
                    Ouvrir
                  </a>
                  <button type="button" onClick={() => removeDossierFile(entry.id)} disabled={dossier.locked}>
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="action-row creation-actions">
        <button disabled={dossier.locked}>Précédent</button>
        <button
          className="primary"
          disabled={dossier.locked}
          onClick={() => {
            setDossier((prev) => ({
              ...prev,
              partType: creationPhysique.geometrie,
              materialPiece: creationPhysique.materialPiece,
              eRef: Number(creationPhysique.ePrime),
            }));
            setNewShot((prev) => ({
              ...prev,
              technique: dossier.technique,
              source: creationPhysique.source,
              materialPiece:
                dossier.technique === 'Gamma'
                  ? normalizeGammaMaterial(creationPhysique.materialPiece)
                  : creationPhysique.materialPiece,
              typeTir: creationPhysique.typeTir,
              diametreTube: creationPhysique.diametre,
              diametreInterne: Number(creationPhysique.diametreInterne),
              longueurPiece: Number(creationPhysique.hauteur),
              nombreExpositions: Number(creationPhysique.nombreExpositions),
              angleExpositions: Number(creationPhysique.angleExpositions),
              sourceAuContact: creationPhysique.sourceAuContact,
              positionSource: creationPhysique.positionSource,
              interieurAccessible: creationPhysique.interieurAccessible,
              superpositionAcceptable: creationPhysique.superpositionAcceptable,
              collimateur: creationPhysique.collimateur,
              d: Number(creationPhysique.dimSource),
              rayon: Number(creationPhysique.rayon),
              longueurFilm: Number(creationPhysique.longueurFilm),
              recouvrement: Number(creationPhysique.recouvrement),
              dsf: Number(creationPhysique.dsf),
              e: Number(creationPhysique.ePrime),
              kv: dossier.technique === 'RX' ? Number(creationPhysique.rxKv) : '',
              ma: dossier.technique === 'RX' ? Number(creationPhysique.rxMa) : '',
              time: dossier.technique === 'RX' ? Number(creationPhysique.rxTemps) : '',
              gammaSource: dossier.technique === 'Gamma' ? creationPhysique.source : '',
              activite: dossier.technique === 'Gamma' ? creationPhysique.activite : '',
              gammaTime:
                dossier.technique === 'Gamma'
                  ? formatMinutesToMinutesSeconds(creationPhysique.gammaTemps) || ''
                  : '',
              filmDetecteur:
                dossier.technique === 'Gamma'
                  ? normalizeGammaFilmDetector(creationPhysique.filmDetecteur)
                  : creationPhysique.filmDetecteur,
              densiteMode: creationPhysique.densiteMode,
              densiteVoulue: Number(creationPhysique.densiteVoulue),
              images: dossierFiles.map((entry) => entry.file.name).join(', '),
            }));
            setSessionGammaSourceAuto(creationGammaSourceAuto);
            registerChange('Mise à jour dossier', 'Paramètres de création sauvegardés');
            setFlash('Dossier enregistré. Paramètres physiques mis à jour.');
          }}
        >
          Suivant
        </button>
      </div>

      <details>
        <summary>Métadonnées automatiques (lecture seule)</summary>
        <ul className="meta-list">
          <li>Created_at : {formatDate(dossier.createdAt)}</li>
          <li>Created_by : {dossier.createdBy}</li>
          <li>Updated_at : {formatDate(dossier.updatedAt)}</li>
          <li>Updated_by : {dossier.updatedBy}</li>
          <li>Nombre de sessions : {sessionCount}</li>
          <li>Nombre total de tirs : {shotCount}</li>
        </ul>
      </details>
    </section>
  );

  const renderDemandes = () => (
    <section className="module">
      <h2>Exigences client</h2>
      <div className="form-grid">
        <label>
          Norme
          <input
            value={demande.norme}
            disabled={dossier.locked}
            onChange={(event) => setDemande((prev) => ({ ...prev, norme: event.target.value }))}
          />
        </label>
        <label>
          Exigences IQI
          <input
            value={demande.iqi}
            disabled={dossier.locked}
            onChange={(event) => setDemande((prev) => ({ ...prev, iqi: event.target.value }))}
          />
        </label>
        <label>
          Sensibilité
          <input
            value={demande.sensibilite}
            disabled={dossier.locked}
            onChange={(event) => setDemande((prev) => ({ ...prev, sensibilite: event.target.value }))}
          />
        </label>
        <label>
          Seuil Fg max (fixe)
          <input
            type="number"
            step="0.01"
            value={FG_MAX_LIMIT_MM}
            disabled
            readOnly
          />
        </label>
        <label>
          Nb vues
          <input
            type="number"
            value={demande.nbVues}
            disabled={dossier.locked}
            onChange={(event) => setDemande((prev) => ({ ...prev, nbVues: Number(event.target.value) }))}
          />
        </label>
        <label>
          Technique demandée
          <select
            value={demande.technique}
            disabled={dossier.locked}
            onChange={(event) => setDemande((prev) => ({ ...prev, technique: event.target.value }))}
          >
            <option>RX</option>
            <option>Gamma</option>
          </select>
        </label>
        <label>
          Date attendue
          <input
            type="date"
            value={demande.dateAttendue}
            disabled={dossier.locked}
            onChange={(event) => setDemande((prev) => ({ ...prev, dateAttendue: event.target.value }))}
          />
        </label>
      </div>

      <label className="block">
        Import mail / contrat / fiche
        <textarea
          rows="4"
          value={demande.sourceMail}
          disabled={dossier.locked}
          onChange={(event) => setDemande((prev) => ({ ...prev, sourceMail: event.target.value }))}
        />
      </label>

      <div className="action-row">
        <button className="primary" disabled={dossier.locked} onClick={updateDemandeFromImport}>
          Mapper les champs importés
        </button>
        <button
          disabled={dossier.locked}
          onClick={() => {
            registerChange('Mise à jour demande', 'Exigences client actualisées');
            setFlash('Demande enregistrée.');
          }}
        >
          Enregistrer demande
        </button>
      </div>
    </section>
  );

  const renderSessions = () => (
    <section className="module">
      <h2>Sessions & tirs</h2>
      <div className="action-row">
        <button onClick={addSession} disabled={dossier.locked}>
          Ajouter session
        </button>
        <select
          value={selectedSessionIdForDocument}
          disabled={dossier.locked || sessions.length === 0}
          onChange={(event) => setSelectedSessionIdForDocument(event.target.value)}
        >
          {sessions.length === 0 ? (
            <option value="">Aucune session</option>
          ) : (
            sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.id} · {session.date}
              </option>
            ))
          )}
        </select>
        <button onClick={attachSessionToDocument} disabled={dossier.locked || sessions.length === 0}>
          Ajouter la session au document
        </button>
        <button onClick={loadSessionIntoNewShot} disabled={dossier.locked || sessions.length === 0}>
          Charger dans Nouveau tir
        </button>
      </div>

      <details open>
        <summary>Nouveau tir</summary>
        <div className="form-grid">
          <label>
            Technique
            <select
              value={newShot.technique}
              disabled={dossier.locked}
              onChange={(event) => {
                const technique = event.target.value;
                setSessionGammaSourceAuto(technique === 'Gamma');
                setNewShot((prev) => {
                  const fallbackSource =
                    technique === 'Gamma'
                      ? getDefaultGammaSourceByThickness(prev.e) || SOURCE_OPTIONS_BY_TECHNIQUE[technique][0]
                      : SOURCE_OPTIONS_BY_TECHNIQUE[technique][0];
                  const nextSource = SOURCE_OPTIONS_BY_TECHNIQUE[technique].includes(prev.source)
                    ? prev.source
                    : fallbackSource;
                  const options = getShotTypeOptions(technique, nextSource, {
                    diametreTube: prev.diametreTube,
                    diametreInterne: prev.diametreInterne,
                    epaisseur: prev.e,
                    interieurAccessible: prev.interieurAccessible,
                    superpositionAcceptable: prev.superpositionAcceptable,
                    pieceType: dossier.partType,
                    contactControle: prev.contactControle,
                  });
                  return {
                    ...prev,
                    technique,
                    source: nextSource,
                    materialPiece:
                      technique === 'Gamma' ? normalizeGammaMaterial(prev.materialPiece) : prev.materialPiece,
                    typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                    gammaSource: technique === 'Gamma' ? nextSource : '',
                    activite: technique === 'Gamma' ? prev.activite || '8,23 Ci' : prev.activite,
                    kv: technique === 'RX' ? Number(prev.kv) || 200 : prev.kv,
                    ma: technique === 'RX' ? Number(prev.ma) || 4.5 : prev.ma,
                    filmDetecteur:
                      technique === 'Gamma' ? normalizeGammaFilmDetector(prev.filmDetecteur) : prev.filmDetecteur,
                  };
                });
              }}
            >
              <option>RX</option>
              <option>Gamma</option>
            </select>
          </label>
          <label>
            Source
            <select
              value={newShot.source}
              disabled={dossier.locked}
              onChange={(event) => {
                const source = event.target.value;
                if (newShot.technique === 'Gamma') {
                  setSessionGammaSourceAuto(false);
                }
                setNewShot((prev) => {
                  const options = getShotTypeOptions(prev.technique, source, {
                    diametreTube: prev.diametreTube,
                    diametreInterne: prev.diametreInterne,
                    epaisseur: prev.e,
                    interieurAccessible: prev.interieurAccessible,
                    superpositionAcceptable: prev.superpositionAcceptable,
                    pieceType: dossier.partType,
                    contactControle: prev.contactControle,
                  });
                  return {
                    ...prev,
                    source,
                    materialPiece:
                      prev.technique === 'Gamma' ? normalizeGammaMaterial(prev.materialPiece) : prev.materialPiece,
                    gammaSource: prev.technique === 'Gamma' ? source : prev.gammaSource,
                    typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                  };
                });
              }}
            >
              {sessionSourceOptions.map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
            {newShot.technique === 'Gamma' && (
              <em>Adaptez la sélection en fonction de la source réellement utilisée.</em>
            )}
          </label>
          <label>
            Matériau pièce
            {newShot.technique === 'Gamma' ? (
              <select
                value={normalizeGammaMaterial(newShot.materialPiece)}
                disabled={dossier.locked}
                onChange={(event) => setNewShot((prev) => ({ ...prev, materialPiece: event.target.value }))}
              >
                {GAMMA_MATERIAL_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <select
                value={normalizeRxMaterial(newShot.materialPiece)}
                disabled={dossier.locked}
                onChange={(event) => setNewShot((prev) => ({ ...prev, materialPiece: event.target.value }))}
              >
                <option value="">Sélectionner un matériau</option>
                {RX_MATERIAL_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </label>
          <label>
            Type de tir
            <select
              value={newShot.typeTir}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, typeTir: event.target.value }))}
            >
              {sessionShotTypeOptions.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          {newShot.technique === 'Gamma' && (
            <>
              <label>
                Diamètre interne (mm)
                <input
                  type="number"
                  value={newShot.diametreInterne}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const diametreInterne = Number(event.target.value);
                    setNewShot((prev) => {
                      const options = getShotTypeOptions(prev.technique, prev.source, {
                        diametreTube: prev.diametreTube,
                        diametreInterne,
                        epaisseur: prev.e,
                        interieurAccessible: prev.interieurAccessible,
                        superpositionAcceptable: prev.superpositionAcceptable,
                        pieceType: dossier.partType,
                        contactControle: prev.contactControle,
                      });
                      return {
                        ...prev,
                        diametreInterne,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                />
              </label>
              <label>
                Diamètre tube (mm)
                <input
                  type="number"
                  value={newShot.diametreTube}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const diametreTube = Number(event.target.value);
                    setNewShot((prev) => {
                      const options = getShotTypeOptions(prev.technique, prev.source, {
                        diametreTube,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.e,
                        interieurAccessible: prev.interieurAccessible,
                        superpositionAcceptable: prev.superpositionAcceptable,
                        pieceType: dossier.partType,
                        contactControle: prev.contactControle,
                      });
                      return {
                        ...prev,
                        diametreTube,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                />
              </label>
              <label>
                Longueur pièce (mm)
                <input
                  type="number"
                  value={newShot.longueurPiece}
                  disabled={dossier.locked}
                  onChange={(event) =>
                    setNewShot((prev) => ({ ...prev, longueurPiece: Number(event.target.value) }))
                  }
                />
              </label>
              <label>
                Nombre expositions
                <input
                  type="number"
                  min={sessionMidDiameterContactRule.mode === 'spsi-interieur' ? 4 : 2}
                  value={newShot.nombreExpositions}
                  disabled={dossier.locked}
                  onChange={(event) =>
                    setNewShot((prev) => ({ ...prev, nombreExpositions: Number(event.target.value) }))
                  }
                />
              </label>
              <label>
                Angle entre expositions (°)
                <input
                  type="number"
                  value={newShot.angleExpositions}
                  disabled={dossier.locked}
                  onChange={(event) =>
                    setNewShot((prev) => ({ ...prev, angleExpositions: Number(event.target.value) }))
                  }
                />
              </label>
              <label>
                Position source
                <select
                  value={newShot.positionSource}
                  disabled={
                    dossier.locked ||
                    sessionDpsiContactRule.applies ||
                    sessionMidDiameterContactRule.applies ||
                    sessionLargeDiameterPanoramicRule.applies
                  }
                  onChange={(event) =>
                    setNewShot((prev) => ({
                      ...prev,
                      positionSource: event.target.value,
                      sourceAuContact: event.target.value !== 'Centrée',
                    }))
                  }
                >
                  <option>Extérieur</option>
                  <option>Intérieur</option>
                  <option>Centrée</option>
                </select>
              </label>
              <label>
                Intérieur accessible ?
                <select
                  value={newShot.interieurAccessible ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const interieurAccessible = event.target.value === 'Oui';
                    setNewShot((prev) => {
                      const options = getShotTypeOptions(prev.technique, prev.source, {
                        diametreTube: prev.diametreTube,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.e,
                        interieurAccessible,
                        superpositionAcceptable: prev.superpositionAcceptable,
                        pieceType: dossier.partType,
                        contactControle: prev.contactControle,
                      });
                      return {
                        ...prev,
                        interieurAccessible,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </label>
              <label>
                Superposition acceptable ?
                <select
                  value={newShot.superpositionAcceptable ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const superpositionAcceptable = event.target.value === 'Oui';
                    setNewShot((prev) => {
                      const options = getShotTypeOptions(prev.technique, prev.source, {
                        diametreTube: prev.diametreTube,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.e,
                        interieurAccessible: prev.interieurAccessible,
                        superpositionAcceptable,
                        pieceType: dossier.partType,
                        contactControle: prev.contactControle,
                      });
                      return {
                        ...prev,
                        superpositionAcceptable,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </label>
              <label>
                Collimateur en place ?
                <select
                  value={newShot.collimateur ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => setNewShot((prev) => ({ ...prev, collimateur: event.target.value === 'Oui' }))}
                >
                  <option>Oui</option>
                  <option>Non</option>
                </select>
              </label>
              <label>
                Contrôle contact ?
                <select
                  value={newShot.contactControle ? 'Oui' : 'Non'}
                  disabled={dossier.locked}
                  onChange={(event) => {
                    const contactControle = event.target.value === 'Oui';
                    setNewShot((prev) => {
                      const options = getShotTypeOptions(prev.technique, prev.source, {
                        diametreTube: prev.diametreTube,
                        diametreInterne: prev.diametreInterne,
                        epaisseur: prev.e,
                        interieurAccessible: prev.interieurAccessible,
                        superpositionAcceptable: prev.superpositionAcceptable,
                        pieceType: dossier.partType,
                        contactControle,
                      });
                      return {
                        ...prev,
                        contactControle,
                        typeTir: options.includes(prev.typeTir) ? prev.typeTir : options[0],
                      };
                    });
                  }}
                >
                  <option>Non</option>
                  <option>Oui</option>
                </select>
              </label>
              {(getPieceCategory(dossier.partType) === 'shell' || getPieceCategory(dossier.partType) === 'tube') && (
                <>
                  <label>
                    Rayon / Ø repère (mm)
                    <input
                      type="number"
                      value={newShot.rayon}
                      disabled={dossier.locked}
                      onChange={(event) => setNewShot((prev) => ({ ...prev, rayon: Number(event.target.value) }))}
                    />
                  </label>
                  <label>
                    Longueur film (mm)
                    <input
                      type="number"
                      value={newShot.longueurFilm}
                      disabled={dossier.locked}
                      onChange={(event) =>
                        setNewShot((prev) => ({ ...prev, longueurFilm: Number(event.target.value) }))
                      }
                    />
                  </label>
                  <label>
                    Recouvrement (mm)
                    <input
                      type="number"
                      value={newShot.recouvrement}
                      disabled={dossier.locked}
                      onChange={(event) =>
                        setNewShot((prev) => ({ ...prev, recouvrement: Number(event.target.value) }))
                      }
                    />
                  </label>
                </>
              )}
            </>
          )}
          <label>
            d (mm)
            <input
              type="number"
              value={newShot.d}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, d: Number(event.target.value) }))}
            />
          </label>
          <label>
            DSF (mm)
            <input
              type="number"
              value={newShot.dsf}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, dsf: Number(event.target.value) }))}
            />
          </label>
          <label>
            Épaisseur e (mm, une paroi)
            <input
              type="number"
              value={newShot.e}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, e: Number(event.target.value) }))}
            />
          </label>
          <label>
            kV
            <input
              type="number"
              value={newShot.kv}
              disabled={dossier.locked || newShot.technique !== 'RX'}
              onChange={(event) => setNewShot((prev) => ({ ...prev, kv: Number(event.target.value) }))}
            />
          </label>
          <label>
            mA
            <input
              type="number"
              value={newShot.ma}
              disabled={dossier.locked || newShot.technique !== 'RX'}
              onChange={(event) => setNewShot((prev) => ({ ...prev, ma: Number(event.target.value) }))}
            />
          </label>
          <label>
            Temps RX (s)
            <input
              type="number"
              value={newShot.time}
              disabled={dossier.locked || newShot.technique !== 'RX'}
              onChange={(event) => setNewShot((prev) => ({ ...prev, time: Number(event.target.value) }))}
            />
          </label>
          <label>
            Q RX auto (mA·min)
            <input value={sessionRxQFactor === null ? 'N/A' : sessionRxQFactor.toFixed(2)} disabled />
          </label>
          <label>
            Temps auto RX (s)
            <input value={sessionRxExposureSeconds === null ? 'N/A' : sessionRxExposureSeconds.toFixed(1)} disabled />
          </label>
          <label>
            Source Gamma
            <input
              value={newShot.gammaSource}
              disabled={dossier.locked || newShot.technique !== 'Gamma'}
              onChange={(event) => setNewShot((prev) => ({ ...prev, gammaSource: event.target.value }))}
            />
          </label>
          <label>
            Activité
            <input
              value={newShot.activite}
              disabled={dossier.locked || newShot.technique !== 'Gamma'}
              onChange={(event) => setNewShot((prev) => ({ ...prev, activite: event.target.value }))}
            />
          </label>
          <label>
            Temps Gamma
            <input
              value={newShot.gammaTime}
              disabled={
                dossier.locked ||
                newShot.technique !== 'Gamma' ||
                (newShot.technique === 'Gamma' && newShot.source === 'Ir-192')
              }
              onChange={(event) => setNewShot((prev) => ({ ...prev, gammaTime: event.target.value }))}
            />
          </label>
          <label>
            Film / détecteur
            {newShot.technique === 'Gamma' ? (
              <select
                value={normalizeGammaFilmDetector(newShot.filmDetecteur)}
                disabled={dossier.locked}
                onChange={(event) => setNewShot((prev) => ({ ...prev, filmDetecteur: event.target.value }))}
              >
                {GAMMA_FILM_OPTIONS.map((film) => (
                  <option key={film} value={film}>
                    {film}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={newShot.filmDetecteur}
                disabled={dossier.locked}
                onChange={(event) => setNewShot((prev) => ({ ...prev, filmDetecteur: event.target.value }))}
              />
            )}
          </label>
          <label>
            Type densité
            <select
              value={newShot.densiteMode}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, densiteMode: event.target.value }))}
            >
              <option value="simple">Film simple</option>
              <option value="double">Double film</option>
            </select>
          </label>
          <label>
            Densité voulue (Δ)
            <input
              type="number"
              step="0.1"
              value={newShot.densiteVoulue}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, densiteVoulue: Number(event.target.value) }))}
            />
          </label>
          <label>
            K film (auto)
            <input value={sessionFilmK === null ? 'N/A' : String(sessionFilmK)} disabled />
          </label>
          <label>
            N densité (auto)
            <input value={sessionDensityN === null ? 'N/A' : sessionDensityN.toFixed(2)} disabled />
          </label>
          <label>
            IQI
            <input
              value={newShot.iqi}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, iqi: event.target.value }))}
            />
          </label>
          <label>
            Sensibilité
            <input
              value={newShot.sensibilite}
              disabled={dossier.locked}
              onChange={(event) => setNewShot((prev) => ({ ...prev, sensibilite: event.target.value }))}
            />
          </label>
        </div>
        {newShot.technique === 'Gamma' && sessionGammaGuidance.length > 0 && (
          <ul className="creation-hints">
            {sessionGammaGuidance.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        )}
        <label className="block">
          Images associées
          <input
            value={newShot.images}
            disabled={dossier.locked}
            onChange={(event) => setNewShot((prev) => ({ ...prev, images: event.target.value }))}
          />
        </label>
        <label className="block">
          Indications / défauts
          <textarea
            rows="3"
            value={newShot.indications}
            disabled={dossier.locked}
            onChange={(event) => setNewShot((prev) => ({ ...prev, indications: event.target.value }))}
          />
        </label>
        <button className="primary" onClick={addShot} disabled={dossier.locked}>
          Ajouter tir
        </button>
      </details>

      <table>
        <thead>
          <tr>
            <th>Tir</th>
            <th>Technique</th>
            <th>Matériau</th>
            <th>Type tir</th>
            <th>Temps pose</th>
            <th>d</th>
            <th>e</th>
            <th>DSF</th>
            <th>Fg</th>
            <th>Verdict</th>
            <th>Recommandation</th>
          </tr>
        </thead>
        <tbody>
          {allShots.map((shot) => {
            const fg = calculateFg(Number(shot.d), Number(shot.e), Number(shot.dsf));
            const compliant = fg !== null && fg <= FG_MAX_LIMIT_MM;
            return (
              <tr key={shot.id}>
                <td>{shot.id}</td>
                <td>{shot.technique}</td>
                <td>{shot.materialPiece || dossier.materialPiece || '-'}</td>
                <td>{shot.typeTir || '-'}</td>
                <td>{shot.technique === 'Gamma' ? formatGammaTimeDisplay(shot.gammaTime) : `${shot.time || '-'} s`}</td>
                <td>{shot.d}</td>
                <td>{shot.e}</td>
                <td>{shot.dsf}</td>
                <td>{fg === null ? 'N/A' : fg.toFixed(3)}</td>
                <td className={compliant ? 'ok' : 'ko'}>{compliant ? 'Conforme' : 'Non conforme'}</td>
                <td>{compliant ? '-' : 'Augmenter DSF ou réduire la taille de source'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );

  const renderVerification = () => (
    <section className="module">
      <h2>Vérification Demande vs Réalisé</h2>
      <table>
        <thead>
          <tr>
            <th>Exigence</th>
            <th>Demandé</th>
            <th>Réalisé</th>
            <th>Conforme</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((row) => (
            <tr key={row.key}>
              <td>{row.key}</td>
              <td>{row.expected}</td>
              <td>{row.actual}</td>
              <td className={row.compliant ? 'ok' : 'ko'}>{row.compliant ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="summary">
        <strong>{nonConformities.length === 0 ? '✅ Conforme' : '❌ Non conforme'}</strong>
        {nonConformities.length > 0 && (
          <ul>
            {nonConformities.map((item) => (
              <li key={item.key}>{item.key} : écart détecté</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );

  const renderRapports = () => (
    <section className="module">
      <h2>Rapports & PV</h2>
      <p>
        Classement : {dossier.client} → {dossier.partType} → {new Date().toLocaleDateString('fr-FR')} →
        Rapport-{dossier.id}
      </p>
      <details open>
        <summary>Template</summary>
        <pre>
{`{{client}}
{{order_ref}}
{{shots_table}}
{{results}}
{{signatures}}`}
        </pre>
      </details>
      <div className="report-box">
        <h3>Prévisualisation</h3>
        <p>Client : {dossier.client}</p>
        <p>Réf commande : {dossier.orderRef}</p>
        <p>Matériau pièce : {dossier.materialPiece || '-'}</p>
        <p>Tirs : {shotCount}</p>
        <p>Dernier temps Gamma : {latestGammaTimeDisplay}</p>
        <p>Résultat : {nonConformities.length === 0 ? 'Conforme' : 'Non conforme'}</p>
        <p>Signatures : Responsable RT / Contrôle Qualité</p>
      </div>
      <div className="report-box">
        <h3>Récapitulatif temps de pose</h3>
        <table>
          <thead>
            <tr>
              <th>Date session</th>
              <th>Tir</th>
              <th>Technique</th>
              <th>Matériau</th>
              <th>Temps de pose</th>
            </tr>
          </thead>
          <tbody>
            {reportShotsChrono.length === 0 ? (
              <tr>
                <td colSpan={5}>Aucun tir</td>
              </tr>
            ) : (
              reportShotsChrono.map((shot) => (
                <tr key={`report-time-${shot.id}`}>
                  <td>{new Date(shot._sessionDate).toLocaleDateString('fr-FR')}</td>
                  <td>{shot.id}</td>
                  <td>{shot.technique}</td>
                  <td>{shot.materialPiece || dossier.materialPiece || '-'}</td>
                  <td>{shot.technique === 'Gamma' ? formatGammaTimeDisplay(shot.gammaTime) : `${shot.time || '-'} s`}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="action-row">
        <button
          disabled={dossier.locked}
          onClick={() => {
            registerChange('Génération rapport', 'PDF généré et classé automatiquement');
            setFlash('Rapport PDF généré (simulation).');
          }}
        >
          Générer PDF
        </button>
        <button
          disabled={dossier.locked}
          onClick={() => {
            registerChange('Signature électronique', 'Signatures apposées sur le PV');
            setFlash('Signature électronique ajoutée (simulation).');
          }}
        >
          Signer électroniquement
        </button>
      </div>
    </section>
  );

  const renderDocumentation = () => (
    <section className="module">
      <h2>Documentation & checklist</h2>
      <details open>
        <summary>Type de pièce : {dossier.partType}</summary>
        <ul>
          <li>Normes applicables : {dossier.norme}</li>
          <li>Procédures : {dossier.procedure}</li>
          <li>Exigences critiques : IQI {demande.iqi}, Sensibilité {demande.sensibilite}</li>
          <li>Fg max (fixe RX/Gamma) : {FG_MAX_LIMIT_MM}</li>
          <li>Points de vigilance : vérifier DSF et cohérence e unique</li>
        </ul>
      </details>

      <details>
        <summary>RX (Abaque ERESCO 42 MF4)</summary>
        <p>
          Méthode RX dédiée : le facteur Q (mA·min) est extrait sur la courbe de la tension saisie (kV),
          avec interpolation numérique selon l&apos;épaisseur équivalente acier. Le temps est ensuite calculé par
          t(s) = 60 × (Q / mA) × (DSF / 700)².
        </p>
        <ul>
          <li>
            Création : e&apos; acier ={' '}
            {creationRxSteelEquivalentThickness === null ? 'N/A' : `${creationRxSteelEquivalentThickness.toFixed(2)} mm`} · kV ={' '}
            {Number(creationPhysique.rxKv).toFixed(0)} · mA = {Number(creationPhysique.rxMa).toFixed(2)} · DSF ={' '}
            {Number(creationPhysique.dsf).toFixed(0)} mm
          </li>
          <li>
            Q création (courbe kV) : {creationRxQFactor === null ? 'N/A' : `${creationRxQFactor.toFixed(2)} mA·min`} ·
            Temps auto création : {creationRxExposureSeconds === null ? 'N/A' : `${creationRxExposureSeconds.toFixed(1)} s`}
          </li>
          <li>
            Tir courant : e acier ={' '}
            {sessionRxSteelEquivalentThickness === null ? 'N/A' : `${sessionRxSteelEquivalentThickness.toFixed(2)} mm`} · kV ={' '}
            {Number(newShot.kv).toFixed(0)} · mA = {Number(newShot.ma).toFixed(2)} · DSF = {Number(newShot.dsf).toFixed(0)} mm
          </li>
          <li>
            Q tir courant (courbe kV) : {sessionRxQFactor === null ? 'N/A' : `${sessionRxQFactor.toFixed(2)} mA·min`} ·
            Temps auto tir courant : {sessionRxExposureSeconds === null ? 'N/A' : `${sessionRxExposureSeconds.toFixed(1)} s`}
          </li>
        </ul>

        <div style={{ marginTop: 12, border: '1px solid #dbe3ef', borderRadius: 10, padding: 10, background: '#f8fbff' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Courbe numérique RX (lecture curseur)</p>
          <label style={{ display: 'inline-grid', gap: 4, marginBottom: 8 }}>
            Courbe à suivre
            <select value={rxChartCurveMode} onChange={(event) => setRxChartCurveMode(event.target.value)}>
              <option value="auto">Auto (kV saisi)</option>
              {rxAvailableCurveKv.map((kv) => (
                <option key={`rx-select-${kv}`} value={String(kv)}>
                  {kv} kV
                </option>
              ))}
            </select>
          </label>
          <p style={{ margin: '0 0 8px', color: '#5f728d', fontSize: 12 }}>
            Courbe active : {rxHoverCurveKv || '-'} kV
            {rxChartCurveMode === 'auto' ? ' (auto)' : ' (sélection manuelle)'} · survolez pour lire Q ; cliquez pour figer/défiger.
            {rxPinnedPoint ? ' (lecture figée)' : ''}
          </p>
          <svg viewBox={`0 0 ${rxAbaqueChart.width} ${rxAbaqueChart.height}`} width="100%" role="img" aria-label="Abaque RX">
            <rect x="0" y="0" width={rxAbaqueChart.width} height={rxAbaqueChart.height} fill="#ffffff" />
            <line
              x1={rxAbaqueChart.padding}
              y1={rxAbaqueChart.height - rxAbaqueChart.padding}
              x2={rxAbaqueChart.width - rxAbaqueChart.padding}
              y2={rxAbaqueChart.height - rxAbaqueChart.padding}
              stroke="#9db0c9"
            />
            <line
              x1={rxAbaqueChart.padding}
              y1={rxAbaqueChart.padding}
              x2={rxAbaqueChart.padding}
              y2={rxAbaqueChart.height - rxAbaqueChart.padding}
              stroke="#9db0c9"
            />
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45].map((tick) => {
              const point = projectIrAbaquePoint(tick, rxAbaqueChart.minQ, rxAbaqueChart);
              return (
                <g key={`rx-x-${tick}`}>
                  <line
                    x1={point.x}
                    y1={rxAbaqueChart.padding}
                    x2={point.x}
                    y2={rxAbaqueChart.height - rxAbaqueChart.padding}
                    stroke="#edf2f8"
                  />
                  <text x={point.x} y={rxAbaqueChart.height - 10} fontSize="10" textAnchor="middle" fill="#5f728d">
                    {tick}
                  </text>
                </g>
              );
            })}
            {[2, 3, 4.5, 7, 10, 15, 20, 30, 50].map((tick) => {
              const point = projectIrAbaquePoint(rxAbaqueChart.minEpaisseur, tick, rxAbaqueChart);
              return (
                <g key={`rx-y-${tick}`}>
                  <line
                    x1={rxAbaqueChart.padding}
                    y1={point.y}
                    x2={rxAbaqueChart.width - rxAbaqueChart.padding}
                    y2={point.y}
                    stroke="#edf2f8"
                  />
                  <text x="8" y={point.y + 3} fontSize="10" textAnchor="start" fill="#5f728d">
                    {tick}
                  </text>
                </g>
              );
            })}

            {rxAbaqueChart.curves.map((curve) => (
              <path
                key={`rx-curve-path-${curve.kv}`}
                d={curve.path}
                fill="none"
                stroke={curve.kv === rxHoverCurveKv ? '#1d4ed8' : '#94a3b8'}
                strokeWidth={curve.kv === rxHoverCurveKv ? '2.6' : '1.3'}
                opacity={curve.kv === rxHoverCurveKv ? 1 : 0.7}
              />
            ))}

            {creationRxChartPoint && (
              <g>
                <circle cx={creationRxChartPoint.x} cy={creationRxChartPoint.y} r="4" fill="#16a34a" />
                <text x={creationRxChartPoint.x + 7} y={creationRxChartPoint.y - 7} fontSize="10" fill="#166534">
                  Création ({Number(creationRxChartPoint.kv).toFixed(0)} kV)
                </text>
              </g>
            )}
            {sessionRxChartPoint && (
              <g>
                <circle cx={sessionRxChartPoint.x} cy={sessionRxChartPoint.y} r="4" fill="#b91c1c" />
                <text x={sessionRxChartPoint.x + 7} y={sessionRxChartPoint.y + 14} fontSize="10" fill="#991b1b">
                  Tir courant ({Number(sessionRxChartPoint.kv).toFixed(0)} kV)
                </text>
              </g>
            )}

            <rect
              x={rxAbaqueChart.padding}
              y={rxAbaqueChart.padding}
              width={rxAbaqueChart.width - 2 * rxAbaqueChart.padding}
              height={rxAbaqueChart.height - 2 * rxAbaqueChart.padding}
              fill="transparent"
              onMouseMove={handleRxAbaqueMouseMove}
              onMouseLeave={clearRxAbaqueHover}
              onClick={toggleRxAbaquePinnedPoint}
              style={{ cursor: 'crosshair' }}
            />

            {rxHoverPoint && (
              <g>
                <line
                  x1={rxHoverPoint.x}
                  y1={rxAbaqueChart.padding}
                  x2={rxHoverPoint.x}
                  y2={rxAbaqueChart.height - rxAbaqueChart.padding}
                  stroke="#334155"
                  strokeDasharray="4 3"
                />
                <circle cx={rxHoverPoint.x} cy={rxHoverPoint.y} r="4" fill="#0f172a" />
                <rect
                  x={Math.min(rxAbaqueChart.width - 200, rxHoverPoint.x + 10)}
                  y={Math.max(rxAbaqueChart.padding, rxHoverPoint.y - 34)}
                  width="190"
                  height="30"
                  rx="6"
                  fill="#0f172a"
                  opacity="0.9"
                />
                <text
                  x={Math.min(rxAbaqueChart.width - 195, rxHoverPoint.x + 15)}
                  y={Math.max(rxAbaqueChart.padding + 12, rxHoverPoint.y - 16)}
                  fontSize="10"
                  fill="#f8fafc"
                >
                  e={rxHoverPoint.epaisseur.toFixed(1)} mm · Q={rxHoverPoint.q.toFixed(2)} · {rxHoverPoint.kv} kV
                </text>
              </g>
            )}
          </svg>
          <p style={{ margin: '6px 0 0', color: '#5f728d', fontSize: 12 }}>
            Abscisse : épaisseur acier (mm) · Ordonnée : facteur Q (mA·min, échelle log).
          </p>
        </div>

        <details>
          <summary>Courbes RX disponibles (Q en mA·min)</summary>
          <table>
            <thead>
              <tr>
                <th>kV</th>
                <th>Plage e acier (mm)</th>
                <th>Q min</th>
                <th>Q max</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(RX_ABAQUE_CURVES_BY_KV)
                .map(([kv, points]) => ({ kv: Number(kv), points }))
                .sort((left, right) => left.kv - right.kv)
                .map(({ kv, points }) => (
                  <tr key={`rx-curve-${kv}`}>
                    <td>{kv}</td>
                    <td>{points[0].epaisseur} – {points[points.length - 1].epaisseur}</td>
                    <td>{points[0].q.toFixed(2)}</td>
                    <td>{points[points.length - 1].q.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <p>
            Référence abaque intégrée : ERESCO 42 MF4 200 kV – 4,5 mA, distance source-film 700 mm,
            film AGFA D7 + écran Pb, densité optique Δ = 2.
          </p>
        </details>
      </details>

      <details>
        <summary>Iridium (tirs Ir-192)</summary>

        <details open>
          <summary>Facteur Q</summary>
          <p>
            Méthode intégrée : à partir de l&apos;épaisseur saisie, le système interpole numériquement l&apos;abaque Ir-192
            pour extraire automatiquement le facteur Q (unité Ci·h), puis calcule le temps de pose avec
            t = Q × D² × K × N / A (D = DSF en mètres).
          </p>
          <ul>
            <li>Épaisseur création (e&apos;) : {Number(creationPhysique.ePrime).toFixed(2)} mm</li>
            <li>
              Matériau création : {creationPhysique.materialPiece || '-'} · ρ ={' '}
              {getGammaMaterialDensity(creationPhysique.materialPiece) === null
                ? 'N/A'
                : `${getGammaMaterialDensity(creationPhysique.materialPiece).toFixed(2)} g/cm³`}
            </li>
            <li>
              Épaisseur équivalente acier (e&apos; × ρ/7,85) :{' '}
              {creationSteelEquivalentThickness === null ? 'N/A' : `${creationSteelEquivalentThickness.toFixed(2)} mm`}
            </li>
            <li>Source création : {creationPhysique.source}</li>
            <li>
              Facteur Q création : {creationIrQFactor === null ? 'N/A (activer Gamma + Ir-192)' : `${creationIrQFactor.toFixed(2)} Ci·h`}
            </li>
            <li>
              Paramètres création : D = {(Number(creationPhysique.dsf) / 1000).toFixed(3)} m · K ={' '}
              {creationFilmK === null ? 'N/A' : creationFilmK} · N ={' '}
              {creationDensityN === null ? 'N/A' : creationDensityN.toFixed(2)} · A ={' '}
              {creationActiviteCi === null ? 'N/A' : `${creationActiviteCi.toFixed(2)} Ci`}
            </li>
            <li>
              Temps auto création :{' '}
              {creationIrExposureHours === null
                ? 'N/A (Q, D, K, N, A requis)'
                : `${creationIrExposureHours.toFixed(3)} h (${formatHoursToMinutesSeconds(creationIrExposureHours)})`}
            </li>
            <li>Épaisseur tir courant (e) : {Number(newShot.e).toFixed(2)} mm</li>
            <li>
              Matériau tir courant : {newShot.materialPiece || '-'} · ρ ={' '}
              {getGammaMaterialDensity(newShot.materialPiece) === null
                ? 'N/A'
                : `${getGammaMaterialDensity(newShot.materialPiece).toFixed(2)} g/cm³`}
            </li>
            <li>
              Épaisseur équivalente acier (e × ρ/7,85) :{' '}
              {sessionSteelEquivalentThickness === null ? 'N/A' : `${sessionSteelEquivalentThickness.toFixed(2)} mm`}
            </li>
            <li>Source tir courant : {newShot.source}</li>
            <li>
              Facteur Q tir courant : {sessionIrQFactor === null ? 'N/A (activer Gamma + Ir-192)' : `${sessionIrQFactor.toFixed(2)} Ci·h`}
            </li>
            <li>
              Paramètres tir courant : D = {(Number(newShot.dsf) / 1000).toFixed(3)} m · K ={' '}
              {sessionFilmK === null ? 'N/A' : sessionFilmK} · N ={' '}
              {sessionDensityN === null ? 'N/A' : sessionDensityN.toFixed(2)} · A ={' '}
              {sessionActiviteCi === null ? 'N/A' : `${sessionActiviteCi.toFixed(2)} Ci`}
            </li>
            <li>
              Temps auto tir courant :{' '}
              {sessionIrExposureHours === null
                ? 'N/A (Q, D, K, N, A requis)'
                : `${sessionIrExposureHours.toFixed(3)} h (${sessionIrExposureMinutesSeconds})`}
            </li>
          </ul>
          <div style={{ marginTop: 12, border: '1px solid #dbe3ef', borderRadius: 10, padding: 10, background: '#f8fbff' }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Courbe numérique de l&apos;abaque Ir-192</p>
            <p style={{ margin: '0 0 8px', color: '#5f728d', fontSize: 12 }}>
              Astuce : survolez pour lire Q ; cliquez pour figer/défiger la lecture.
              {irPinnedPoint ? ' (lecture figée)' : ''}
            </p>
            <svg viewBox={`0 0 ${irAbaqueChart.width} ${irAbaqueChart.height}`} width="100%" role="img" aria-label="Abaque Ir-192">
            <rect x="0" y="0" width={irAbaqueChart.width} height={irAbaqueChart.height} fill="#ffffff" />
            <line
              x1={irAbaqueChart.padding}
              y1={irAbaqueChart.height - irAbaqueChart.padding}
              x2={irAbaqueChart.width - irAbaqueChart.padding}
              y2={irAbaqueChart.height - irAbaqueChart.padding}
              stroke="#9db0c9"
            />
            <line
              x1={irAbaqueChart.padding}
              y1={irAbaqueChart.padding}
              x2={irAbaqueChart.padding}
              y2={irAbaqueChart.height - irAbaqueChart.padding}
              stroke="#9db0c9"
            />
            {[0, 20, 40, 60, 80, 100].map((tick) => {
              const point = projectIrAbaquePoint(tick, irAbaqueChart.minQ, irAbaqueChart);
              return (
                <g key={`x-${tick}`}>
                  <line x1={point.x} y1={irAbaqueChart.padding} x2={point.x} y2={irAbaqueChart.height - irAbaqueChart.padding} stroke="#edf2f8" />
                  <text x={point.x} y={irAbaqueChart.height - 10} fontSize="10" textAnchor="middle" fill="#5f728d">
                    {tick}
                  </text>
                </g>
              );
            })}
            {[1, 5, 10, 20, 50, 100, 200, 500].map((tick) => {
              const point = projectIrAbaquePoint(irAbaqueChart.minEpaisseur, tick, irAbaqueChart);
              return (
                <g key={`y-${tick}`}>
                  <line
                    x1={irAbaqueChart.padding}
                    y1={point.y}
                    x2={irAbaqueChart.width - irAbaqueChart.padding}
                    y2={point.y}
                    stroke="#edf2f8"
                  />
                  <text x="8" y={point.y + 3} fontSize="10" textAnchor="start" fill="#5f728d">
                    {tick}
                  </text>
                </g>
              );
            })}
            <path d={irAbaqueChart.path} fill="none" stroke="#1d4ed8" strokeWidth="2.5" />
            {irAbaqueChart.creationPoint && (
              <g>
                <circle cx={irAbaqueChart.creationPoint.x} cy={irAbaqueChart.creationPoint.y} r="4" fill="#16a34a" />
                <text x={irAbaqueChart.creationPoint.x + 7} y={irAbaqueChart.creationPoint.y - 7} fontSize="10" fill="#166534">
                  Création
                </text>
              </g>
            )}
            {irAbaqueChart.sessionPoint && (
              <g>
                <circle cx={irAbaqueChart.sessionPoint.x} cy={irAbaqueChart.sessionPoint.y} r="4" fill="#b91c1c" />
                <text x={irAbaqueChart.sessionPoint.x + 7} y={irAbaqueChart.sessionPoint.y + 14} fontSize="10" fill="#991b1b">
                  Tir courant
                </text>
              </g>
            )}
            <rect
              x={irAbaqueChart.padding}
              y={irAbaqueChart.padding}
              width={irAbaqueChart.width - 2 * irAbaqueChart.padding}
              height={irAbaqueChart.height - 2 * irAbaqueChart.padding}
              fill="transparent"
              onMouseMove={handleIrAbaqueMouseMove}
              onMouseLeave={clearIrAbaqueHover}
              onClick={toggleIrAbaquePinnedPoint}
              style={{ cursor: 'crosshair' }}
            />
            {irHoverPoint && (
              <g>
                <line
                  x1={irHoverPoint.x}
                  y1={irAbaqueChart.padding}
                  x2={irHoverPoint.x}
                  y2={irAbaqueChart.height - irAbaqueChart.padding}
                  stroke="#334155"
                  strokeDasharray="4 3"
                />
                <circle cx={irHoverPoint.x} cy={irHoverPoint.y} r="4" fill="#0f172a" />
                <rect
                  x={Math.min(irAbaqueChart.width - 170, irHoverPoint.x + 10)}
                  y={Math.max(irAbaqueChart.padding, irHoverPoint.y - 34)}
                  width="160"
                  height="30"
                  rx="6"
                  fill="#0f172a"
                  opacity="0.9"
                />
                <text
                  x={Math.min(irAbaqueChart.width - 165, irHoverPoint.x + 15)}
                  y={Math.max(irAbaqueChart.padding + 12, irHoverPoint.y - 16)}
                  fontSize="10"
                  fill="#f8fafc"
                >
                  e={irHoverPoint.epaisseur.toFixed(1)} mm · Q={irHoverPoint.q.toFixed(2)} Ci·h
                </text>
              </g>
            )}
            </svg>
            <p style={{ margin: '6px 0 0', color: '#5f728d', fontSize: 12 }}>
              Abscisse : épaisseur acier (mm) · Ordonnée : facteur Q (Ci·h, échelle log).
            </p>
          </div>
        </details>

        <details>
          <summary>Coefficient de rapidité du film K</summary>
          <table>
          <thead>
            <tr>
              <th>Type de film</th>
              <th>K</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Agfa D7</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Agfa D5</td>
              <td>1,6</td>
            </tr>
            <tr>
              <td>Agfa D4</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Agfa D3</td>
              <td>4</td>
            </tr>
          </tbody>
          </table>
          <p>
            K auto (création) : {creationFilmK === null ? 'N/A' : creationFilmK} · K auto (tir courant) :{' '}
            {sessionFilmK === null ? 'N/A' : sessionFilmK}
          </p>
        </details>

        <details>
          <summary>Coefficient correcteur de densité N</summary>
          <table>
          <thead>
            <tr>
              <th>Densité simple film</th>
              <th>N</th>
              <th>Densité double film</th>
              <th>N</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Δ = 1,5</td>
              <td>0,73</td>
              <td>Δ = 2,5</td>
              <td>0,6</td>
            </tr>
            <tr>
              <td>Δ = 2</td>
              <td>1</td>
              <td>Δ = 3</td>
              <td>0,73</td>
            </tr>
            <tr>
              <td>Δ = 2,5</td>
              <td>1,2</td>
              <td>Δ = 3,5</td>
              <td>0,85</td>
            </tr>
            <tr>
              <td>Δ = 3</td>
              <td>1,4</td>
              <td>Δ = 4</td>
              <td>1</td>
            </tr>
            <tr>
              <td>Δ = 3,5</td>
              <td>1,7</td>
              <td>Δ = 4,5</td>
              <td>1,12</td>
            </tr>
          </tbody>
          </table>
          <p>
            N auto (création) : {creationDensityN === null ? 'N/A' : creationDensityN.toFixed(2)} · N auto (tir courant)
            : {sessionDensityN === null ? 'N/A' : sessionDensityN.toFixed(2)}
          </p>
        </details>

        <details>
          <summary>Tableau densités matériaux (référence + conversion)</summary>
          <table>
            <thead>
              <tr>
                <th>Catégorie</th>
                <th>Matériau</th>
                <th>ρ référence (g/cm³)</th>
                <th>ρ conversion (calcul)</th>
              </tr>
            </thead>
            <tbody>
              {GAMMA_DENSITY_REFERENCE_GROUPS.flatMap((group) =>
                group.rows.map((row, index) => (
                  <tr key={`${group.label}-${row.material}`} style={index === 0 ? { borderTop: '3px solid #9db0c9' } : undefined}>
                    <td>{group.label}</td>
                    <td>{row.material}</td>
                    <td>{row.rho}</td>
                    <td>{row.conversion.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <ul>
            {GAMMA_DENSITY_REFERENCE_GROUPS.filter((group) => group.examValue).map((group) => (
              <li key={`${group.label}-exam`}>
                {group.label} : {group.examValue}
              </li>
            ))}
          </ul>
          <p>
            Conversion appliquée pour l&apos;abaque Ir-192 : e acier = e matériau × ρ matériau / 7,85.
          </p>
        </details>
      </details>

      <h3>Checklist obligatoire avant soumission</h3>
      <div className="checklist">
        {[
          ['identification', 'Identification correcte'],
          ['iqi', 'IQI conforme'],
          ['parametres', 'Paramètres validés'],
          ['fg', 'Fg conforme'],
        ].map(([key, label]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={checklist[key]}
              disabled={dossier.locked}
              onChange={(event) => {
                setChecklist((prev) => ({ ...prev, [key]: event.target.checked }));
                registerChange('Checklist', `${label} : ${event.target.checked ? 'Oui' : 'Non'}`);
              }}
            />
            {label}
          </label>
        ))}
      </div>
      <p className={checklistDone ? 'ok' : 'ko'}>
        {checklistDone
          ? 'Checklist complète : la soumission est autorisée.'
          : 'Checklist incomplète : la soumission reste bloquée.'}
      </p>
    </section>
  );

  const renderReferentiels = () => (
    <section className="module">
      <h2>Référentiels</h2>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>RT-NORM-001</td>
            <td>Norme radiographie numérique</td>
            <td>ISO 17636-2</td>
          </tr>
          <tr>
            <td>RT-IQI-002</td>
            <td>IQI standard soudage</td>
            <td>EN IQI fil 10</td>
          </tr>
          <tr>
            <td>RT-FG-003</td>
            <td>Seuil Fg interne recommandé</td>
            <td>0.6</td>
          </tr>
        </tbody>
      </table>
    </section>
  );

  const moduleMap = {
    Dashboard: renderDashboard,
    Dossiers: renderDossiers,
    Demandes: renderDemandes,
    Sessions: renderSessions,
    Vérification: renderVerification,
    Rapports: renderRapports,
    Documentation: renderDocumentation,
    Référentiels: renderReferentiels,
  };

  return (
    <div className="mobile-shell">
      <aside className="pc-sidebar" aria-label="Navigation desktop">
        <div className="pc-user">
          <div className="profile-avatar" aria-hidden="true">
            SD
          </div>
          <div>
            <h2>Marc Durand</h2>
            <p>Expert niveau 2</p>
          </div>
        </div>

        <div className="pc-dossier">
          <p>Dossier {dossier.id}</p>
          <strong>{dossier.client}</strong>
          <span>Statut : {dossier.status}</span>
          <span>{sessionCount} sessions · {shotCount} tirs</span>
        </div>

        <nav className="desktop-nav" aria-label="Modules">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              className={item === active ? 'desktop-nav-item active' : 'desktop-nav-item'}
              onClick={() => setActive(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="mobile-screen">
        <header className="profile-header">
          <div className="profile-avatar" aria-hidden="true">
            SD
          </div>
          <div>
            <h1>Marc Durand</h1>
            <p>Expert niveau 2</p>
          </div>
          <button className="notif-btn" aria-label="Notifications">
            🔔
          </button>
        </header>

        {flash && <p className="flash">{flash}</p>}

        {active === 'Dashboard' ? (
          renderDashboard()
        ) : (
          <>
            <section className="dossier-banner">
              <div>
                <h2>Dossier {dossier.id}</h2>
                <p>Client : {dossier.client}</p>
              </div>
              <div>
                <p>Statut : {dossier.status}</p>
                <p>Sessions : {sessionCount}</p>
                <p>Tirs : {shotCount}</p>
                <p>Dernière modification : {formatDate(dossier.updatedAt)} par {dossier.updatedBy}</p>
              </div>
              <div className="status-actions">
                <button onClick={() => updateStatus('Brouillon')} disabled={dossier.locked}>
                  Brouillon
                </button>
                <button onClick={() => updateStatus('Soumis')} disabled={dossier.locked}>
                  Soumettre
                </button>
                <button onClick={() => updateStatus('Validé')} disabled={dossier.locked}>
                  Valider
                </button>
              </div>
            </section>
            {moduleMap[active]()}
          </>
        )}
      </main>

      <nav className="mobile-nav" aria-label="Navigation principale">
        {MOBILE_NAV.map((item) => (
          <button
            key={item.key}
            className={item.key === active ? 'mobile-nav-item active' : 'mobile-nav-item'}
            onClick={() => setActive(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
