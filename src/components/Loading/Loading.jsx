
import React, { useEffect, useState } from "react";

const Loading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(
    "Preparing your learning experience..."
  );

  useEffect(() => {
    const duration = 2500;
    const intervalTime = 25;
    const increment = 100 / (duration / intervalTime);

    const messages = [
      "Preparing your learning experience...",
      "Loading institute resources...",
      "Setting up your dashboard...",
      "Almost ready...",
    ];

    let messageIndex = 0;

    const messageTimer = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, messages.length - 1);
      setStatus(messages[messageIndex]);
    }, duration / messages.length);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        if (next >= 100) {
          clearInterval(progressTimer);
          clearInterval(messageTimer);

          setStatus("Welcome to Open IT Institute");

          setTimeout(() => {
            onComplete?.();
          }, 500);

          return 100;
        }

        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(progressTimer);
      clearInterval(messageTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-hidden bg-[#07111F] px-5 text-white">
      
      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        
        {/* Center Glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.08] blur-[140px]" />

        {/* Side Glow */}
        <div className="absolute -left-32 top-20 h-[350px] w-[350px] rounded-full bg-blue-600/[0.06] blur-[120px]" />

        <div className="absolute -right-32 bottom-10 h-[350px] w-[350px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Top Accent */}
      <div className="absolute left-1/2 top-0 h-[2px] w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

      {/* ================= MAIN CONTENT ================= */}

      <div className="relative z-10 w-full max-w-md text-center">

        {/* ================= ANIMATED LOGO ================= */}

        <div className="relative mx-auto mb-8 flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">

          {/* Outer Glow */}
          <div className="absolute inset-5 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />

          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20 border-t-cyan-300 animate-spin-slow" />

          {/* Second Rotating Ring */}
          <div className="absolute inset-4 rounded-full border border-dashed border-blue-400/30 animate-spin-reverse" />

          {/* Inner Circle */}
          <div className="absolute inset-10 rounded-full border border-cyan-400/10 animate-spin-slower" />

          {/* Orbit Dot */}
          <div className="absolute inset-0 animate-orbit">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]">
              <span className="absolute inset-0 rounded-full bg-cyan-300 animate-ping" />
            </span>
          </div>

          {/* Second Orbit Dot */}
          <div className="absolute inset-4 animate-orbit-reverse">
            <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.9)]" />
          </div>

          {/* Pulse Ring */}
          <div className="absolute inset-9 rounded-full border border-cyan-400/20 animate-ping-slow" />

          {/* LOGO CONTAINER */}
          <div className="relative z-10 flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] shadow-[0_0_60px_rgba(34,211,238,0.20)] backdrop-blur-xl sm:h-32 sm:w-32 animate-logo-float">

            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-blue-600/10" />

            {/* Logo */}
            <img
              src="/logo.png"
              alt="Open IT Institute"
              className="relative z-10 h-20 w-20 object-contain sm:h-24 sm:w-24 animate-logo-reveal"
            />

            {/* Shine Effect */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-[120%] top-0 h-full w-[45%] rotate-[25deg] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
            </div>

          </div>

          {/* Logo Shadow */}
          <div className="absolute -bottom-3 h-5 w-24 rounded-full bg-cyan-500/10 blur-xl" />

        </div>


        {/* ================= BRAND ================= */}

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Welcome To
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              OPEN IT
            </span>
          </h1>

          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-cyan-400/60" />

            <p className="text-xs font-semibold tracking-[0.45em] text-slate-400">
              INSTITUTE
            </p>

            <span className="h-px w-10 bg-gradient-to-l from-transparent to-cyan-400/60" />
          </div>

          <p className="mt-5 text-xs tracking-wide text-slate-500">
            Learn. Create. Innovate.
          </p>
        </div>


        {/* ================= STATUS ================= */}

        <div className="mt-10">
          <div className="flex items-center justify-center gap-2">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </span>

            <p className="min-h-[20px] text-sm text-slate-400">
              {status}
            </p>

          </div>
        </div>


        {/* ================= PROGRESS ================= */}

        <div className="mt-5">

          <div className="flex items-center gap-4">

            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05] ring-1 ring-white/[0.08]">

              <div
                className="relative h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-300 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              >
                {/* Progress Glow */}
                <div className="absolute right-0 top-1/2 h-5 w-8 -translate-y-1/2 rounded-full bg-cyan-300/70 blur-md" />

                {/* Progress Shine */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full w-16 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-progress-shine" />
                </div>
              </div>

            </div>

            <span className="w-12 text-right font-mono text-sm font-semibold text-cyan-300">
              {Math.round(progress)}%
            </span>

          </div>


          {/* Progress Labels */}
          <div className="mt-3 flex justify-between text-[9px] font-medium uppercase tracking-widest text-slate-600">
            <span>Loading</span>
            <span>Open IT</span>
            <span>Ready</span>
          </div>

        </div>


        {/* ================= FOOTER ================= */}

        <div className="mt-10">

          <div className="mx-auto mb-4 h-px w-24 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Professional Digital Skills & Training
          </p>

        </div>

      </div>


      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>


      {/* ================= CUSTOM ANIMATIONS ================= */}

      <style>{`

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 8s linear infinite;
        }


        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-reverse {
          animation: spinReverse 12s linear infinite;
        }


        @keyframes spinSlower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slower {
          animation: spinSlower 20s linear infinite;
        }


        @keyframes orbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-orbit {
          animation: orbit 5s linear infinite;
        }


        @keyframes orbitReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-orbit-reverse {
          animation: orbitReverse 7s linear infinite;
        }


        @keyframes pingSlow {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }

          50% {
            opacity: 0.5;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        .animate-ping-slow {
          animation: pingSlow 2.5s ease-out infinite;
        }


        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .animate-logo-float {
          animation: logoFloat 3s ease-in-out infinite;
        }


        @keyframes logoReveal {
          0% {
            opacity: 0;
            transform: scale(0.7);
            filter: blur(8px);
          }

          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        .animate-logo-reveal {
          animation: logoReveal 1.2s ease-out forwards;
        }


        @keyframes shine {
          0% {
            transform: translateX(0) rotate(25deg);
          }

          100% {
            transform: translateX(500%) rotate(25deg);
          }
        }

        .animate-shine {
          animation: shine 3.5s ease-in-out infinite;
        }


        @keyframes progressShine {
          from {
            transform: translateX(-100%);
          }

          to {
            transform: translateX(600%);
          }
        }

        .animate-progress-shine {
          animation: progressShine 2s linear infinite;
        }


        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }

      `}</style>

    </div>
  );
};

export default Loading;
