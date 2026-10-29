# 🤟 SignBridge – AI-Powered Sign Language Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**SignBridge** is an accessibility-first web platform designed to bridge the communication gap between the Deaf/Hard of Hearing and hearing communities through artificial intelligence and interactive computer vision.

Developed as part of the **Millennium Fellowship** in support of **UN Sustainable Development Goal 10 (Reduced Inequalities)** and **SDG 4 (Quality Education)**.

---

## ✨ Features

- **✍️ Text-to-Sign Animation Avatar**: Enter any phrase or use speech-to-text; an animated 3D-styled avatar demonstrates the corresponding signs gesture-by-gesture and letter-by-letter.
- **🎥 Video Translator & Synchronizer**: Paste video links (YouTube, Spotify, etc.) to extract speech, generate live transcripts, and synchronize sign language demonstration alongside the media.
- **📷 Real-Time Vision Sign Detection**: Uses the device camera to track hand gestures in real-time with visual landmark overlays and automatic text-to-speech output.
- **📚 Interactive Sign Language Dictionary**: Explore ASL alphabet letters and common phrases categorized by daily life, emergency, greetings, and social interaction.
- **🌐 Multi-Language Ready**: Designed with architecture for global sign systems including ASL (American), BSL (British), Auslan (Australian), ISL (Irish), LSF (French), and DGS (German).
- **🔒 Privacy-First**: Video and camera streams are processed locally on the client's device without cloud storage.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **UI & Animation**: React 19, Framer Motion, Lucide React
- **Styling**: Tailwind CSS v4, custom glassmorphism & mesh gradients
- **Language**: TypeScript 5 (Strict Mode)
- **Audio & Speech**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or newer
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/sign-language-platform.git
   cd sign-language-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Quality Assurance & Scripts

```bash
# Run linting (ESLint 9)
npm run lint

# Run type checks
npx tsc --noEmit

# Build production bundle
npm run build

# Start production server
npm start
```

---

## ☁️ Deployment

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Keep standard Next.js defaults (Framework: `Next.js`, Root: `./`).
5. Click **Deploy**.

---

## 🤝 Millennium Fellowship Impact

SignBridge is developed to advance global accessibility and inclusion by making sign language tools intuitive, open, and readily available for classrooms, workplaces, and daily communication.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
