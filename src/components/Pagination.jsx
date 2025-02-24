import { ArrowBigLeft, ArrowBigRight, Ellipsis } from "lucide-react";
import React from "react";

function Pagination({ pages, currentPage, setCurrentPage, count, perPage }) {
  const maxVisiblePages = 3;
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  const getVisiblePages = () => {
    if (pages === 1) return []; // Return an empty array if there's only one page

    let startPage = Math.max(1, currentPage - halfVisiblePages);
    let endPage = Math.min(pages, currentPage + halfVisiblePages);

    if (currentPage <= halfVisiblePages) {
      endPage = maxVisiblePages;
    } else if (currentPage >= pages - halfVisiblePages) {
      startPage = pages - maxVisiblePages + 1;
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    return visiblePages;
  };

  const visiblePages = getVisiblePages();

  // If there's only one page, don't render the pagination
  if (pages <= 1) {
    return (
      <div className="flex justify-between items-center mt-4 bg-gray-100 p-3 rounded-lg">
        <span className="text-sm text-gray-700 italic">
          <span className="font-semibold text-slate-950">{count}</span>{" "}
          {count === 1 ? "résultat trouvé" : "résultats trouvés"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-4 bg-gray-100 p-3 rounded-lg">
      <span className="text-sm text-gray-700 italic">
        <span className="font-semibold text-slate-950">{count}</span>{" "}
        {count === 1 ? "résultat trouvé" : "résultats trouvés"}
      </span>
      <div className="mt-3 w-100">
        <ul className="pagination flex flex-row justify-center items-center">
          {currentPage !== 1 && (
            <li
              onClick={() => setCurrentPage((prev) => prev - 1)}
              aria-label="Précédent"
              className="mx-1 p-1 cursor-pointer bg-gradient-to-r from-slate-950 to-slate-800 rounded-lg text-white flex justify-center items-center"
            >
              <ArrowBigLeft size={17} />
            </li>
          )}

          {/* Show first page and ellipsis if needed */}
          {visiblePages[0] > 1 && (
            <>
              <li
                onClick={() => setCurrentPage(1)}
                className={`cursor-pointer w-5 h-5 mx-1 p-3 rounded-lg text-white text-sm flex justify-center items-center ${
                  currentPage === 1
                    ? "bg-gradient-to-r from-green-600 to-green-500"
                    : "bg-gradient-to-r from-slate-950 to-slate-800"
                }`}
              >
                1
              </li>
              {visiblePages[0] > 2 && (
                <li className="mx-1 p-1 cursor-pointer bg-gradient-to-r from-slate-950 to-slate-800 rounded-lg text-white flex justify-center items-center">
                  {" "}
                  <Ellipsis size={17} />
                </li>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((page) => (
            <li
              onClick={() => setCurrentPage(page)}
              key={page}
              className={`cursor-pointer w-5 h-5 mx-1 p-3 rounded-lg text-white text-sm flex justify-center items-center ${
                currentPage === page
                  ? "bg-gradient-to-r from-green-600 to-green-500"
                  : "bg-gradient-to-r from-slate-950 to-slate-800"
              }`}
            >
              {page}
            </li>
          ))}

          {/* Show last page and ellipsis if needed */}
          {visiblePages[visiblePages.length - 1] < pages && (
            <>
              {visiblePages[visiblePages.length - 1] < pages - 1 && (
                <li className="mx-1 p-1 cursor-pointer bg-gradient-to-r from-slate-950 to-slate-800 rounded-lg text-white flex justify-center items-center">
                  {" "}
                  <Ellipsis size={17} />
                </li>
              )}
              <li
                onClick={() => setCurrentPage(pages)}
                className={`cursor-pointer w-5 h-5 mx-1 p-3 rounded-lg text-white text-sm flex justify-center items-center ${
                  currentPage === pages
                    ? "bg-gradient-to-r from-green-600 to-green-500"
                    : "bg-gradient-to-r from-slate-950 to-slate-800"
                }`}
              >
                {pages}
              </li>
            </>
          )}

          {currentPage !== pages && (
            <li
              className="cursor-pointer mx-1 p-1 bg-gradient-to-r from-slate-950 to-slate-800 rounded-lg text-white flex justify-center items-center"
              aria-label="Suivant"
              onClick={() => setCurrentPage((next) => next + 1)}
            >
              <ArrowBigRight size={16} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Pagination;
