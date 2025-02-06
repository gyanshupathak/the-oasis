"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient, useSwitchChain } from "wagmi";

// Import ABI of MovieDAOFactory contract
import MovieDAOFactoryABI from "../../abis/MovieDAOFactory.json";

const factoryAddress = "0x518160f7d75ffd6fd78e7901e6302928a6aa68f3";

const CreateDAOForm = () => {
  const [movieName, setMovieName] = useState("");
  const [daos, setDaos] = useState([]);
  const { address } = useAccount();
  const { data: WalletClient  } = useWalletClient ();
  const { switchChain } = useSwitchChain(); 

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
        // Prompt user to switch to Base Sepolia
        await switchChain?.({ chainId: 84532 }); // Switch to Base Sepolia
        throw new Error("Please switch to Base Sepolia to continue.");
      }
      const factoryContract = new ethers.Contract(factoryAddress, MovieDAOFactoryABI, signer);
      console.log("Creating DAO for movie: ", movieName);   
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
        // Prompt user to switch to Base Sepolia
        await switchChain?.({ chainId: 84532 }); // Switch to Base Sepolia
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

  useEffect(() => {
    if (WalletClient) fetchDAOs();
  }, [WalletClient]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Create a Movie DAO</h1>
      <input
        type="text"
        placeholder="Enter Movie Name"
        value={movieName}
        onChange={(e) => setMovieName(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <button onClick={handleCreateDAO} style={{ padding: "10px", cursor: "pointer" }}>
        Create DAO
      </button>

      <h2>Existing DAOs</h2>
      <ul>
        {daos.map((dao: any, index) => (
          <li key={index}>
            <p>Movie Name: {dao.movieName}</p>
            <p>Creator Address: {dao.creator}</p>
            <p>DAO Address: {dao.daoAddress}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateDAOForm;
