import React, { useState } from 'react';
import { AIEngine } from '../services/aiEngine';
import { Key, ShieldCheck, X } from 'lucide-react';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const APIKeyModal: React.FC<APIKeyModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = AIEngine.getConfig();
  const [apiKey, setApiKey] = useState(currentConfig.apiKey);
  const [provider, setProvider] = useState<'deterministic' | 'openai' | 'gemini'>(currentConfig.provider);

  if (!isOpen) return null;

  const handleSave = () => {
    AIEngine.setConfig(apiKey, provider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#0b1120] p-6 shadow-2xl shadow-cyan-950/50">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-sans">
              AI Provider Abstraction Config
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 py-4 text-xs text-slate-300">
          <p>
            QNova includes a <strong>Built-in Offline Quantum Mentor</strong> that works deterministically without requiring external API keys.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-slate-200">Select AI Provider Engine:</label>
            <select
              value={provider}
              onChange={(e: any) => setProvider(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500/50"
            >
              <option value="deterministic">⚡ Offline Deterministic Mentor (Recommended for Offline Hackathon Demo)</option>
              <option value="gemini">✨ Google Gemini API</option>
              <option value="openai">🤖 OpenAI GPT-4o API</option>
            </select>
          </div>

          {provider !== 'deterministic' && (
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-200">API Key:</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key..."
                className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-cyan-500/50"
              />
            </div>
          )}

          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 flex items-start gap-2 text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Fallback protection active: If an API key is missing or fails, QNova automatically defaults to the deterministic quantum mentor engine.</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20"
          >
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
};
