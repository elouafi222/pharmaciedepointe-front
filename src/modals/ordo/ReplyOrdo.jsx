import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CircleX,
  FilePen,
  FilePlus2,
  LoaderCircle,
  NotebookPen,
  SendHorizonal,
} from "lucide-react";

function ReplyOrdo({ show, handleClose, user, ordonnance }) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const envoyerWhatsApp = async (e) => {
    e.preventDefault();
    if (!text) return toast.error("Message est requise");
    if (!ordonnance.phone) {
      if (!phone) return toast.error("WhatsApp numero est requise");
    }
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/whatsApp/sendMessage`,
        {
          message: text,
          phoneNumber: ordonnance.phone ? ordonnance.phone : phone,
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("La message a été envoyer avec succès.");
      // refreshOrdo();
      handleClose(false);
    } catch (error) {
      // console.error("Erreur lors de l'envoi du message :", error);
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
      setText("");
      setPhone("");
    }
  };
  const envoyerEmail = async (e) => {
    e.preventDefault();
    if (!text) return toast.error("Email message est requise");
    if (!sujet) return toast.error("Email sujet est requise");
    if (!ordonnance.email) {
      if (!email) return toast.error("WEmail adresse est requise");
    }
    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/email/sendEmail`,
        {
          ordNumero: ordonnance.numero,
          sujet: sujet,
          message: text,
          email: ordonnance.email ? ordonnance.email : email,
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("L'email a été envoyer avec succès.");
      handleClose(false);
    } catch (error) {
      // console.error("Erreur lors de l'envoi du message :", error);
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
      setText("");
      setSujet("");
      setEmail("");
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
          className="bg-slate-900/50 backdrop-blur  p-3 md:p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br bg-white  p-3 md:p-6  rounded-lg w-full max-w-lg shadow-3xl cursor-default relative overflow-hidden"
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between rounded-lg items-center p-3 mb-4 bg-gradient-to-r from-slate-950 to-slate-800 ">
                <span className="flex items-center">
                  <SendHorizonal size={20} className="text-white me-2" />
                  <h1 className="text-sm md:text-lg text-white">
                    {" "}
                    Repondre a l'ordonnance ORD-{ordonnance.numero}
                  </h1>
                </span>
                <CircleX
                  onClick={() => handleClose(false)}
                  className="text-white cursor-pointer"
                />
              </div>
              {ordonnance.from === "Email" ? (
                <form onSubmit={envoyerEmail}>
                  {ordonnance.email ? (
                    <div className="flex flex-col mb-4">
                      <label
                        className="text-md text-gray-500"
                        htmlFor="firstName"
                      >
                        Email Adresse
                      </label>
                      <input
                        value={ordonnance.email}
                        disabled
                        className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                        type="text"
                        id="firstName"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col mb-4">
                      <label
                        className="text-md text-gray-500"
                        htmlFor="firstName"
                      >
                        Email adresse
                      </label>
                      <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                        type="text"
                        id="firstName"
                      />
                    </div>
                  )}
                  <div className="flex flex-col mb-4 ">
                    <label className="text-md text-gray-500" htmlFor="name">
                      Sujet
                    </label>
                    <input
                      onChange={(e) => setSujet(e.target.value)}
                      value={sujet}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="text"
                      id="firstName"
                    />
                  </div>
                  <div className="flex flex-col mb-4 ">
                    <label className="text-md text-gray-500" htmlFor="name">
                      Message
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg p-3 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      name=""
                      rows={10}
                      id=""
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="flex justify-center p-3 text-center text-white  mt-3 w-full uppercase h-100 bg-gradient-to-r from-green-600 to-green-400   rounded-lg"
                  >
                    {isLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Envoyer"
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={envoyerWhatsApp}>
                  {ordonnance.phone ? (
                    <div className="flex flex-col mb-4">
                      <label
                        className="text-md text-gray-500"
                        htmlFor="firstName"
                      >
                        Numero de WhatsApp
                      </label>
                      <input
                        value={ordonnance.phone}
                        disabled
                        className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                        type="text"
                        id="firstName"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col mb-4">
                      <label
                        className="text-md text-gray-500"
                        htmlFor="firstName"
                      >
                        Numero de WhatsApp
                      </label>
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        value={phone}
                        className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                        type="text"
                        id="firstName"
                      />
                    </div>
                  )}
                  <div className="flex flex-col mb-4 ">
                    <label className="text-md text-gray-500" htmlFor="name">
                      Message
                    </label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg p-3 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      name=""
                      rows={10}
                      id=""
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="flex justify-center p-3 text-center text-white  mt-3 w-full uppercase h-100 bg-gradient-to-r from-green-600 to-green-400   rounded-lg"
                  >
                    {isLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Envoyer"
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReplyOrdo;
