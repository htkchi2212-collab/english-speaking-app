export default function DictionaryPopup({ word, onClose }) {
  if (!word) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        width: 300,
        background: "#fff",
        color: "#000",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 999,
      }}
    >
      <h3>{word.word}</h3>

      {word.phonetic && <p><i>{word.phonetic}</i></p>}

      {word.partOfSpeech && (
        <p><b>({word.partOfSpeech})</b></p>
      )}

      <p>{word.definition}</p>

      {word.example && (
        <p style={{ fontStyle: "italic" }}>
          Example: {word.example}
        </p>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: 10,
          padding: "6px 12px",
          borderRadius: 6,
          border: "none",
          background: "#222",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}
