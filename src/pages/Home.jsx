import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CountBoxes from "../components/CountBoxes";
import Navbar from "../components/Navbar";
import {
  AlertCircle,
  CalendarClock,
  Check,
  ExternalLink,
  FileClock,
  FilePlus,
  FileSearch,
  Info,
  ListRestart,
  LoaderCircle,
  Timer,
} from "lucide-react";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import AddOrdo from "../modals/ordo/AddOrdo";
moment.locale("fr");
function Home() {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [ordonnances, setOrdonnances] = useState([]);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("3");
  const fetchOrdo = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/ordonnance?page=1&status=${status}`,
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
  }, [status]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [addOrderOpen, setAddOrderOpen] = useState(false);
  const openAddOrderModal = () => {
    setAddOrderOpen(true);
  };

  const closedOrderModal = () => {
    setAddOrderOpen(false);
  };
  return (
    <div className="flex ">
      <Sidebar />
      <div className="h-screen flex-1 p-1 md:p-7   overflow-y-scroll">
        <Navbar page="Accueil" />
        <CountBoxes />
        <div className="flex  flex-col md:flex-row justify-between items-center p-3 mb-4 gap-3 bg-gray-100 rounded-lg ">
          <div className="flex  flex-col md:flex-row  items-center ">
            <h1 className=" font-bold text-md w-full">
              Ordonnances récemment{" "}
            </h1>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="capitalize text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
            >
              <option disabled selected value="">
                Filtrer par status
              </option>

              <option value="1">En attente</option>
              <option value="2">En Cours</option>
              <option value="3">Terminée</option>
              <option value="4">En retard</option>
            </select>
          </div>
          <button
            onClick={() => openAddOrderModal()}
            className="flex bg-gradient-to-r from-slate-950 to-slate-800 text-white capitalize px-5 py-2 rounded-lg w-full md:w-fit hover:to-slate-600 transition-all duration-200"
          >
            <FilePlus size={20} className="text-white me-2" />
            Nouvelle ordonnance
          </button>
        </div>
        <div className="relative overflow-x-scroll p-3 bg-gray-100 rounded-lg ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-slate-950 to-slate-800  ">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-l-lg">
                  N°
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3">
                  Traité par
                </th>
                <th scope="col" className="px-6 py-3">
                  Ordonnance
                </th>
                <th scope="col" className="px-6 py-3">
                  Client
                </th>
                <th scope="col" className="px-6 py-3  rounded-r-lg">
                  Date de traitement
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6">
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
                  <td colSpan="6">
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
                    className="hover:bg-white transition-all duration-100"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap rounded-l-lg"
                    >
                      ORD-{ordonnance.numero}
                    </th>
                    <td className="px-6 py-4 capitalize">
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
                    <td className="px-6 py-4 ">
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
                    <td className="px-6 py-4">
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
                        <span className="text-xxs italic capitalize ">
                          Aucune donnée
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 ">
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
                    <td className="px-6 py-4">
                      {ordonnance?.prenom && ordonnance?.nom ? (
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

                    <td className="px-6 py-4">
                      {" "}
                      {moment(ordonnance.updatedAt).format("Do MMM  YY")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddOrdo
        user={user}
        refreshOrdo={fetchOrdo}
        show={addOrderOpen}
        handleClose={closedOrderModal}
      />
    </div>
  );
}

export default Home;
