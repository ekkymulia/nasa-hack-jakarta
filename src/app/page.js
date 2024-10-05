'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] min-h-screen font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: "url('/img/globe.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main className="p-8 grid grid-cols-2 gap-11 justify-items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="my-10">
            <h1 className="text-4xl text-center text-white py-20">Globe Guard</h1>
          </div>
          <div className="pt-24 mt-24 flex flex-col gap-8">
            <Button
              onClick={() => router.push('/room/join')}
              className="px-40 py-10 text-2xl rounded-3xl shadow-2xl"
              variant="secondary"
            >
              Join Room
            </Button>
            <Button
              onClick={() => router.push('/room/create')}
              className="px-40 py-10 text-2xl rounded-3xl shadow-2xl"
              variant="secondary"
            >
              Make Room
            </Button>
            <Button
              onClick={() => router.push('/how-to-play')}
              className="px-40 py-10 text-2xl rounded-3xl shadow-2xl"
              variant="secondary"
            >
              How to Play
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
