import React from "react";
import Modal from "../../components/ui/Modal";
import { Crown } from "lucide-react";

const HeaderUpgradeModal = ({ show, onClose, onUpgrade, loading, error }) => (
  <Modal isOpen={show} onClose={onClose}>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Crown size={32} className="text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Become a Streamer</h2>
      </div>
      <p className="text-dark-300 mb-4">
        Upgrade your account to start streaming and unlock exclusive features!
      </p>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <button
        onClick={onUpgrade}
        disabled={loading}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span>Upgrading...</span>
        ) : (
          <>
            <Crown size={18} />
            Upgrade Now
          </>
        )}
      </button>
    </div>
  </Modal>
);

export default HeaderUpgradeModal;
