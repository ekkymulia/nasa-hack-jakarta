'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

const postRoom = async (data) => {
  const response = await fetch("/api/room", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create room');
  }

  return response.json(); // Return response data
};

export default function JoinRoom() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const { room_code, id } = await postRoom({ username }); // Expect roomCode in response
      Cookies.set('username', username); // Store username in cookie
      Cookies.set('roomCode', room_code); // Store room code in cookie
      Cookies.set('roomId', id);
      router.push("/play/select-country");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] min-h-screen font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: "url('/img/globe.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="p-8 justify-items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="my-10">
            <h1 className="text-4xl text-center text-white items-center py-20">Create Room</h1>
          </div>
          <div className="pt-24 mt-24 flex flex-col gap-8">
            <div className="grid w-full max-w-sm items-center gap-1.5 text-white">
              <Label htmlFor="username">Username</Label>
              <Input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                placeholder="Username"
                className="py-6 bg-white text-black rounded-lg"
              />
            </div>
            <Button onClick={handleClick} className="px-28 py-6 text-xl rounded-3xl shadow-2xl" variant="secondary">
              Create Room
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
