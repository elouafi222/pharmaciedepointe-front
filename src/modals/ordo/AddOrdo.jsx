import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { CircleX, FilePlus, LoaderCircle } from "lucide-react";

function AddOrdo({ show, handleClose, user, refreshOrdo }) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [periode, setPeriode] = useState(1);
  const [times, setTimes] = useState(1);
  const [file, setFile] = useState(null);
  const [respo, setRespo] = useState(false);
  const [type, setType] = useState("unique");
  const [more500, setmMore500] = useState(false);
  const [livraison, setlivraison] = useState(false);
  const [adresse, setAdresse] = useState("");
  useEffect(() => {
    if (show) {
      setlivraison(!show);
      setmMore500(!show);
    }
  }, [show]);

  const addOrdoSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }
    if (!firstName) return toast.error("Le prenom est requise");
    if (!lastName) return toast.error("Le nom est requis");
    if (!tel) return toast.error("Numéro de télephone est requis");
    if (type === "renouveller") {
      if (!periode) return toast.error("Periode est requis");
      if (!times) return toast.error("Nombre de fois est requis");
    }
    if (livraison) {
      if (!adresse) return toast.error("Adreese de livraison est requis");
    }
    const formData = new FormData();
    formData.append("nom", lastName);
    formData.append("prenom", firstName);
    formData.append("email", email);
    formData.append("phone", tel);
    formData.append("isMore500", more500);
    formData.append("livraison", livraison);
    formData.append("adresse", adresse);
    formData.append("file", file);
    formData.append("type", type);
    formData.append("periodeRenouvellement", periode);
    formData.append("times", times);

    if (respo) {
      formData.append("collabId", user._id);
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/ordonnance`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("L'ordonnance a été ajoutée avec succès.");
      refreshOrdo();
      handleClose(false);
    } catch (error) {
      // console.error("Erreur lors de l'ajout de l'ordonnance :", error);
      toast.error(error.response?.data.message);
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
            className="bg-gradient-to-br bg-white p-3 md:p-6 rounded-lg max-h-full  overflow-y-scroll  w-full max-w-screen  shadow-3xl cursor-default relative overflow-hidden"
          >
            <div className="flex flex-col">
              <div className="flex flex-row justify-between rounded-lg items-center p-3 mb-4 bg-gradient-to-r from-slate-950 to-slate-800">
                <span className="flex items-center">
                  <FilePlus size={20} className="text-white me-2" />
                  <h1 className="text-sm md:text-lg text-white">
                    Ajouter une nouvelle ordonnance
                  </h1>
                </span>
                <CircleX
                  onClick={() => handleClose(false)}
                  className="text-white cursor-pointer"
                />
              </div>
              <form
                onSubmit={addOrdoSubmit}
                className="grid md:grid-cols-3 gap-x-3 md:gap-x-5"
              >
                <div className="">
                  <div className="flex flex-col mb-4 ">
                    <label
                      className="text-md text-gray-500"
                      htmlFor="firstName"
                    >
                      Prénom
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="text"
                      id="firstName"
                    />
                  </div>
                  <div className="flex flex-col mb-4 ">
                    <label className="text-md text-gray-500" htmlFor="lastName">
                      Nom
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="text"
                      id="lastName"
                    />
                  </div>
                  <div className="flex flex-col mb-4 ">
                    <label className="text-md text-gray-500" htmlFor="email">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none "
                      type="email"
                      id="email"
                    />
                  </div>
                  <div className="flex flex-col mb-4 ">
                    <label className="text-md text-gray-500" htmlFor="tel">
                      Tél
                    </label>
                    <input
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none "
                      type="text"
                      id="tel"
                    />
                  </div>
                  <div className="flex flex-col mb-4  col-span-2 ">
                    <label className="text-md text-gray-500" htmlFor="file">
                      Ordonnance
                    </label>
                    <input
                      // value={file}
                      onChange={(e) => setFile(e.target.files[0])}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none "
                      type="file"
                      id="file"
                    />
                  </div>
                </div>
                <div className="">
                  <div className=" mb-4 flex flex-row  items-center  col-span-2 ">
                    <input
                      value={more500}
                      onChange={(e) => setmMore500(!more500)}
                      type="checkbox"
                      className="p-0"
                    />
                    <label className="text-md text-gray-500 ms-3">
                      Produit superieur a 500 EUROS
                    </label>
                  </div>
                  <div className=" mb-4 flex flex-row  items-center  col-span-2 ">
                    <input
                      value={livraison}
                      onChange={(e) => setlivraison(!livraison)}
                      type="checkbox"
                      className="p-0"
                    />
                    <label className="text-md text-gray-500 ms-3">
                      Avec livraison
                    </label>
                  </div>
                  {livraison && (
                    <div className="flex flex-col mb-4 col-span-2">
                      <label className="text-md text-gray-500" htmlFor="tel">
                        Adresse
                      </label>
                      <input
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                        type="text"
                        id="tel"
                      />
                    </div>
                  )}
                </div>
                <div className="">
                  <div className=" mb-4 flex flex-row  items-center  col-span-2 ">
                    <label className="text-md text-gray-500" htmlFor="type">
                      Type de l'ordonnance
                    </label>
                    <select
                      onChange={(e) => setType(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      name="type"
                      id=""
                      value={type}
                    >
                      <option value="unique">Unique</option>
                      <option value="renouveller">Renouveller</option>
                    </select>
                  </div>
                  {type === "renouveller" && (
                    <>
                      <div className="flex flex-col mb-4">
                        <label
                          className="text-md text-gray-500"
                          htmlFor="periode"
                        >
                          Intervalle de temps (Nombre de jours)
                        </label>
                        <input
                          value={periode}
                          onChange={(e) => setPeriode(e.target.value)}
                          className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                          type="number"
                          min={1}
                          id="periode"
                        />
                      </div>
                      <div className="flex flex-col mb-4 ">
                        <label
                          className="text-md text-gray-500"
                          htmlFor="times"
                        >
                          Nombre des cycles
                        </label>
                        <input
                          value={times}
                          onChange={(e) => setTimes(e.target.value)}
                          className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                          type="number"
                          min={1}
                          id="times"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-row mb-4 items-center col-span-2  ">
                    <input
                      value={respo}
                      onChange={(e) => setRespo(true)}
                      type="checkbox"
                      className="p-0"
                      name="respo"
                      id="respo"
                    />
                    <label className="text-sm text-gray-500 ms-3">
                      Vous désigner comme Responsable de cette ordonnance.
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="md:col-span-3 flex justify-center p-3 text-center text-white mt-3 w-full uppercase h-100 bg-gradient-to-r from-green-600 to-green-400 rounded-lg"
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

export default AddOrdo;
