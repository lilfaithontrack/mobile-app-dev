import React, { useState } from 'react';
import { Phone, MessageCircle, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [, setOtpSent] = useState(false);
  
  const { login } = useAuth();

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    // Validate Ethiopian phone number format
    const phoneRegex = /^(\+251|0)?[79]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid Ethiopian phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.requestOTP({ phone_number: phone });
      if (response.data) {
        setOtpSent(true);
        setStep('otp');
        setError('');
      } else {
        setError(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP code');
      return;
    }

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(phone, otp, fullName);
      if (result.success) {
        // Login successful - AuthContext will handle navigation
      } else {
        if (result.error?.includes('Full name is required')) {
          setStep('name');
          setError('Please provide your full name to complete registration');
        } else {
          setError(result.error || 'Invalid OTP');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (fullName.trim().length < 2) {
      setError('Please enter a valid full name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await login(phone, otp, fullName);
      if (!result.success) {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
          <Phone className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to WashLink</h1>
        <p className="text-gray-600 text-lg">Enter your phone number to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+251 9 XX XX XX XX"
            className="input focus-ring"
            autoComplete="tel"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-slide-in">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleSendOTP}
          disabled={isLoading}
          className="btn btn-primary btn-full btn-lg haptic-medium"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse font-semibold">Sending...</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold">Send OTP</span> <ArrowRight className="w-5 h-5" />
            </div>
          )}
        </button>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Verify Your Phone</h1>
        <p className="text-gray-600 text-lg">
          We sent a 6-digit code to {phone}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-3">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="input text-center text-2xl tracking-widest font-bold focus-ring"
            autoComplete="one-time-code"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-slide-in">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleVerifyOTP}
          disabled={isLoading || otp.length !== 6}
          className="btn btn-primary btn-full btn-lg haptic-medium"
        >
          {isLoading ? (
            <div className="animate-pulse font-semibold">Verifying...</div>
          ) : (
            <span className="font-semibold">Verify Code</span>
          )}
        </button>

        <button
          onClick={() => setStep('phone')}
          className="btn btn-ghost btn-full haptic-light"
        >
          <span className="font-medium">Change Phone Number</span>
        </button>
      </div>
    </div>
  );

  const renderNameStep = () => (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
          <User className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Complete Registration</h1>
        <p className="text-gray-600 text-lg">Please provide your full name to complete setup</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-3">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="input focus-ring"
            autoComplete="name"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-slide-in">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleCompleteRegistration}
          disabled={isLoading}
          className="btn btn-primary btn-full btn-lg haptic-medium"
        >
          {isLoading ? (
            <div className="animate-pulse font-semibold">Creating Account...</div>
          ) : (
            <span className="font-semibold">Complete Registration</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4 safe-top safe-bottom relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-600/20"></div>
      <div className="w-full max-w-md">
        <div className="card-gradient backdrop-blur-xl">
          {step === 'phone' && renderPhoneStep()}
          {step === 'otp' && renderOTPStep()}
          {step === 'name' && renderNameStep()}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;