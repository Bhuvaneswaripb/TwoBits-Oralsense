import {
  Doctor,
  DentalClinic,
  Question,
  NightlyTelemetry,
  Appointment,
  ScreeningResult,
  PatientProfile,
  ConcernType,
  FeaturedConcernType,
  SecondaryConcernType,
  ServiceType,
  PracticePatient,
  SymptomLogEntry,
  FollowUpSubmission,
  VisualInputConfig,
} from '../types';

export const FEATURED_CONCERNS: {
  id: FeaturedConcernType;
  title: string;
  description: string;
  iconName: string;
  isFlagship?: boolean;
}[] = [
  {
    id: 'Bruxism & Jaw Health',
    title: 'Bruxism & Jaw Health',
    description: 'Screen signs of nocturnal teeth grinding, daytime clenching, and TMJ muscle stiffness.',
    iconName: 'Activity',
    isFlagship: true,
  },
  {
    id: 'Tooth Pain & Cavity Concerns',
    title: 'Tooth Pain & Cavity Concerns',
    description: 'Organize pain triggers, biting discomfort, and suspected cavity locations.',
    iconName: 'Zap',
  },
  {
    id: 'Gum Health',
    title: 'Gum Health',
    description: 'Evaluate gum bleeding, swelling, tenderness, or recession indicators.',
    iconName: 'HeartPulse',
  },
  {
    id: 'Tooth Sensitivity',
    title: 'Tooth Sensitivity',
    description: 'Track zinging sensations triggered by cold water, hot drinks, or sweets.',
    iconName: 'Thermometer',
  },
  {
    id: 'Tooth Wear',
    title: 'Tooth Wear & Damage',
    description: 'Track flattened tooth surfaces, chipped edges, enamel transparency, or cracks.',
    iconName: 'ShieldAlert',
  },
];

export const CONCERN_CARDS = FEATURED_CONCERNS;

export const SECONDARY_CONCERNS: {
  id: SecondaryConcernType;
  title: string;
  description: string;
  iconName: string;
}[] = [
  {
    id: 'Oral Ulcer Concerns',
    title: 'Oral Ulcer Concerns',
    description: 'Track tender spots, cheek bites, or recurring mouth friction sores.',
    iconName: 'AlertCircle',
  },
  {
    id: 'Bad Breath',
    title: 'Bad Breath (Halitosis)',
    description: 'Evaluate persistent bad taste, dry mouth, or gum-related odor concerns.',
    iconName: 'Wind',
  },
  {
    id: 'Dry Mouth',
    title: 'Dry Mouth (Xerostomia)',
    description: 'Screen lack of saliva flow, swallowing discomfort, or tongue dryness.',
    iconName: 'Droplets',
  },
  {
    id: 'Wisdom Tooth Concerns',
    title: 'Wisdom Tooth Concerns',
    description: 'Track back jaw stiffness, pericoronitis gum flaps, or impacted tooth pain.',
    iconName: 'HelpCircle',
  },
  {
    id: 'Jaw / TMJ Symptoms',
    title: 'Jaw / TMJ Symptoms',
    description: 'Screen clicking, popping sounds, or restricted jaw opening.',
    iconName: 'Volume2',
  },
  {
    id: 'Enamel Damage',
    title: 'Enamel Damage',
    description: 'Evaluate acid erosion, yellowing dentin exposure, or enamel thinning.',
    iconName: 'Sparkles',
  },
  {
    id: 'Swollen / Painful Gums',
    title: 'Swollen / Painful Gums',
    description: 'Organize localized gum abscesses, acute puffiness, or painful gingivitis.',
    iconName: 'HeartPulse',
  },
  {
    id: 'Other Dental Concern',
    title: 'Other Dental Concern',
    description: 'Organize general oral symptoms before a professional dental evaluation.',
    iconName: 'FileText',
  },
];

export interface DentalServiceCategory {
  categoryName: string;
  badgeText: string;
  badgeVariant: 'success' | 'primary' | 'secondary' | 'neutral';
  services: {
    id: ServiceType;
    title: string;
    description: string;
    icon: string;
    recommendedSpecialty: string;
  }[];
}

