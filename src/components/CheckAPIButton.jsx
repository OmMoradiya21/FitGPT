import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai";

const CheckAPIButton = ({ APIKey, children, isAPIValid, setIsAPIValid }) => {
    const [message, SetMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkAPIKey = async () => {
        if (!APIKey || APIKey.trim() === '') {
            setIsAPIValid(false);
            SetMessage("⚠️ Please enter an API key first");
            return;
        }
        
        setIsLoading(true);
        SetMessage("Checking API key...");

        try {
            const genAI = new GoogleGenerativeAI(APIKey);
            const model = genAI.getGenerativeModel({ model: import.meta.env.VITE_GEMINI_MODEL });
            const result = await model.generateContent("hi");

            console.log(result.response.text());

            if (result.response.text()) {
                SetMessage("✓ Your API Key is Valid");
                setIsAPIValid(true);
            } else {
                setIsAPIValid(false);
                SetMessage("Somthing is Wrong");
            }
        } catch (error) {
            setIsAPIValid(false);
            SetMessage("❌ Invalid API key");
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="api-key-widget">
            <div className="api-key-input-row">
                {children}
                <button 
                    type="button" 
                    className="btn-api-check"
                    disabled={isLoading} 
                    onClick={checkAPIKey}
                >
                    {isLoading ? "Checking..." : isAPIValid ? "Valid" : "Check"}
                </button>
            </div>
            {message && (
                <div className={`api-key-status ${isAPIValid ? 'status-success' : message.startsWith('⚠️') ? 'status-warning' : 'status-error'}`}>
                    {message}
                </div>
            )}
        </div>
    )
}

export default CheckAPIButton;