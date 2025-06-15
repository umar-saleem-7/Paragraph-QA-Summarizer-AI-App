# Passage QA & Text Summarizer Application

This project is a full-stack web application that provides two core functionalities:

1. **Passage-Based Question Answering**  
2. **Text Summarization**

Built with a React frontend and a FastAPI backend, it combines modern NLP models for real-time inference and JWT-authenticated user interaction. OTP-based registration ensures user identity validation via email. The system uses local embedding and inference without relying on third-party APIs.

---

## 📌 Features

- **Passage-Based QA** using `distilbert-base-uncased-distilled-squad`
- **Text Summarization** using `facebook/bart-large-cnn`
- **JWT Authentication** with OTP email verification via Gmail SMTP
- **Secure Password Storage** using PBKDF2 hashing
- **Role-based Routing** for login, registration, and account deletion
- **Session History (Frontend-only, not persisted)**
- **Modular FastAPI Backend with Routers**
- **Professional React Interface** using Bootstrap layout

---

## 📁 Folder Structure

```bash
📦 root/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── qa.py
│   ├── summarize.py
│   ├── database.py
│   └── models.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── DeleteAccount.js
│   │   │   ├── FeatureSelector.js
│   │   │   ├── SummarizerDashboard.js
│   │   │   └── ContactUs.js
│   │   ├── App.js
│   │   └── styles.css
└── README.md
````

---

## ⚙️ Backend Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd backend
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### `requirements.txt`

```text
fastapi
uvicorn
pydantic
transformers
torch
sentence-transformers
email-validator
python-multipart
passlib[bcrypt]
smtplib
python-dotenv
```

### 4. Set Gmail SMTP App Password

Create a `.env` file in the backend root with:

```
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
SECRET_KEY=your_jwt_secret
```

> Note: App passwords require two-factor authentication to be enabled in Gmail.

### 5. Start the Backend Server

```bash
uvicorn main:app --reload
```

The API will run at:
`http://localhost:8000`

---

## 💻 Frontend Setup Instructions

### 1. Navigate to the Frontend Folder

```bash
cd frontend
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Start React App

```bash
npm start
```

The frontend will run at:
`http://localhost:3000`

---

## 🔐 Authentication Flow

* **Registration**:
  Users register with email and password. An OTP is sent via Gmail SMTP and must be entered to complete registration.

* **Login**:
  On login, the user receives a JWT access token which is stored in `localStorage` and used to authenticate subsequent requests.

* **Account Deletion**:
  Requires re-entering the password. Passwords are verified server-side via PBKDF2 hash comparison.

---

## 🧠 NLP Models Used

| Task          | Model                                     |
| ------------- | ----------------------------------------- |
| QA            | `distilbert-base-uncased-distilled-squad` |
| Summarization | `facebook/bart-large-cnn`                 |
| Embedding     | `sentence-transformers/all-MiniLM-L6-v2`  |

All models are loaded using the HuggingFace `transformers` and `sentence-transformers` libraries.

---

## ⚠️ Known Limitations

* **Device-Specific Usage**:
  Since SQLite is used as a local file (`users.db`) and both frontend/backend are on the same machine, the same user account cannot be accessed from different devices unless the backend and database are deployed to a server.

* **No Backend Memory**:
  QA and summarization history is maintained only in the browser session and not stored on the server.

---

## 🚀 Future Work

* Deploy backend with SQLite/PostgreSQL to cloud (e.g., Render, Railway)
* Add persistent user history with timestamp
* Integrate rate-limiting and CAPTCHA during OTP
* Enable file upload (PDF, TXT) for summarization
* Add multi-language support for QA and summaries

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 👥 Contributors

* **Omer Faisal**
  [Omer Faisal GitHub Profile](https://github.com/Omer-443) 
  [Umar Saleem GitHub Profile](https://github.com/umar-saleem-7) 


---

## 📫 Contact

For questions, contact us via the “Contact Us” page in the app or email at:
📧 **[official.omerfaisal@gmail.com](mailto:official.omerfaisal@gmail.com)**

📧 **[umarsaleem0816@gmail.com](mailto:umarsaleem0816@gmail.com)**


