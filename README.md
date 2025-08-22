# 🎧 Transcript & Rating System  

## 📌 Project Overview  
This project is a single-file upload system for **BPO call recordings** that automatically transcribes audio and rates the transcript based on multiple criteria.  

It is built using a **microservices architecture** with:  
- React frontend  
- Node.js/Express backend  
- MongoDB, Redis queues, MinIO  
- OpenAI APIs for STT and ratings  

### 🔑 Key Features  
- Upload audio files  
- Real-time transcription using OpenAI Whisper  
- Automatic rating for customer-executive calls:  
  - Opening  
  - Issue Understanding  
  - Tone / Sentiment  
  - CSAT  
- Polling-based frontend updates  
- Modular microservices architecture  
- Containerized with Docker  

---

## 🏗️ Architecture Design  

### 🔹 Front-End Flow  

#### Upload Page (`/upload`)  
- User selects a single audio file  
- File is uploaded to **upload-service** via POST API  
- After upload, user is redirected to **AudioDetailPage**  

#### Dashboard Page (`/dashboard`)  
- Shows a list of uploaded audio files with status  
- Can navigate to **AudioDetailPage** for each file  

#### Audio Detail Page (`/audio/:id`)  
- Displays audio file, transcription, and ratings  
- Shows sequential loaders:  
  - Transcript loader until `status === 'transcribed'`  
  - Ratings loader until `status === 'rated'`  
- Polls the backend every 3 seconds until transcription and rating are complete  
- Top-right **Dashboard button** allows navigation back to dashboard  

---

### 🔹 Back-End Services  

#### 1. Upload-Service  
**Purpose:** Handles audio file uploads, stores in MinIO, saves metadata in MongoDB, and pushes jobs to STT queue.  

**Stack:** Node.js, Express, MongoDB, MinIO, BullMQ (Redis).  

**Key Components:**  
- `/src/routes/upload.js` → File upload API  
- `/src/models/File.js` → File schema  
- `/src/queues/sttQueue.js` → Queue for STT  
- `/src/utils/minioClient.js` → MinIO client helper  

---

#### 2. STT-Service  
**Purpose:** Consumes jobs from `sttQueue`, downloads audio from MinIO, transcribes using OpenAI Whisper, updates MongoDB, and pushes to `ratingQueue`.  

**Key Components:**  
- `/src/workers/sttWorker.js` → Processes transcription jobs  
- `/src/routes/transcript.js` → Optional API to fetch transcript  
- `/src/config/openai.js` → OpenAI API client  
- `/src/queues/ratingQueue.js` → Queue for rating jobs  

---

#### 3. Rating-Service  
**Purpose:** Consumes jobs from `ratingQueue`, calls OpenAI LLM to generate ratings based on transcript, updates MongoDB `File` document with rating data, and sets `status: 'rated'`.  

**Key Components:**  
- `/src/workers/ratingWorker.js` → Processes rating jobs  
- `/src/config/openai.js` → OpenAI API client for LLM  

**Rating Criteria:**  
- Opening  
- Issue Understanding  
- Tone / Sentiment  
- CSAT (Customer Satisfaction)  

---

### 🔹 Database  

MongoDB stores the `File` collection for all audio uploads, transcripts, and ratings.  

**File Schema Example:**  
```json
{
  "_id": "...",
  "originalName": "...",
  "fileName": "...",
  "url": "...",
  "status": "pending | uploaded | processing | transcribed | rated | failed",
  "transcript": "...",
  "rating": {
    "opening": 8,
    "issueUnderstanding": 7,
    "tone": 9,
    "csat": 8
  },
  "createdAt": "...",
  "updatedAt": "..."
}
