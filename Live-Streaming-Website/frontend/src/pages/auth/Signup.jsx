import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User, Lock, Zap, Check, AlertCircle } from 'lucide-react';

const Signup = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    age: '',
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async () => {
    
    setError('');
    setIsLoading(true);

    // Validate form
    if (!formData.email || !formData.username || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Please accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const signupData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age) || 18,
        role: 'user'
      };
      const result = await onSignupSuccess(signupData);

      if (!result.success) {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (password.length < 6) return { strength: 'weak', color: 'bg-red-500', width: '33%' };
    if (password.length < 8) return { strength: 'fair', color: 'bg-yellow-500', width: '66%' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 'strong', color: 'bg-green-500', width: '100%' };
    }
    return { strength: 'good', color: 'bg-blue-500', width: '80%' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Join StreamVibe</h2>
        <p className="text-dark-400">Start your streaming journey</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Signup Form */}
      <div className="space-y-4">
        {/* Email Field */}
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 group-focus-within:text-live transition-colors z-10" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-dark-800/80 border border-dark-600 rounded-lg pl-12 pr-4 py-4 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-live focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
        </div>

        {/* Username Field */}
        <div className="relative group">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 group-focus-within:text-live transition-colors z-10" size={20} />
          <input
            type="text"
            name="username"
            placeholder="Choose Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full bg-dark-800/80 border border-dark-600 rounded-lg pl-12 pr-10 py-4 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-live focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
          {/* Username availability indicator */}
          {formData.username.length > 2 && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Age Field */}
        <div className="relative group">
          <input
            type="number"
            name="age"
            placeholder="Age (optional)"
            value={formData.age}
            onChange={handleInputChange}
            min="13"
            max="120"
            className="w-full bg-dark-800/80 border border-dark-600 rounded-lg px-4 py-4 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-live focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 group-focus-within:text-live transition-colors z-10" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-dark-800/80 border border-dark-600 rounded-lg pl-12 pr-12 py-4 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-live focus:border-transparent transition-all"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white transition-colors z-10"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                style={{ width: passwordStrength.width }}
              ></div>
            </div>
            <p className="text-xs text-dark-400 capitalize">
              Password strength: <span className={`${passwordStrength.color.replace('bg-', 'text-')}`}>
                {passwordStrength.strength}
              </span>
            </p>
          </div>
        )}

        {/* Terms Agreement */}
        <div className="flex items-start gap-3">
          <div className="relative mt-1">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleInputChange}
              className="sr-only"
              required
              disabled={isLoading}
            />
            <div 
              onClick={() => !isLoading && handleInputChange({ target: { name: 'acceptTerms', type: 'checkbox', checked: !formData.acceptTerms } })}
              className={`w-5 h-5 rounded border-2 cursor-pointer transition-all ${
                formData.acceptTerms 
                  ? 'bg-live border-live' 
                  : 'border-dark-600 hover:border-dark-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {formData.acceptTerms && (
                <Check size={12} className="text-white m-0.5" />
              )}
            </div>
          </div>
          <div className="text-xs text-dark-400 leading-relaxed">
            I agree to the{' '}
            <button className="text-live hover:text-red-400 transition-colors">Terms of Service</button>{' '}
            and{' '}
            <button className="text-live hover:text-red-400 transition-colors">Privacy Policy</button>
          </div>
        </div>
      </div>

      {/* Signup Button */}
      <button
        onClick={handleSubmit}
        disabled={!formData.acceptTerms || isLoading}
        className="w-full bg-live hover:bg-red-600 disabled:bg-dark-700 disabled:text-dark-500 text-white py-4 rounded-lg font-bold text-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Creating Account...
          </>
        ) : (
          <>
            <Zap size={20} />
            Start Streaming
          </>
        )}
      </button>

      {/* Social Signup */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-dark-900 text-dark-400">or sign up with</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </button>
          <button 
            className="flex-1 bg-[#9146FF] hover:bg-[#7B2CBF] text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.149 0L.537 4.119v15.581h5.4V24h3.276l4.119-4.3h6.137L24 15.581V0H2.149zm1.831 1.831h18.389v12.019l-3.276 3.276h-5.4L9.574 21.17v-4.044H4.119V1.831h-.139z"/>
              <path d="M20.1 4.119v8.836l-2.681 2.681H12.85l-2.681 2.681V15.636H6.95V4.119H20.1zm-6.137 1.831v4.836h1.831V5.95h-1.831zm-4.836 0v4.836h1.831V5.95H9.127z"/>
            </svg>
            Twitch
          </button>
        </div>
      </div>

      {/* Switch to Login */}
      <div className="text-center pt-4">
        <p className="text-dark-400">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-live hover:text-red-400 transition-colors font-medium"
            disabled={isLoading}
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;