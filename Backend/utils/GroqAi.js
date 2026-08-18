import "dotenv/config";

const getApiresponse = async (message) => {
    // Truncate prompt if it exceeds 80,000 characters to prevent payload limit overflow
    const maxChars = 80000;
    const safeMessage = typeof message === "string" && message.length > maxChars 
        ? message.substring(0, maxChars) + "\n\n[Prompt truncated due to length]"
        : message;

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            "model": process.env.GROQ_MODEL || "groq/compound",
            "messages": [{
                "role": "user",
                "content": safeMessage
            }]
        })
    };
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Groq API Error Response:", response.status, errorData);
            throw new Error(errorData.error?.message || `Groq API responded with status ${response.status}`);
        }
        const data = await response.json();
        return data.choices?.[0]?.message?.content || "No response generated.";
    } catch (err) {
        console.error("Error fetching AI response:", err);
        throw err;
    }
}

export default getApiresponse;