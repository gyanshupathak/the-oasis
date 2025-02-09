# Oasis - Movie DAO Platform

Oasis is a decentralized autonomous organization (DAO) platform designed for movie enthusiasts to collaboratively generate, propose, and vote on movie scripts. Leveraging blockchain technology, AI, and NFTs, Oasis ensures transparency, creativity, and community-driven ownership of cinematic ideas.

## 🚀 Features
- **AI-Powered Script Generation**: Users submit movie ideas, and AI generates compelling scripts based on the prompts.
- **Proposal System**: Members can propose edits or new scripts to refine the content collaboratively.
- **Voting Mechanism**: DAO members vote on proposed scripts, ensuring democratic decision-making.
- **Automated NFT Distribution**: Winning scripts are minted as NFTs and automatically transferred to the proposer after voting concludes.
- **IPFS Integration**: All scripts are securely stored on IPFS via Pinata for decentralized and tamper-proof storage.

## 🛠 Tech Stack
- **Frontend**: Next.js, React, TailwindCSS, Wagmi (for wallet integration)
- **Backend**: Flask (Python) for AI-driven script generation and NFT automation
- **AI Integration**: Gemini for generating creative movie scripts from user prompts
- **Blockchain**: Ethereum, Ethers.js, CDP Agentkit for smart contract interaction and NFT minting
- **Storage**: IPFS via Pinata SDK for decentralized file storage

## 📝 Getting Started
### Prerequisites
- Node.js (v14 or later)
- Python (v3.8 or later)
- MetaMask or any Ethereum-compatible wallet
- Pinata Account for IPFS storage
- Gemini API Key for AI script generation

### Installation
#### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/the-oasis.git
cd the-oasis
```
#### 2. Install Dependencies
**Frontend:**
```bash
cd frontend
npm install
```
**Backend:**
```bash
cd ai-agents
pip install -r requirements.txt
```
#### 3. Configure Environment Variables
Create `.env` files in both the frontend and backend directories.

**Frontend `.env`:**
```ini
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_PINATA_GATEWAY=your_pinata_gateway
```

**Backend `.env`:**
```ini
PINATA_JWT=your_pinata_jwt
PRIVATE_KEY=your_wallet_private_key
INFURA_PROJECT_ID=your_infura_project_id
CONTRACT_ADDRESS=your_contract_address
OPENAI_API_KEY=your_openai_api_key
```

#### 4. Run the Application
**Start the Backend:**
```bash
cd ai-agents
python script_genrator.py
```
**Start the Frontend:**
```bash
cd frontend
npm run dev
```
Visit `http://localhost:3000` to access Oasis!

## 💡 How It Works
1. **AI-Powered Script Generation**: The founder inputs a movie idea, which is sent to the backend Flask server. The server uses OpenAI's GPT to generate a script based on the idea.
2. **IPFS Upload**: The generated script is uploaded to IPFS using Pinata, ensuring decentralized and secure storage.
3. **Proposal & Edits**: DAO members can propose edits to the script. Upon submission, a 30-second timer initiates.
4. **Automated NFT Transfer**: After 30 seconds, the proposed script is minted as an NFT using CDP Agentkit and automatically transferred to the proposer.
5. **Voting**: Members vote on the proposed scripts. The script with the highest votes is finalized and permanently stored on IPFS.

## 🤖 AI Integration Details
Oasis uses Gemini's model to generate creative, high-quality movie scripts based on user-submitted ideas.

### AI Workflow:
1. **User Input**: The user enters a movie idea on the frontend.
2. **API Call**: The idea is sent to the Flask backend, which communicates with OpenAI's API using the provided API key.
3. **Script Generation**: Gemini a script based on the movie idea, formatted and prepared for DAO proposal.
4. **IPFS Storage**: The script is uploaded to IPFS, and its CID is recorded on the blockchain for transparency.

#### Example Input:
```plaintext
"A heist movie set in a futuristic city where the crew uses advanced AI technology."
```

#### Generated Script (snippet):
```plaintext
"In the neon-lit streets of Neo-Tokyo, a crew of rogue hackers plans the ultimate digital heist. Their target: the AI system controlling the city's power grid..."
```

## 📦 Smart Contract Overview
The smart contract governs DAO membership, script proposals, and voting mechanisms. It integrates with the CDP Agentkit for seamless NFT minting and transfers.


## 🧩 Contributing
We welcome contributions from the community! To contribute:
1. Fork the repository
2. Create a new branch:
```bash
git checkout -b feature-branch
```
3. Commit your changes:
```bash
git commit -m 'Add new feature'
```
4. Push to the branch:
```bash
git push origin feature-branch
```
5. Open a Pull Request



