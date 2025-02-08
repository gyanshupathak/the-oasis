import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">Welcome to the Oasis</h1>
        <p className="text-lg text-black-200 mb-8">
          Your gateway to decentralized movie DAOs. Start your journey now!
        </p>
        <Link href="/createDAOForm">
          <button className="py-3 px-8 bg-yellow-400 text-black font-bold rounded-full text-lg shadow-lg hover:bg-yellow-600 transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
