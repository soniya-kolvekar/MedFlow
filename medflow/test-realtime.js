
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAbb4P_2kozICSTBchT2VtmHj4BUosIOMQ",
  authDomain: "medflow-e99e6.firebaseapp.com",
  projectId: "medflow-e99e6",
  storageBucket: "medflow-e99e6.firebasestorage.app",
  messagingSenderId: "591014615976",
  appId: "1:591014615976:web:b847cb4663ef9cc8a49b9d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRealtime() {
  console.log("Adding real-time test appointment...");
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      patientId: "TEST_USER_123",
      patientName: "Real-time Tester",
      doctorId: "any",
      doctorName: "Dr. Realtime",
      condition: "Verifying real-time updates!",
      type: "Virtual",
      status: "pending",
      requestedDate: new Date().toISOString().split('T')[0],
      requestedTime: "10:00 AM",
      createdAt: new Date().toISOString()
    });
    console.log("Success! Appointment added with ID:", docRef.id);
    console.log("Check your Appointments page now. You should see 'Real-time Tester' in Pending Requests.");
    process.exit(0);
  } catch (e) {
    console.error("Error adding document: ", e);
    process.exit(1);
  }
}

testRealtime();
