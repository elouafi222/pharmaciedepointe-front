import { AlarmCheck, AlertCircle } from "lucide-react";
import React from "react";

function Warning() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center px-5">
      <div className="text-center rounded-lg bg-gradient-to-r from-slate-950 to-slate-800 p-5 text-white">
        <h1 className="text-3xl text-red-600  flex flex-row items-center justify-center mb-5 rounded-lg fw-bold text-red  bg-white p-3">
          {" "}
          Access Restricted <AlertCircle className="ms-3" size={30} />
        </h1>
        <p className="fs-3">
          Cher Client, l'accès à cette application est actuellement restreint.
          Veuillez régler le paiement en attente pour reprendre l'accès complet.
          Merci de votre compréhension.
        </p>
        <p className="mb-5 italic">~Equipe DEV</p>
      </div>
    </div>
  );
}

export default Warning;
