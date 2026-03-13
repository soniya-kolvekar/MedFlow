import { db } from "./firebase";
import { collection, doc, setDoc, writeBatch } from "firebase/firestore";

const patientsData = [
  { 
    name: 'Sarah Jenkins', 
    info: 'F, 34 yrs', 
    id: '#MF-92831', 
    dept: 'Cardiology', 
    cond: 'Hypertension', 
    status: 'In-session', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
    priority: 'Normal',
    items: [
      { name: 'Lisinopril 10mg', dosage: '1 tab daily', status: 'In Stock', qty: '30 units', color: 'bg-deep-teal-500', code: 'Lp' },
      { name: 'Amoxicillin 500mg', dosage: '2 tabs daily', status: 'In Stock', qty: '14 units', color: 'bg-deep-teal-500', code: 'Am' }
    ]
  },
  { 
    name: 'David Chen', 
    info: 'M, 45 yrs', 
    id: '#MF-92845', 
    dept: 'Neurology', 
    cond: 'Migraine Chronic', 
    status: 'Waiting', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidC',
    priority: 'Urgent',
    items: [
      { name: 'Sumatriptan 50mg', dosage: '1 tab at onset', status: 'In Stock', qty: '6 units', color: 'bg-deep-teal-500', code: 'St' }
    ]
  },
  { 
    name: 'Elena Rodriguez', 
    info: 'F, 28 yrs', 
    id: '#MF-92850', 
    dept: 'Emergency', 
    cond: 'Fracture - L Arm', 
    status: 'In-session', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaR',
    priority: 'Normal',
    items: [
      { name: 'Ibuprofen 600mg', dosage: '1 tab q8h prn', status: 'In Stock', qty: '20 units', color: 'bg-deep-teal-500', code: 'Ib' }
    ]
  },
  { 
    name: 'Robert Wilson', 
    info: 'M, 67 yrs', 
    id: '#MF-92799', 
    dept: 'Cardiology', 
    cond: 'Post-Op Checkup', 
    status: 'Discharged', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertW',
    priority: 'Normal',
    items: [
      { name: 'Aspirin 81mg', dosage: '1 tab daily', status: 'In Stock', qty: '90 units', color: 'bg-deep-teal-500', code: 'As' }
    ]
  },
];

const inventoryData = [
  { name: 'Amoxicillin', category: 'Antibiotic', stock: 124, threshold: 50, status: 'Available', price: 12.50 },
  { name: 'Lisinopril', category: 'ACE Inhibitor', stock: 42, threshold: 50, status: 'Low Stock', price: 8.20 },
  { name: 'Atorvastatin', category: 'Statin', stock: 8, threshold: 20, status: 'Critical', price: 15.00 },
  { name: 'Metformin', category: 'Antidiabetic', stock: 215, threshold: 100, status: 'Available', price: 5.40 },
];

const reportsData = [
  { name: 'Discharge Summary: Emily Watson', id: '#REP-2024-0892', category: 'PATIENT RECORD', type: 'Clinical', date: 'Oct 24, 2024', status: 'Finalized', statusColor: 'bg-green-100 text-green-600', dotColor: 'bg-green-500' },
  { name: 'Dept. Efficiency: Cardiology', id: '#REP-2024-0887', category: 'ADMINISTRATIVE', type: 'Administrative', date: 'Oct 22, 2024', status: 'Finalized', statusColor: 'bg-green-100 text-green-600', dotColor: 'bg-green-500' },
  { name: 'Inventory Audit: Q3 Medical Supplies', id: '#REP-2024-0881', category: 'INVENTORY', type: 'Inventory', date: 'Oct 19, 2024', status: 'Processing', statusColor: 'bg-ash-grey-800/10 text-charcoal-blue-600', dotColor: 'bg-ash-grey-400' },
  { name: 'Lab Analysis: COVID-19 Surveillance', id: '#REP-2024-0875', category: 'LAB RESULT', type: 'Lab', date: 'Oct 18, 2024', status: 'Finalized', statusColor: 'bg-green-100 text-green-600', dotColor: 'bg-green-500' },
];

const departmentsData = [
  { name: 'Doctor Unit', type: 'Primary Clinical Division', category: 'Clinical', staff: 24, pending: 12, status: 'Active', statusColor: 'text-green-600 bg-green-100', iconName: 'Stethoscope', iconBg: 'bg-green-50 text-green-700' },
  { name: 'Laboratory', type: 'Diagnostic & Pathology', category: 'Diagnostic', staff: 12, pending: 45, status: 'High Load', statusColor: 'text-orange-600 bg-orange-100', iconName: 'FlaskConical', iconBg: 'bg-orange-50 text-orange-700' },
  { name: 'Pharmacy', type: 'Dispensary Unit', category: 'Clinical', staff: 8, pending: 8, status: 'Active', statusColor: 'text-green-600 bg-green-100', iconName: 'Pill', iconBg: 'bg-green-50 text-green-700' },
  { name: 'Administration', type: 'Operations & Support', category: 'Administrative', staff: 15, pending: 3, status: 'Maintenance', statusColor: 'text-blue-600 bg-blue-100', iconName: 'ShieldCheck', iconBg: 'bg-blue-50 text-blue-700' },
  { name: 'Radiology', type: 'Imaging Services', category: 'Diagnostic', staff: 6, pending: 18, status: 'Active', statusColor: 'text-green-600 bg-green-100', iconName: 'Rows', iconBg: 'bg-green-50 text-green-700' },
  { name: 'Pediatrics', type: 'Child Care Division', category: 'Clinical', staff: 14, pending: 4, status: 'Active', statusColor: 'text-green-600 bg-green-100', iconName: 'Baby', iconBg: 'bg-green-50 text-green-700' },
  { name: 'Emergency ER', type: 'Urgent Care Unit', category: 'Clinical', staff: 32, pending: 88, status: 'Critical', statusColor: 'text-red-600 bg-red-100', iconName: 'Activity', iconBg: 'bg-red-50 text-red-700' },
  { name: 'Logistics', type: 'Supply Chain & Transport', category: 'Administrative', staff: 10, pending: 5, status: 'Active', statusColor: 'text-green-600 bg-green-100', iconName: 'Truck', iconBg: 'bg-green-50 text-green-700' },
];

export const seedDatabase = async () => {
  const batch = writeBatch(db);

  // Seed Patients
  patientsData.forEach((patient) => {
    const docRef = doc(collection(db, "patients"), patient.id.replace('#', ''));
    batch.set(docRef, {
      ...patient,
      createdAt: new Date().toISOString(),
    });
  });

  // Seed Inventory
  inventoryData.forEach((item) => {
    const docRef = doc(collection(db, "inventory"), item.name.toLowerCase().replace(/\s/g, '_'));
    batch.set(docRef, {
      ...item,
      lastUpdated: new Date().toISOString(),
    });
  });

  // Seed Reports
  reportsData.forEach((report) => {
    const docRef = doc(collection(db, "reports"), report.id.replace('#', ''));
    batch.set(docRef, {
      ...report,
      createdAt: new Date().toISOString(),
    });
  });

  // Seed Departments
  departmentsData.forEach((dept) => {
    const docRef = doc(collection(db, "departments"), dept.name.toLowerCase().replace(/\s/g, '_'));
    batch.set(docRef, {
      ...dept,
      lastUpdated: new Date().toISOString(),
    });
  });

  await batch.commit();
  console.log("Database seeded successfully!");
};
