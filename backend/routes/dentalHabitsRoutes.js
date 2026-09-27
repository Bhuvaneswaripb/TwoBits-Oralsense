const express = require('express');
const router = express.Router();
const ChildProfile = require('../models/ChildProfile');
const DentalHabitLog = require('../models/DentalHabitLog');
const BrushReplacement = require('../models/BrushReplacement');

// Demo Catalog of Dental Essentials Products
const DEMO_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'OralSense Junior Soft Sonic Toothbrush',
    category: "Children's Toothbrushes",
    ageRange: '3-6 years',
    description: 'Ultra-soft tapered bristles with 2-minute zone pulse timer designed for gentle primary teeth cleaning.',
    price: 24.99,
    rating: 4.9,
    reviewCount: 128,
    recommendedFor: 'Early habit builders needing gentle gumline care',
    isDemoItem: true,
    features: [
      'Ultra-soft tapered bristles for delicate gums',
      '2-minute quadrant pulse timer',
      'Ergonomic non-slip child grip',
      'Rechargeable battery (up to 30 days use)',
    ],
  },
  {
    id: 'prod-2',
    name: 'Kids Smart Oscillating Power Brush',
    category: 'Electric Toothbrushes',
    ageRange: '6-12 years',
    description: 'Dual-speed gentle oscillating brush head with pressure sensor and quadrant timer.',
    price: 39.99,
    rating: 4.8,
    reviewCount: 94,
    recommendedFor: 'Developing permanent teeth and independent brushing',
    isDemoItem: true,
    features: [
      'Dual-speed gentle oscillating motion',
      'Visible pressure sensor to protect enamel',
      'Smart 2-minute zone guide timer',
      'Compatible with all soft replacement heads',
    ],
  },
  {
    id: 'prod-3',
    name: 'Mild Mint Fluoride Enamel Protection Toothpaste',
    category: 'Toothpaste',
    ageRange: '6+ years',
    description: 'Dentist-recommended 1450 ppm fluoride formula with low abrasivity to support enamel remineralization.',
    price: 6.49,
    rating: 4.9,
    reviewCount: 215,
    recommendedFor: 'Daily cavity prevention and enamel fortification',
    isDemoItem: true,
    features: [
      '1450 ppm active fluoride enamel defense',
      'Mild kid-approved mint flavor',
      'Low RDA abrasivity rating',
      'SLS-free gentle foam formula',
    ],
  },
  {
    id: 'prod-4',
    name: 'Gentle Care Kids Fluoride Free Starter Gel',
    category: 'Toothpaste',
    ageRange: '2-5 years',
    description: 'Natural berry-flavored low-foam gel formulated safely for young children learning to spit.',
    price: 5.99,
    rating: 4.7,
    reviewCount: 86,
    recommendedFor: 'Toddlers & early brushers starting daily routine',
    isDemoItem: true,
    features: [
      'Safe if swallowed starter gel',
      'Natural wild berry flavor',
      'Xylitol enriched to discourage plaque',
      'Free from artificial dyes and preservatives',
    ],
  },
  {
    id: 'prod-5',
    name: 'Ergonomic Handle Kids Flossers (48 Pack)',
    category: 'Flossers',
    ageRange: '4-12 years',
    description: 'Shred-resistant PTFE floss string with easy-grip safety handles in fun colors.',
    price: 7.99,
    rating: 4.9,
    reviewCount: 310,
    recommendedFor: 'Interdental cleaning between tight back teeth',
    isDemoItem: true,
    features: [
      'Shred-resistant fluoride coated floss',
      'Child-safe rounded pick tip',
      'Easy-grip ergonomic animal handle',
      '48 individually sealed flossers',
    ],
  },
  {
    id: 'prod-6',
    name: 'Ultra-Soft Replacement Brush Heads (4 Pack)',
    category: 'Replacement Brush Heads',
    ageRange: 'All Ages',
    description: 'Color-fading indicator bristles that signal when 3-month replacement interval is due.',
    price: 18.99,
    rating: 4.8,
    reviewCount: 164,
    recommendedFor: 'Quarterly brush head replacement reminder routine',
    isDemoItem: true,
    features: [
      'Color fading indicator bristles',
      'Ultra-soft micro-fine filament bristles',
      'Snap-on universal fit shaft',
      '4 color-coded identification rings',
    ],
  },
];

