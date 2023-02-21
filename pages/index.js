import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [chatHistory, setChatHistory] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userQuery: userInput }),
      });
      const data = await response.json();
      setLoading(false);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setChatHistory([{ speaker: "Question", message: " " + userInput }, { speaker: "Chat bot", message: data.result }, ...chatHistory]);
      setResult(data.result);
      setUserInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Your AI Mitra</title>
        <link rel="icon" href="/bot3.png" />
      </Head>
      <main className={styles.main}>
        <img src="/bot3.png" className={styles.icon} />
        <h3>Chat bot</h3><p>powered by GPT-3</p>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="userQuery"
            placeholder="Ask me anything?"
            value = {userInput}
            autocomplete="off"
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value={loading ? "Loading..." : "Submit"} disabled={loading} />
        </form>
        <div>
             {chatHistory.map((chat, index) => (
                <div key={index}>
                  <p>
                    <span className={styles.result}>{chat.speaker}:</span>
                    {chat.message}
                  </p>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
