"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.publicMetadata?.role) {
      const role = user.publicMetadata.role as string;
      router.replace(role === "student" ? "/gpa" : "/home");
    }
  }, [isLoaded, isSignedIn, user, router]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        .sl-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f0f4ff;
          padding: 24px 16px;
          position: relative;
          overflow: hidden;
        }

        /* Background blobs */
        .sl-blob1 {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
          top: -200px;
          right: -100px;
          pointer-events: none;
        }
        .sl-blob2 {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          bottom: -150px;
          left: -100px;
          pointer-events: none;
        }

        /* Card */
        .sl-card {
          background: #fff;
          border-radius: 24px;
          box-shadow:
            0 0 0 1px rgba(59,130,246,0.08),
            0 8px 32px rgba(59,130,246,0.1),
            0 32px 64px rgba(0,0,0,0.06);
          width: 100%;
          max-width: 420px;
          padding: 40px 36px 36px;
          position: relative;
          z-index: 1;
          animation: sl-rise 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }

        @media (max-width: 480px) {
          .sl-card { padding: 32px 24px 28px; }
        }

        @keyframes sl-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .sl-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .sl-logo-wrap {
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 2px 12px rgba(59,130,246,0.15);
        }

        .sl-uni-name {
          font-size: 13px;
          font-weight: 700;
          color: #1d4ed8;
          letter-spacing: 0.3px;
          margin-bottom: 2px;
        }
        .sl-uni-sub {
          font-size: 11px;
          color: #93c5fd;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .sl-divider {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #6366f1);
          border-radius: 2px;
          margin: 0 auto 14px;
        }

        .sl-title {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.4px;
          margin-bottom: 4px;
        }
        .sl-subtitle {
          font-size: 13px;
          color: #94a3b8;
          font-weight: 400;
        }

        /* Global error */
        .sl-global-error {
          font-size: 13px;
          color: #dc2626;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 10px 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        /* Fields */
        .sl-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .sl-label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          letter-spacing: 0.2px;
        }

        .sl-input-wrap {
          position: relative;
        }

        .sl-input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          color: #93c5fd;
          pointer-events: none;
          transition: color 0.15s;
        }

        .sl-input {
          width: 100%;
          padding: 11px 14px 11px 40px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .sl-input:focus {
          border-color: #3b82f6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
        }
        .sl-input:focus + .sl-input-icon-overlay,
        .sl-input-wrap:focus-within .sl-input-icon {
          color: #3b82f6;
        }
        .sl-input::placeholder { color: #cbd5e1; }

        .sl-field-error {
          font-size: 12px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Button */
        .sl-btn {
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: none;
          cursor: pointer;
          margin-top: 8px;
          letter-spacing: 0.2px;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(37,99,235,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .sl-btn:hover {
          background: linear-gradient(135deg, #1d4ed8, #1e40af);
          box-shadow: 0 6px 24px rgba(37,99,235,0.4);
          transform: translateY(-1px);
        }
        .sl-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(37,99,235,0.3);
        }

        /* Enter hint */
        .sl-enter-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 12px;
          font-size: 11px;
          color: #cbd5e1;
        }
        .sl-kbd {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-bottom: 2px solid #cbd5e1;
          border-radius: 5px;
          padding: 1px 6px;
          font-size: 11px;
          color: #64748b;
          font-weight: 600;
        }

        /* Footer */
        .sl-footer {
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }
        .sl-footer-text {
          font-size: 11px;
          color: #cbd5e1;
          line-height: 1.6;
        }
        .sl-footer-text strong {
          color: #94a3b8;
          font-weight: 600;
        }

        /* Staggered field animations */
        .sl-field:nth-child(1) { animation: sl-rise 0.4s 0.1s both; }
        .sl-field:nth-child(2) { animation: sl-rise 0.4s 0.18s both; }
        .sl-btn            { animation: sl-rise 0.4s 0.25s both; }
      `}</style>

      <div className="sl-root">
        <div className="sl-blob1" />
        <div className="sl-blob2" />

        <div className="sl-card">
          {/* ── Header ── */}
          <div className="sl-header">
            <div className="sl-logo-wrap">
              <Image
                src="/logo.png"
                alt="SUSL Logo"
                width={52}
                height={52}
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className="sl-title">Sign in</div>
            <div className="sl-subtitle">Use your university credentials</div>
          </div>

          {/* ── Form ── */}
          <SignIn.Root>
            <SignIn.Step name="start">
              <Clerk.GlobalError className="sl-global-error" />

              <Clerk.Field name="identifier" className="sl-field">
                <Clerk.Label className="sl-label">Username</Clerk.Label>
                <div className="sl-input-wrap">
                  <svg
                    className="sl-input-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <Clerk.Input
                    type="text"
                    required
                    placeholder="Your username"
                    className="sl-input"
                  />
                </div>
                <Clerk.FieldError className="sl-field-error" />
              </Clerk.Field>

              <Clerk.Field name="password" className="sl-field">
                <Clerk.Label className="sl-label">Password</Clerk.Label>
                <div className="sl-input-wrap">
                  <svg
                    className="sl-input-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <Clerk.Input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="sl-input"
                  />
                </div>
                <Clerk.FieldError className="sl-field-error" />
              </Clerk.Field>

              <SignIn.Action submit className="sl-btn">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </SignIn.Action>
            </SignIn.Step>
          </SignIn.Root>

          {/* ── Footer ── */}
          <div className="sl-footer">
            <p className="sl-footer-text">
              <strong>Hall Reservation & Academic Management</strong>
              <br />© {new Date().getFullYear()} Sabaragamuwa University of Sri
              Lanka
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