export const CATEGORIZED_DENTAL_SERVICES: DentalServiceCategory[] = [
  {
    categoryName: 'PREVENTIVE CARE',
    badgeText: 'DIRECT SERVICE BOOKING',
    badgeVariant: 'success',
    services: [
      {
        id: 'Teeth Cleaning & Scaling',
        title: 'Teeth Cleaning & Scaling',
        description: 'Professional plaque and tartar removal with preventive oral hygiene care.',
        icon: '🦷',
        recommendedSpecialty: 'General / Preventive Dentist',
      },
      {
        id: 'Routine Dental Check-up',
        title: 'Routine Dental Check-up',
        description: 'Professional examination to assess overall dental and oral health.',
        icon: '💬',
        recommendedSpecialty: 'General / Restorative Dentistry',
      },
    ],
  },
  {
    categoryName: 'COSMETIC CARE',
    badgeText: 'SMILE ENHANCEMENT',
    badgeVariant: 'primary',
    services: [
      {
        id: 'Teeth Whitening',
        title: 'Teeth Whitening',
        description: 'Professional treatment to reduce surface stains and brighten the appearance of teeth.',
        icon: '✨',
        recommendedSpecialty: 'Cosmetic Dentistry',
      },
      {
        id: 'Dental Veneers',
        title: 'Dental Veneers',
        description: 'Thin tooth-colored shells used to improve the appearance of selected teeth.',
        icon: '💎',
        recommendedSpecialty: 'Cosmetic Dentistry',
      },
      {
        id: 'Dental Bonding',
        title: 'Dental Bonding',
        description: 'Tooth-colored material used to improve the appearance of minor chips, cracks or discoloration.',
        icon: '🪄',
        recommendedSpecialty: 'Cosmetic Dentistry',
      },
      {
        id: 'Tooth & Gum Contouring',
        title: 'Tooth & Gum Contouring',
        description: 'Procedures that reshape selected tooth or gum areas to improve smile symmetry.',
        icon: '✨',
        recommendedSpecialty: 'Cosmetic Dentistry',
      },
    ],
  },
  {
    categoryName: 'RESTORATIVE CARE',
    badgeText: 'TOOTH REPAIR',
    badgeVariant: 'secondary',
    services: [
      {
        id: 'Dental Implants',
        title: 'Dental Implants',
        description: 'A restorative option using an implant placed in the jawbone to support a replacement tooth.',
        icon: '🦾',
        recommendedSpecialty: 'Restorative / Prosthodontic / Occlusal Care',
      },
      {
        id: 'Fillings',
        title: 'Fillings',
        description: 'Restorative treatment for decayed or damaged teeth using composite or durable material.',
        icon: '🦷',
        recommendedSpecialty: 'General / Restorative Dentistry',
      },
      {
        id: 'Root Canal Consultation',
        title: 'Root Canal Consultation',
        description: 'Specialized assessment for infected tooth pulp or deep inner tooth inflammation.',
        icon: '🩺',
        recommendedSpecialty: 'General / Restorative Dentistry',
      },
      {
        id: 'Crown Consultation',
        title: 'Crown Consultation',
        description: 'Custom tooth cap consultation to restore shape, strength, and appearance of damaged teeth.',
        icon: '👑',
        recommendedSpecialty: 'Restorative / Prosthodontic / Occlusal Care',
      },
    ],
  },
  {
    categoryName: 'ORTHODONTIC CARE',
    badgeText: 'ALIGNMENT CARE',
    badgeVariant: 'neutral',
    services: [
      {
        id: 'Braces Consultation',
        title: 'Braces Consultation',
        description: 'Professional consultation for traditional or ceramic braces alignment.',
        icon: '🦷',
        recommendedSpecialty: 'General / Orthodontic Care',
      },
      {
        id: 'Clear Aligners Consultation',
        title: 'Clear Aligners Consultation',
        description: 'Assessment for custom transparent, removable aligners to straighten teeth.',
        icon: '✨',
        recommendedSpecialty: 'General / Orthodontic Care',
      },
    ],
  },
];

export const DENTAL_SERVICES: {
  id: ServiceType;
  title: string;
  description: string;
  icon: string;
  recommendedSpecialty: string;
}[] = CATEGORIZED_DENTAL_SERVICES.flatMap((cat) => cat.services);

export const VISUAL_INPUT_CONFIGS: Record<ConcernType, VisualInputConfig> = {
  'Bruxism & Jaw Health': {
    mediaType: 'video',
    title: 'Optional: Record or Upload a Short Jaw Movement Video',
    description: 'Demonstrate opening, closing, or side-to-side jaw movement to help organize information for discussion with a dental professional.',
    instructions: [
      'Position camera at eye level with bright room lighting',
      'Slowly open your mouth wide twice, then close gently',
      'Keep video short (5 to 10 seconds)',
      'Visual check is strictly optional — core screening works without media',
    ],
  },
  'Tooth Pain & Cavity Concerns': {
    mediaType: 'photo',
    title: 'Optional: Take or Upload a Photo of Affected Tooth',
    description: 'Your photo helps organize information for discussion with a dental professional.',
    instructions: [
      'Ensure clear room lighting or indirect front light',
      'Hold camera steady and focused on the specific tooth',
      'Avoid camera flash glare on shiny enamel surfaces',
      'Do not include personal identification documents',
    ],
  },
  'Gum Health': {
    mediaType: 'photo',
    title: 'Optional: Take or Upload a Photo of Gums',
    description: 'Your photo helps organize information for discussion with a dental professional.',
    instructions: [
      'Gently retract lip to show the specific gum line area',
      'Use a bright, steady light source',
      'Focus clearly on the gum tissue border',
    ],
  },
  'Tooth Sensitivity': {
    mediaType: 'none',
    title: 'No Visual Input Required by Default',
    description: 'Tooth sensitivity is primarily evaluated through symptom triggers and temperature response questions.',
    instructions: [],
  },
  'Tooth Wear': {
    mediaType: 'photo',
    title: 'Optional: Take or Upload Front / Side Mouth Photos',
    description: 'Upload a photo showing flattened tooth edges, minor chips, or transparent enamel borders.',
    instructions: [
      'Smile naturally showing upper and lower front tooth edges',
      'Avoid harsh glare on front surfaces',
      'Keep camera still for crisp detail',
    ],
  },
  'Cracked / Chipped Tooth': {
    mediaType: 'photo',
    title: 'Optional: Take or Upload a Photo of Cracked Tooth',
    description: 'Capture the cracked or chipped tooth edge to assist your dentist during consultation.',
    instructions: [
      'Focus clearly on the chipped or fractured tooth surface',
      'Ensure good lighting without harsh shadows',
    ],
  },
  'Oral Ulcer Concerns': {
    mediaType: 'photo',
    title: 'Optional: Take or Upload a Photo of Mouth Sore',
    description: 'Provide a clear close-up image of the tender ulcer or sore inside cheek or lip.',
    instructions: [
      'Use clear, soft lighting',
      'Keep camera focused on the localized sore',
    ],
  },
  'Jaw / TMJ Symptoms': {
    mediaType: 'video',
    title: 'Optional: Record or Upload Short Jaw Movement Video',
    description: 'Record 5 seconds showing jaw movement when opening wide or shifting side to side.',
    instructions: [
      'Position head straight in good lighting',
      'Record 5 seconds of slow jaw movement',
    ],
  },
  'Bad Breath': {
    mediaType: 'none',
    title: 'No Visual Upload Required',
    description: 'Bad breath assessment is based entirely on your symptom questionnaire response.',
    instructions: ['Proceed directly to your AI-assisted screening summary'],
  },
  'Dry Mouth': {
    mediaType: 'none',
    title: 'No Visual Upload Required',
    description: 'Dry mouth assessment relies on your symptom questionnaire response.',
    instructions: ['Proceed directly to your AI-assisted screening summary'],
  },
  'Wisdom Tooth Concerns': {
    mediaType: 'photo',
    title: 'Optional: Photo of Back Jaw / Gum Area',
    description: 'Provide an optional photo of the back jaw area if swollen.',
    instructions: ['Use good lighting', 'Focus on back molar area'],
  },
  'Enamel Damage': {
    mediaType: 'photo',
    title: 'Optional: Photo of Enamel Wear / Erosion',
    description: 'Upload a photo showing front tooth surface changes.',
    instructions: ['Avoid bright flash glare', 'Focus on front surfaces'],
  },
  'Swollen / Painful Gums': {
    mediaType: 'photo',
    title: 'Optional: Photo of Swollen Gum Area',
    description: 'Provide a photo of the localized swollen gum bump or puffiness.',
    instructions: ['Retract lip gently', 'Ensure good lighting'],
  },
  'Other Dental Concern': {
    mediaType: 'photo',
    title: 'Optional: Take or Upload a Photo of Your Concern',
    description: 'Upload a photo if relevant to your dental concern.',
    instructions: ['Ensure good lighting', 'Focus on the specific area of concern'],
  },
};

