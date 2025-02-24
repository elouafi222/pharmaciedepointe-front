import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  CircleAlert,
  CircleX,
  LoaderCircle,
  UserRoundX,
} from "lucide-react";

function AccepteMessage({ show, handleClose, user, refreshMessages, message }) {
  const [isLoading, setIsLoading] = useState(false);

  const accepteMessage = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/message/acceptMessage/${message._id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("Le message a été ajouté comme ordonnance avec succès.");
      refreshMessages();
      handleClose(false);
    } catch (error) {
      // console.error("Erreur lors de l'ajout de l'ordonnance :", error);
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du traitement de la demande."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => handleClose(false)}
          className="bg-slate-900/50 backdrop-blur p-3 md:p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br bg-white p-3 md:p-6 rounded-lg w-full max-w-lg shadow-3xl cursor-default relative overflow-hidden"
          >
            <div className="flex flex-col">
              <form onSubmit={accepteMessage}>
                <div className="flex flex-col">
                  <div className="flex flex-row justify-between rounded-lg items-center p-3 mb-4 bg-gradient-to-r from-slate-950 to-slate-800">
                    <span className="flex items-center">
                      <CheckCircle2 size={20} className="text-white me-2" />
                      <h1 className="text-sm md:text-lg text-white">
                        Créer une ordonnance
                      </h1>
                    </span>
                    <CircleX
                      onClick={() => handleClose(false)}
                      className="text-white cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col items-center my-10">
                    <CheckCircle2 size={80} className="mb-4 text-green-600" />

                    <h1 className="text-center text-2xl">
                      Êtes-vous sûr de vouloir{" "}
                      <span className="font-semibold text-green-600">
                        créer une ordonnance
                      </span>{" "}
                      à partir de ce message ?
                    </h1>
                    <p className="text-gray-500 text-center">
                      Cette action supprimera le message après l'ajout de
                      l'ordonnance. Procédez avec prudence.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex justify-center p-3 text-center text-white mt-3 w-full uppercase h-100 bg-gradient-to-r from-green-600 to-green-400 rounded-lg"
                >
                  {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Confirmer"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AccepteMessage;
