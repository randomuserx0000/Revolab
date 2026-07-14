"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente virtual de Revolab. Puedo ayudarte con información sobre nuestros medicamentos de nueva generación, kits de cirugía, certificaciones y más. ¿En qué puedo ayudarte?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error al obtener respuesta");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ocurrió un problema al contactar al asistente. Por favor intenta de nuevo o escríbenos por WhatsApp al +58 414-2772050.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        className="chat-toggle-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5C21 16.7467 16.7467 21 11.5 21C10.1077 21 8.78764 20.7014 7.6 20.1647L3 21L4.35317 17.1621C3.49743 15.7734 3 14.147 3 12.5C3 6.7533 7.7533 2 13.5 2"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="18" cy="6" r="4" fill="#F7B668" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <p className="chat-header-title">Asistente Revolab</p>
              <p className="chat-header-subtitle">En línea</p>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble-row chat-bubble-row--${msg.role}`}>
                <div className={`chat-bubble chat-bubble--${msg.role}`}>{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-bubble-row chat-bubble-row--assistant">
                <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              className="chat-input"
              placeholder="Escribe tu consulta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="chat-send-button"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Enviar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 12L21 3L15 21L11 13L2 12Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-toggle-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: var(--color-1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          z-index: 1000;
          transition: transform 0.2s;
        }

        .chat-toggle-button:hover {
          transform: scale(1.05);
        }

        .chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: min(360px, calc(100vw - 32px));
          height: min(520px, calc(100vh - 140px));
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1000;
          font-family: var(--font-manrope);
        }

        .chat-header {
          background-color: var(--color-6);
          color: white;
          padding: 16px 20px;
          display: flex;
          align-items: center;
        }

        .chat-header-title {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
        }

        .chat-header-subtitle {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #4caf50;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background-color: #f5f6f8;
        }

        .chat-bubble-row {
          display: flex;
        }

        .chat-bubble-row--user {
          justify-content: flex-end;
        }

        .chat-bubble-row--assistant {
          justify-content: flex-start;
        }

        .chat-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .chat-bubble--user {
          background-color: var(--color-1);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .chat-bubble--assistant {
          background-color: white;
          color: var(--color-6);
          border: 1px solid #e0e0e0;
          border-bottom-left-radius: 4px;
        }

        .chat-bubble--typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 14px;
        }

        .chat-bubble--typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #999;
          animation: typing-bounce 1.2s infinite ease-in-out;
        }

        .chat-bubble--typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chat-bubble--typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing-bounce {
          0%,
          60%,
          100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

        .chat-input-row {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #e0e0e0;
          background-color: white;
        }

        .chat-input {
          flex: 1;
          resize: none;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          padding: 10px 16px;
          font-size: 14px;
          font-family: var(--font-manrope);
          max-height: 100px;
          outline: none;
        }

        .chat-input:focus {
          border-color: var(--color-1);
        }

        .chat-send-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--color-1);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s, opacity 0.15s;
        }

        .chat-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-send-button:not(:disabled):hover {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
}
