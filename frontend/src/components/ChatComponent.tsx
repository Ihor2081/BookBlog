import { useEffect, useState, useRef } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
}

export function ChatComponent({ roomId, currentRole }: { roomId: string, currentRole: "user" | "admin" }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Відкриваємо WebSocket-з'єднання до нашого FastAPI на Render або localhost
    // Заміни ws://localhost:8000 на wss://bookblog-backend-acui.onrender.com у деплої
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}`);

    ws.current.onmessage = (event) => {
      const newMessage: Message = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMessage]);
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim() || !ws.current) return;

    const messageData: Message = {
      sender: currentRole,
      text: input,
    };

    // Відправляємо в WebSocket -> він полетить в Redis -> повернеться всім учасникам кімнати
    ws.current.send(JSON.stringify(messageData));
    setInput("");
  };

  return (
    <div className="p-4 border rounded-xl max-w-md mx-auto bg-white shadow">
      <h3 className="font-bold mb-4">Чат (Кімната: {roomId})</h3>
      <div className="h-64 overflow-y-auto border p-2 rounded mb-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded max-w-[70%] ${
            msg.sender === currentRole ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
          }`}>
            <p className="text-sm">{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          className="flex-1 border p-2 rounded"
          placeholder="Напишіть повідомлення..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded">
          Надіслати
        </button>
      </div>
    </div>
  );
}

export default ChatComponent