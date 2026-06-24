# Atmosphera — Weather Application

A full-stack weather application built for the **PM Accelerator AI Engineer Intern** technical assessment. This project fulfills the requirements for **both Tech Assessment #1 (Frontend) and Tech Assessment #2 (Backend)**.

## 🚀 Features

### Frontend (Tech Assessment #1)
- **Modern UI/UX**: Glassmorphism design system with dynamic, weather-based gradient backgrounds.
- **Location Input**: Search by city, zip code, or coordinates.
- **Geolocation**: "Use my location" button utilizing the browser's Geolocation API.
- **Current Weather**: Beautiful visualization of current conditions with icons and key metrics.
- **5-Day Forecast**: Interactive temperature trend chart (Recharts) and daily summaries.
- **Responsive**: Fully adapts to mobile, tablet, and desktop screens.

### Backend (Tech Assessment #2)
- **Robust API**: Built with Node.js and Express.js.
- **Database Persistence**: SQLite database via Prisma ORM for seamless, zero-config data storage.
- **Full CRUD Operations**: 
  - **Create**: Automatically saves weather search records with date ranges.
  - **Read**: View search history with sorting.
  - **Update**: Edit the description of past searches.
  - **Delete**: Remove records from history.
- **API Integrations**:
  - OpenWeatherMap API (Geocoding, Current, Forecast).
  - YouTube Data API v3 (Travel guides and videos for the searched location).
  - Unsplash API (High-quality photos of the location).
- **Data Export**: Export your search history in JSON, CSV, XML, PDF, and Markdown formats.

### Stand-Apart Features
- **Explore Mode**: Interactive map (Leaflet) combined with YouTube videos and Unsplash photos of the searched location.
- **Error Handling**: Graceful error UI and robust backend validation (express-validator).
- **Zero Config Setup**: Uses SQLite so the evaluator doesn't need to spin up a database server.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router, Recharts, Leaflet, Vanilla CSS.
- **Backend**: Node.js, Express.js, Prisma ORM, SQLite.
- **External APIs**: OpenWeatherMap, YouTube Data API, Unsplash API.

---

## 💻 How to Run Locally

### Prerequisites
- Node.js (v18+ recommended)
- API Keys for OpenWeatherMap, YouTube (optional), and Unsplash (optional).

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd atmosphera
   ```

2. **Configure Environment Variables:**
   Navigate to the `server` folder and rename `.env.example` to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   *Edit `server/.env` and insert your API keys.* (Only OPENWEATHER_API_KEY is strictly required to run the app).

3. **Install Dependencies & Generate Database:**
   From the root of the project, run:
   ```bash
   npm run install:all
   ```
   *This command installs root, client, and server dependencies, and generates the Prisma client.*

4. **Start the Application:**
   From the root of the project, run:
   ```bash
   npm run dev
   ```
   *This uses `concurrently` to start both the Express backend (port 3001) and Vite frontend (port 5173).*

5. **View the App:**
   Open your browser and navigate to: `http://localhost:5173`

---

## 👨‍💻 Developer

Built by the applicant for the **AI Engineer Intern** position.

**About PM Accelerator:**
Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their careers in product management. The accelerator provides mentorship, hands-on experience, and industry connections to empower the next generation of tech leaders and innovators.