export const CONCERN_QUESTIONS: Record<ConcernType, Question[]> = {
  'Bruxism & Jaw Health': [
    {
      id: 101,
      concern: 'Bruxism & Jaw Health',
      text: 'Do you wake up with morning jaw stiffness or muscle soreness?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Sometimes (1-2 days/week)', value: 2 },
        { label: 'Often (Most mornings)', value: 4 },
      ],
    },
    {
      id: 102,
      concern: 'Bruxism & Jaw Health',
      text: 'Do you experience temple or head discomfort upon waking up?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Occasionally', value: 2 },
        { label: 'Frequently', value: 4 },
      ],
    },
    {
      id: 103,
      concern: 'Bruxism & Jaw Health',
      text: 'Do you clench your teeth during the day while stressed, driving, or working?',
      category: 'behavior',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Sometimes', value: 2 },
        { label: 'Frequently', value: 4 },
      ],
    },
    {
      id: 104,
      concern: 'Bruxism & Jaw Health',
      text: 'Has a partner or family member mentioned hearing you grind your teeth during sleep?',
      category: 'behavior',
      options: [
        { label: 'No / Unsure', value: 0 },
        { label: 'Occasional noise reported', value: 2 },
        { label: 'Loud grinding frequently reported', value: 4 },
      ],
    },
    {
      id: 105,
      concern: 'Bruxism & Jaw Health',
      text: 'Do you experience jaw clicking, popping, or discomfort when opening your mouth?',
      category: 'physical',
      options: [
        { label: 'No clicking or discomfort', value: 0 },
        { label: 'Painless clicking sounds', value: 2 },
        { label: 'Clicking accompanied by soreness', value: 4 },
      ],
    },
    {
      id: 106,
      concern: 'Bruxism & Jaw Health',
      text: 'Have you noticed your tooth edges appearing flattened, chipped, or worn down?',
      category: 'physical',
      options: [
        { label: 'No visible wear', value: 0 },
        { label: 'Mild flattening', value: 2 },
        { label: 'Noticeable wear or shortened teeth', value: 4 },
      ],
    },
  ],

  'Tooth Pain & Cavity Concerns': [
    {
      id: 201,
      concern: 'Tooth Pain & Cavity Concerns',
      text: 'Where is your tooth pain or discomfort located?',
      category: 'symptom',
      options: [
        { label: 'Single specific tooth', value: 2 },
        { label: 'One general jaw area / quadrant', value: 3 },
        { label: 'Multiple teeth across mouth', value: 4 },
      ],
    },
    {
      id: 202,
      concern: 'Tooth Pain & Cavity Concerns',
      text: 'How long have you been experiencing this tooth pain?',
      category: 'behavior',
      options: [
        { label: 'Started today / yesterday', value: 1 },
        { label: 'A few days to 1 week', value: 2 },
        { label: 'More than 2 weeks', value: 4 },
      ],
    },
    {
      id: 203,
      concern: 'Tooth Pain & Cavity Concerns',
      text: 'Does cold liquid, ice cream, or hot drinks trigger lingering pain?',
      category: 'symptom',
      options: [
        { label: 'No sensitivity', value: 0 },
        { label: 'Brief zinging (seconds)', value: 2 },
        { label: 'Lingering pain (minutes after)', value: 4 },
      ],
    },
    {
      id: 204,
      concern: 'Tooth Pain & Cavity Concerns',
      text: 'Do you experience sharp pain when biting down or chewing food?',
      category: 'symptom',
      options: [
        { label: 'No biting pain', value: 0 },
        { label: 'Occasional discomfort when chewing hard food', value: 2 },
        { label: 'Sharp pain upon every bite', value: 4 },
      ],
    },
    {
      id: 205,
      concern: 'Tooth Pain & Cavity Concerns',
      text: 'Have you noticed a dark spot, hole, or visible white chalky area on the tooth?',
      category: 'physical',
      options: [
        { label: 'No visible changes', value: 0 },
        { label: 'Slight discoloration spot', value: 2 },
        { label: 'Noticeable hole or dark cavity', value: 4 },
      ],
    },
  ],

  'Gum Health': [
    {
      id: 301,
      concern: 'Gum Health',
      text: 'Do your gums bleed during brushing or flossing?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Occasionally (pink toothbrush)', value: 2 },
        { label: 'Frequently (visible bleeding)', value: 4 },
      ],
    },
    {
      id: 302,
      concern: 'Gum Health',
      text: 'Have you noticed swelling, puffiness, or redness in your gums?',
      category: 'physical',
      options: [
        { label: 'Firm pink healthy gums', value: 0 },
        { label: 'Slight red edge swelling', value: 2 },
        { label: 'Puffy, swollen, red gums', value: 4 },
      ],
    },
    {
      id: 303,
      concern: 'Gum Health',
      text: 'Are your gums tender or sore to touch?',
      category: 'symptom',
      options: [
        { label: 'Never tender', value: 0 },
        { label: 'Slightly sensitive', value: 2 },
        { label: 'Sore and painful to touch', value: 4 },
      ],
    },
    {
      id: 304,
      concern: 'Gum Health',
      text: 'Have your gums started pulling back, exposing longer tooth roots?',
      category: 'physical',
      options: [
        { label: 'No recession noticed', value: 0 },
        { label: 'Slight recession in specific teeth', value: 2 },
        { label: 'Noticeable root exposure', value: 4 },
      ],
    },
  ],

  'Tooth Sensitivity': [
    {
      id: 401,
      concern: 'Tooth Sensitivity',
      text: 'Do your teeth feel sensitive when drinking cold water or ice drinks?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Mild zinging', value: 2 },
        { label: 'Sharp intense pain', value: 4 },
      ],
    },
    {
      id: 402,
      concern: 'Tooth Sensitivity',
      text: 'Does hot coffee, tea, or warm soup trigger tooth discomfort?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Sometimes', value: 2 },
        { label: 'Often', value: 4 },
      ],
    },
    {
      id: 403,
      concern: 'Tooth Sensitivity',
      text: 'Do sweet or acidic foods cause a sudden sensitivity reaction?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Sometimes', value: 2 },
        { label: 'Often', value: 4 },
      ],
    },
    {
      id: 404,
      concern: 'Tooth Sensitivity',
      text: 'Does sensitivity occur when toothbrush bristles touch near the gumline?',
      category: 'physical',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Sometimes', value: 2 },
        { label: 'Often', value: 4 },
      ],
    },
  ],

  'Tooth Wear': [
    {
      id: 501,
      concern: 'Tooth Wear',
      text: 'Do your teeth appear flattened, shorter, or uneven along biting edges?',
      category: 'physical',
      options: [
        { label: 'No wear noticed', value: 0 },
        { label: 'Slightly flattened edges', value: 2 },
        { label: 'Noticeably short or flattened teeth', value: 4 },
      ],
    },
    {
      id: 502,
      concern: 'Tooth Wear',
      text: 'Are the biting edges of your front teeth chipped, rough, or notched?',
      category: 'physical',
      options: [
        { label: 'Smooth intact edges', value: 0 },
        { label: 'Minor rough spots', value: 2 },
        { label: 'Visible chips or notched edges', value: 4 },
      ],
    },
    {
      id: 503,
      concern: 'Tooth Wear',
      text: 'Do your front tooth edges look thin or semi-transparent under light?',
      category: 'physical',
      options: [
        { label: 'Opaque healthy enamel', value: 0 },
        { label: 'Slightly see-through edges', value: 2 },
        { label: 'Clearly transparent edges', value: 4 },
      ],
    },
  ],

  'Cracked / Chipped Tooth': [
    {
      id: 601,
      concern: 'Cracked / Chipped Tooth',
      text: 'Did a crack or chip occur suddenly while biting hard food or due to trauma?',
      category: 'symptom',
      options: [
        { label: 'No trauma / gradual wear', value: 1 },
        { label: 'Biting hard food', value: 3 },
        { label: 'Sudden impact / trauma', value: 4 },
      ],
    },
    {
      id: 602,
      concern: 'Cracked / Chipped Tooth',
      text: 'Do you experience sharp pain when biting down and releasing your bite?',
      category: 'symptom',
      options: [
        { label: 'No pain on biting', value: 0 },
        { label: 'Occasional sharp zinging on release', value: 3 },
        { label: 'Severe pain every time bite is released', value: 4 },
      ],
    },
    {
      id: 603,
      concern: 'Cracked / Chipped Tooth',
      text: 'Can you see or feel a jagged edge or missing piece of tooth structure?',
      category: 'physical',
      options: [
        { label: 'Cannot see or feel', value: 0 },
        { label: 'Sharp tongue feeling', value: 2 },
        { label: 'Visible missing piece or crack line', value: 4 },
      ],
    },
  ],

  'Oral Ulcer Concerns': [
    {
      id: 701,
      concern: 'Oral Ulcer Concerns',
      text: 'Where is the sore or tender spot located inside your mouth?',
      category: 'physical',
      options: [
        { label: 'Inside lip or cheek', value: 2 },
        { label: 'On tongue surface or side', value: 3 },
        { label: 'Roof of mouth / palate', value: 3 },
      ],
    },
    {
      id: 702,
      concern: 'Oral Ulcer Concerns',
      text: 'How long has this mouth sore been present?',
      category: 'behavior',
      options: [
        { label: 'Under 1 week', value: 1 },
        { label: '1 to 2 weeks', value: 2 },
        { label: 'More than 2 weeks continuously', value: 4 },
      ],
    },
  ],

  'Bad Breath': [
    {
      id: 801,
      concern: 'Bad Breath',
      text: 'How long have you noticed persistent bad breath or unpleasant taste?',
      category: 'behavior',
      options: [
        { label: 'Recent / occasional', value: 1 },
        { label: 'Several weeks', value: 2 },
        { label: 'Ongoing persistent problem', value: 4 },
      ],
    },
    {
      id: 802,
      concern: 'Bad Breath',
      text: 'When was your last professional dental scaling / cleaning?',
      category: 'behavior',
      options: [
        { label: 'Within last 6 months', value: 0 },
        { label: '6 to 12 months ago', value: 2 },
        { label: 'Over 1 year ago / Never', value: 4 },
      ],
    },
  ],

  'Dry Mouth': [
    {
      id: 901,
      concern: 'Dry Mouth',
      text: 'Do you frequently experience dry mouth, lack of saliva, or difficulty swallowing dry foods?',
      category: 'symptom',
      options: [
        { label: 'Rarely', value: 0 },
        { label: 'Sometimes', value: 2 },
        { label: 'Constantly dry', value: 4 },
      ],
    },
  ],

  'Wisdom Tooth Concerns': [
    {
      id: 1001,
      concern: 'Wisdom Tooth Concerns',
      text: 'Do you feel pain, pressure, or swollen gum flaps near your back molars?',
      category: 'symptom',
      options: [
        { label: 'No back jaw pain', value: 0 },
        { label: 'Occasional tightness', value: 2 },
        { label: 'Swollen tender gum behind last molar', value: 4 },
      ],
    },
  ],

  'Jaw / TMJ Symptoms': [
    {
      id: 1101,
      concern: 'Jaw / TMJ Symptoms',
      text: 'Do you hear clicking or popping sounds when opening wide?',
      category: 'symptom',
      options: [
        { label: 'Never', value: 0 },
        { label: 'Painless clicking', value: 2 },
        { label: 'Painful clicking or popping', value: 4 },
      ],
    },
  ],

  'Enamel Damage': [
    {
      id: 1201,
      concern: 'Enamel Damage',
      text: 'Have you noticed yellowing dentin exposure or enamel thinning?',
      category: 'physical',
      options: [
        { label: 'No enamel changes', value: 0 },
        { label: 'Slight thinning', value: 2 },
        { label: 'Noticeable enamel erosion', value: 4 },
      ],
    },
  ],

  'Swollen / Painful Gums': [
    {
      id: 1301,
      concern: 'Swollen / Painful Gums',
      text: 'Is there a specific swollen bump or painful area on your gums?',
      category: 'physical',
      options: [
        { label: 'No swollen bump', value: 0 },
        { label: 'Mild puffiness', value: 2 },
        { label: 'Painful swollen localized area', value: 4 },
      ],
    },
  ],

  'Other Dental Concern': [
    {
      id: 1401,
      concern: 'Other Dental Concern',
      text: 'Do you experience dental symptoms that warrant professional evaluation?',
      category: 'symptom',
      options: [
        { label: 'Mild symptom', value: 1 },
        { label: 'Moderate symptom', value: 2 },
        { label: 'Significant symptom', value: 4 },
      ],
    },
  ],
};

