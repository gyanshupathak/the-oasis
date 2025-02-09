"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VideoPage = () => {
  const [vote, setVote] = useState<string | null>(null);
  const [releaseStage, setReleaseStage] = useState(0);
  const [showPopups, setShowPopups] = useState(false);

  const handleVote = (isYes: boolean) => {
    setVote(isYes ? "YES" : "NO");
  };

  const handleReleaseMovie = () => {
    setShowPopups(true);
    setReleaseStage(1);

    setTimeout(() => setReleaseStage(2), 3000);
    setTimeout(() => setReleaseStage(3), 6000);
    setTimeout(() => setReleaseStage(4), 9000);
    setTimeout(() => setShowPopups(false), 12000);
  };

  return (
    <div className="min-h-screen w-screen bg-black text-white flex flex-col items-center p-6 space-y-4">
      <h1 className="text-3xl font-bold text-yellow-500">Finalized Movie</h1>
      <p className="text-gray-400">This movie is generated from the finalized script.</p>

      <div className="w-full max-w-2xl bg-gray-900 p-6 rounded-lg border border-yellow-500 shadow-lg">
        <h2 className="text-xl font-bold text-yellow-500 mb-4">Watch the Movie</h2>
        <div className="relative w-full">
          <video controls className="w-full rounded-lg border border-gray-700 shadow">
            <source src="https://cdn.pixabay.com/video/2022/11/07/138115-768324070_large.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 font-bold rounded-lg transition duration-300 shadow ${
            vote === "YES" ? "bg-green-700" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={() => handleVote(true)}
        >
          Vote YES
        </button>
        <button
          className={`px-4 py-2 font-bold rounded-lg transition duration-300 shadow ${
            vote === "NO" ? "bg-red-700" : "bg-red-500 hover:bg-red-600"
          }`}
          onClick={() => handleVote(false)}
        >
          Vote NO
        </button>
      </div>
      {vote && <p className="text-gray-400">You voted: <span className="font-bold text-yellow-500">{vote}</span></p>}

      <button
        className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300 shadow"
        onClick={handleReleaseMovie}
        disabled={showPopups}
      >
        Release Movie
      </button>

      <AnimatePresence>
        {showPopups && (
          <motion.div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gray-900 text-white p-6 rounded-lg border border-yellow-500 shadow-lg max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {releaseStage === 1 && <p className="text-lg font-bold">🎬 Movie Released Successfully!</p>}
              {releaseStage === 2 && <p className="text-lg font-bold">💰 Movie Earned: 1.2M USD</p>}
              {releaseStage === 3 && <p className="text-lg font-bold">📈 Total Profit: 500K USD</p>}
              {releaseStage === 4 && <p className="text-lg font-bold">🎉 NFTs Distributed to DAO Members!</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPage;