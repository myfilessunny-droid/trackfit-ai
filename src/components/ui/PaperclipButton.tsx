import React from "react";

export const PaperclipButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
    title="Attach file"
    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-gray-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25v13.5A2.25 2.25 0 0010.5 21h3a2.25 2.25 0 002.25-2.25V15"
      />
    </svg>
  </button>
);

export default PaperclipButton;
