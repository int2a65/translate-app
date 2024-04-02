"use client"

import styles from "./page.module.css";

import { useState, useRef, useEffect, useCallback} from 'react'

export default function Home() {
  // Keep track of the classification result and the model loading status.
  const [result, setResult] = useState(null);
  const [ready, setReady] = useState<true | false | null>(null);
  const [inputText, setInputText] = useState('');

  // Create a reference to the worker object.
  const worker = useRef<object | any | null>(null);

  // We use the `useEffect` hook to set up the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: any) => { 
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          break;
        case 'ready':
          setReady(true);
          break;
        case 'complete':
          console.log('complete', e.data.output)
          setResult(e.data.output[0]?.translation_text)
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const classify = useCallback((text: String) => {
    if (worker.current) {
      worker.current.postMessage({ text });
    }
  }, []);


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
