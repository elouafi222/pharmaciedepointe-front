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
} from "lucide-react";

function AddNote({ show, handleClose, user, refreshOrdo, ordo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const addNote = async (e) => {
    // console.log(ordo);
    e.preventDefault();
    if (!text) return toast.error("Note text est requise");

    try {
      setIsLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/note`,
        {
          text: text,
          ordoId: ordo._id,
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("La note a été ajouter avec succès.");
      refreshOrdo();
      handleClose(false);
    } catch (error) {
      console.error("Erreur lors de l'ajoute de la note :", error);
      toast.error(error?.response?.data.message);
    } finally {
      setIsLoading(false);
      setText("");
    }
  };

  //     if (!name) return toast.error("Le nom de niveau est requise");

  //     try {
  //       setIsLoading(true);
  //       await axios.post(
  //         `${process.env.REACT_APP_API_URL}/level`,
  //         {
  //           name: name,
  //         },
  //         {
  //           headers: {
  //             Authorization: "Bearer " + user.token,
  //           },
  //         }
  //       );
  //       toast.success("Le niveau a été ajouter avec succès.");
  //       refreshLevels();
  //       handleClose(false);
  //     } catch (error) {
  //       console.error("Erreur lors de la'ajoute de le niveau :", error);
  //       toast.error(error.response.data.message);
  //     } finally {
  //       setIsLoading(false);
  //       setName("");
  //     }
  //   };

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
                  <FilePlus2 size={20} className="text-white me-2" />
                  <h1 className="text-sm md:text-lg text-white">
                    {" "}
                    Ajouter la note de l'ordonnance ORD-{ordo.numero}
                  </h1>
                </span>
                <CircleX
                  onClick={() => handleClose(false)}
                  className="text-white cursor-pointer"
                />
              </div>
              <form onSubmit={addNote}>
                <div className="flex flex-col mb-4 ">
                  <label className="text-md text-gray-500" htmlFor="name">
                    Note
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

export default AddNote;
