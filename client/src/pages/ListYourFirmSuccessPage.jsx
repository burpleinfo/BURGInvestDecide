import React from "react";
import { useNavigate } from "react-router-dom";

const ListYourFirmSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <svg
            className="h-14 w-14"
            viewBox="0 0 52 52"
            fill="none"
            aria-hidden="true"
            style={{ animation: "successPop 420ms ease-out 0ms forwards" }}
          >
            <circle
              cx="26"
              cy="26"
              r="23"
              stroke="#16a34a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 145,
                strokeDashoffset: 145,
                animation: "drawCircle 520ms ease-out 120ms forwards",
              }}
            />
            <path
              d="M14 27l8 8 16-16"
              stroke="#16a34a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 36,
                strokeDashoffset: 36,
                animation: "drawCheck 360ms ease-out 620ms forwards",
              }}
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Submission Successful</h1>
        <p className="mt-4 text-lg text-gray-600">We will reach out to you soon.</p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Go To Home
          </button>
        </div>

        <style>{`
          @keyframes drawCircle {
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes drawCheck {
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes successPop {
            0% {
              opacity: 0;
              transform: scale(0.88);
            }
            60% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ListYourFirmSuccessPage;
