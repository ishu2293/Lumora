import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Auth from "./Auth.jsx";
import { MyContext } from "./Mycontext.jsx";
import { AuthProvider, AuthContext } from "./AuthContext.jsx";
import { useState, useContext } from 'react';
import { v1 as uuidv1 } from "uuid";

function MainContent() {
  const { token, loading } = useContext(AuthContext);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setcurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newchat, setNewchat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setcurrThreadId,
    newchat, setNewchat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  if (loading) {
    return (
      <div style={{
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        background: "#0d0d12", 
        color: "#fff"
      }}>
        Loading Lumora...
      </div>
    );
  }

  if (!token) {
    return <Auth />;
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
