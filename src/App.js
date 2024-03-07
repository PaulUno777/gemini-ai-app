import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  //random question 
  const surpriseOptions = [
    "are there major political events happening globally today ?",
    "is the weather looking good for tomorrow?",
    "what is the current top selling single on Spotify?",
    "what is the best computer setup for a software engineer in 2024 ?",
    "Show me popular sports in this season on Cameroon",
    "Write original fable about lion and other animal the lion must be the  king"
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const clearAll =() =>{
    setValue("");
    setError("");
    setChatHistory([]);
  }

  const getResponse = async () => {
    if (!value) {
      setError("Please ask a question!");
      return;
    }
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
      };

      const response = await fetch(
        "http://localhost:8555/gemini",
        requestOptions
      );

      const data = await response.text();
      console.log("data", data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try later.");
    }
  };

  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Suprise me!
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Ask me anything..."
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clearAll}>Clear</button>}
      </div>
      {/* display  error if there is one */}
      {error && <p className="error">{error}</p>}
      {/* result section */}
      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <div key={index}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
