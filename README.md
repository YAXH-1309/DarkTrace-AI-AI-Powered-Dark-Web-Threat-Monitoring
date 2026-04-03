# 🛡️ DarkTrace AI - Sentinel Prism

**Sentinel Prism** is a high-fidelity intelligence console designed for real-time, domain-specific dark web threat monitoring. It combines live OSINT scraping with deep-web data analytics to provide organizations and individuals with an immersive, on-demand security overview of their sensitive data leaks.

![Sentinel Dashboard Placeholder](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=DarkTrace+AI+Dashboard+Premium+Aesthetic)

---

## 🚀 Key Features

- **Interactive Intelligence Console:** Trigger on-demand "Sentinel Traces" for any domain (e.g., `world.com`, `tesla.com`).
- **Hybrid Hub Scanning:** Orchestrates a **Live OSINT Trace** (via Reddit forum search) combined with an extensive **Deep-Web Mock Bank**.
- **AI Analysis Visualizer:** A premium "AI-Thinking" phase with real-time status logs during data collection.
- **Sentinel Access Terminal:** Role-based access control with **Admin** and **Organization** operator profiles, plus new operator enrollment.
- **Synchronized Visual Analytics:**
  - **Risk-Distribution Gauge:** 1:1 mapping of High/Medium/Low threats.
  - **Trend Analysis:** Temporal line charts tracking threat frequency over time with integer-precision.
- **Expandable Threat Feed:** Deep-dive into technical metadata, category-specific icons, and risk-level filtering.

---

## 🛠️ Technology Stack

### Backend
- **Core:** Node.js, Express.js
- **Database:** Local In-Memory Supabase Mock (Extensible to real Supabase)
- **Scraper:** Node-fetch (Native) for public OSINT API integration.
- **Protocol:** RESTful Architecture (+ SSE capability for real-time alerts).

### Frontend
- **Core:** React (Vite)
- **UI Architecture:** Sentinel Prism Design System (Obsidian/Neon aesthetic).
- **Styling:** Vanilla CSS (Tailored glassmorphism and motion animations).
- **Icons:** Lucide-React
- **Charts:** Chart.js + React-Chartjs-2

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm (v10+)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/darktrace-ai.git
cd darktrace-ai
```

### 2. Backend Setup
```bash
cd backend
npm install
node src/index.js
```
*The backend server will run on `http://localhost:5000`.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
*The frontend dashboard will be available at `http://localhost:3000`.*

---

## 🔐 Sentinel Access Credentials

To access the console, use one of the predefined operator uplinks or enroll a new one:

| Operator Role | Username | Password |
| :--- | :--- | :--- |
| **Sentinel Admin** | `admin123` | `admin123` |
| **Org Operator** | `org123` | `org123` |

---

## 🛡️ Usage: Initiating a Trace

1. **Login:** Access the Sentinel Terminal and establish an uplink.
2. **Domain Input:** Enter a domain name in the primary dashboard console.
3. **Fetch Intelligence:** Click "Fetch Data" to initiate the AI Intelligence Phase.
4. **Analyze:**
   - Expand threat rows to view specific leaked snippets.
   - Filter by risk level to prioritize response.
   - Monitor the **Glow-Trends** to see how threats are escalating.

---

## 📜 Roadmap & Future Enhancements

- [x] High-fidelity Dashboard UI & Visualizations.
* [x] Interactive On-Demand Data Fetching.
* [x] Live OSINT (Reddit) Integration.
* [x] Sentinel Auth & Operator Enrollment.
* [ ] Real Supabase/PostgreSQL persistence.
* [ ] Advanced TOR hidden-service scraping nodes.
* [ ] One-click Remediation & Takedown requests.

---

**Developed for DarkTrace AI - Powering Modern Cybersecurity Intelligence.**
