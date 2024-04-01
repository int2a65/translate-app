"use client"

import styles from "./page.module.css";

import { useState } from 'react'

export default function Home() {
  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState<true | false | null>(null);
  const [inputText, setInputText] = useState('');

  const classify = async (text: string) => {
    if (!text) return;
    if (ready === null) setReady(false);
      // If this is the first time we've made a request, set the ready flag.
    //if (!ready) setReady(true);
    // Make a request to the /classify route on the server.
    const result = await fetch(`/classify?text=${encodeURIComponent(text)}`);

    const json = await result.json();
    
    setReady(true);
    setResult(json[0].translation_text);
   
  };

  return (
    <main className={styles.main}>
      <div className="translate-app-container">
        <div className="translate-app-input-container">
          <textarea
          dir="ltr"
          className="translate-app-input"
          placeholder="Enter text here"
          onInput={e => {
            const target = e.target as HTMLTextAreaElement;
            setInputText(target.value);
          }}
        />
        <button 
          className="translate-app-translate-button"
          onClick={() => {
            classify(inputText);
          }}>translate</button>
        </div>
      <div className="translate-app-content">
        Translation text
        {ready !== null && (
          <div className="bg-gray-100 p-2 rounded">
            {
              (!ready || !result) ? 'Loading...' : result}
          </div>
        )}
      </div>
      <div className="translate-app-footer">
        <div>using facebook/nllb-200-distilled-600M</div>
      </div>
      </div>
    </main>
  );
}
