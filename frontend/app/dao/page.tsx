"use client";

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useWalletClient } from "wagmi";
import MovieDAOABI from "../../abis/MovieDAO.json";
import { useSearchParams } from "next/navigation";
import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMjBiODU0ZS0wOTVkLTRhNDctYjFlYy01YjEyZTE3MjM1YTIiLCJlbWFpbCI6InBhdGhha2d5YW5zaHVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImM1NDc1MDg5MWUzZTU2MWJmZGE2Iiwic2NvcGVkS2V5U2VjcmV0IjoiMDk1MGYwMDVjODgxY2QxZmFhNTUwMDIyMTJlYmM1ZTgzNmZmYjQ1NzAxZDk5MWMwM2FhYjAzMjM3MjcxZjU2MSIsImV4cCI6MTc3MDU4MzQxMn0.jGrYTNPyhLN1iqlMzHZ3Dn7BARXsG7vKB8XJUC-eTlo",
  pinataGateway: "scarlet-fantastic-marmot-419.mypinata.cloud",
});
import { vote, finalizeVote } from "@/utils/contracts";

const DAOPage = () => {
  const searchParams = useSearchParams();
  const daoAddress = searchParams.get("daoAddress");
  const { data: WalletClient } = useWalletClient();
  const { address } = useAccount();

  const [members, setMembers] = useState([]);
  const [script, setScript] = useState();
  const [userScript, setUserScript] = useState(null);
  const [proposedScript, setProposedScript] = useState("");
  const [scriptInput, setScriptInput] = useState("");
  const [yesVotes, setYesVotes] = useState(0);
  const [noVotes, setNoVotes] = useState(0);
  const [votingActive, setVotingActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(true);
  const [IpfsHash, setIpfsHash] = useState("");
  const [ProposalSigner, setProposalSigner] = useState("");

  console.log("ProposalSigner Type:", typeof ProposalSigner); 
  console.log("Address Type:", typeof address);

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
      const ipfsHash = await fetch("http://localhost:5000/get-hash", 
      );
      const dataHash = await ipfsHash.json();
      console.log("data", dataHash);

      const getSigner = await fetch(`http://localhost:5000/get-signer/${dataHash.ipfs_hash}`);
      const dataSigner = await getSigner.json();
      console.log("dataSigner", dataSigner);
      setProposalSigner(dataSigner.signer_address);

      const get = await pinata.gateways.get(dataHash.ipfs_hash);
      console.log("GET", get);
      setScript(get.data?.script);
      setScriptLoading(false);
      
      // Ensure it's a string before setting state
      // if (typeof get === "object") {
      //     setScript(JSON.stringify(get, null, 2));  // Convert object to readable JSON
      // } else {
      //     setScript(get);
      // }
  } catch (error) {
      console.error("Error fetching script:", error);
  }
  };

  // async function uploadToIPFS(name, content) {
  //   const file = new File([content], "Texting.txt", { type: "text/plain" });
  //   const upload = await pinata.upload.file(file);
  //   setUpload(upload);
  //   console.log("upload", upload)
  //   return upload;
  // }

  const uploadScript = async (data, daoAddress, signer) => {
        console.log("data", data , daoAddress, signer)
        setUserScript(data.script);
        const fileContent = JSON.stringify(data, null, 2); // Convert data to a JSON string
        const file = new File([fileContent], "Testing.txt", { type: "application/json" });
        // const file = new File([JSON.stringify(data, null, 2)], "Testing.txt", { type: "application/json" });
        console.log("file", file)
        const upload = await pinata.upload.file(file);
        if (upload && upload.IpfsHash) {

          const response = await fetch(`http://localhost:5000/store-hash/${signer.address}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hash: upload.IpfsHash }),
          });
          const storedHash = await response.json();
          console.log("storedHash", storedHash);
          await fetchScript();
          console.log("ipfsHash", upload.IpfsHash);
    // const cid = await uploadToIPFS(signer.address , script);  // Upload the script to IPFS via Pinata
    // console.log("cid", cid)
    // const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
    // await contract.generateScript(cid);
    };
  };

  const handleGenerateScript = async () => {
    if (!scriptInput.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieIdea: scriptInput }),
      });

      const data = await response.json();
      if (response.ok) {
        const provider = new ethers.BrowserProvider(WalletClient.transport);
        const signer = await provider.getSigner();
        await uploadScript(data, daoAddress, signer);
        } else {
          console.error("Upload failed or IpfsHash is missing:");
          return; // Exit early to avoid further errors
        }
        // console.log(upload);
        // // setUpload(upload);
        // console.log("upload",upload);

      // const get = await pinata.gateways.get("bafkreifsrsklegk4r3jft4fucwvo4pzzwczjecsfg5qrjgp2arevnel2ee");
      // console.log("GET", get)
      // await fetchScript();
    // } else {
    //   console.error("Failed to generate script:", data.error);
    // }
  } catch (error) {
    console.error("Error generating script:", error);
  } finally {
    setLoading(false);
    setScriptInput("");
  }
  };

  // const handleProposeEdit = async () => {
  //   if (!scriptInput.trim()) return;
  //   const signer = await WalletClient.getSigner();
  //   await proposeEdit(scriptInput, daoAddress, signer);
  //   setScriptInput("");
  // };

  const handleVote = async (approve) => {
    const signer = await WalletClient.getSigner();
    await vote(daoAddress, approve, signer);
  };

  // const handleFinalizeVote = async () => {
  //   const signer = await WalletClient.getSigner();
  //   await finalizeVote(daoAddress, signer);
  //   fetchScript();
  // };

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
      <h2 className="text-md font-light text-yellow-500 mb-2">{script}</h2>
      <h2 className="text-md font-light italic text-white mb-2">Proposed by : {ProposalSigner}</h2>

      {/* Script Section */}
      <div className="w-full max-w-2xl mt-6 bg-gray-900 p-6 rounded-lg border border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-500 mb-2">Script</h2>

        {/* Show the Script Box when a script is generated */}
        {userScript && (
          <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
            <p className="text-white">{userScript}</p>
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
              disabled={!scriptLoading}
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
              placeholder="Propose script prompt..."
            />
            <button
              className={`py-2 px-4 font-bold rounded-lg transition duration-300 ${
                script
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!script}
              onClick={handleGenerateScript}
            >
              {script ? "Propose Script" : "Waiting for Founder to generate script..."}
            </button>
          </div>
        )}
      </div>

      {/* Voting Section */}
      { ProposalSigner !== address && (
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
