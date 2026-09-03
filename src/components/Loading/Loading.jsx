import React, { useEffect, useState } from "react";

const Loading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1000; // 0.8 seconds
    const intervalTime = 20;

    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            onComplete?.();
          }, 0);

          return 100;
        }

        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center overflow-hidden bg-[#020817] px-5">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.07] blur-[110px]" />

        <div className="absolute left-[15%] top-[20%] h-[180px] w-[180px] rounded-full bg-blue-500/[0.04] blur-[80px]" />

        <div className="absolute bottom-[10%] right-[15%] h-[180px] w-[180px] rounded-full bg-yellow-400/[0.025] blur-[80px]" />
      </div>

      {/* ================= MAIN ================= */}

      <div className="relative z-10 flex w-full max-w-[560px] flex-col items-center">

        {/* ================= LOGO AREA ================= */}

        <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[340px] sm:w-[340px]">

          {/* Outer Ring */}
          <div
            className="
              absolute
              inset-[18px]
              rounded-full
              border
              border-cyan-400/20
              border-dashed
              animate-spin-slow
            "
          />

          {/* Inner Ring */}
          <div
            className="
              absolute
              inset-[38px]
              rounded-full
              border
              border-blue-400/20
              border-dashed
              animate-spin-reverse
            "
          />

          {/* Soft Circle Glow */}
          <div
            className="
              absolute
              inset-[58px]
              rounded-full
              bg-cyan-400/[0.025]
              shadow-[0_0_70px_rgba(0,190,255,0.12)]
            "
          />

          {/* Cyan Arc */}
          <div
            className="
              absolute
              left-[20px]
              top-[72px]
              h-[135px]
              w-[135px]
              rounded-full
              border-l
              border-t
              border-cyan-400/60
              rotate-[-35deg]
              animate-pulse
            "
          />

          {/* Yellow Arc */}
          <div
            className="
              absolute
              bottom-[50px]
              right-[25px]
              h-[105px]
              w-[105px]
              rounded-full
              border-b
              border-r
              border-yellow-400/60
              rotate-[20deg]
              animate-pulse
            "
          />

          {/* Decorative Dots */}

          <span
            className="
              absolute
              left-[62px]
              top-[55px]
              h-[6px]
              w-[6px]
              rounded-full
              bg-cyan-400
              shadow-[0_0_12px_#00cfff]
              animate-ping
            "
          />

          <span
            className="
              absolute
              right-[62px]
              top-[80px]
              h-[6px]
              w-[6px]
              rounded-full
              bg-yellow-400
              shadow-[0_0_12px_#ffc400]
              animate-pulse
            "
          />

          <span
            className="
              absolute
              bottom-[70px]
              right-[48px]
              h-[6px]
              w-[6px]
              rounded-full
              bg-cyan-400
              shadow-[0_0_12px_#00cfff]
              animate-ping
            "
          />

          {/* ================= LOGO ================= */}

          <div
            className="
              relative
              z-10
              flex
              items-center
              justify-center
            "
          >
            <img
              src="/logo.png"
              alt="Open IT Institute"
              className="
                h-[180px]
                w-[180px]
                object-contain
                drop-shadow-[0_0_20px_rgba(0,174,255,0.22)]
                sm:h-[205px]
                sm:w-[205px]
              "
            />
          </div>
        </div>

        {/* ================= TEXT ================= */}

        <div className="-mt-1 flex w-full flex-col items-center">

          <h2
            className="
              text-center
              text-[26px]
              font-medium
              tracking-[0.12em]
              text-white
              sm:text-[30px]
            "
          >
            LOADING
            <span className="loading-dots">...</span>
          </h2>

          <p
            className="
              mt-2
              text-center
              text-[13px]
              tracking-[0.18em]
              text-slate-500
              uppercase
            "
          >
            Open IT Institute
          </p>

          {/* ================= PROGRESS ================= */}

          <div className="mt-7 flex w-full max-w-[470px] items-center gap-3">

            <div
              className="
                relative
                h-[9px]
                flex-1
                overflow-hidden
                rounded-full
                bg-white/[0.07]
                ring-1
                ring-white/[0.08]
              "
            >

              {/* Progress */}
              <div
                className="
                  relative
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-blue-600
                  via-cyan-500
                  to-cyan-300
                  transition-[width]
                  duration-75
                  ease-linear
                "
                style={{
                  width: `${progress}%`,
                }}
              >

                {/* Shine */}
                <div
                  className="
                    absolute
                    right-0
                    top-0
                    h-full
                    w-[45px]
                    bg-white/40
                    blur-[5px]
                  "
                />

              </div>
            </div>

            {/* Percentage */}
            <span
              className="
                w-[42px]
                text-right
                text-[14px]
                font-semibold
                tabular-nums
                text-cyan-400
              "
            >
              {Math.round(progress)}%
            </span>

          </div>

          {/* ================= STATUS ================= */}

          <div className="mt-5 flex items-center gap-2">

            <span
              className="
                h-[6px]
                w-[6px]
                rounded-full
                bg-cyan-400
                shadow-[0_0_10px_#00d9ff]
                animate-pulse
              "
            />

            <p
              className="
                text-[12px]
                tracking-[0.08em]
                text-slate-500
              "
            >
              Preparing your experience
            </p>

          </div>

          {/* ================= BOTTOM DOTS ================= */}

          <div className="mt-6 flex items-center gap-3">

            <span
              className="
                loading-dot
                h-[6px]
                w-[6px]
                rounded-full
                bg-blue-500
              "
            />

            <span
              className="
                loading-dot
                h-[6px]
                w-[6px]
                rounded-full
                bg-yellow-400
              "
              style={{
                animationDelay: "0.2s",
              }}
            />

            <span
              className="
                loading-dot
                h-[6px]
                w-[6px]
                rounded-full
                bg-cyan-400
              "
              style={{
                animationDelay: "0.4s",
              }}
            />

          </div>

        </div>
      </div>

      {/* ================= CUSTOM CSS ================= */}

      <style>{`

        /* ================= ROTATION ================= */

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .animate-spin-slow {
          animation: spinSlow 16s linear infinite;
        }

        .animate-spin-reverse {
          animation: spinReverse 12s linear infinite;
        }


        /* ================= DOT PULSE ================= */

        @keyframes dotPulse {

          0%,
          100% {
            transform: scale(0.7);
            opacity: 0.4;
          }

          50% {
            transform: scale(1.25);
            opacity: 1;
          }

        }

        .loading-dot {
          animation: dotPulse 1s ease-in-out infinite;
        }


        /* ================= LOADING TEXT ================= */

        @keyframes loadingDots {

          0% {
            opacity: 0.25;
          }

          50% {
            opacity: 1;
          }

          100% {
            opacity: 0.25;
          }

        }

        .loading-dots {
          animation: loadingDots 1s infinite;
        }

      `}</style>

    </div>
  );
};

export default Loading;