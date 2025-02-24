import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  AlertCircle,
  CalendarSearch,
  Check,
  Edit3,
  ExternalLink,
  FileClock,
  FileDigit,
  FilePen,
  FilePlus2,
  FileSearch,
  Info,
  LoaderCircle,
  RouteOff,
  SendHorizonal,
  Timer,
  Trash,
} from "lucide-react";
import Pagination from "../components/Pagination";
import AddNote from "../modals/note/AddNote";
import UpdateNote from "../modals/note/UpdateNote";
import moment from "moment";
import axios from "axios";
import { per_page } from "../utils/constant";
import UpdateOrdo from "../modals/ordo/UpdateOrdo";
import DeleteOrdo from "../modals/ordo/DeleteOrdo";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ReplyOrdo from "../modals/ordo/ReplyOrdo";
moment.locale("fr");
function Termine() {
  const { user } = useSelector((state) => state.auth);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(count / per_page);

  const [ordonnances, setOrdonnances] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    date: "",
    numero: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const fetchOrdo = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/ordonnance?page=${currentPage}&search=${filters.search}&date=${filters.date}&numero=${filters.numero}&status=3`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setOrdonnances(res.data.ordonnances);
      setCount(res.data.totalCount);
    } catch (error) {
      // console.log("Fetching ordonnances failed" + error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrdo();
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    setCurrentPage(1);
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  const handleReset = () => {
    setFilters({
      search: "",
      date: "",
      numero: "",
    });
  };

  const changeStatusOrdo = async (ordonnanceId, numero, status) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/ordonnance/changeStatusOrdnnance/${ordonnanceId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchOrdo();
      toast.success(
        `Le statut d'ordonnance ORD-${numero} vous a été modifeier en success.`
      );
    } catch (error) {
      // console.error("Error changing statut:", error);
      toast.error(
        `Erreur lors de le changament du statut. Veuillez réessayer plus tard.`
      );
    }
  };
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

      fetchOrdo();
      toast.success(
        `Le statut du renouvellement ${cycle} de l'ordonnance ORD-${numero} a été modifié avec succès.`
      );
    } catch (error) {
      // console.error("Error changing statut:", error);
      toast.error(
        `Erreur lors de le changament du statut. Veuillez réessayer plus tard.`
      );
    }
  };
  const [selectedOrderNote, setSelectedOrderNote] = useState(null);
  const [updateOrderNoteOpen, setUpdateOrderNoteOpen] = useState(false);
  const [addOrderNoteOpen, setAddOrderNoteOpen] = useState(false);

  const openUpdateOrderNoteModal = (item) => {
    setSelectedOrderNote(item);
    setUpdateOrderNoteOpen(true);
  };

  const closeUpdateOrderNoteModal = () => {
    setSelectedOrderNote(null);
    setUpdateOrderNoteOpen(false);
  };
  const openAddOrderNoteModal = (ordo) => {
    setSelectedOrderNote(ordo);
    setAddOrderNoteOpen(true);
  };

  const closedOrderNoteModal = () => {
    setSelectedOrder(null);
    setAddOrderNoteOpen(false);
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateOrderOpen, setUpdateOrderOpen] = useState(false);
  const [deleteOrderOpen, setDeleteOrderOpen] = useState(false);

  const openUpdateOrderModal = (item) => {
    setSelectedOrder(item);
    setUpdateOrderOpen(true);
  };

  const closeUpdateOrderModal = () => {
    setSelectedOrder(null);
    setUpdateOrderOpen(false);
  };

  const openDeleteOrderModal = (item) => {
    setSelectedOrder(item);
    setDeleteOrderOpen(true);
  };

  const closeDeleteOrderModal = () => {
    setSelectedOrder(null);
    setDeleteOrderOpen(false);
  };
  // const openAddOrderModal = () => {
  //   setAddOrderOpen(true);
  // };

  // const closedOrderModal = () => {
  //   setAddOrderOpen(false);
  // };
  const [replyOrderOpen, setReplyOrderOpen] = useState(false);
  const openReplyOrderModal = (item) => {
    setSelectedOrder(item);
    setReplyOrderOpen(true);
  };

  const closeReplyOrderModal = () => {
    setSelectedOrder(null);
    setReplyOrderOpen(false);
  };
  return (
    <div className="flex ">
      <Sidebar />
      <div className="h-screen flex-1 p-1 md:p-7  overflow-y-scroll">
        <Navbar page="Ordonnances terminées" />
        <div className="grid md:grid-cols-4 p-3 mb-4 gap-3 bg-gray-100 rounded-lg ">
          {/* <button
            onClick={() => openAddOrderModal()}
            className="flex flex-row items-center justify-center bg-gradient-to-r from-slate-950 to-slate-800  hover:to-slate-600 text-white capitalize text-center text-xs py-3 rounded-lg w-full   transition-all duration-200"
          >
            <FilePlus size={20} className="text-white me-2" />
            Nouvelle ordonnance
          </button> */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FileDigit size={20} className="text-green-400" />
            </div>
            <input
              name="numero"
              value={filters.numero}
              onChange={handleFilterChange}
              type="text"
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
              placeholder="ORD-Numero"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FileSearch size={20} className="text-green-400" />
            </div>
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              type="text"
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
              placeholder="Chercher par prénom, nom, email, phone de Client"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <CalendarSearch size={20} className="text-green-400" />
            </div>
            <input
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              type="date"
              className="text-slate-800 placeholder:text-sky-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-sky-950 focus:outline-none w-full"
              placeholder="Chercher par jour"
            />
          </div>
          <button
            onClick={() => handleReset()}
            className="flex flex-row items-center justify-center bg-gradient-to-r from-slate-950 to-slate-800  hover:to-slate-600 text-white capitalize text-center text-xs py-3 rounded-lg w-full   transition-all duration-200"
          >
            <RouteOff size={20} className="text-white me-2" />
            réinitialiser
          </button>
        </div>
        <div className="relative overflow-x-auto p-3 bg-gray-100 rounded-lg ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-slate-950 to-slate-800 ">
              <tr>
                <th scope="col" className="px-3 py-3 rounded-l-lg">
                  N°
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Opérations
                </th>

                <th scope="col" className="px-3 py-3">
                  Renouvellement statut
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Modifier R.Statut
                </th>
                <th scope="col" className="px-3 py-3 ">
                  Traité par
                </th>
                <th scope="col" className="px-3 py-3">
                  Client
                </th>
                <th scope="col" className="px-1 py-3">
                  Ordonnance Statut
                </th>
                <th scope="col" className="px-3 py-3  ">
                  Modifier O.Statut
                </th>
                <th scope="col" className="px-3 py-3">
                  Ordonnance
                </th>

                <th scope="col" className="px-3 py-3">
                  Tél
                </th>
                <th scope="col" className="px-3 py-3">
                  Email
                </th>
                <th scope="col" className="px-3 py-3 flex flex-row">
                  {"<"}500€
                </th>
                <th scope="col" className="px-3 py-3">
                  Livraison
                </th>
                <th scope="col" className="px-3 py-3">
                  Type
                </th>
                <th scope="col" className="px-3 py-3">
                  Date de réception
                </th>
                <th scope="col" className="px-3 py-3 rounded-r-lg">
                  Date de traitement
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="16">
                    <span className="h-36 w-full flex flex-col justify-center items-center">
                      <span className="text-sm text-gray-700 italic mb-2">
                        Chargement, veuillez patienter...
                      </span>
                      <LoaderCircle className="animate-spin text-slate-950" />
                    </span>
                  </td>
                </tr>
              ) : count === 0 ? (
                <tr>
                  <td colSpan="16">
                    <span className="h-36 w-full flex flex-col justify-center items-center">
                      <span className="text-sm text-gray-700 italic mb-2">
                        Aucun résultat
                      </span>
                      <Info className="animate-bounce text-yellow-400" />
                    </span>
                  </td>
                </tr>
              ) : (
                ordonnances.map((ordonnance, index) => (
                  <tr
                    key={index}
                    className=" hover:bg-white transition-all duration-100"
                  >
                    <th
                      scope="row"
                      className=" flex items-center px-3 py-4 font-medium text-gray-600 whitespace-nowrap rounded-l-lg"
                    >
                      ORD-{ordonnance.numero + " "}{" "}
                      {ordonnance.type === "renouveller" &&
                      ordonnance.cycles.length > 0 ? (
                        <span className="flex px-2 py-1 ms-2 text-sm rounded-lg bg-sky-400 text-white">
                          R{" "}
                          {"(" +
                            ordonnance.cycles[ordonnance.cycles.length - 1]
                              ?.cycleNumber +
                            ")"}
                        </span>
                      ) : (
                        <span className="px-2 py-1 ms-2 text-sm rounded-lg bg-green-400 text-white">
                          U
                        </span>
                      )}
                    </th>
                    <td className="px-3 py-4 rounded-r-lg ">
                      {ordonnance.collabId ? (
                        <span className="flex justify-between">
                          {" "}
                          <Edit3
                            onClick={() => openUpdateOrderModal(ordonnance)}
                            size={20}
                            className="text-green-500 cursor-pointer"
                          />
                          <Trash
                            onClick={() => openDeleteOrderModal(ordonnance)}
                            size={20}
                            className="text-red-500 cursor-pointer"
                          />
                          <SendHorizonal
                            onClick={() => openReplyOrderModal(ordonnance)}
                            size={20}
                            className="text-sky-500 cursor-pointer"
                          />
                        </span>
                      ) : (
                        <span className="text-xxs italic capitalize ">
                          Pour avoir accès, Vous devez assumer la
                          responsabilité.
                        </span>
                      )}
                    </td>

                    <td>
                      {ordonnance.type === "renouveller" &&
                      ordonnance.cycles.length > 0 ? (
                        <span className="flex flex-row items-center">
                          {ordonnance.cycles[ordonnance.cycles.length - 1]
                            .cycleStatus === "2" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-green-600 to-green-400">
                              Terminée <Check className="ms-2" />
                            </span>
                          )}
                          {ordonnance.cycles[ordonnance.cycles.length - 1]
                            .cycleStatus === "4" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-yellow-400 to-yellow-300">
                              En cours <Timer className=" ms-2" />
                            </span>
                          )}
                          {ordonnance.cycles[ordonnance.cycles.length - 1]
                            .cycleStatus === "1" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-red-600 to-red-400">
                              En attente <AlertCircle className=" ms-2" />
                            </span>
                          )}
                          {ordonnance.cycles[ordonnance.cycles.length - 1]
                            .cycleStatus === "3" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-red-600 to-red-400">
                              En retard <FileClock className=" ms-2" />
                            </span>
                          )}
                        </span>
                      ) : (
                        " - "
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {ordonnance.type === "renouveller" ? (
                        <>
                          {ordonnance.collabId ? (
                            <select
                              value={
                                ordonnance.cycles[ordonnance.cycles.length - 1]
                                  .cycleStatus
                              }
                              onChange={(e) =>
                                changeStatusCycle(
                                  ordonnance.cycles[
                                    ordonnance.cycles.length - 1
                                  ].cycleId,
                                  ordonnance.numero,
                                  ordonnance.cycles[
                                    ordonnance.cycles.length - 1
                                  ].cycleNumber,
                                  e.target.value
                                )
                              }
                              className="border-2 border-slate-400 focus:border-slate-950 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:border-sky"
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
                          ) : (
                            <span className="text-xxs italic capitalize ">
                              Pour avoir accès, Vous devez assumer la
                              responsabilité.
                            </span>
                          )}
                        </>
                      ) : (
                        " - "
                      )}
                    </td>
                    <td className="px-3 py-4 rounded-r-lg">
                      {ordonnance.collaborator ? (
                        <>
                          <span className="capitalize">
                            {ordonnance.collaborator.prenom}
                          </span>{" "}
                          <span className="uppercase">
                            {ordonnance.collaborator.nom}
                          </span>
                        </>
                      ) : (
                        "Aucune Responsable"
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {ordonnance.prenom && ordonnance.nom ? (
                        <>
                          <span className="capitalize">
                            {ordonnance.prenom}
                          </span>{" "}
                          <span className="uppercase">{ordonnance.nom}</span>
                        </>
                      ) : (
                        <span className="text-xxs italic capitalize ">
                          Aucune donnée
                        </span>
                      )}
                    </td>
                    <td className="px-1 py-4 capitalize">
                      {ordonnance.status && (
                        <span className="flex flex-row items-center">
                          {ordonnance.status === "3" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-green-600 to-green-400">
                              Terminée <Check className="ms-2" />
                            </span>
                          )}
                          {ordonnance.status === "2" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-yellow-400 to-yellow-300">
                              En cours <Timer className=" ms-2" />
                            </span>
                          )}
                          {ordonnance.status === "1" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-red-600 to-red-400">
                              En attente <AlertCircle className=" ms-2" />
                            </span>
                          )}
                          {ordonnance.status === "4" && (
                            <span className="flex justify-center items-center text-sm  rounded-lg text-white px-2 py-1 bg-gradient-to-tr from-red-600 to-red-400">
                              En retard <FileClock className=" ms-2" />
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {ordonnance.collabId ? (
                        <select
                          value={ordonnance.status}
                          onChange={(e) =>
                            changeStatusOrdo(
                              ordonnance._id,
                              ordonnance.numero,
                              e.target.value
                            )
                          }
                          className="border-2 border-slate-400 focus:border-slate-950 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:border-sky"
                        >
                          <option disabled value="1">
                            En attente
                          </option>
                          <option value="2">En cours</option>
                          <option value="3">Terminée</option>
                          <option disabled value="4">
                            En retard
                          </option>
                        </select>
                      ) : (
                        <span className="text-xxs italic capitalize ">
                          Pour avoir accès, Vous devez assumer la
                          responsabilité.
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-4 ">
                      <a
                        href={ordonnance.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="flex flex-row items-center hover:underline duration-200 cursor-pointer">
                          Ouvrir{" "}
                          <ExternalLink
                            className="text-gray-600 ms-4"
                            size={15}
                          />{" "}
                        </span>
                      </a>
                    </td>

                    <td className="px-3 py-4">
                      {ordonnance.phone ? (
                        ordonnance.phone
                      ) : (
                        <span className="text-xxs italic capitalize ">
                          Aucune donnée
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center">
                      {ordonnance.email ? (
                        ordonnance.email
                      ) : (
                        <span className="text-xxs italic capitalize ">
                          Aucune donnée
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-center">
                      {ordonnance.isMore500 ? "Oui" : "Non"}
                    </td>
                    <td className="px-3 py-4 text-center">
                      {ordonnance.livraison ? ordonnance.adresse : "Non"}
                    </td>
                    <td className="px-3 py-4 capitalize">
                      {ordonnance.type === "renouveller" &&
                      ordonnance.cycles.length > 0 ? (
                        <div className="flex flex-col">
                          <span className="flex">
                            {" "}
                            {ordonnance.type + " "} (
                            {
                              ordonnance.cycles[ordonnance.cycles.length - 1]
                                ?.cycleNumber
                            }
                            )
                          </span>
                        </div>
                      ) : (
                        ordonnance.type
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {moment(ordonnance.dateReception).format("Do MMM  YY")}
                    </td>
                    <td className="px-3 py-4">
                      {moment(ordonnance.updatedAt).format("Do MMM  YY")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && count > 0 && (
          <Pagination
            pages={pages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            count={count}
            perPage={per_page}
          />
        )}
        <ReplyOrdo
          ordonnance={selectedOrder}
          user={user}
          refreshOrdo={fetchOrdo}
          show={replyOrderOpen}
          handleClose={closeReplyOrderModal}
        />
        <UpdateOrdo
        isEnRetardCycles={false}
          ordonnance={selectedOrder}
          user={user}
          refreshOrdo={fetchOrdo}
          show={updateOrderOpen}
          handleClose={closeUpdateOrderModal}
        />
        <DeleteOrdo
          ordonnance={selectedOrder}
          user={user}
          refreshOrdo={fetchOrdo}
          show={deleteOrderOpen}
          handleClose={closeDeleteOrderModal}
        />
        <AddNote
          user={user}
          ordo={selectedOrderNote}
          refreshOrdo={fetchOrdo}
          show={addOrderNoteOpen}
          handleClose={closedOrderNoteModal}
        />
        <UpdateNote
          user={user}
          ordo={selectedOrderNote}
          refreshOrdo={fetchOrdo}
          show={updateOrderNoteOpen}
          handleClose={closeUpdateOrderNoteModal}
        />
      </div>
    </div>
  );
}

export default Termine;
