import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./Mycontext.jsx";
import { AuthContext } from "./AuthContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

import { API_URL } from "./config.js";

export default function ChatWindow(){
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewchat} = useContext(MyContext);
    const { user, token: authToken, logout } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        if(!prompt.trim()) return;
        const currentPrompt = prompt;
        setPrompt("");
        setLoading(true);
        setNewchat(false);

        const token = localStorage.getItem("token") || authToken;

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: currentPrompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(`${API_URL}/api/chat`, options);
            const res = await response.json();
            if (response.ok) {
                setPrevChats(prevChats => (
                    [...prevChats, {
                        role: "user",
                        content: currentPrompt
                    }, {
                        role: "assistant",
                        content: res.reply
                    }]
                ));
                setReply(res.reply);
            } else {
                console.error("Chat error:", res.error);
            }
        } catch(err){
            console.log(err);
        }
        setLoading(false);
    };

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>Lumora<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIcon" onClick={handleProfileClick} title={user?.username || "User"}>
                    <span className="userIconImage" style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                        {user?.username ? user.username[0].toUpperCase() : <i className="fa-solid fa-user"></i>}
                    </span>
                </div>
            </div>

            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "4px", paddingBottom: "8px" }}>
                        <strong>{user?.username}</strong>
                        <div style={{ fontSize: "0.75rem", color: "#888" }}>{user?.email}</div>
                    </div>
                    <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout} style={{ color: "#f87171", cursor: "pointer" }}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                    </div>
                </div>
            }

            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading} />
            <div className="chatInput">
                <div className="InputBox">
                    <input 
                        placeholder="Ask Anything" 
                        value={prompt} 
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''} 
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    Lumora can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}