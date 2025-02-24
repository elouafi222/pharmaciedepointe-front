import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  CheckCircle2,
  ExternalLink,
  FileSearch,
  Inbox,
  Info,
  LoaderCircle,
  RefreshCcw,
  RouteOff,
  Trash,
  Trash2Icon,
} from "lucide-react";
import axios from "axios";
import { extractEmail, per_page } from "../utils/constant";
import Pagination from "../components/Pagination";
import moment from "moment";
import AccepteMessage from "../modals/message/AccepteMessage";
import DeleteMessage from "../modals/message/DeleteMessage";
import { useSelector } from "react-redux";
import DeteleManyMessage from "../modals/message/DeleteManyMessage";
moment.locale("fr");

function Messages() {
  const { user } = useSelector((state) => state.auth);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(count / per_page);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({
    sender: "",
    type: "",
  });

  const fetchMessage = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/message?page=${currentPage}&sender=${filters.sender}&type=${filters.type}`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      setMessages(res.data.messages);
      setCount(res.data.totalCount);
    } catch (error) {
      // console.log("Fetching messages failed" + error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMessage();

    const interval = setInterval(() => {
      fetchMessage();
    }, 120000);

    return () => clearInterval(interval);
  }, [currentPage, filters]);

  const handleFilterChange = (e) => {
    setCurrentPage(1);
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      sender: "",
      type: "",
    });
  };

  const refreshMessage = async (e) => {
    fetchMessage();
  };
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [accepteMessageOpen, setAccepteMessageOpen] = useState(false);
  const [deleteMessageOpen, setDeleteMessageOpen] = useState(false);
  const [deleteManyMessageOpen, setDeleteManyMessageOpen] = useState(false);
  const openAccepteMessageModal = (item) => {
    setSelectedMessage(item);
    setAccepteMessageOpen(true);
  };

  const closeAccepteMessageModal = () => {
    setSelectedMessage(null);
    setAccepteMessageOpen(false);
  };

  const openDeleteMessageModal = (item) => {
    setSelectedMessage(item);
    setDeleteMessageOpen(true);
  };

  const closeDeleteMessageModal = () => {
    setSelectedMessage(null);
    setDeleteMessageOpen(false);
  };
  const openDeleteManyMessageModal = () => {
    setDeleteManyMessageOpen(true);
  };

  const closeDeleteManyMessageModal = () => {
    setDeleteManyMessageOpen(false);
  };
  const [selectedMessages, setSelectedMessages] = useState([]);
  const handleSelectMessage = (messageId) => {
    setSelectedMessages((prevSelected) =>
      prevSelected.includes(messageId)
        ? prevSelected.filter((id) => id !== messageId)
        : [...prevSelected, messageId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allMessageIds = messages.map((message) => message._id);
      setSelectedMessages(allMessageIds);
    } else {
      setSelectedMessages([]);
    }
  };

  return (
    <div className="flex ">
      <Sidebar />
      <div className="h-screen flex-1 p-1 md:p-7  overflow-y-scroll">
        <Navbar page="Nouveaux messages" />
        <div className="grid md:grid-cols-5 p-3 mb-4 gap-3 bg-gray-100 rounded-lg ">
          <button
            onClick={refreshMessage}
            className="flex flex-row items-center justify-center bg-gradient-to-r from-slate-950 to-slate-800  hover:to-slate-600 text-white capitalize text-center text-xs py-3 rounded-lg w-full   transition-all duration-200"
          >
            <RefreshCcw size={20} className="text-white me-2" />
            Rafraîchir les messages
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FileSearch size={20} className="text-green-400" />
            </div>
            <input
              name="sender"
              value={filters.sender}
              onChange={handleFilterChange}
              type="text"
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
              placeholder="Rechercher par adresse email ou numéro de WhatsApp"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <Inbox size={20} className="text-green-400" />
            </div>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
            >
              <option disabled selected value="">
                Filtrer par type
              </option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>
          </div>
          <button
            onClick={() => handleReset()}
            className="flex flex-row items-center justify-center bg-gradient-to-r from-slate-950 to-slate-800  hover:to-slate-600 text-white capitalize text-center text-xs py-3 rounded-lg w-full   transition-all duration-200"
          >
            <RouteOff size={20} className="text-white me-2" />
            réinitialiser
          </button>
          <button
            disabled={selectedMessages.length === 0}
            onClick={() => openDeleteManyMessageModal()}
            className="flex flex-row items-center justify-center bg-gradient-to-r from-red-600 to-red-500  hover:to-red-400 text-white capitalize text-center text-xs py-3 rounded-lg w-full   transition-all duration-200"
          >
            <Trash2Icon size={20} className="text-white me-2" />
            Supprimer les messages
          </button>
        </div>
        <div className="relative overflow-x-auto p-3 bg-gray-100 rounded-lg ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-slate-950 to-slate-800 ">
              <tr>
                <th className="px-6 py-3 rounded-l-lg">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedMessages.length === messages.length}
                  />
                  <label htmlFor=""> Sélectionner tout</label>
                </th>
                <th scope="col" className="px-6 py-3 ">
                  N°
                </th>
                <th scope="col" className="px-6 py-3">
                  De
                </th>
                <th scope="col" className="px-6 py-3">
                  Fichier
                </th>
                <th scope="col" className="px-6 py-3">
                  Par
                </th>
                <th scope="col" className="px-6 py-3">
                  Date de réception
                </th>
                <th scope="col" className="px-6 py-3 rounded-r-lg">
                  Opérations
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  Opérations
                </th> */}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8">
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
                  <td colSpan="8">
                    <span className="h-36 w-full flex flex-col justify-center items-center">
                      <span className="text-sm text-gray-700 italic mb-2">
                        Aucun résultat
                      </span>
                      <Info className="animate-bounce text-yellow-400" />
                    </span>
                  </td>
                </tr>
              ) : (
                messages.map((message, index) => (
                  <tr
                    key={index}
                    className=" hover:bg-white transition-all duration-100"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message._id)}
                        onChange={() => handleSelectMessage(message._id)}
                      />
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-600 whitespace-nowrap rounded-l-lg"
                    >
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">{message.sender}</td>
                    <td className="px-6 py-4 ">
                      <a
                        href={message.url}
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
                    <td className="px-6 py-4 ">
                      <span className="flex flex-row items-center">
                        {message.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {moment(message.timestamp).format("Do MMM  YY")} (
                      {moment(message.timestamp).fromNow()})
                    </td>

                    <td className="px-6 py-4 ">
                      <span className="flex justify-between">
                        {" "}
                        <CheckCircle2
                          onClick={() => openAccepteMessageModal(message)}
                          size={20}
                          className="text-green-500 cursor-pointer"
                        />
                        <Trash
                          onClick={() => openDeleteMessageModal(message)}
                          size={20}
                          className="text-red-500 cursor-pointer"
                        />
                      </span>
                    </td>

                    {/* <td className="px-6 py-4  ">
                    <UserCog
                      onClick={() => openAddMessageModal()}
                      size={20}
                      className="text-slate-950 cursor-pointer"
                    />
                    <select
                      className="border rounded px-2 py-1 text-sm text-gray-600"
                      onChange={(e) => console.log(e.target.value)} // Replace with your actual handler
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="terminee">Terminée</option>
                    </select>
                  </td> */}
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

        <DeleteMessage
          message={selectedMessage}
          user={user}
          refreshMessages={fetchMessage}
          show={deleteMessageOpen}
          handleClose={closeDeleteMessageModal}
        />
        <DeteleManyMessage
          messages={selectedMessages}
          user={user}
          refreshMessages={fetchMessage}
          show={deleteManyMessageOpen}
          handleClose={closeDeleteManyMessageModal}
        />
        <AccepteMessage
          message={selectedMessage}
          user={user}
          refreshMessages={fetchMessage}
          show={accepteMessageOpen}
          handleClose={closeAccepteMessageModal}
        />
      </div>
    </div>
  );
}

export default Messages;
