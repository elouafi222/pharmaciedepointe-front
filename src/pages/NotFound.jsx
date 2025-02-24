import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <div className="text-center rounded-lg bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white">
        <h1 className="text-5xl fw-bold">404</h1>
        <p className="fs-3">
          <span>Oups!</span> Page non trouvée.
        </p>
        <p className="mb-5">La page que vous recherchez n'existe pas.</p>
        <Link to="/">
          <button className="bg-white w-full px-5 py-2 text-purple-600 rounded-lg">
            Connexion
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