export const SCREENING_QUESTIONS: Question[] = CONCERN_QUESTIONS['Bruxism & Jaw Health'];

export const MOCK_CLINICS: DentalClinic[] = [
  {
    id: 'clinic-1',
    name: 'SmileCare Advanced Dental & TMJ Center',
    type: 'Hospital',
    location: 'Indiranagar, Bengaluru',
    address: '100ft Rd, Indiranagar, Bengaluru, KA 560038',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 240,
    phone: '+91 80 4123 9000',
    openingHours: 'Mon - Sat: 08:30 AM - 08:00 PM',
    departments: [
      'TMJ & Orofacial Pain Department',
      'General & Restorative Dentistry',
      'Periodontal & Gum Care',
      'Cosmetic Dentistry',
    ],
    services: [
      'Night Guard / Bruxism Care',
      'Teeth Cleaning',
      'Teeth Whitening',
      'Tooth Restoration',
      'Gum Care',
      'Dental Consultation',
    ],
    consultationTypes: ['In-Person', 'Video Consultation'],
    about:
      'SmileCare is a multi-specialty dental hospital featuring advanced digital bite evaluation, 3D intraoral scanning, and dedicated care continuity protocols.',
    doctors: [],
  },
  {
    id: 'clinic-2',
    name: 'Kulkarni Precision Occlusal Hub',
    type: 'Clinic',
    location: 'Koramangala, Bengaluru',
    address: '5th Block, Koramangala, Bengaluru, KA 560095',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    reviewCount: 175,
    phone: '+91 80 2553 4411',
    openingHours: 'Mon - Sat: 09:00 AM - 07:30 PM',
    departments: [
      'Restorative & Prosthodontic Department',
      'General & Preventive Dental Department',
    ],
    services: [
      'Night Guard / Bruxism Care',
      'Tooth Restoration',
      'Teeth Cleaning',
      'Dental Consultation',
    ],
    consultationTypes: ['In-Person'],
    about:
      'Specialized in tooth surface preservation, custom nightguard fitting, enamel wear restoration, and precision occlusal balancing.',
    doctors: [],
  },
  {
    id: 'clinic-3',
    name: 'Apex Dental Care & Periodontal Institute',
    type: 'Dental Hub',
    location: 'Jayanagar, Bengaluru',
    address: '4th Block, Jayanagar, Bengaluru, KA 560011',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    reviewCount: 198,
    phone: '+91 80 4112 8822',
    openingHours: 'Mon - Sun: 09:00 AM - 08:30 PM',
    departments: [
      'Periodontal & Gum Care Clinic',
      'Cosmetic Dentistry & Whitening Center',
      'Emergency Dental Care',
    ],
    services: [
      'Gum Care',
      'Teeth Cleaning',
      'Teeth Whitening',
      'Dental Consultation',
    ],
    consultationTypes: ['In-Person', 'Video Consultation'],
    about:
      'Premier gum health center providing laser periodontal therapy, professional prophylaxis, and cosmetic whitening treatments.',
    doctors: [],
  },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Menon',
    title: 'BDS, MDS - Orofacial Care & Occlusal Specialist',
    specialty: 'TMJ / Orofacial Pain / Occlusal Care',
    clinicId: 'clinic-1',
    clinic: 'SmileCare Advanced Dental & TMJ Center',
    clinicAddress: 'Indiranagar 100ft Rd, Bengaluru',
    experienceYears: 11,
    consultationFee: 800,
    rating: 4.9,
    reviewCount: 128,
    isVerified: true,
    availableToday: true,
    consultationType: ['In-Person', 'Video Consultation'],
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    about:
      'Dr. Ananya Menon focuses on early symptom evaluation, bite alignment assessment, TMJ muscle relaxation, and structured post-consultation care monitoring.',
    education: [
      'MDS in Prosthodontics & Crown-Bridge - Manipal University',
      'BDS - Rajiv Gandhi University of Health Sciences',
    ],
    areasOfCare: ['Bruxism & Jaw Tension', 'TMJ Symptoms', 'Occlusal Assessment', 'Custom Nightguards'],
    relevantConcerns: ['Bruxism & Jaw Health', 'Jaw / TMJ Symptoms', 'Tooth Wear', 'Enamel Damage'],
    relevantServices: ['Night Guard / Bruxism Care', 'Dental Consultation', 'Routine Dental Check-up', 'Crown Consultation'],
    availableSlots: [
      {
        date: 'Today',
        slots: ['09:00 AM', '10:30 AM', '02:00 PM', '05:30 PM'],
      },
      {
        date: 'Tomorrow',
        slots: ['10:00 AM', '11:30 AM', '03:30 PM', '06:00 PM'],
      },
      {
        date: 'Sep 20, 2026',
        slots: ['09:30 AM', '01:00 PM', '04:30 PM'],
      },
    ],
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Kulkarni',
    title: 'BDS, MDS - Prosthodontist & Enamel Specialist',
    specialty: 'Restorative / Prosthodontic / Occlusal Care',
    clinicId: 'clinic-2',
    clinic: 'Kulkarni Precision Occlusal Hub',
    clinicAddress: 'Koramangala 5th Block, Bengaluru',
    experienceYears: 14,
    consultationFee: 1000,
    rating: 4.8,
    reviewCount: 94,
    isVerified: true,
    availableToday: true,
    consultationType: ['In-Person'],
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    about:
      'Dr. Rajesh Kulkarni provides structured evaluations for patients experiencing tooth wear, enamel thinning, chipped tooth edges, and bite friction.',
    education: ['MDS Prosthodontics - AIIMS New Delhi', 'BDS - Government Dental College Mumbai'],
    areasOfCare: ['Tooth Wear Repair', 'Enamel Damage', 'Chipped Teeth', 'Custom Nightguards'],
    relevantConcerns: ['Tooth Wear', 'Cracked / Chipped Tooth', 'Enamel Damage', 'Bruxism & Jaw Health'],
    relevantServices: ['Dental Implants', 'Crown Consultation', 'Dental Veneers', 'Dental Bonding', 'Tooth Restoration', 'Tooth & Gum Contouring', 'Fillings', 'Dental Consultation'],
    availableSlots: [
      {
        date: 'Today',
        slots: ['11:00 AM', '03:00 PM', '06:30 PM'],
      },
      {
        date: 'Tomorrow',
        slots: ['09:30 AM', '12:00 PM', '04:00 PM'],
      },
    ],
  },
  {
    id: 'doc-3',
    name: 'Dr. Meera Nambiar',
    title: 'BDS, MDS - Periodontist & Gum Specialist',
    specialty: 'Periodontal / Gum Care',
    clinicId: 'clinic-3',
    clinic: 'Apex Dental Care & Periodontal Institute',
    clinicAddress: 'Jayanagar 4th Block, Bengaluru',
    experienceYears: 10,
    consultationFee: 750,
    rating: 4.9,
    reviewCount: 112,
    isVerified: true,
    availableToday: true,
    consultationType: ['In-Person', 'Video Consultation'],
    image: 'https://images.unsplash.com/photo-1594824813566-78a99478f001?auto=format&fit=crop&q=80&w=400',
    about:
      'Dr. Meera Nambiar specializes in early gum screening, bleeding gum therapy, persistent bad breath diagnosis, and soft tissue health maintenance.',
    education: ['MDS Periodontics - RGUHS Bengaluru', 'BDS - Amrita School of Dentistry'],
    areasOfCare: ['Gum Bleeding & Swelling', 'Swollen / Painful Gums', 'Bad Breath Management', 'Teeth Cleaning'],
    relevantConcerns: ['Gum Health', 'Bad Breath', 'Swollen / Painful Gums', 'Oral Ulcer Concerns'],
    relevantServices: ['Teeth Cleaning & Scaling', 'Teeth Cleaning', 'Tooth & Gum Contouring', 'Gum Care', 'Routine Dental Check-up', 'Dental Consultation'],
    availableSlots: [
      {
        date: 'Today',
        slots: ['10:00 AM', '01:30 PM', '04:30 PM'],
      },
      {
        date: 'Tomorrow',
        slots: ['09:00 AM', '11:00 AM', '03:00 PM'],
      },
    ],
  },
  {
    id: 'doc-4',
    name: 'Dr. Vikramaditya Rao',
    title: 'BDS, MDS - Endodontist & Restorative Dentist',
    specialty: 'General / Restorative Dentistry',
    clinicId: 'clinic-1',
    clinic: 'SmileCare Advanced Dental & TMJ Center',
    clinicAddress: 'Indiranagar 100ft Rd, Bengaluru',
    experienceYears: 12,
    consultationFee: 700,
    rating: 4.8,
    reviewCount: 156,
    isVerified: true,
    availableToday: false,
    consultationType: ['In-Person'],
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    about:
      'Dr. Vikramaditya Rao focuses on gentle cavity treatments, tooth pain relief, temperature sensitivity care, and composite restorations.',
    education: ['MDS Endodontics - SDM College of Dental Sciences', 'BDS - RGUHS'],
    areasOfCare: ['Tooth Pain Evaluation', 'Cavity Fillings', 'Sensitivity Management', 'Cracked Tooth Repair'],
    relevantConcerns: ['Tooth Pain & Cavity Concerns', 'Tooth Sensitivity', 'Cracked / Chipped Tooth', 'Wisdom Tooth Concerns'],
    relevantServices: ['Root Canal Consultation', 'Fillings', 'Crown Consultation', 'Tooth Restoration', 'Teeth Cleaning & Scaling', 'Routine Dental Check-up', 'Dental Consultation'],
    availableSlots: [
      {
        date: 'Tomorrow',
        slots: ['10:30 AM', '02:00 PM', '05:00 PM'],
      },
      {
        date: 'Sep 20, 2026',
        slots: ['09:00 AM', '11:30 AM', '04:00 PM'],
      },
    ],
  },
  {
    id: 'doc-5',
    name: 'Dr. Shalini Gupta',
    title: 'BDS - Cosmetic & General Dentist',
    specialty: 'Cosmetic Dentistry',
    clinicId: 'clinic-3',
    clinic: 'Apex Dental Care & Periodontal Institute',
    clinicAddress: 'Jayanagar 4th Block, Bengaluru',
    experienceYears: 8,
    consultationFee: 600,
    rating: 4.9,
    reviewCount: 88,
    isVerified: true,
    availableToday: true,
    consultationType: ['In-Person', 'Video Consultation'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    about:
      'Dr. Shalini Gupta provides gentle professional teeth cleaning, laser whitening, and preventive oral health guidance.',
    education: ['BDS - Maulana Azad Institute of Dental Sciences, New Delhi'],
    areasOfCare: ['Teeth Whitening', 'Ultrasonic Scaling', 'Preventive Checkups', 'Smile Enhancements'],
    relevantConcerns: ['Tooth Sensitivity', 'Tooth Wear', 'Bad Breath', 'Enamel Damage'],
    relevantServices: ['Teeth Whitening', 'Dental Veneers', 'Dental Bonding', 'Tooth & Gum Contouring', 'Teeth Cleaning & Scaling', 'Braces Consultation', 'Clear Aligners Consultation', 'Teeth Cleaning', 'Routine Dental Check-up', 'Dental Consultation'],
    availableSlots: [
      {
        date: 'Today',
        slots: ['11:30 AM', '02:30 PM', '06:00 PM'],
      },
      {
        date: 'Tomorrow',
        slots: ['10:00 AM', '01:00 PM', '04:30 PM'],
      },
    ],
  },
];

