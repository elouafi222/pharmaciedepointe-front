import React from "react";
import moment from "moment";
import "moment/locale/fr";
import logo from "../utils/logo.png";
function Navbar({ page }) {
  return (
    <div className=" flex   justify-between items-start md:items-center mb-4 bg-gray-100 p-3 rounded-lg ">
      <h1 className="text-xl md:text-2xl font-semibold ">{page}</h1>
      <div
        className=" flex-col items-end italic"
        style={{ fontSize: "12px" }}
      >
        {/* <span className="uppercase text-slate-900">Pharmacie de la pointe</span> */}
        <img src={logo} className="h-6 md:h-8 mb-1" alt="" srcset="" />
        <span className="capitalize text-xs md:text-sm ">
          {moment().locale("fr").format("Do MMMM YYYY")}
        </span>{" "}
      </div>
    </div>
  );
}

export default Navbar;
