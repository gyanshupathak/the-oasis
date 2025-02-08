"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected the connection");
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask!");
    }
  };

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) setAccount(accounts[0]);
      }
    };
    checkWalletConnection();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative">
      <div className="absolute top-6 right-6">
        <button
          onClick={connectWallet}
          className="py-3 px-6 bg-blue-500 text-white font-medium rounded-lg text-sm shadow-md hover:bg-blue-700 transition duration-300"
        >
          {account ? `${account.slice(0, 4)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>

      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
          Welcome to the Oasis
        </h1>
        <p className="text-lg text-gray-400 mb-8">
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
