import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { LoaderCircle, Lock, Mail, MoonStar, User } from "lucide-react";
import { loginUser } from "../redux/authApiCall";
import logo from "../utils/logo.png";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginSubmit = async (e) => {
    e.preventDefault();
    if (!username) return toast.error("Email requis");
    if (!password) return toast.error("Mot de passe requis");

    try {
      setIsLoading(true);
      await dispatch(
        loginUser({
          username: username,
          password: password,
        })
      );
      toast.success("Connexion réussie");
      navigate("/ordonnances");
    } catch (error) {
      // console.error("Erreur de connexion:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="p-5  w-screen min-h-screen  flex items-center justify-center ">
      <form
        onSubmit={loginSubmit}
        className=" flex flex-col items-center justify-center bg-gray-100  rounded-lg p-5  md:w-1/3 lg:1/4"
      >
        <div className="flex justify-center items-center mb-8   bg-gradient-to-r text-white from-slate-950 to-slate-800 rounded-lg p-3 w-full ">
          <img src={logo} className="h-20" />
        </div>
        <h1 className="text-3xl font-semibold capitalize text-slate-950">
          Se connecter
        </h1>
        <p className="mb-4 text-sm text-gray-400 text-justify">
          Prêt à vous connecter ? Entrez votre mot d'utilisateur et votre mot de
          passe pour accéder à votre compte.
        </p>
        <div className="relative flex items-center justify-center mb-4 w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <User size={20} className="text-slate-950" />
          </div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="text"
            type="text"
            placeholder="Mot d'utilisateur"
            className="ps-10  text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2  border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
          />
        </div>
        <div className="relative flex items-center mb-4 w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <Lock size={20} className="text-slate-950" />
          </div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            placeholder="Mot de passe"
            className="ps-10  text-gray-700 placeholder:text-slate-800 placeholder:italic rounded-lg px-3 py-2  border-2 border-slate-400 focus:border-slate-950 focus:outline-none w-full"
          />
        </div>

        <button className="bg-gradient-to-r flex items-center justify-center from-slate-950 to-slate-800 text-white capitalize px-5 py-2 rounded-lg w-full  hover:to-slate-600 transition-all duration-200">
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Connexion"}
        </button>
      </form>
    </div>
  );
}

export default Login;
