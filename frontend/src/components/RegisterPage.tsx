import { useState } from "react";

export function RegisterPage({ onRegister }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => onRegister(username, email, password)}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          Register
        </button>
      </div>
    </div>
  );
}