// Link Doctors into Clinics
MOCK_CLINICS[0].doctors = [MOCK_DOCTORS[0], MOCK_DOCTORS[3]];
MOCK_CLINICS[1].doctors = [MOCK_DOCTORS[1]];
MOCK_CLINICS[2].doctors = [MOCK_DOCTORS[2], MOCK_DOCTORS[4]];

export const INITIAL_PATIENT_PROFILE: PatientProfile = {
  name: 'Mahesh Kumar',
  email: 'mahesh.kumar@example.com',
  phone: '+91 98765 43210',
  dateOfBirth: '1997-05-15',
  age: 29,
  mode: 'adult',
  gender: 'Male',
  location: 'Bengaluru, Karnataka',
  mouthguardConnected: false,
  mouthguardBatteryPercent: 92,
  mouthguardLastSynced: 'Today, 08:30 AM',
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    doctorId: 'doc-1',
    doctorName: 'Dr. Ananya Menon',
    doctorSpecialty: 'TMJ / Orofacial Pain / Occlusal Care',
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    clinicName: 'SmileCare Advanced Dental & TMJ Center',
    clinicAddress: 'Indiranagar 100ft Rd, Bengaluru',
    date: '2026-09-20',
    time: '10:30 AM',
    type: 'In-Person',
    status: 'Upcoming',
    patientNotes: 'Bruxism & Jaw Health screening follow-up — morning jaw stiffness and daytime clenching reported.',
    screeningContext: 'Bruxism & Jaw Health screening summary indicated HIGHER CONCERN for morning stiffness and temple discomfort.',
    fee: 800,
    createdAt: '2026-09-17',
  },
];

