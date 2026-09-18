const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Provider = require('./models/Provider');

const MOCK_DEMO_PROVIDERS = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Menon',
    qualification: 'BDS, MDS (TMJ & Orofacial Pain)',
    specialization: 'TMJ / Orofacial Pain / Occlusal Care',
    clinic: 'SmileCare Advanced Dental & TMJ Center',
    location: 'Indiranagar 100ft Rd, Bengaluru',
    consultationFee: 180,
    consultationType: ['In-Person', 'Video Consultation'],
    services: ['Teeth Cleaning & Scaling', 'Night Guard / Bruxism Care', 'Dental Consultation'],
    country: 'US',
    demoCoverage: { providerFee: 180, estimatedCoverage: 120, patientResponsibility: 60 },
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewCount: 142,
    availableSlots: [
      { date: 'Tomorrow', slots: ['09:30 AM', '11:00 AM', '02:30 PM'] },
      { date: 'Day After', slots: ['10:00 AM', '01:30 PM', '04:00 PM'] },
    ],
  },
  {
    id: 'doc-2',
    name: 'Dr. Vikramaditya Rao',
    qualification: 'BDS, MDS (Endodontics & Restorative)',
    specialization: 'Restorative & Endodontic Care',
    clinic: 'Apex Dental Care & Implant Institute',
    location: 'Koramangala 5th Block, Bengaluru',
    consultationFee: 200,
    consultationType: ['In-Person'],
    services: ['Root Canal Consultation', 'Fillings', 'Tooth Restoration'],
    country: 'Australia',
    demoCoverage: { providerFee: 200, estimatedCoverage: 100, patientResponsibility: 100 },
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviewCount: 98,
    availableSlots: [
      { date: 'Tomorrow', slots: ['10:30 AM', '03:00 PM'] },
      { date: 'Day After', slots: ['11:30 AM', '02:00 PM'] },
    ],
  },
  {
    id: 'doc-3',
    name: 'Dr. Sarah Jenkins',
    qualification: 'DDS, FAGD (General & Preventive Dentistry)',
    specialization: 'Preventive Care & Dental Hygiene',
    clinic: 'Metro Dental Health Center',
    location: 'Central Avenue, London',
    consultationFee: 150,
    consultationType: ['In-Person', 'Video Consultation'],
    services: ['Teeth Cleaning & Scaling', 'Teeth Whitening', 'Routine Dental Check-up'],
    country: 'UK',
    demoCoverage: { providerFee: 150, estimatedCoverage: 90, patientResponsibility: 60 },
    image: 'https://images.unsplash.com/photo-1594824813566-88855ce78c08?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviewCount: 175,
    availableSlots: [
      { date: 'Tomorrow', slots: ['09:00 AM', '01:00 PM', '04:30 PM'] },
    ],
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected.');

    const count = await Provider.countDocuments();
    console.log(`Current Provider documents in MongoDB Atlas: ${count}`);

    if (count === 0) {
      console.log('Seeding fictional demo providers into MongoDB Atlas...');
      for (const p of MOCK_DEMO_PROVIDERS) {
        await Provider.create(p);
      }
      console.log('Successfully seeded 3 demo providers into MongoDB Atlas!');
    } else {
      console.log('Provider documents already exist in MongoDB Atlas.');
    }

    const providers = await Provider.find();
    console.log('Retrieved Provider documents from MongoDB Atlas:');
    console.log(`Count: ${providers.length}`);
    providers.forEach(p => console.log(`- ${p.name} (${p.specialization}) at ${p.clinic}`));

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
