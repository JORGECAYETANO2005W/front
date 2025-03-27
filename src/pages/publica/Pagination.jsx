import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ 
    productsPerPage, 
    totalProducts, 
    currentPage, 
    paginate,
    indexOfFirstProduct, 
    indexOfLastProduct 
  }) {
  
  const pageNumbers = [];
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Logic to determine which page numbers to display
  const getPageNumbers = () => {
    // Always show first page, last page, current page, and one page before and after current
    let pages = [1];
    
    // Pages around current page
    const current = currentPage;
    if (current > 2) pages.push("...");
    if (current > 1 && current < totalPages) pages.push(current);
    if (current < totalPages - 1) pages.push("...");
    
    // Add last page if more than one page
    if (totalPages > 1) pages.push(totalPages);
    
    // Remove duplicates and ellipses if unnecessary
    pages = [...new Set(pages)];
    if (current <= 3) {
      pages = pages.filter(page => page !== "..." || pages.indexOf(page) !== 1);
      // Add pages 2 and 3 if we're at the start
      if (totalPages >= 2 && !pages.includes(2)) pages.splice(1, 0, 2);
      if (totalPages >= 3 && !pages.includes(3)) pages.splice(2, 0, 3);
    }
    
    if (current >= totalPages - 2) {
      pages = pages.filter(page => page !== "..." || pages.indexOf(page) !== pages.length - 2);
      // Add second-to-last and third-to-last pages if we're at the end
      if (totalPages >= 2 && !pages.includes(totalPages - 1)) 
        pages.splice(pages.length - 1, 0, totalPages - 1);
      if (totalPages >= 3 && !pages.includes(totalPages - 2)) 
        pages.splice(pages.length - 2, 0, totalPages - 2);
    }
    
    return pages;
  };

  // Render pagination elements
  return (
    <div className="catalog-pagination">
      <div className="pagination-container">
        {/* Previous button */}
        <button 
          className="pagination-nav-button" 
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((number, index) => {
          if (number === "...") {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          return (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-button ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          );
        })}
        
        {/* Next button */}
        <button 
          className="pagination-nav-button"
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaChevronRight />
        </button>
      </div>
      
      {/* Pagination info */}
      <div className="pagination-info">
        Mostrando {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, totalProducts)} de {totalProducts} productos
      </div>
    </div>
  );
}

export default Pagination;