export const INITIAL_SCREENING_RESULT: ScreeningResult = {
  id: 'scr-789',
  date: '2026-09-18',
  concern: 'Bruxism & Jaw Health',
  overallScore: 68,
  indicationLevel: 'HIGHER CONCERN',
  symptomsScore: 65,
  hasVisualInput: true,
  visualInputType: 'video',
  attachedVisualInput: {
    type: 'video',
    fileUrl: 'jaw_movement_sample.mp4',
    fileName: 'jaw_movement_clip.mp4',
    timestamp: '18 Sept 2026, 09:15 AM',
  },
  whyHighlighted: [
    'Morning jaw stiffness reported consistently',
    'Frequent daytime clenching reported',
    'Temple discomfort upon waking reported',
    'Optional jaw movement video submitted for evaluation',
  ],
  recommendedNextStep: 'Consider discussing these symptoms with a dental professional.',
  recommendations: [
    'Schedule a consultation for an in-person occlusal & TMJ evaluation.',
    'Practice daytime jaw relaxation techniques and avoid teeth grinding.',
    'Log symptom trends using OralSense daily symptom monitoring.',
  ],
};

export const MOCK_7DAY_SYMPTOMS: SymptomLogEntry[] = [
  { id: 'log-1', date: '2026-09-12', dayLabel: 'Mon', concernCategory: 'Bruxism & Jaw Health', primaryValue: 6, secondaryValue: 5, tertiaryValue: 4, notes: 'Morning jaw tightness noted' },
  { id: 'log-2', date: '2026-09-13', dayLabel: 'Tue', concernCategory: 'Bruxism & Jaw Health', primaryValue: 5, secondaryValue: 4, tertiaryValue: 3 },
  { id: 'log-3', date: '2026-09-14', dayLabel: 'Wed', concernCategory: 'Bruxism & Jaw Health', primaryValue: 5, secondaryValue: 4, tertiaryValue: 3 },
  { id: 'log-4', date: '2026-09-15', dayLabel: 'Thu', concernCategory: 'Bruxism & Jaw Health', primaryValue: 4, secondaryValue: 3, tertiaryValue: 2 },
  { id: 'log-5', date: '2026-09-16', dayLabel: 'Fri', concernCategory: 'Bruxism & Jaw Health', primaryValue: 3, secondaryValue: 2, tertiaryValue: 2 },
  { id: 'log-6', date: '2026-09-17', dayLabel: 'Sat', concernCategory: 'Bruxism & Jaw Health', primaryValue: 3, secondaryValue: 2, tertiaryValue: 1 },
  { id: 'log-7', date: '2026-09-18', dayLabel: 'Sun', concernCategory: 'Bruxism & Jaw Health', primaryValue: 2, secondaryValue: 1, tertiaryValue: 1, notes: 'Felt much better today' },
];

