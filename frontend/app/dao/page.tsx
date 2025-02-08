"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import MovieDAOABI from "../../abis/MovieDAO.json";
import { useSearchParams } from "next/navigation";
import { fetchScriptFromIPFS, generateScript, proposeEdit, vote, finalizeVote } from "@/utils/contracts";

const DAOPage = () => {
  const searchParams = useSearchParams();
  const daoAddress = searchParams.get("daoAddress");
  const { data: WalletClient } = useWalletClient();
  const { address } = useAccount();

  const [members, setMembers] = useState([]);
  const [script, setScript] = useState("");
  const [proposedScript, setProposedScript] = useState("");
  const [scriptInput, setScriptInput] = useState("");
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);
  const [votingActive, setVotingActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (daoAddress && WalletClient) {
      fetchMembers();
      fetchScript();
    }
  }, [daoAddress, WalletClient]);

  const fetchMembers = async () => {
    try {
      const provider = new ethers.BrowserProvider(WalletClient.transport);
      const daoContract = new ethers.Contract(daoAddress, MovieDAOABI, provider);
      const membersList = await daoContract.getMembers();
      setMembers(membersList);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchScript = async () => {
    try {
      const provider = new ethers.BrowserProvider(WalletClient.transport);
      const daoContract = new ethers.Contract(daoAddress, MovieDAOABI, provider);
      const scriptCID = await daoContract.getScript();
      if (scriptCID) {
        const scriptText = await fetchScriptFromIPFS(scriptCID);
        setScript(scriptText);
      }
    } catch (error) {
      console.error("Error fetching script:", error);
    }
  };


  const handleGenerateScript = async () => {
    if (!scriptInput.trim()) return;
    setLoading(true);
    const signer = await WalletClient.getSigner();
    await generateScript(scriptInput, daoAddress, signer);
    setScriptInput("");
    fetchScript();
    setLoading(false);
  };

  const handleProposeEdit = async () => {
    if (!scriptInput.trim()) return;
    const signer = await WalletClient.getSigner();
    await proposeEdit(scriptInput, daoAddress, signer);
    setScriptInput("");
  };

  const handleVote = async (approve) => {
    const signer = await WalletClient.getSigner();
    await vote(daoAddress, approve, signer);
  };

  const handleFinalizeVote = async () => {
    const signer = await WalletClient.getSigner();
    await finalizeVote(daoAddress, signer);
    fetchScript();
  };

  console.log("script", script);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-yellow-500">Movie DAO Members</h1>
      <p className="text-gray-400 mb-4">DAO Address: {daoAddress}</p>

      {members.length === 0 ? (
        <p className="text-gray-400">No members yet.</p>
      ) : (
        <ul className="w-full max-w-2xl">
          {members.map((member, index) => (
            <li key={index} className="bg-gray-900 p-3 rounded-lg mb-2 border border-yellow-500">
              {member}
            </li>
          ))}
        </ul>
      )}

      {/* Script Section */}
      <div className="w-full max-w-2xl mt-6 bg-gray-900 p-6 rounded-lg border border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-500 mb-2">Script</h2>

        {/* Show the Script Box when a script is generated */}
        {script && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <p className="text-white">{script}</p>
          </div>
        )}

        {/* Founder View: Generate Script */}
        {address === members[0] ? (
          <div className="flex flex-col">
            <textarea
              className="p-2 bg-gray-700 text-white rounded-lg resize-none mb-2"
              rows={4}
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder="Enter your script here..."
            />
            <button
              className="py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition duration-300"
              onClick={handleGenerateScript}
            >
              {loading ? "Uploading..." : "Generate Script"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <textarea
              className="p-2 bg-gray-700 text-white rounded-lg resize-none mb-2"
              rows={4}
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder="Waiting for the founder to generate the script..."
              disabled
            />
            <button
              className={`py-2 px-4 font-bold rounded-lg transition duration-300 ${
                script
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!script}
            >
              {script ? "Propose Script" : "Waiting for Founder to generate script..."}
            </button>
          </div>
        )}
      </div>

      {/* Voting Section */}
      {votingActive && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-yellow-500 mb-2">Vote on Proposed Script</h2>
          <button className="mr-4 px-4 py-2 bg-green-500 text-white rounded" onClick={() => handleVote(true)}>Vote YES</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleVote(false)}>Vote NO</button>
          {address === members[0] && (
            <button className="ml-4 px-4 py-2 bg-yellow-500 text-black rounded" onClick={handleFinalizeVote}>
              Finalize Voting
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DAOPage;
