import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { CalendarArrowUp, CalendarSearch } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Rapports() {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateFin, setDateFin] = useState("");

  const genereExcel = (data) => {
    const {
      totalPrescriptions,
      totalInitiales,
      renouvellementsTraites,
      totalSup500,
      statsByStatus,
      statsByUser,
      ordonnancesInitiales,
      renouvellements,
      ordonnancesSup500
    } = data;
    
    // Feuille 1: Résumé général
    const summaryData = [
      ["Statistique", "Valeur"],
      ["Total des prescriptions", totalPrescriptions],
      ["Ordonnances initiales", totalInitiales],
      ["Renouvellements traités", renouvellementsTraites],
      ["Ordonnances >500€", totalSup500],
      ["", ""]
    ];

    // Feuille 2: Statistiques par statut
    const statusData = [
      ["Statut", "Ordonnances initiales", "Renouvellements", "Total"]
    ];
    
    statsByStatus.forEach((item) => {
      statusData.push([
        item.statusName.toUpperCase(),
        item.count,
        item.renouvellements,
        item.total
      ]);
    });

    // Feuille 3: Statistiques par utilisateur
    const userData = [
      ["Utilisateur", "Ordonnances initiales", "Renouvellements traités", "Total"]
    ];
    
    statsByUser.forEach((item) => {
      const u = item.userDetails || {};
      const total = (item.ordonnancesInitiales || 0) + (item.renouvellementsTraites || 0);
      
      userData.push([
        `${u.nom?.toUpperCase() || "inconnu"} ${u.prenom || ""} (${u.username || ""})`,
        item.ordonnancesInitiales || 0,
        item.renouvellementsTraites || 0,
        total
      ]);
    });

    // Feuille 4: Ordonnances supérieures à 500€
    const sup500Data = [
      ["Numéro", "Supérieur à 500€", "Nom", "Prénom", "Statut", "Collaborateur", "Date de traitement"]
    ];
    
    ordonnancesSup500.forEach((ord) => {
      const utilisateur = ord.collaborator
        ? `${ord.collaborator.prenom || ""} ${ord.collaborator.nom?.toUpperCase() || ""}`.trim()
        : "inconnu";
      const dateTraitement = ord.dateReception
        ? new Date(ord.dateReception).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A";

      sup500Data.push([
        `ORD-${ord.numero}`,
        "OUI",
        ord.nom || "N/A",
        ord.prenom || "N/A",
        ord.statusName?.toUpperCase() || "N/A",
        utilisateur,
        dateTraitement
      ]);
    });

    // Feuille 5: Détail complet des prescriptions
    const detailData = [
      ["Numéro", "Type", "Nom", "Prénom", "Statut", "Collaborateur", "Date de traitement"]
    ];
    
    // Ajouter les ordonnances initiales
    ordonnancesInitiales.forEach((item) => {
      const utilisateur = item.collaborator
        ? `${item.collaborator.prenom || ""} ${item.collaborator.nom?.toUpperCase() || ""}`.trim()
        : "inconnu";
      const dateTraitement = item.dateReception
        ? new Date(item.dateReception).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A";

      detailData.push([
        `ORD-${item.numero}`,
        "Ordonnance initiale",
        item.nom || "N/A",
        item.prenom || "N/A",
        item.statusName?.toUpperCase() || "N/A",
        utilisateur,
        dateTraitement
      ]);
    });
    
    // Ajouter les renouvellements
    renouvellements.forEach((item) => {
      const utilisateur = item.collaborator
        ? `${item.collaborator.prenom || ""} ${item.collaborator.nom?.toUpperCase() || ""}`.trim()
        : "inconnu";
      const dateTraitement = item.dateTreatement
        ? new Date(item.dateTreatement).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A";

      detailData.push([
        `ORD-${item.ordonnanceNumero} (Cycle ${item.cycleNumber})`,
        "Renouvellement",
        item.nom || "N/A",
        item.prenom || "N/A",
        "TERMINÉ", // Statut fixe pour les renouvellements
        utilisateur,
        dateTraitement
      ]);
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryData), "Résumé");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(statusData), "Par Statut");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(userData), "Par Utilisateur");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(sup500Data), "Ordonnances >500€");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(detailData), "Détail prescriptions");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `rapport-prescriptions-${dateStart}-to-${dateFin}.xlsx`);
  };

  const generePDF = (data) => {
    const pdfMake = window.pdfMake;
    if (!pdfMake) {
      toast.error("pdfMake n'est pas chargé !");
      return;
    }

    const {
      totalPrescriptions,
      totalInitiales,
      renouvellementsTraites,
      totalSup500,
      statsByStatus,
      statsByUser,
      ordonnancesInitiales,
      renouvellements,
      ordonnancesSup500
    } = data;

    // Créer le contenu PDF
    const content = [
      { text: "Rapport des Prescriptions", style: "header" },
      { text: `Période : du ${dateStart} au ${dateFin}`, margin: [0, 0, 0, 10] },
      
      // Section Résumé
      { text: "Résumé Général", style: "subheader" },
      {
        table: {
          widths: ["*", "*"],
          body: [
            ["Total des prescriptions", totalPrescriptions],
            ["Ordonnances initiales", totalInitiales],
            ["Renouvellements traités", renouvellementsTraites],
            ["Ordonnances >500€", totalSup500]
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20]
      },
      
      // Section par statut
      { text: "Statistiques par Statut", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body: [
            [
              "Statut", 
              "Ordonnances", 
              "Renouvellements", 
              "Total"
            ],
            ...statsByStatus.map(item => [
              item.statusName.toUpperCase(),
              item.count,
              item.renouvellements,
              item.total
            ])
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20]
      },
      
      // Section par utilisateur
      { text: "Statistiques par Utilisateur", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["*", "*", "*", "*"],
          body: [
            ["Collaborateur", "Ordonnances initiales", "Renouvellements traités", "Total"],
            ...statsByUser.map(item => {
              const u = item.userDetails || {};
              const total = (item.ordonnancesInitiales || 0) + (item.renouvellementsTraites || 0);
              
              return [
                `${u.nom || "inconnu"} ${u.prenom || ""} (${u.username || ""})`,
                item.ordonnancesInitiales || 0,
                item.renouvellementsTraites || 0,
                total
              ];
            })
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20]
      },
      
      // Section ordonnances supérieures à 500€
      { text: "Ordonnances supérieures à 500€", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
          body: [
            ["Numéro", "Supérieur à 500€", "Nom", "Prénom", "Statut", "Collaborateur", "Date de traitement"],
            ...ordonnancesSup500.map(ord => {
              const utilisateur = ord.collaborator
                ? `${ord.collaborator.prenom || ""} ${ord.collaborator.nom?.toUpperCase() || ""}`.trim()
                : "inconnu";
              const dateTraitement = ord.dateReception
                ? new Date(ord.dateReception).toLocaleDateString("fr-FR")
                : "N/A";

              return [
                `ORD-${ord.numero}`,
                "OUI",
                ord.nom || "N/A",
                ord.prenom || "N/A",
                ord.statusName?.toUpperCase() || "N/A",
                utilisateur,
                dateTraitement
              ];
            })
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20]
      },
      
      // Détail complet des prescriptions
      { text: "Détail complet des prescriptions", style: "subheader" },
      {
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
          body: [
            ["Numéro", "Type", "Nom", "Prénom", "Statut", "Collaborateur", "Date de traitement"],
            // Ordonnances initiales
            ...ordonnancesInitiales.map(item => {
              const utilisateur = item.collaborator
                ? `${item.collaborator.prenom || ""} ${item.collaborator.nom?.toUpperCase() || ""}`.trim()
                : "inconnu";
              const dateTraitement = item.dateReception
                ? new Date(item.dateReception).toLocaleDateString("fr-FR")
                : "N/A";

              return [
                `ORD-${item.numero}`,
                "Ordonnance initiale",
                item.nom || "N/A",
                item.prenom || "N/A",
                item.statusName?.toUpperCase() || "N/A",
                utilisateur,
                dateTraitement
              ];
            }),
            // Renouvellements
            ...renouvellements.map(item => {
              const utilisateur = item.collaborator
                ? `${item.collaborator.prenom || ""} ${item.collaborator.nom?.toUpperCase() || ""}`.trim()
                : "inconnu";
              const dateTraitement = item.dateTreatement
                ? new Date(item.dateTreatement).toLocaleDateString("fr-FR")
                : "N/A";

              return [
                `ORD-${item.ordonnanceNumero} (Cycle ${item.cycleNumber})`,
                "Renouvellement",
                item.nom || "N/A",
                item.prenom || "N/A",
                "TERMINÉ", // Statut fixe pour les renouvellements
                utilisateur,
                dateTraitement
              ];
            })
          ]
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 20]
      }
    ];

    const docDefinition = {
      pageOrientation: "portrait",
      content,
      styles: {
        header: { 
          fontSize: 18, 
          bold: true, 
          alignment: "center",
          margin: [0, 0, 0, 10] 
        },
        subheader: { 
          fontSize: 14, 
          bold: true, 
          margin: [0, 10, 0, 5] 
        }
      },
      defaultStyle: { 
        fontSize: 10,
        margin: [0, 2, 0, 2]
      },
    };

    pdfMake.createPdf(docDefinition).download(`rapport-prescriptions-${dateStart}-to-${dateFin}.pdf`);
  };

  const genreRapport = async (format) => {
    if (!dateStart) return toast.error("Date de début est requise");
    if (!dateFin) return toast.error("Date de fin est requise");
    
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/rapport`,
        { dateStart, dateFin },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const { 
        totalPrescriptions, 
        totalInitiales, 
        renouvellementsTraites,
        totalSup500,
        statsByStatus, 
        statsByUser,
        ordonnancesInitiales,
        renouvellements,
        ordonnancesSup500
      } = res.data;

      if (totalPrescriptions === 0) {
        toast.error("Cette période n'a aucune prescription");
        return;
      }

      const reportData = {
        totalPrescriptions,
        totalInitiales,
        renouvellementsTraites,
        totalSup500,
        statsByStatus,
        statsByUser,
        ordonnancesInitiales,
        renouvellements,
        ordonnancesSup500
      };

      if (format === "excel") {
        genereExcel(reportData);
      } else {
        generePDF(reportData);
      }

      toast.success(`Rapport ${format.toUpperCase()} généré avec succès !`);
    } catch (error) {
      toast.error("Échec de la génération du rapport");
      console.error("Erreur:", error.response?.data || error.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen flex-1 p-1 md:p-7 overflow-y-scroll">
        <Navbar page="Générer des rapports" />
        <div className="grid md:grid-cols-3 p-3 mb-4 gap-3 bg-gray-100 rounded-lg">
          <div>
            <label className="text-md text-gray-500">Date de début</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <CalendarArrowUp size={20} className="text-green-400" />
              </div>
              <input
                type="date"
                className="text-slate-800 rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-sky-950 w-full"
                onChange={(e) => setDateStart(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-md text-gray-500">Date de fin</label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <CalendarSearch size={20} className="text-green-400" />
              </div>
              <input
                type="date"
                className="text-slate-800 rounded-lg py-3 ps-9 text-xs border-2 border-slate-400 focus:border-sky-950 w-full"
                onChange={(e) => setDateFin(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <button
              onClick={() => genreRapport("excel")}
              disabled={isLoading}
              className="bg-blue-800 hover:bg-blue-600 text-white text-xs py-3 rounded-lg w-full"
            >
              {isLoading ? "Chargement..." : "📈 Générer Excel"}
            </button>
            <button
              onClick={() => genreRapport("pdf")}
              disabled={isLoading}
              className="bg-green-800 hover:bg-green-600 text-white text-xs py-3 rounded-lg w-full"
            >
              {isLoading ? "Chargement..." : "📄 Générer PDF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rapports;