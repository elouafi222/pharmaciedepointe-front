import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircle2,
  CircleX,
  FilePen,
  FilePlus,
  FilePlus2,
  FileWarning,
  LoaderCircle,
  SendHorizonal,
  TriangleAlert,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import AddNote from "../note/AddNote";
import UpdateNote from "../note/UpdateNote";
import ReplyOrdo from "./ReplyOrdo";
import moment from "moment";
import { useDispatch } from "react-redux";
import { getCount } from "../../redux/countApiCall";
moment.locale("fr");
function UpdateOrdo({
  show,
  handleClose,
  user,
  refreshOrdo,
  ordonnance,
  isEnRetardCycles,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [type, setType] = useState("");
  const [periode, setPeriode] = useState(1);
  const [times, setTimes] = useState(1);
  const [more500, setmMre500] = useState(false);
  const [livraison, setlivraison] = useState(false);
  const [adresse, setAdresse] = useState("");
  const [dateTreatement, setDateTreatement] = useState("");
  const [dateNextRenwal, setDateNextRenwal] = useState("");
  const [enoyerMessage, setEnoyerMessage] = useState(false);
  useEffect(() => {
    if (show) {
      setEnoyerMessage(!show);
    }
  }, [show]);
  useEffect(() => {
    if (ordonnance) {
      setFirstName(ordonnance.prenom || "");
      setLastName(ordonnance.nom || "");
      setEmail(ordonnance.email || "");
      setTel(ordonnance.phone);
      setType(ordonnance.type);
      setPeriode(ordonnance.periodeRenouvellement);
      setTimes(ordonnance.times);
      setmMre500(ordonnance.isMore500);
      setlivraison(ordonnance.livraison);
      setAdresse(ordonnance.adresse);
      setDateTreatement(ordonnance?.dateTreatement?.split("T")[0]);
      setDateNextRenwal(ordonnance?.dateRenouvellement?.split("T")[0]);
    }
  }, [ordonnance]);
  const updateOrdoSubmit = async (e) => {
    e.preventDefault();
    if (!firstName) return toast.error("Le prenom est requise");
    if (!lastName) return toast.error("Le nom est requis");
    if (!email) return toast.error("L'email est requis");
    if (!tel) return toast.error("Numéro de télephone est requis");
    if (type === "renouveller") {
      if (!periode) return toast.error("Periode est requis");
      if (!times) return toast.error("Nombre de fois est requis");
    }

    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_API_URL}/ordonnance/${ordonnance?._id}`,
        {
          nom: lastName,
          prenom: firstName,
          phone: tel,
          email: email,
          isMore500: more500,
          livraison: livraison,
          adresse: adresse,
          type: type,
          periodeRenouvellement: type ? periode : null,
          times: type ? times : null,
          dateTreatement: dateTreatement,
          enoyerMessage: enoyerMessage,
        },
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("L'ordonnance a été mise à jour avec succès.");
      refreshOrdo();
      handleClose(false);
    } catch (error) {
      // console.error("Erreur lors de la mise à jour de l'ordonnace :", error);
      toast.error(error.response?.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderNote, setSelectedOrderNote] = useState(null);
  const [updateOrderNoteOpen, setUpdateOrderNoteOpen] = useState(false);
  const [addOrderNoteOpen, setAddOrderNoteOpen] = useState(false);

  const openUpdateOrderNoteModal = (note, ordo) => {
    setSelectedOrderNote(note);
    setSelectedOrder(ordo);
    setUpdateOrderNoteOpen(true);
  };

  const closeUpdateOrderNoteModal = () => {
    setSelectedOrderNote(null);
    setSelectedOrder(null);
    setUpdateOrderNoteOpen(false);
  };
  const openAddOrderNoteModal = (ordo) => {
    setSelectedOrderNote(ordo);
    setAddOrderNoteOpen(true);
  };

  const closedOrderNoteModal = () => {
    setSelectedOrderNote(null);
    setAddOrderNoteOpen(false);
  };
  const [replyOrderOpen, setReplyOrderOpen] = useState(false);
  const openReplyOrderModal = (item) => {
    setSelectedOrder(item);
    setReplyOrderOpen(true);
  };

  const closeReplyOrderModal = () => {
    setSelectedOrder(null);
    setReplyOrderOpen(false);
  };
  const [notes, setNotes] = useState([]);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const fetchNotes = async () => {
    try {
      setIsNotesLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/note/${
          isEnRetardCycles ? "getNotesOfRetardCyclesByOrdId" : "notes"
        }/${ordonnance?._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setNotes(res.data);
    } catch (error) {
      // console.log("Fetching ordonnances failed" + error);
    } finally {
      setIsNotesLoading(false);
    }
  };
  useEffect(() => {
    if (ordonnance?._id) {
      fetchNotes();
    }
  }, [ordonnance?._id]);
  const dispatch = useDispatch();
  const changeStatusCycle = async (cycleId, numero, cycle, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/ordonnance/changeStatusCycle/${cycleId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchNotes();
      toast.success(
        `Le statut du cycle ${cycle} de l'ordonnance ORD-${numero} a été modifié avec succès.`
      );
      if (isEnRetardCycles) {
        dispatch(getCount());
      }
    } catch (error) {
      // console.error("Error changing statut:", error);
      toast.error(
        `Erreur lors de le changament du statut. Veuillez réessayer plus tard.`
      );
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
          className="bg-slate-900/50 backdrop-blur fixed inset-0 z-50 grid place-items-center  cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br bg-white p-3 md:p-6 rounded-lg max-h-full  overflow-y-scroll  w-full max-w-screen shadow-3xl cursor-default relative overflow-hidden"
          >
            <div className="flex flex-col ">
              <div className="mb-4 flex flex-row justify-between rounded-lg items-center p-3 bg-gradient-to-r from-slate-950 to-slate-800 ">
                <span className="flex items-center">
                  <FilePlus size={20} className="text-white me-2" />
                  <h1 className="text-sm md:text-lg text-white">
                    Modifier ORD-{ordonnance.numero}
                  </h1>
                </span>
                <CircleX
                  onClick={() => handleClose(false)}
                  className="text-white cursor-pointer"
                />
              </div>
              <form
                onSubmit={updateOrdoSubmit}
                className="grid  grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="flex flex-col gap-y-3">
                  <div className="flex flex-col">
                    <label
                      className="text-sm md:text-base text-gray-500"
                      htmlFor="firstName"
                    >
                      Prénom
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="text"
                      name="firstName"
                      id="firstName"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="text-sm md:text-base text-gray-500"
                      htmlFor="lastName"
                    >
                      Nom
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="text"
                      name="lastName"
                      id="lastName"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="text-sm md:text-base text-gray-500"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="email"
                      name="email"
                      id="email"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="text-sm md:text-base text-gray-500"
                      htmlFor="tel"
                    >
                      Tél
                    </label>
                    <input
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="text"
                      name="tel"
                      id="tel"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="text-sm md:text-base text-gray-500"
                      htmlFor="tel"
                    >
                      Date de l'ordonnance
                    </label>
                    <input
                      value={dateTreatement}
                      onChange={(e) => setDateTreatement(e.target.value)}
                      className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                      type="date"
                      name="tel"
                      id="tel"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-y-3">
                  {isNotesLoading ? (
                    <span className="flex items-center w-full text-white hover:underline cursor-pointer bg-gradient-to-tr from-green-500 to-green-400 custom-shadow px-3 py-1 rounded-lg">
                      <LoaderCircle size={20} className="animate-spin me-3" />{" "}
                      Chargement, veuillez patienter...
                    </span>
                  ) : (
                    <>
                      {ordonnance.type === "renouveller" ? (
                        <span
                          onClick={() =>
                            openUpdateOrderNoteModal(
                              notes.uniqueNotes[0],
                              ordonnance
                            )
                          }
                          className=" w-full text-white hover:underline cursor-pointer bg-gradient-to-tr from-green-500 to-green-400 custom-shadow px-3 py-1 rounded-lg"
                        >
                          Note générale de l'ordonnance
                        </span>
                      ) : (
                        <span
                          onClick={() =>
                            openUpdateOrderNoteModal(
                              notes.uniqueNotes,
                              ordonnance
                            )
                          }
                          className=" w-full text-white hover:underline cursor-pointer bg-gradient-to-tr from-green-500 to-green-400 custom-shadow px-3 py-1 rounded-lg"
                        >
                          Note de l'ordonnance
                        </span>
                      )}
                    </>
                  )}
                  <div className=" flex flex-row  items-center   ">
                    <input
                      value={more500}
                      onChange={(e) => setmMre500(!more500)}
                      type="checkbox"
                      className="p-0"
                      checked={more500}
                    />
                    <label
                      className="text-sm md:text-base text-gray-500 ms-3"
                      htmlFor="file"
                    >
                      Produit superieur a 500 EUROS
                    </label>
                  </div>
                  <div className=" flex flex-row  items-center   ">
                    <input
                      value={livraison}
                      onChange={(e) => setlivraison(!livraison)}
                      type="checkbox"
                      checked={livraison}
                      className="p-0"
                    />
                    <label
                      className="text-sm md:text-base text-gray-500 ms-3"
                      htmlFor="file"
                    >
                      Avec livraison
                    </label>
                  </div>
                  {livraison && (
                    <div className="flex flex-col col-span-2">
                      <label
                        className="text-sm md:text-base text-gray-500"
                        htmlFor="tel"
                      >
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
                  {ordonnance.type === "renouveller" && type === "unique" && (
                    <div className="flex items-center bg-gradient-to-tr from-red-600 to-red-500 custom-shadow mb-4 p-3 rounded-lg text-sm text-white">
                      <TriangleAlert size={50} className="me-3" />
                      <p>
                        Changer le type d'ordonnance supprimera toutes les
                        anciennes données liées.
                      </p>
                    </div>
                  )}

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
                          Nombre des renouvellements
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
                      {ordonnance.status === "2" && (
                        <div className="flex flex-col  mb-4 ">
                          <label
                            className="text-sm md:text-base text-gray-500"
                            htmlFor="tel"
                          >
                            Date de la prochaine renouvellement
                          </label>
                          <input
                            value={dateNextRenwal}
                            disabled
                            className="text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
                            type="date"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex flex-row mb-4 items-center col-span-2  ">
                    <input
                      value={enoyerMessage}
                      onChange={(e) => setEnoyerMessage(true)}
                      type="checkbox"
                      className="p-0"
                      name="respo"
                      id="respo"
                    />
                    <label className="text-sm text-gray-500 ms-3">
                      Vous pouvez informer le client que son ordonnance est en
                      cours de traitement.
                    </label>
                  </div>
                </div>
                {ordonnance.type === "renouveller" && (
                  <div className="md:col-span-3">
                    <div className="flex flex-col text-center mb-3">
                      <p className="italic text-sm text-center text-red-600">
                        {isEnRetardCycles
                          ? " -- Renouvellements en retard -- "
                          : " -- Historique des renouvellements -- "}
                      </p>
                    </div>

                    {isNotesLoading ? (
                      <span className="flex justify-center h-32 gap-y-2 text-white custom-shadow p-4 bg-gradient-to-tr from-sky-500 to-sky-400 rounded-lg text-sm">
                        {" "}
                        <LoaderCircle
                          size={20}
                          className="animate-spin me-3"
                        />{" "}
                        Chargement, veuillez patienter...
                      </span>
                    ) : (
                      <>
                        <div className="grid md:grid-cols-5 gap-4">
                          {notes.cycles?.map((cycle) => (
                            <div
                              key={cycle._id}
                              className={`flex flex-col gap-y-2 text-white custom-shadow p-4 rounded-lg text-sm ${
                                isEnRetardCycles
                                  ? "bg-gradient-to-tr from-red-500 to-red-400"
                                  : "bg-gradient-to-tr from-sky-500 to-sky-400"
                              }`}
                            >
                              <p>
                                <strong>N° de renouvellement: </strong>{" "}
                                {cycle.cycleNumber}
                                {!isEnRetardCycles &&
                                  ordonnance.cycles[
                                    ordonnance.cycles.length - 1
                                  ].cycleId === cycle.cycleId &&
                                  " (La dernière)"}
                              </p>
                              <p>
                                <strong>Statut: </strong>{" "}
                                <select
                                  disabled={
                                    !isEnRetardCycles &&
                                    ordonnance.cycles[
                                      ordonnance.cycles.length - 1
                                    ].cycleId === cycle.cycleId
                                  }
                                  value={cycle.cycleStatus}
                                  onChange={(e) =>
                                    changeStatusCycle(
                                      cycle.cycleId,
                                      ordonnance.numero,
                                      cycle.cycleNumber,
                                      e.target.value
                                    )
                                  }
                                  className="bg-white ms-3 border-none cursor-pointer  custom-shadow  focus:border-none rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:border-sky"
                                >
                                  <option disabled value="1">
                                    En attente
                                  </option>
                                  <option value="4">En cours</option>
                                  <option value="2">Terminée</option>
                                  <option disabled value="3">
                                    En retard
                                  </option>
                                </select>
                              </p>
                              <p>
                                <strong>Créé le :</strong>{" "}
                                {moment(cycle.createdAt).format("Do MMM YY")}
                              </p>
                              <p>
                                <strong>Traité le :</strong>{" "}
                                {moment(cycle.dateTreatement).format(
                                  "Do MMM YY [at] HH:mm"
                                )}
                              </p>

                              <p>
                                <strong>Responsable :</strong>{" "}
                                <span className="capitalize">
                                  {cycle.fullName ? cycle.fullName : "Aucun"}
                                </span>
                              </p>
                              <span
                                className="w-full text-white hover:underline cursor-pointer bg-gradient-to-tr from-green-500 to-green-400 custom-shadow p-1 rounded-lg"
                                onClick={() =>
                                  openUpdateOrderNoteModal(
                                    cycle.cycleNotes[0],
                                    ordonnance
                                  )
                                }
                              >
                                Note {cycle.cycleNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-x-3 md:col-span-3">
                  <button
                    type="button"
                    onClick={() => handleClose(false)}
                    className=" flex items-center justify-center p-3 text-center text-white mt-3 w-full uppercase h-100 bg-gradient-to-r from-red-600 to-red-400 rounded-lg"
                  >
                    Annuler
                    <CircleX size={20} className="text-white ms-2" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openReplyOrderModal(ordonnance)}
                    className=" flex items-center justify-center p-3 text-center text-white mt-3 w-full uppercase h-100 bg-gradient-to-r from-sky-600 to-sky-400 rounded-lg"
                  >
                    Repondre a l'ordonnance{" "}
                    <SendHorizonal size={20} className="text-white ms-2" />
                  </button>
                  <button
                    type="submit"
                    className=" flex items-center justify-center p-3 text-center text-white mt-3 w-full uppercase h-100 bg-gradient-to-r from-green-600 to-green-400 rounded-lg"
                  >
                    {isLoading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <span className=" flex items-center justify-center">
                        {" "}
                        Confirmer{" "}
                        <CheckCircle2 size={20} className="text-white ms-2" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
              <ReplyOrdo
                ordonnance={selectedOrder}
                user={user}
                // refreshOrdo={refreshOrdo}
                show={replyOrderOpen}
                handleClose={closeReplyOrderModal}
              />
              <AddNote
                user={user}
                ordo={selectedOrderNote}
                refreshOrdo={fetchNotes}
                show={addOrderNoteOpen}
                handleClose={closedOrderNoteModal}
              />
              <UpdateNote
                user={user}
                ordo={selectedOrder}
                note={selectedOrderNote}
                refreshOrdo={fetchNotes}
                show={updateOrderNoteOpen}
                handleClose={closeUpdateOrderNoteModal}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UpdateOrdo;