export const MOCK_FOLLOW_UP: FollowUpSubmission = {
  id: 'fol-202',
  date: '2026-09-18',
  appointmentId: 'apt-101',
  painLevel: 1,
  sensitivityLevel: 2,
  hasNewSymptoms: false,
  notes: 'Jaw tightness decreased following daytime relaxation exercises.',
  nextFollowUpDate: '24 September 2026',
};

export const MOCK_PRACTICE_PATIENTS: PracticePatient[] = [
  {
    id: 'pat-1',
    name: 'Mahesh Kumar',
    age: 29,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'mahesh.k@example.com',
    concern: 'Bruxism & Jaw Health',
    screeningDate: '18 Sept 2026',
    screeningIndication: 'HIGHER CONCERN',
    screeningScore: 68,
    hasVisualInput: true,
    visualInputType: 'video',
    screeningAnswers: [
      { question: 'Morning jaw stiffness?', answer: 'Often (Most mornings)' },
      { question: 'Temple discomfort on waking?', answer: 'Frequently' },
      { question: 'Daytime clenching?', answer: 'Frequently' },
    ],
    whyHighlighted: [
      'Morning jaw tightness reported consistently',
      'Daytime tension noted during focus',
      'Jaw movement video submitted for clinician review',
    ],
    appointmentDate: '20 Sept 2026',
    appointmentTime: '10:30 AM',
    appointmentStatus: 'Scheduled',
    monitoringStatus: 'Active',
    followUpStatus: 'Due',
    timelineStage: 'Appointment',
    clinicalNotes: [
      {
        id: 'cn-1',
        date: '18 Sept 2026',
        author: 'Dr. Ananya Menon',
        observation: 'Screening summary and jaw video received. Patient reports morning masseter tightness.',
        recommendation: 'Evaluate occlusal contacts and discuss custom nightguard fitting.',
        followUpDate: '24 Sept 2026',
      },
    ],
    symptomHistory: MOCK_7DAY_SYMPTOMS,
  },
  {
    id: 'pat-2',
    name: 'Priya Verma',
    age: 34,
    gender: 'Female',
    phone: '+91 98123 45678',
    email: 'priya.verma@example.com',
    concern: 'Tooth Pain & Cavity Concerns',
    screeningDate: '17 Sept 2026',
    screeningIndication: 'HIGHER CONCERN',
    screeningScore: 78,
    hasVisualInput: true,
    visualInputType: 'photo',
    screeningAnswers: [
      { question: 'Discomfort when chewing?', answer: 'Sharp pain upon every bite' },
      { question: 'Lingering cold pain?', answer: 'Lingering pain' },
      { question: 'Visible dark spot noticed?', answer: 'Noticeable hole or dark cavity' },
    ],
    whyHighlighted: [
      'Frequent chewing pain reported',
      'Lingering cold sensitivity noted',
      'Tooth close-up photo attached',
    ],
    appointmentDate: '21 Sept 2026',
    appointmentTime: '02:00 PM',
    appointmentStatus: 'Scheduled',
    monitoringStatus: 'Pending',
    followUpStatus: 'Pending',
    timelineStage: 'Appointment',
    clinicalNotes: [],
    symptomHistory: [],
  },
];

export const generate30DayTelemetry = (): NightlyTelemetry[] => {
  const result: NightlyTelemetry[] = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const baseEvents = 18 + Math.floor(Math.sin(i * 0.4) * 8);
    const avgPress = 35 + Math.floor(Math.cos(i * 0.3) * 12);
    const peakPress = avgPress + 25 + Math.floor(Math.random() * 10);

    result.push({
      date: dateStr,
      sleepDurationMinutes: 420 + (i % 5) * 15,
      biteEventsCount: Math.max(5, baseEvents),
      avgPressurePercent: Math.min(85, Math.max(15, avgPress)),
      peakPressurePercent: Math.min(98, Math.max(40, peakPress)),
      avgEventDurationSec: Number((1.2 + (i % 3) * 0.3).toFixed(1)),
      restlessnessIndex: 20 + (i % 7) * 4,
      pressureTrend: [
        { time: '23:30', pressure: 10 },
        { time: '01:15', pressure: avgPress },
        { time: '03:00', pressure: peakPress },
        { time: '04:45', pressure: avgPress - 10 },
        { time: '06:15', pressure: 15 },
      ],
    });
  }
  return result;
};
