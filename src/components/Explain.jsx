import { AlertCircle } from "lucide-react";
import React from "react";

function Explain({ text }) {
  return (
    <div className=" flex gap-3 items-center text-sm  text-white p-3 bg-gradient-to-tr from-red-600 to-red-400 rounded-lg mb-3">
      <AlertCircle className="hidden md:block" />
      <p className="">{text}</p>
    </div>
  );
}

export default Explain;
