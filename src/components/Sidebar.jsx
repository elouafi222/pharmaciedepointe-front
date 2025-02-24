import axios from "axios";
import {
  AlarmClock,
  AlertCircle,
  AlertOctagon,
  CalendarClock,
  Circle,
  CircleCheck,
  ClockArrowDown,
  Files,
  FileWarningIcon,
  HistoryIcon,
  Home,
  Inbox,
  ListCollapse,
  LogOutIcon,
  MoonStar,
  Users,
} from "lucide-react";
import logo from "../utils/logo.png";
import icon from "../utils/icon.png";
import icon2 from "../utils/icon2.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/authApiCall";
import { getCount } from "../redux/countApiCall";
function Sidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const logout = () => {
    dispatch(logoutUser());
    toast.success(
      "Déconnexion réussie. Vous avez été déconnecté en toute sécurité. À bientôt !"
    );
    navigate("/");
  };
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    setOpen(savedState === "true");
  }, []);

  const { countMessages } = useSelector((state) => state.count);
  const { countEnAttent } = useSelector((state) => state.count);
  const { countDuJour } = useSelector((state) => state.count);
  const { cycleEnRetard } = useSelector((state) => state.count);
  useEffect(() => {
    try {
      dispatch(getCount());
    } catch (error) {
      console.log("Fetching statistics failed" + error);
    }
  }, []);
  const toggleSidebar = () => {
    setOpen(!open);
    localStorage.setItem("sidebarState", !open);
  };
  return (
    <div
      className={` ${
        open ? "w-72 absolute " : "w-16 md:w-20 "
      }  flex flex-col justify-between bg-gradient-to-r from-slate-950 to-slate-800 h-screen p-2 md:p-5  pt-8 md:relative duration-300 z-50`}
    >
      <div>
        <ListCollapse
          size={30}
          className={`mb-3 text-white text-sm duration-600 cursor-pointer   px-1 m-2  bg-green-400  rounded-lg   ${
            open && "rotate-180"
          }`}
          onClick={toggleSidebar}
        />
        <div className="flex items-center ">
          <img
            src={icon}
            className={`cursor-pointer h-10 w-10 duration-500 me-4  ${
              open && "rotate-[360deg] "
            }`}
          />

          <span
            className={`flex flex-col origin-left   text-white   duration-200 ${
              !open && "scale-0"
            }`}
          >
            <img src={icon2} className="h-14" />
          </span>
        </div>
      </div>
      <ul>
        <Link
          to="/ordonnances"
          className={`flex hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <Home size={20} />
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            Accueil
          </span>
        </Link>
        <Link
          to="/ordonnances/message"
          className={`flex justify-between hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <span className="flex flex-row items-center  md:gap-x-2">
            <Inbox size={20} />
            {countMessages > 0 && (
              <span
                className={`${
                  open && "hidden"
                }  w-2 h-2 rounded-full bg-green-500`}
              ></span>
            )}
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Nouveaux messages
            </span>
          </span>

          {countMessages > 0 && (
            <span
              className={`${
                !open && "hidden"
              } bg-green-600  px-2 py-1 rounded-full`}
            >
              {countMessages}
            </span>
          )}
        </Link>
        <Link
          to="/ordonnances/dujour"
          className={`flex justify-between hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <span className="flex flex-row items-center md:gap-x-2">
            {" "}
            <CalendarClock size={20} />
            {countDuJour > 0 && (
              <span
                className={`${
                  open && "hidden"
                }  w-2 h-2 rounded-full bg-sky-500`}
              ></span>
            )}
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Ordonnances du jour{" "}
            </span>
          </span>

          {countDuJour > 0 && (
            <span
              className={`${
                !open && "hidden"
              } bg-sky-600  px-2 py-1 rounded-full`}
            >
              {countDuJour}
            </span>
          )}
        </Link>
        <Link
          to="/ordonnances/enretard"
          className={`flex justify-between  hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <span className="flex flex-row items-center md:gap-x-2">
            <FileWarningIcon size={20} />
            {countEnAttent > 0 && (
              <span
                className={`${
                  open && "hidden"
                }  w-2 h-2 rounded-full bg-red-500`}
              ></span>
            )}
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Ordonnances en retard{" "}
            </span>
          </span>
          {countEnAttent > 0 && (
            <span
              className={`${
                !open && "hidden"
              } bg-red-600  px-2 py-1 rounded-full`}
            >
              {countEnAttent}
            </span>
          )}
        </Link>
        {/* Lien vers la page des cycles en retard 
        <Link
          to="/ordonnances/cyclesEnRetard"
          className={`flex justify-between  hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <span className="flex flex-row items-center md:gap-x-2">
            <AlertCircle size={20} />
            {countEnAttent > 0 && (
              <span
                className={`${
                  open && "hidden"
                }  w-2 h-2 rounded-full bg-red-500`}
              ></span>
            )}
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Renouvellements en retard{" "}
            </span>
          </span>
          {cycleEnRetard > 0 && (
            <span
              className={`${
                !open && "hidden"
              } bg-red-600  px-2 py-1 rounded-full`}
            >
              {cycleEnRetard}
            </span>
          )}
        </Link>
        <Link
          to="/ordonnances/historique"
          className={`flex hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <HistoryIcon size={20} />
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            Historique des ordonnances
          </span>
        </Link>
        <Link
          to="/ordonnances/termine"
          className={`flex hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <CircleCheck size={20} />
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            Ordonnances terminées
          </span>
        </Link>
        */}
        <Link
          to="/ordonnances/rapports"
          className={`flex hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
        >
          <Files size={20} />
          <span className={`${!open && "hidden"} origin-left duration-200`}>
            Rapports
          </span>
        </Link>
        {user.role === "admin" && (
          <Link
            to="/ordonnances/collaborateurs"
            className={`flex hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
        mt-2`}
          >
            <Users size={20} />
            <span className={`${!open && "hidden"} origin-left duration-200`}>
              Collaborateurs
            </span>
          </Link>
        )}
      </ul>
      <span
        onClick={logout}
        className={`flex hover:duration-200  hover:text-green-400 rounded-lg p-2 cursor-pointer border-2 border-transparent hover:border-white text-gray-200 text-sm items-center gap-x-4 
          mt-2`}
      >
        <LogOutIcon size={20} />
        <span className={`${!open && "hidden"} origin-left duration-200`}>
          {user?.username}
        </span>
      </span>
    </div>
  );
}

export default Sidebar;
