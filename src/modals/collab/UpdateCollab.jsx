import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { CircleX, LoaderCircle, UserRoundPen } from "lucide-react";

function UpdateCollab({ show, handleClose, user, refreshUsers, item }) {
  const [isLoading, setIsLoading] = useState(false);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (item) {
      setNom(item.nom);
      setPrenom(item.prenom);
      setPassword(item.password);
      setRole(item.role);
      setUsername(item.username);
    }
  }, [item]);

  const updateUserSubmit = async (e) => {
    e.preventDefault();
    if (!prenom) return toast.error("Le prénom est requis");
    if (!nom) return toast.error("Le nom est requise");
    if (!username) return toast.error("Le  nom d'utilisateur  est requis");
    if (!password) return toast.error("Le mot de passe est requis");
    if (!role) return toast.error("Le role est requis");
    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/user/${item._id}`,
        {
          nom: nom,
          prenom: prenom,
          password: password,
          role: role,
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("L'utilisateur a été ajouter avec succès.");
      refreshUsers();
      handleClose(false);
    } catch (error) {
      // console.error("Erreur lors de la mise à jour de le responsable :", error);
      toast.error(error.response);
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
          className="bg-slate-900/50 backdrop-blur  p-3 md:p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br bg-white p-3 md:p-6 rounded-lg w-full max-w-lg shadow-3xl cursor-default relative overflow-hidden"
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between rounded-lg items-center p-3 mb-4 bg-gradient-to-r from-slate-950 to-slate-800 ">
                <span className="flex items-center">
                  <UserRoundPen size={20} className="text-white me-2" />
                  <h1 className="text-sm md:text-lg text-white">
                    {" "}
                    Modifier le collaborateur{" "}
                    <span className="capitalize">{item.prenom + " "}</span>
                    <span className="uppercase">{item.nom}</span>
                  </h1>
                </span>
                <CircleX
                  onClick={() => handleClose(false)}
                  className="text-white cursor-pointer"
                />
              </div>
              <form onSubmit={updateUserSubmit}>
                <div className="flex flex-col mb-4 ">
                  <label className="text-md text-gray-500" htmlFor="name">
                    Prénom
                  </label>
                  <input
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="flex flex-col mb-4 ">
                  <label className="text-md text-gray-500" htmlFor="name">
                    Nom
                  </label>
                  <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="flex flex-col mb-4 ">
                  <label className="text-md text-gray-500" htmlFor="name">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border-2 cursor-pointer border-purple-600 focus:border-purple-700 focus:outline-none rounded-lg px-3 py-1"
                    id="role"
                  >
                    <option disabled selected value="">
                      Sélectionnez le type
                    </option>
                    <option className="text-purple-700 " value="admin">
                      Admin
                    </option>
                    <option className="text-purple-700 " value="collab">
                      Collaborateur
                    </option>
                  </select>
                </div>
                <div className="flex flex-col mb-4 ">
                  <label className="text-md text-gray-500" htmlFor="name">
                    Mot d'utilisateur
                  </label>
                  <input
                    value={username}
                    disabled
                    className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="flex flex-col mb-4 ">
                  <label className="text-md text-gray-500" htmlFor="name">
                    Mot de passe
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                    type="text"
                    name=""
                    id=""
                  />
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

export default UpdateCollab;
