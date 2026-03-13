<div align="center">
  
# 🏥 MedFlow AI

**Revolutionizing Clinical Workflows with Real-Time Multilingual Intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10-FFCA28.svg?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
<br/>
[![Sarvam AI](https://img.shields.io/badge/Sarvam_AI-Powered-FF4B4B.svg)](https://sarvam.ai)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5-4285F4.svg?style=flat-square&logo=google)](https://deepmind.google/technologies/gemini/)

</div>

<p align="center">
  MedFlow AI is an advanced, fully-featured healthcare dashboard designed to seamlessly connect doctors, patients, and pharmacies. By leveraging cutting-edge real-time audio translation and GenAI, MedFlow AI eliminates language barriers in consultations and automates tedious clinical documentation.
</p>

---

## ✨ Key Features

- 🎙️ **Real-Time Multilingual Transcription & Translation**: Powered by **Sarvam AI**, spoken consultations are instantly transcribed and translated bi-directionally (e.g., Hindi to English) right in the doctor's dashboard.
- 🧠 **AI Clinical Scribe**: Utilizing **Gemini 2.5 Flash**, session transcripts are automatically analyzed to generate highly accurate structural clinical summaries, including symptoms, potential diagnosis, and clinical notes.
- 📄 **Automated PDF Generation**: Seamlessly export AI summaries and manual Smart Prescriptions into formatted PDFs using `jsPDF`.
- ☁️ **Cloud Storage Integration**: Automatically host and secure medical documents and prescriptions via **Cloudinary**.
- 🔄 **Real-Time Sync**: **Firebase Firestore** powers instant state updates across the Doctor, Patient, and Pharmacy dashboards.
- 🎨 **Modern Aesthetics**: Built with Next.js and TailwindCSS, featuring a clean, responsive, and glassmorphic UI.

## 🏗️ Architecture Stack

### Frontend (`/medflow`)
- **Framework**: Next.js 14, React 18
- **Styling**: TailwindCSS, Framer Motion
- **Services**: Firebase Auth, Firebase Firestore SDK
- **Utilities**: `jsPDF` for client-side document generation

### Backend (`/backend`)
- **Framework**: Python, FastAPI, Uvicorn
- **AI Integration**: Google Generative AI (Gemini), Sarvam API (WebSockets)
- **Networking**: Python `websockets`, `requests`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- Node.js > 18.x
- Python 3.9+
- API Keys for: Firebase, Cloudinary, Gemini, and Sarvam AI.

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/MedFlow.git
cd MedFlow
```

### 2. Backend Setup
Navigate into the backend directory, set up your virtual environment, and install the dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` root:
```env
SARVAM_API_KEY=your_sarvam_key_here
GEMINI_API_KEY=your_gemini_key_here
```

Start the FastAPI server:
```bash
python main.py
```
*The backend will run on `http://localhost:8000`*

### 3. Frontend Setup
Navigate to the frontend directory and install NPM packages:
```bash
cd ../medflow
npm install
```

Create a `.env.local` file in the `medflow/` root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_keys
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SARVAM_AI_API_KEY=your_sarvam_key
```

Run the development server:
```bash
npm run dev
```
*The application will be available at `http://localhost:3000`*

---

## 🩺 Core User Flows

### For Doctors
1. Open the **Doctor Dashboard**.
2. Select an active patient from the **Patients** queue to begin a session.
3. Click **Start Session**. The microphone will capture audio, passing it through the Sarvam AI websocket for live translated subtitles.
4. Click **End Session**. The Gemini API will automatically read the transcript, formulate clinical notes, and upload a polished PDF to Cloudinary.
5. Manually write a **Smart Prescription**, which is similarly formulated into a PDF and saved to the patient's record.

### For Patients
- View detailed health records securely fetched from Firestore.
- Access exact PDF copies of past session summaries and prescriptions from the Doctor.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">Made with ❤️ for Hackathons and better Healthcare.</p>
