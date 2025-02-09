// import { ethers } from "ethers";
// import { Web3Storage } from "web3.storage";
// import MovieDAOABI from "../abis/MovieDAO.json";

import { ethers } from "ethers";
// import pinataSDK from "@pinata/sdk";
// import MovieDAOABI from "../abis/MovieDAO.json";

// // Initialize Web3Storage client
// const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY });

// const API_KEY = "c54750891e3e561bfda6"
// const API_SECRET = "0950f005c881cd1faa55002212ebc5e836ffb45701d991c03aab03237271f561"
// // Initialize Pinata client with your Pinata API key and secret
// const pinata = new pinataSDK(API_KEY, API_SECRET);


// // Upload script to IPFS
// export const uploadToIPFS = async (script) => {
//   const blob = new Blob([script], { type: "text/plain" });
//   const cid = await client.put([new File([blob], "script.txt")]);
//   return cid;
// };

// // Generate script on the blockchain
// export const generateScript = async (script, daoAddress, signer) => {
//   const cid = await uploadToIPFS(script);
//   const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
//   await contract.generateScript(cid);
// };

// // Fetch script from IPFS
// export const fetchScriptFromIPFS = async (cid) => {
//   const response = await fetch(`https://${cid}.ipfs.w3s.link/script.txt`);
//   return await response.text();
// };

// // Propose an edit to the script
// export const proposeEdit = async (script, daoAddress, signer) => {
//   const cid = await uploadToIPFS(script);
//   const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
//   await contract.proposeEdit(cid);
// };

// // Vote on a proposed script
// export const vote = async (daoAddress, approve, signer) => {
//   const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
//   await contract.vote(approve);
// };

// // Finalize voting process
// export const finalizeVote = async (daoAddress, signer) => {
//   const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
//   await contract.finalizeVoting();
// };


// Upload script to IPFS (using Pinata)
// export const uploadToIPFS = async (script) => {
//   // Create a Blob object from the script text
//   const blob = new Blob([script], { type: "text/plain" });
//   console.log("blob", blob)

//   // Create a file object for Pinata
//   const file = new File([blob], "script.txt");
//   console.log("file", file)

//   // Pin the file to IPFS
//   const result = await pinata.pinFileToIPFS(file);
//   console.log("result", result)
//   const cid = result.IpfsHash;
//   console.log("cid", cid)
//   return cid;
// };

// // Generate script on the blockchain (using Pinata)
// export const generateScript = async (script, daoAddress, signer) => {
//   const cid = await uploadToIPFS(script);  // Upload the script to IPFS via Pinata
//   const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
//   await contract.generateScript(cid);
// };

// // Fetch script from IPFS (using Pinata)
// export const fetchScriptFromIPFS = async (cid) => {
//   const url = https://gateway.pinata.cloud/ipfs/${cid}/script.txt;
//   const response = await fetch(url);
//   return await response.text();
// };

// // Propose an edit to the script (using Pinata)
// export const proposeEdit = async (script, daoAddress, signer) => {
//   const cid = await uploadToIPFS(script);  // Upload the new script to IPFS via Pinata
//   const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
//   await contract.proposeEdit(cid);
// };

// Vote on a proposed script (no changes here)
export const vote = async (daoAddress, approve, signer) => {
  const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
  await contract.vote(approve);
};

// Finalize voting process (no changes here)
export const finalizeVote = async (daoAddress, signer) => {
  const contract = new ethers.Contract(daoAddress, MovieDAOABI, signer);
  await contract.finalizeVoting();
};