// "use client"

// import React, { useState } from "react";
// import { PinataSDK } from "pinata-web3";

// const pinata = new PinataSDK({
//   pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMjBiODU0ZS0wOTVkLTRhNDctYjFlYy01YjEyZTE3MjM1YTIiLCJlbWFpbCI6InBhdGhha2d5YW5zaHVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImM1NDc1MDg5MWUzZTU2MWJmZGE2Iiwic2NvcGVkS2V5U2VjcmV0IjoiMDk1MGYwMDVjODgxY2QxZmFhNTUwMDIyMTJlYmM1ZTgzNmZmYjQ1NzAxZDk5MWMwM2FhYjAzMjM3MjcxZjU2MSIsImV4cCI6MTc3MDU4MzQxMn0.jGrYTNPyhLN1iqlMzHZ3Dn7BARXsG7vKB8XJUC-eTlo",
//   pinataGateway: "scarlet-fantastic-marmot-419.mypinata.cloud",
// });

// const PinataUploader = () => {
//   const [cid, setCid] = useState("");
//   const [fetchedData, setFetchedData] = useState("");

//   const uploadFile = async () => {
//     try {
//       const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
//       const upload = await pinata.upload.file(file);
//       setCid(upload.IpfsHash);
//       console.log("Uploaded CID:", upload.IpfsHash);
//     } catch (error) {
//       console.error("Upload Error:", error);
//     }
//   };

//   const fetchFile = async () => {
//     const get = await pinata.gateways.get("bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq");
//     console.log("GET", get)
//   };

//   return (
//     <div style={{ padding: "20px", textAlign: "center" }}>
//       <h1>Pinata IPFS Upload & Fetch</h1>
//       <button onClick={uploadFile} style={{ margin: "10px", padding: "10px" }}>
//         Upload File
//       </button>
//       <button onClick={fetchFile} style={{ margin: "10px", padding: "10px" }}>
//         Fetch File
//       </button>
//       {cid && <p>Uploaded CID: {cid}</p>}
//       {fetchedData && <p>Fetched Content: {fetchedData}</p>}
//     </div>
//   );
// };

// export default PinataUploader;
