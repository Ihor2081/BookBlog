import { useEffect, useState, useRef, KeyboardEvent } from "react";

interface Message {
  sender: "user" | "admin";
  text: string;
}

interface ChatProps {
  roomId: string;
  currentRole: "user" | "admin";
}

export function ChatComponent({ roomId, currentRole }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!roomId) return;

  // 1. Обов'язково очищуємо повідомлення попередньої кімнати на екрані,
  // щоб вони не змішувалися з повідомленнями нової кімнати.
    setMessages([]);

  // 2. Динамічно визначаємо базовий хост
    const wsBaseUrl = window.location.hostname === "localhost"
      ? "ws://localhost:8000"
      : "wss://bookblog-backend-acui.onrender.com";

  // 3. Створюємо сокет у ЛОКАЛЬНУ змінну всередині ефекту.
  // Це гарантує, що функція зачистки закриє саме ЦЕ з'єднання.
    const socket = new WebSocket(`${wsBaseUrl}/ws/chat/${roomId}`);
  
  // Також дублюємо його в реф, якщо він потрібен вам в інших функціях (наприклад, для відправки повідомлень)
    ws.current = socket;

    socket.onopen = () => {
       console.log(`WebSocket підключено до кімнати: ${roomId}`);
    };

    socket.onmessage = (event) => {
      try {
        const newMessage: Message = JSON.parse(event.data);
      // Запобігаємо дублюванню: додаємо повідомлення, тільки якщо його ще немає в стейті
      // (актуально, якщо бекенд відправив його одночасно через історію та Pub/Sub)
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) => msg.text === newMessage.text && msg.sender === newMessage.sender
          );
          return isDuplicate ? prev : [...prev, newMessage];
        });
      } catch (error) {
        console.error("Помилка парсингу повідомлення:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Помилка WebSocket з'єднання:", error);
    };

    socket.onclose = () => {
      console.log(`WebSocket для кімнати ${roomId} закрито`);
    };

  // 4. Надійна функція очищення
    return () => {
      console.log(`Клінап: Закриваємо сокет для кімнати ${roomId}`);
      socket.close(); // Закриваємо саме ТОЙ сокет, який був створений у цьому конкретному циклі ефекту
    };
  }, [roomId]);

  const sendMessage = () => {
    // Перевіряємо, чи сокет відкритий перед відправкою (запобігає помилкам CLOSING/CLOSED)
    if (!input.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    const messageData: Message = {
      sender: currentRole,
      text: input,
    };

    ws.current.send(JSON.stringify(messageData));
    setInput("");
  };

  // Функція для відправки повідомлення по натисканню Enter (виправлено типізацію)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="p-4 border rounded-xl max-w-md mx-auto bg-white shadow w-full">
      <h3 className="font-bold mb-4 text-gray-800">Чат (Кімната: {roomId})</h3>
      
      <div className="h-64 overflow-y-auto border p-2 rounded mb-4 bg-gray-50 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded max-w-[70%] text-sm ${
              msg.sender === currentRole
                ? "bg-blue-500 text-white ml-auto rounded-br-none"
                : "bg-gray-200 text-black mr-auto rounded-bl-none"
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border p-2 rounded text-sm outline-none focus:border-blue-500"
          placeholder="Напишіть повідомлення..."
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition"
        >
          Надіслати
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;