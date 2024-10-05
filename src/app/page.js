import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
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
              <h1 className="text-4xl text-center text-white items-center py-20">Globe Guard</h1>
          </div>
          <div className="pt-24 mt-24 flex flex-col gap-8">
            <Button className="px-40 py-10 text-2xl rounded-3xl shadow-2xl" variant="secondary">Join Room</Button>
            <Button className="px-40 py-10 text-2xl rounded-3xl shadow-2xl" variant="secondary">Make Room</Button>
            <Button className="px-40 py-10 text-2xl rounded-3xl shadow-2xl" variant="secondary">How to Play</Button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
            <img src="/img/globeguard.png" alt="Globe" className="w-96 h-96 rounded-full" />
        </div>
      </main>
    </div>
  );
}
