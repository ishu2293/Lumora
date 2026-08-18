import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./Mycontext.jsx";
import { AuthContext } from "./AuthContext.jsx";
import { v1 as uuidv1 } from "uuid";
import lumoraIcon from "./assets/Lumora_icon.png";

import { API_URL } from "./config.js";

export default function Sidebar(){
    const {allThreads, setAllThreads, currThreadId, setNewchat, setPrompt, setReply, setcurrThreadId, setPrevChats} = useContext(MyContext);
    const { token: authToken } = useContext(AuthContext);

    const getAllThreads = async() => {
        const token = localStorage.getItem("token") || authToken;
        if (!token) return;
        try{
            const response = await fetch(`${API_URL}/api/thread`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();

            if (Array.isArray(res)) {
                const filterData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
                setAllThreads(filterData);
            }
        }catch(err){
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId, authToken]);

    const createNewChat = () => {
        setNewchat(true);
        setPrompt("");
        setReply(null);
        setcurrThreadId(uuidv1());
        setPrevChats([]);
    };

    const changeThread = async(newThreadId) => {
        setcurrThreadId(newThreadId);
        const token = localStorage.getItem("token") || authToken;
        try{
            const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const res = await response.json();
            if (Array.isArray(res)) {
                setPrevChats(res);
                setNewchat(false);
                setReply(null);
            }
        }catch(err){
            console.log(err);
        }
    };

    const deleteThread = async (threadId) => {
        const token = localStorage.getItem("token") || authToken;
        try {
            await fetch(`${API_URL}/api/thread/${threadId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }
    };

    return (
        <section className="sidebar">
            <button onClick={createNewChat} className="new-chat-btn">
                <div className="new-chat-content">
                    <img src={lumoraIcon} alt="Lumora logo" className="logo" />
                    <span>New Chat</span>
                </div>
                <i className="fa-solid fa-plus add-icon"></i>
            </button>
            
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={() => changeThread(thread.threadId)} className={thread.threadId === currThreadId ? "highlighted": " "}>
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteThread(thread.threadId);
                                }}></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p>By Ishwari &hearts;</p>
            </div>
        </section>
    );
}