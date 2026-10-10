import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { Zap, LogIn, UserPlus } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      if (isRegister) await register(name, email, password);
      else await login(email, password);
      onClose();
    } catch (err) { setError(err.message || 'Unable to authenticate. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? 'Create AuraHabit Account' : 'Sign In to AuraHabit'}
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        
        {/* Logo & Headline */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#5E6AD2] mx-auto flex items-center justify-center text-white shadow-linear-accent mb-2">
            <Zap className="w-6 h-6 fill-white" />
          </div>
          <p className="text-xs text-foreground-muted">
            {isRegister ? 'Join the habit architecture movement' : 'Enter your credentials to access your habit matrix'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-mono text-foreground-muted mb-1 uppercase">Full Name</label>
              <input
                type="text"
                required
                placeholder="Sarthak"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              placeholder="sarthak@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-foreground-muted mb-1 uppercase">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#050506] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-accent"
            />
          </div>

          {error && <p role="alert" className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
          <Button variant="primary" size="md" className="w-full" type="submit" disabled={submitting} icon={isRegister ? UserPlus : LogIn}>
            {submitting ? 'Please wait…' : isRegister ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-white/[0.08]">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-foreground-muted hover:text-white transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </Modal>
  );
};
