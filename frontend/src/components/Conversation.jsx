import { useState } from "react";
import DictionaryPopup from "./DictionaryPopup";

export default function Conversation() {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [autoMode, setAutoMode] = useState(false);
  const [listening, setListening] = useState(false);

//TESTING
const fakeScripts = [
  "Hello",
  "I want a coffee",
  "Medium size please",
  "Yes, with milk",
  "Thank you",
];

const [testIndex, setTestIndex] = useState(0);




  // ================= START CONVERSATION =================
  const startConversation = async (topic, level) => {
    const res = await fetch("http://127.0.0.1:5000/conversation/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 1,
        topic,
        level,
      }),
    });  

    const data = await res.json();
    setConversationId(data.conversation_id);
    setMessages([
      { role: "assistant", text: "Hello! Let's practice English 😊" },
    ]);
  };

  // ================= TEXT-TO-SPEECH =================
  const speakText = (text) => {
  if (!("speechSynthesis" in window)) {
    alert("Your browser does not support Text-to-Speech");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;   // tốc độ nói
  utterance.pitch = 1;    // cao độ
  utterance.volume = 1;   // âm lượng

  window.speechSynthesis.cancel(); // stop tiếng cũ
  window.speechSynthesis.speak(utterance);
};





  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!input || !conversationId) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    const res = await fetch("http://127.0.0.1:5000/conversation/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        text: userText,
      }),
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: data.reply },
    ]);
    speakText(data.reply); // Gọi hàm TTS
  };

  //=========SEND AUTO=======================
  const sendMessageAuto = async (spokenText) => {
    if (!spokenText || !conversationId) return;

    setMessages((prev) => [...prev, { role: "user", text: spokenText }]);

    const res = await fetch("http://127.0.0.1:5000/conversation/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        text: spokenText,
      }),
    });

    const data = await res.json();
    const reply = data.reply;

    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: reply },
    ]);

  // Text → Speech
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "en-US";

    utterance.onend = () => {
      //if (autoMode) startListening();
      if(autoMode){
        setTimeout(()=>{
          startAutoTest(); //mic fake
        }, 800)
      }
    };

    window.speechSynthesis.speak(utterance);
};

//TESTING
const startAutoTest = async () => {
  if (testIndex >= fakeScripts.length) return;

  const text = fakeScripts[testIndex];
  console.log("AUTO TEST USER:", text);

  await sendMessageAuto(text);
  setTestIndex((prev) => prev + 1);
};



//
const startListening = () => {
  if (!recognition || listening) return;
  setListening(true);
  recognition.start();
};

const stopListening = () => {
  if (!recognition) return;
  recognition.stop();
  setListening(false);
};



  // ================= DICTIONARY =================
  const lookupWord = async (word) => {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await res.json();

    // Parse dữ liệu
    const entry = data[0];
    const meaning = entry.meanings?.[0];
    const definitionObj = meaning?.definitions?.[0];

    setSelectedWord({
      word: entry.word,
      phonetic: entry.phonetic || "",
      partOfSpeech: meaning?.partOfSpeech || "",
      definition: definitionObj?.definition || "No definition found.",
      example: definitionObj?.example || "No example available.",
    });
  } catch (err) {
    console.error("Dictionary error", err);
    setSelectedWord({
      word,
      definition: "Word not found.",
      example: "",
    });
  }
};


  const renderText = (text) =>
    text.split(" ").map((w, i) => {
      const clean = w.replace(/[.,!?]/g, "").toLowerCase();
      return (
        <span
          key={i}
          onClick={() => lookupWord(clean)}
          style={{
            cursor: "pointer",
            marginRight: 4,
            color: "blue",
          }}
        >
          {w}
        </span>
      );
    });


    let recognition;

    if ("webkitSpeechRecognition" in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
    
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        console.log("STT:", text);
      
        setInput(text);
        sendMessageAuto(text);
      };
    
      recognition.onerror = (e) => {
        console.error("Speech error:", e);
        setListening(false);
      };
    
      recognition.onend = () => {
        if (autoMode) {
          setListening(false);
        }
      };
    }




  // ================= UI =================
  return (
    <div>
      <DictionaryPopup
        word={selectedWord}
        onClose={() => setSelectedWord(null)}
      />

      <h2>English Speaking Practice - 22880013</h2>

      {!conversationId && (
        <div>
          <button
            onClick={() =>
              startConversation("Ordering Coffee", "Beginner")
            }
          >
            Ordering Coffee
          </button>

          <button
            onClick={() =>
              startConversation("Job Interview", "Advanced")
            }
          >
            Job Interview
          </button>
        </div>
      )}
      <button
  onClick={() => {
    if (!autoMode) {
      setAutoMode(true);
      startListening();
    } else {
      setAutoMode(false);
      stopListening();
    }
  }}
  style={{
    background: autoMode ? "green" : "gray",
    color: "white",
    padding: "6px 12px",
    marginBottom: 10,
  }}
>
  {autoMode ? "Auto Mode ON 🎙️" : "Auto Mode OFF"}
</button>

<button
  onClick={() => {
    setAutoMode(true);
    setTestIndex(0);
    startAutoTest();
  }}
  style={{
    background: "#444",
    color: "white",
    padding: "6px 12px",
    marginLeft: 10,
  }}
>
  ▶ Auto Test (No Mic)
</button>


      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <b>{m.role}:</b> {renderText(m.text)}
            <button
              onClick={() => speakText(m.text)}
              style={{ marginLeft: 8 }}>
              🔊
            </button>
          </div>
        ))}
      </div>

      {conversationId && (
        <div style={{ marginTop: 10 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
