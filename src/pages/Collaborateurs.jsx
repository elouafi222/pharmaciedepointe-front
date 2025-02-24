import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Info,
  LoaderCircle,
  RefreshCw,
  RouteOff,
  UserRoundPen,
  UserRoundPlus,
  UserRoundSearch,
  UserRoundX,
} from "lucide-react";
import { per_page } from "../utils/constant";
import Pagination from "../components/Pagination";
import AddCollab from "../modals/collab/AddCollab";
import UpdateCollab from "../modals/collab/UpdateCollab";
import DeleteCollab from "../modals/collab/DeleteCollab";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
moment.locale("fr");
function Collaborateurs() {
  const { user } = useSelector((state) => state.auth);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(count / per_page);
  const [isLoading, setIsLoading] = useState(false);
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isAccountActive: "",
  });

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/user?page=${currentPage}&search=${filters.search}&role=${filters.role}&isAccountActive=${filters.isAccountActive}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setCollaborateurs(res.data.users);
      setCount(res.data.totalCount);
    } catch (error) {
      // console.log("Fetching collaborateurs failed" + error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();
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
      role: "",
      isAccountActive: "",
    });
  };

  const changeStatus = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/user/accountActivity/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );
      toast.success("Compte statut a été modifiée avec succès.");
      setCollaborateurs((prevRespo) =>
        prevRespo.map((item) =>
          item._id === id
            ? { ...item, isAccountActive: !item.isAccountActive }
            : item
        )
      );
    } catch (error) {
      // console.error("Error change status:", error.message);
      toast.error(
        "Quelque chose s'est mal passé. Veuillez réessayer plus tard."
      );
    }
  };

  const [selectedCollabe, setSelectedCollabe] = useState(null);
  const [updateCollabeOpen, setUpdateCollabeOpen] = useState(false);
  const [addCollabeOpen, setAddCollabeOpen] = useState(false);
  const [deleteCollabeOpen, setDeleteCollabeOpen] = useState(false);
  const openUpdateCollabeModal = (item) => {
    setSelectedCollabe(item);
    setUpdateCollabeOpen(true);
  };

  const closeUpdateCollabeModal = () => {
    setSelectedCollabe(null);
    setUpdateCollabeOpen(false);
  };

  const openDeleteCollabeModal = (item) => {
    setSelectedCollabe(item);
    setDeleteCollabeOpen(true);
  };

  const closeDeleteCollabeModal = () => {
    setSelectedCollabe(null);
    setDeleteCollabeOpen(false);
  };
  const openAddCollabeModal = () => {
    setAddCollabeOpen(true);
  };

  const closedCollabeModal = () => {
    setAddCollabeOpen(false);
  };
  return (
    <div className="flex ">
      <Sidebar />
      <div className="h-screen flex-1 p-1 md:p-7   overflow-y-scroll">
        <Navbar page="Liste des collaborateurs" />
        <div className="grid md:grid-cols-5 p-3 mb-4 gap-3 bg-gray-100 rounded-lg ">
          <button
            onClick={() => openAddCollabeModal()}
            className="flex flex-row items-center justify-center bg-gradient-to-r from-slate-950 to-slate-800  hover:to-slate-600 text-white capitalize text-center text-xs py-3 rounded-lg w-full   transition-all duration-200"
          >
            <UserRoundPlus size={20} className="text-white me-2" />
            Nouveau collaborateur
          </button>
          <div className="relative ">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <UserRoundSearch size={20} className="text-green-400" />
            </div>
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              type="text"
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
              placeholder="Chercher par nom, prénom, email ..."
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <UserRoundSearch size={20} className="text-green-400" />
            </div>
            <select
              name="isAccountActive"
              value={filters.isAccountActive}
              onChange={handleFilterChange}
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
            >
              <option disabled selected value="">
                Filtrer par compte statut
              </option>
              <option value="true">Active</option>
              <option value="false">Desactive</option>
            </select>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <UserRoundSearch size={20} className="text-green-400" />
            </div>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="text-slate-800 placeholder:text-slate-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
            >
              <option disabled selected value="">
                Filtrer par role
              </option>
              <option value="admin">Admin</option>
              <option value="collab">Collaborateur</option>
            </select>
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
                <th scope="col" className="px-6 py-3 rounded-l-lg">
                  Prénom
                </th>
                <th scope="col" className="px-6 py-3">
                  nom
                </th>
                <th scope="col" className="px-6 py-3">
                  Role
                </th>
                <th scope="col" className="px-6 py-3">
                  Date d'inscription
                </th>
                <th scope="col" className="px-6 py-3">
                  Compte statut
                </th>
                <th scope="col" className="px-6 py-3">
                  N.O. Traité
                </th>
                <th scope="col" className="px-6 py-3 rounded-r-lg">
                  Opérations
                </th>
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
                collaborateurs.map((user, index) => (
                  <tr
                    key={index}
                    className=" hover:bg-white transition-all duration-100"
                  >
                    <td className="px-6 py-4 capitalize rounded-l-lg">
                      {user.prenom}
                    </td>
                    <td className="px-6 py-4 uppercase">{user.nom}</td>
                    <td className="px-6 py-4">
                      {user.role === "admin" ? "Admin" : "Collaborateur"}
                    </td>
                    <td className="px-6 py-4">
                      {moment(user.createdAt).format("Do MMM  YY")}
                    </td>
                    <td className="px-6 py-4 flex">
                      {user.isAccountActive ? (
                        <span className="bg-green-500 px-3 py-1 text-white rounded-lg">
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-500 px-3 py-1 text-white rounded-lg">
                          Désactive
                        </span>
                      )}
                      <span
                        onClick={() => changeStatus(user._id)}
                        className="bg-sky-500 ms-2 rounded-md px-1 py-1 text-center   hover:text-purple-700  cursor-pointer"
                      >
                        {" "}
                        <RefreshCw
                          size={20}
                          className="text-white cursor-pointer"
                        />
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.ordonnanceCount}</td>
                    <td className="px-6 py-4 rounded-r-lg">
                      <span className="flex justify-between">
                        <UserRoundPen
                          onClick={() => openUpdateCollabeModal(user)}
                          size={20}
                          className="text-green-500 cursor-pointer"
                        />
                        <UserRoundX
                          onClick={() => openDeleteCollabeModal(user)}
                          size={20}
                          className="text-red-500 cursor-pointer"
                        />
                      </span>
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
        <AddCollab
          user={user}
          refreshUsers={fetchUser}
          show={addCollabeOpen}
          handleClose={closedCollabeModal}
        />
        <UpdateCollab
          user={user}
          item={selectedCollabe}
          refreshUsers={fetchUser}
          show={updateCollabeOpen}
          handleClose={closeUpdateCollabeModal}
        />
        <DeleteCollab
          user={user}
          item={selectedCollabe}
          refreshUsers={fetchUser}
          show={deleteCollabeOpen}
          handleClose={closeDeleteCollabeModal}
        />
      </div>
    </div>
  );
}

export default Collaborateurs;
