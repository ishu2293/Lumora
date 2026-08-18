# Lumora

Lumora is a full-stack AI chatbot built with React, Node.js, Express, MongoDB Atlas, and Groq API. It provides a simple conversational interface with persistent chat history and thread management.<br><br>

<img width="1585" height="850" alt="image" src="https://github.com/user-attachments/assets/4175b0b6-9a5e-419f-bc45-b4974e3712bd" />

<img width="1432" height="768" alt="image" src="https://github.com/user-attachments/assets/68d76150-bd10-4234-80a4-dae74367a640" />

<img width="1541" height="851" alt="image" src="https://github.com/user-attachments/assets/ff2c2cea-4232-48c5-8c3a-8aa43509218d" />


## Features

- AI-powered conversations using Groq API
- Create new chat threads
- Persistent chat history with MongoDB Atlas
- View and switch between previous conversations
- Delete chat threads
- AI response typing animation
- Markdown support for AI responses
- Code syntax highlighting

## Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI:** Groq API
- **Libraries:** React Markdown, Highlight.js, UUID

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account
- Groq API key

### Clone the Repository

```bash
git clone "https://github.com/ishu2293/Lumora.git"
cd Lumora
```

## Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## Backend Setup

Open a new terminal and navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:

```bash
npm run dev
```

```text
.env
node_modules/
```

## Usage

1. Start the backend server.
2. Start the React frontend.
3. Open the application in your browser.
4. Create a new chat.
5. Enter a question and send it.
6. View and switch between previous conversations.
7. Delete conversations when needed.

## Author

**Ishwari Daphal**
