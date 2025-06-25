# Machine Learning based Quiz System and preparation system – Frontend

This is the **frontend** of the Machine Learning-Based Quiz & Preparation Suggestion System — an intelligent platform for teachers to create quizzes (manually or using AI) and for students to attempt them securely with real-time cheating prevention mechanisms and personalized AI feedback.

---

## 📌 Key Features (Frontend)

### 👨‍🏫 Teacher Panel:

- Create quizzes manually or using AI
- Publish quizzes to selected students
- Manage student records and quiz schedules
- View results and feedback dashboards

### 🧑‍🎓 Student Panel:

- Attempt quizzes in a secure browser
- Real-time detection of tab-switching and location spoofing
- View detailed results once published
- AI feedback with improvement suggestions

---

## 🧰 Tech Stack

- **Framework**: React.js
- **Routing**: React Router DOM
- **State Management**: Context API (based on actual usage)
- **Styling**: Tailwind CSS / CSS Modules
- **API Communication**: Axios / Fetch
- **Authentication**: JWT
- **Utils**: React Hooks, Toast Notifications, Location & Tab Monitoring Hooks

---

## 📦 Installation

> Ensure you have `Node.js` and `npm` installed.

```bash
# Clone the repository
git clone https://github.com/hamza-mqbl/quiz-app.git
```

```bash
cd quiz-app
```

# Install dependencies

```bash
npm install --legacy-per-deps
```

# Run development server

npm run dev

Create a .env.local file in the root of your frontend project and add the following:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Make sure your backend server is running at the URL and port specified in NEXT_PUBLIC_API_URL.
