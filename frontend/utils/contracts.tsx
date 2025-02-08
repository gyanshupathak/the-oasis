import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import MovieDAOABI from "../abis/MovieDAO.json";

// Initialize Web3Storage client
const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY });

// Upload script to IPFS
export const uploadToIPFS = async (script) => {
  const blob = new Blob([script], { type: "text/plain" });
  const cid = await client.put([new File([blob], "script.txt")]);
  return cid;
};

// Generate script on the blockchain
export const generateScript = async (script, daoAddress, signer) => {
  const cid = await uploadToIPFS(script);
  const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
  await contract.generateScript(cid);
};

// Fetch script from IPFS
export const fetchScriptFromIPFS = async (cid) => {
  const response = await fetch(`https://${cid}.ipfs.w3s.link/script.txt`);
  return await response.text();
};

// Propose an edit to the script
export const proposeEdit = async (script, daoAddress, signer) => {
  const cid = await uploadToIPFS(script);
  const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
  await contract.proposeEdit(cid);
};

// Vote on a proposed script
export const vote = async (daoAddress, approve, signer) => {
  const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
  await contract.vote(approve);
};

// Finalize voting process
export const finalizeVote = async (daoAddress, signer) => {
  const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
  await contract.finalizeVoting();
};
