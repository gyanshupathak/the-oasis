// import { NextResponse } from "next/server";
// import pinataSDK from "@pinata/sdk";

// const pinata = new pinataSDK(
//   process.env.PINATA_API_KEY!,
//   process.env.PINATA_API_SECRET!
// );

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzMjBiODU0ZS0wOTVkLTRhNDctYjFlYy01YjEyZTE3MjM1YTIiLCJlbWFpbCI6InBhdGhha2d5YW5zaHVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImM1NDc1MDg5MWUzZTU2MWJmZGE2Iiwic2NvcGVkS2V5U2VjcmV0IjoiMDk1MGYwMDVjODgxY2QxZmFhNTUwMDIyMTJlYmM1ZTgzNmZmYjQ1NzAxZDk5MWMwM2FhYjAzMjM3MjcxZjU2MSIsImV4cCI6MTc3MDU4MzQxMn0.jGrYTNPyhLN1iqlMzHZ3Dn7BARXsG7vKB8XJUC-eTlo",
  pinataGateway: "scarlet-fantastic-marmot-419.mypinata.cloud",
});

async function main() {
  try {
    const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
    const upload = await pinata.upload.file(file);
    console.log("upload",upload);
  } catch (error) {
    console.log(error);
  }
}

await main();