// Helper to calculate date strings
const getTodayStr = () => new Date().toISOString().split('T')[0];

const addMonths = (dateStr, months) => {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
};

// 1. GET /api/dental-habits/profile/:userId
router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId || 'pat-default';
    let profiles = await ChildProfile.find({ userId }).sort({ createdAt: -1 });

    // Fallback default child profile if none exists in DB
    if (!profiles || profiles.length === 0) {
      const defaultProfile = await ChildProfile.create({
        userId,
        name: 'Leo',
        age: 6,
        avatar: 'star',
        morningReminderTime: '08:00',
        eveningReminderTime: '20:00',
      });
      profiles = [defaultProfile];
    }

    res.json({ success: true, data: profiles[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. POST /api/dental-habits/profile
router.post('/profile', async (req, res) => {
  try {
    const { userId = 'pat-default', id, _id, name, age, avatar, morningReminderTime, eveningReminderTime } = req.body;
    
    let profile;
    const targetId = id || _id;
    if (targetId) {
      profile = await ChildProfile.findByIdAndUpdate(
        targetId,
        { name, age, avatar, morningReminderTime, eveningReminderTime },
        { new: true }
      );
    }

    if (!profile) {
      profile = await ChildProfile.create({
        userId,
        name: name || 'Leo',
        age: Number(age) || 6,
        avatar: avatar || 'star',
        morningReminderTime: morningReminderTime || '08:00',
        eveningReminderTime: eveningReminderTime || '20:00',
      });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET /api/dental-habits/today/:childId
router.get('/today/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const today = getTodayStr();

    let log = await DentalHabitLog.findOne({ childId, date: today });
    if (!log) {
      log = {
        userId: 'pat-default',
        childId,
        date: today,
        morningBrushing: false,
        morningTongue: false,
        eveningBrushing: false,
        eveningFloss: false,
        totalBrushingSeconds: 0,
        completedSessions: 0,
      };
    }

    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. POST /api/dental-habits/log
router.post('/log', async (req, res) => {
  try {
    const {
      userId = 'pat-default',
      childId,
      date = getTodayStr(),
      morningBrushing,
      morningTongue,
      eveningBrushing,
      eveningFloss,
      totalBrushingSeconds = 0,
      completedSessions = 0,
    } = req.body;

    if (!childId) {
      return res.status(400).json({ success: false, message: 'childId is required' });
    }

    const log = await DentalHabitLog.findOneAndUpdate(
      { childId, date },
      {
        userId,
        childId,
        date,
        morningBrushing,
        morningTongue,
        eveningBrushing,
        eveningFloss,
        totalBrushingSeconds,
        completedSessions,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. GET /api/dental-habits/weekly/:childId
router.get('/weekly/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const logs = await DentalHabitLog.find({ childId }).sort({ date: -1 }).limit(30);

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. GET /api/dental-habits/products
router.get('/products', (req, res) => {
  res.json({ success: true, data: DEMO_PRODUCTS });
});

// 7. GET /api/dental-habits/replacement/:childId
router.get('/replacement/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    let replacement = await BrushReplacement.findOne({ childId }).sort({ createdAt: -1 });

    if (!replacement) {
      const today = getTodayStr();
      replacement = {
        userId: 'pat-default',
        childId,
        lastReplacementDate: today,
        nextReminderDate: addMonths(today, 3),
        notes: 'Suggested 3-month brush head replacement interval.',
      };
    }

    res.json({ success: true, data: replacement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 8. POST /api/dental-habits/replacement
router.post('/replacement', async (req, res) => {
  try {
    const { userId = 'pat-default', childId, lastReplacementDate, notes } = req.body;
    const lastDate = lastReplacementDate || getTodayStr();
    const nextDate = addMonths(lastDate, 3);

    const replacement = await BrushReplacement.findOneAndUpdate(
      { childId },
      {
        userId,
        childId,
        lastReplacementDate: lastDate,
        nextReminderDate: nextDate,
        notes: notes || 'Suggested 3-month brush head replacement interval.',
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: replacement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
