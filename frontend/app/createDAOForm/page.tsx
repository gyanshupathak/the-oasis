"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient, useSwitchChain } from "wagmi";
import { useRouter } from "next/navigation";

// Import ABI of MovieDAOFactory contract
import MovieDAOFactoryABI from "../../abis/MovieDAOFactory.json";
import MovieDAOABI from "../../abis/MovieDAO.json";
import Link from "next/link";

const factoryAddress = "0xf83d5c4cfc7d63afe0b69c2ead699c003b668901";

const CreateDAOForm = () => {
  const [movieName, setMovieName] = useState("");
  const [daos, setDaos] = useState([]);
  const [members, setMembers] = useState([]);
  const [joining, setJoining] = useState(false);
  const { address } = useAccount();
  const { data: WalletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const router = useRouter()

  const handleCreateDAO = async () => {
    if (!WalletClient) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(WalletClient.transport);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(84532)) {
        await switchChain?.({ chainId: 84532 });
        throw new Error("Please switch to Base Sepolia to continue.");
      }
      const factoryContract = new ethers.Contract(factoryAddress, MovieDAOFactoryABI, signer);
      console.log("Creating DAO for movie: ", factoryContract);
      const tx = await factoryContract.createMovieDAO(movieName);
      console.log("Transaction : ", tx);
      await tx.wait();
      alert("Movie DAO created successfully!");
      fetchDAOs();
    } catch (error) {
      console.error(error);
      alert("Error creating DAO");
    }
  };

  const fetchDAOs = async () => {
    if (!WalletClient) return;
    try {
      const provider = new ethers.BrowserProvider(WalletClient.transport);
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(84532)) {
        await switchChain?.({ chainId: 84532 });
        throw new Error("Please switch to Base Sepolia to continue.");
      }
      const factoryContract = new ethers.Contract(factoryAddress, MovieDAOFactoryABI, provider);
      const daoList = await factoryContract.getDAOs();
      console.log("DAOs: ", daoList);
      setDaos(daoList);
    } catch (error) {
      console.error(error);
      alert("Error fetching DAOs");
    }
  };

  const handleJoinDAO = async (daoAddress) => {
    if (!WalletClient) {
      alert("Please connect your wallet!");
      return;
    }
    try {
      setJoining(true);
      const provider = new ethers.BrowserProvider(WalletClient.transport);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(84532)) {
        await switchChain?.({ chainId: 84532 });
        throw new Error("Please switch to Base Sepolia to continue.");
      }
      const daoContract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
      const tx = await daoContract.joinMovieDAO();
      await tx.wait();
      alert("Joined DAO successfully!");
      setJoining(false);
      router.push(`/dao?daoAddress=${daoAddress}`);
    } catch (error) {
      console.error(error);
      alert("Error joining DAO");
    }
  };

  useEffect(() => {
    if (WalletClient) fetchDAOs();
  }, [WalletClient]);

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Sidebar for Creating DAO */}
      <div className="w-1/4 bg-red-700 p-6 flex flex-col items-start">
        <h1 className="text-xl font-bold mb-4">Create a Movie DAO</h1>
        <input
          type="text"
          placeholder="Enter Movie Name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-yellow-500 text-black focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        />
        <button
          onClick={handleCreateDAO}
          className="bg-yellow-400 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition duration-300"
        >
          Create DAO
        </button>
      </div>

      {/* Main Section for DAOs */}
      <div className="w-3/4 p-6">
        <h2 className="text-3xl font-bold text-yellow-500 mb-6">Existing Movies</h2>
        <ul className="w-full">
          {daos.length === 0 ? (
            <p className="text-gray-400">No DAOs found. Create one!</p>
          ) : (
            daos.map((dao: any, index) => (
              <li key={index} className="bg-gray-900 p-4 rounded-lg mb-3 border border-yellow-500">
                <p className="text-yellow-500 font-bold">Movie Name: {dao.movieName}</p>
                <p className="text-gray-400">Creator: {dao.creator}</p>
                <p className="text-gray-400">DAO Address: {dao.daoAddress}</p>
                {address === dao.creator ? (
                  <Link href={`/dao?daoAddress=${dao.daoAddress}`}>
                    <button className="py-2 px-4 text-black rounded-lg font-bold transition duration-300 bg-yellow-400 hover:bg-yellow-600">
                      Open
                    </button>
                  </Link>
                ) : (
                    <button
                      className="py-2 px-4 text-black rounded-lg font-bold transition duration-300 bg-yellow-400 hover:bg-yellow-600"
                      disabled={joining} // Disable button while joining
                      onClick={() => handleJoinDAO(dao.daoAddress)}
                    >
                      {joining ? "Joining..." : "Join"}
                    </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CreateDAOForm;
