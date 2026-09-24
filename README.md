# NagarikAI - AI Citizen Grievance Redressal & Smart Civic Action Platform

![NagarikAI Civic Platform](https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80)

An intelligent, full-stack civic engagement and grievance redressal platform engineered to eliminate manual form filling and friction for citizens. Enables effortless public hazard reporting (potholes, garbage accumulation, water leakages, broken streetlights, drainage blockages, road damage) through Computer Vision and multilingual voice commands, backed by automatic GPS geocoding, smart municipal routing, duplicate merging, real-time ticket tracking, GIS heatmap analytics, municipal operations dashboard, and **Supabase Cloud PostgreSQL** integration.

---

## 🌟 Key Features

1. **AI Image Recognition & HUD Scanner**
   - Live camera snapshot and photo dropzone.
   - Futuristic AI scanning line with dynamic bounding boxes highlighting defects.
   - Accurately classifies: Potholes, Garbage Dumps, Water Leaks, Broken Streetlights, Drainage Issues, and Hazardous Road Collapses.
   - Confidence scoring (e.g. 98.4%) and urgency grading (Critical / High / Medium).

2. **AI Complaint Generation**
   - Automatically drafts comprehensive municipal complaint title and technical assessment description.
   - Identifies structural hazards (e.g. skid danger, water loss, pest attraction).

3. **Multilingual Voice-Based Complaint Studio**
   - Web Speech API integration with native regional language support:
     - **English** (`en-IN`)
     - **Telugu - తెలుగు** (`te-IN`)
     - **Hindi - हिन्दी** (`hi-IN`)
     - **Tamil - தமிழ்** (`ta-IN`)
     - **Kannada - ಕನ್ನಡ** (`kn-IN`)
     - **Malayalam - മലയാളം** (`ml-IN`)
   - Real-time animated neon audio waveform visualizer.

4. **Instant Language Switcher**
   - Seamless one-click UI translation across all 6 Indian languages.

5. **Automatic GPS & Ward Geocoding**
   - High-accuracy HTML5 Geolocation API.
   - Reverse-geocodes coordinates into specific street address and Municipal Ward number.
   - Interactive draggable Leaflet map pin to fine-tune issue location.

6. **Smart Department Routing**
   - Automatically routes issues to:
     - *Roads, Bridges & Pavements Wing*
     - *Solid Waste Management & Sanitation (SWM)*
     - *Water Supply & Sewerage Board (HMWSSB / BWSSB)*
     - *Electrical & Street Lighting Wing*
   - Auto-computes target statutory SLA (24h for Critical, 48h for High, 72h for Medium).

7. **Duplicate Complaint Detection & Upvoting**
   - Proximity search (<150m) scans active database for matching categories.
   - Displays smart alert: *"⚠️ Similar complaint found 35m away (8 citizens upvoted)"*.
   - Allows citizens to click **"Upvote (+1 Me Too)"** to escalate municipal priority without creating redundant tickets.

8. **Real-Time Ticket Tracking & Resolution Proof**
   - 6-Stage visual stepper timeline: `Reported` ➔ `AI Triaged` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved`.
   - Assigned field officer profile card with contact and badge ID.
   - **Resolution Verification**: Displays side-by-side **Before vs After** photos uploaded by field staff upon completion.
   - Citizen satisfaction feedback rating (1-5 stars).

9. **Civic GIS Heatmap & Predictive Analytics**
   - Real-time Leaflet GIS Heatmap displaying density clusters across city zones.
   - KPI cards: Total Grievances, Active In-Progress, Resolution Rate %, Avg SLA Compliance %, Citizens Engaged.
   - Department SLA compliance leaderboard.
   - **AI Predictive Advisory**: Early warning for rainfall and drainage overload.

10. **Accessibility & Senior Citizen Mode**
    - High-contrast color scheme, enlarged typography, and prominent touch targets.
    - Integrated Text-to-Speech (TTS) voice guidance that reads status and actions aloud.

11. **Municipal Admin & Ward Officer Portal**
    - Secure role switcher (Citizen ⇄ Officer).
    - Status management: assign officers, dispatch crews, and submit resolution proof photos.
    - Audit-ready CSV export of all grievance records.

12. **⚡ Supabase Cloud Integration (PostgreSQL + Realtime)**
    - Resilient dual-mode database (works out of the box with local JSON, connects seamlessly to Supabase PostgreSQL).
    - In-app connection manager and 1-click `supabase_schema.sql` database migration.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)

### Installation & Launch

1. Navigate to the project directory:
   ```bash
   cd "c:\Users\balanagu lokesh\OneDrive\Desktop\New folder"
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### ⚡ Supabase Setup (Optional Cloud Sync)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Open the **SQL Editor** in Supabase and run the provided [supabase_schema.sql](file:///c:/Users/balanagu%20lokesh/OneDrive/Desktop/New%20folder/supabase_schema.sql).
3. In NagarikAI, click the **⚡ Supabase** button in the top navigation bar, enter your Project URL and Anon Key, and click **Connect**.
