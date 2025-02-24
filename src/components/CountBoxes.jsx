import axios from "axios";
import {
  Bell,
  List,
  ListCheck,
  ListChecks,
  ListRestart,
  LoaderCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCount } from "../redux/countApiCall";

function CountBoxes() {
  const dispatch = useDispatch();
  const { countMessages } = useSelector((state) => state.count);
  const { countEnAttent } = useSelector((state) => state.count);
  const { countDuJour } = useSelector((state) => state.count);
  const { terminerToday } = useSelector((state) => state.count);
  const { isLoading } = useSelector((state) => state.count);
  useEffect(() => {
    dispatch(getCount());
  }, []);
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-4 bg-gray-100 p-3 rounded-lg">
      <Link to="/ordonnances/message">
        <div className="h-full bg-gradient-to-r  from-purple-600 to-purple-400 rounded-lg flex flex-col items-center p-4 text-white">
          <div className="flex flex-row items-center justify-center">
            <Bell size={40} />
            <span className="text-5xl font-semibold ms-2">
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={25} />
              ) : (
                countMessages
              )}
            </span>
          </div>
          <span className="capitalize text-sm ">Ordonnances Reçues</span>
        </div>
      </Link>
      <Link to="/ordonnances/dujour">
        {" "}
        <div className="h-full bg-gradient-to-r  from-sky-500 to-sky-300 rounded-lg flex flex-col items-center p-4 text-white">
          <div className="flex flex-row items-center justify-center">
            <ListChecks size={40} />
            <span className="text-5xl font-semibold ms-2">
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={25} />
              ) : (
                countDuJour
              )}
            </span>
          </div>
          <span className="capitalize text-sm ">Ordonnances Du Jour</span>
        </div>
      </Link>
      <Link to="/ordonnances/enretard">
        <div className="h-full bg-gradient-to-r  from-red-600 to-red-400 rounded-lg flex flex-col items-center p-4 text-white">
          <div className="flex flex-row items-center justify-center">
            <List size={40} />
            <span className="text-5xl font-semibold ms-2">
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={25} />
              ) : (
                countEnAttent
              )}
            </span>
          </div>
          <span className="capitalize text-sm ">Ordonnances en Retard</span>
        </div>
      </Link>

      {/* <Link to="/ordonnances/historique">
        {" "}
        <div className="h-full bg-gradient-to-r  from-sky-500 to-sky-300 rounded-lg flex flex-col items-center p-4 text-white">
          <div className="flex flex-row items-center justify-center">
            <ListRestart size={40} />
            <span className="text-5xl font-semibold ms-2">
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={25} />
              ) : (
                countRenwal
              )}
            </span>
          </div>
          <span className="capitalize text-sm ">Ordonnances À Renouveler</span>
        </div>
      </Link> */}
      <Link to="/ordonnances/termine">
        {" "}
        <div className="h-full bg-gradient-to-r  from-green-600 to-green-400 rounded-lg flex flex-col items-center p-4 text-white">
          <div className="flex flex-row items-center justify-center">
            <ListCheck size={40} />
            <span className="text-5xl font-semibold ms-2">
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={25} />
              ) : (
                terminerToday
              )}
            </span>
          </div>
          <span className="capitalize text-sm ">
            Ordonnances Terminées Du Jour
          </span>
        </div>
      </Link>
    </div>
  );
}

export default CountBoxes;
