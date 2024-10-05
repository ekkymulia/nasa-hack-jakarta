'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function JoinRoom() {
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
                <Input type="text" id="username" placeholder="Username" className="py-6 bg-white text-black rounded-lg" />
            </div>
            <Button className="px-28 py-6 text-xl rounded-3xl shadow-2xl" variant="secondary">Create Room</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
