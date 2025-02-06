"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient  } from "wagmi";

// Import ABI of MovieDAOFactory contract
import MovieDAOFactoryABI from "../../abis/MovieDAOFactory.json";

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT || "";

const CreateDAOForm = () => {
  const [movieName, setMovieName] = useState("");
  const [daos, setDaos] = useState([]);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleCreateDAO = async () => {
    if (!walletClient) {
      alert("Please connect your wallet!");
      return;
    }

    try {
      const factoryContract = new ethers.Contract(factoryAddress, MovieDAOFactoryABI, walletClient);
      console.log("Creating DAO for movie: ", movieName);   
      const tx = await factoryContract.createMovieDAO(movieName);
      console.log("Transaction : ", tx);
      await tx.wait();
      alert("Movie DAO created successfully!");
      fetchDAOs(); // Refresh DAO list after creation
    } catch (error) {
      console.error(error);
      alert("Error creating DAO");
    }
  };

  const fetchDAOs = async () => {
    if (!walletClient) return;

    try {
      const factoryContract = new ethers.Contract(factoryAddress, MovieDAOFactoryABI, walletClient);
      const daoList = await factoryContract.getDAOs();
      console.log("DAOs: ", daoList);
      setDaos(daoList);
    } catch (error) {
      console.error(error);
      alert("Error fetching DAOs");
    }
  };

  useEffect(() => {
    if (walletClient) fetchDAOs();
  }, [walletClient]);

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
