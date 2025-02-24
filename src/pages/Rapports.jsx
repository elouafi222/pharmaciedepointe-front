import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { CalendarArrowUp, CalendarSearch, FilePlus2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../utils/logo.png";
import { useSelector } from "react-redux";

function Rapports() {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateFin, setDateFin] = useState("");

  const genreRapport = async () => {
    if (!dateStart) return toast.error("Date de début est requise");
    if (!dateFin) return toast.error("Date de fin est requise");
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/rapport`,
        {
          dateStart,
          dateFin,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const { statsByStatus, statsByUser, totalOrdonnances } = res.data;
      if (totalOrdonnances === 0) {
        toast.error("Cette période n'a aucune ordonnance");
        setIsLoading(false);
        return;
      }

      // Create PDF
      const doc = new jsPDF();
      const pharmacyName = "Pharmacie de la pointe";
      const currentDate = new Date().toLocaleDateString();
      const logoUrl = logo; // Add the path to your logo image here

      // Add logo
      const logoWidth = 80;
      const logoHeight = 20;

      // Add logo and center it horizontally
      const pageWidth = doc.internal.pageSize.getWidth();
      const logoX = (pageWidth - logoWidth) / 2; // Calculate center position for logo
      doc.addImage(logoUrl, "PNG", logoX, 10, logoWidth, logoHeight); // X, Y, Width, Height

      // Center the title
      const title = "Rapport des Ordonnances";
      doc.setFontSize(16);
      const titleWidth = doc.getTextWidth(title);
      const titleX = (pageWidth - titleWidth) / 2; // Calculate center position
      doc.text(title, titleX, 40); // Y position for title

      // Pharmacy name below the title
      doc.setFontSize(12);
      const pharmacyNameWidth = doc.getTextWidth(pharmacyName);
      const pharmacyNameX = (pageWidth - pharmacyNameWidth) / 2;
      doc.text(pharmacyName, pharmacyNameX, 50); // Y position for pharmacy name

      // Period and total ordonnances
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text(`Période : du ${dateStart} au ${dateFin}`, 14, 65); // Y position for period
      doc.text(`Total d'ordonnances: ${totalOrdonnances}`, 14, 70); // Y position for total ordonnances

      // Table for stats by status
      doc.setFontSize(11);
      doc.text("Statistiques par statut", 14, 85); // Y position for stats by status title

      const tableColumnStatus = [
        "Statut",
        "Nombre d'ordonnances",
        "Détails (N° - Type - Client - Tél - Email)",
      ];
      const tableRowsStatus = [];

      statsByStatus.forEach((item) => {
        const ordonnanceDetails = item.details
          .map((detail) => {
            const nomPrenom =
              detail.nom || detail.prenom
                ? `${detail.nom.toUpperCase() || ""} ${
                    detail.prenom.toUpperCase() || ""
                  }`
                : "Aucune donnée";

            const contactInfo =
              detail.phone || detail.email
                ? `${detail.phone || ""} ${detail.email || ""}`
                : "Aucune donnée";

            return `ORD-${detail.numero} : ${detail.type} - ${nomPrenom} - ${contactInfo}`;
          })
          .join("\n");

        tableRowsStatus.push([
          item.statusName.toUpperCase(),
          item.count,
          ordonnanceDetails,
        ]);
      });

      doc.autoTable({
        head: [tableColumnStatus],
        body: tableRowsStatus,
        startY: 90,
      });

      let finalY = doc.lastAutoTable.finalY || 90;
      doc.setFontSize(11);
      doc.text("Statistiques par utilisateur", 14, finalY + 10); // Y position for stats by user title

      // Table for stats by user
      const tableColumnUser = ["Utilisateur", "Nombre d'ordonnances"];
      const tableRowsUser = [];

      statsByUser.forEach((item) => {
        const userDetails = item.userDetails || {}; // Ensure userDetails is defined
        const nom = userDetails.nom || "inconnu";
        const prenom = userDetails.prenom || "";
        const username = userDetails.username || "";

        tableRowsUser.push([
          `${nom} ${prenom} (${username})`, // Combine nom, prenom, and username
          item.count,
        ]);
      });

      // Generate auto-table for stats by user
      doc.autoTable({
        head: [tableColumnUser],
        body: tableRowsUser,
        startY: finalY + 15, // Adjust starting Y position for the next table
      });

      // Footer with small size text
      doc.setFontSize(8);
      doc.text(
        `${pharmacyName} - ${currentDate}`,
        14,
        doc.internal.pageSize.height - 10 // Y position for footer
      );

      // Save the PDF
      doc.save(`rapport-ordonnances-${dateStart}-to-${dateFin}.pdf`);

      toast.success("Rapport généré avec succès !");
    } catch (error) {
      toast.error("Échec de la génération du rapport");
      console.error("Fetching ordonnances statistics failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen flex-1 p-1 md:p-7 overflow-y-scroll">
        <Navbar page="Génerer des rapports" />
        <div className="grid md:grid-cols-3 p-3 mb-4 gap-3 bg-gray-100 rounded-lg">
          <div>
            <label className="text-md text-gray-500" htmlFor="dateStart">
              Date de début
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <CalendarArrowUp size={20} className="text-green-400" />
              </div>
              <input
                type="date"
                className="text-slate-800 placeholder:text-sky-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-sky-950 focus:outline-none w-full"
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-md text-gray-500" htmlFor="dateFin">
              Date de fin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <CalendarSearch size={20} className="text-green-400" />
              </div>
              <input
                type="date"
                className="text-slate-800 placeholder:text-sky-500 placeholder:italic rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-sky-950 focus:outline-none w-full"
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-md text-gray-500">
              Ce processus peut prendre un peu de temps.
            </label>
            <button
              onClick={genreRapport}
              className="flex flex-row items-center justify-center bg-gradient-to-r from-slate-950 to-slate-800 hover:to-slate-600 text-white capitalize text-center text-xs py-3 rounded-lg w-full transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Chargement...</span>
              ) : (
                <>
                  <FilePlus2 size={20} className="text-white me-2" />
                  Génerer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rapports;
