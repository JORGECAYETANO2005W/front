import React from "react";
import ProductCard from "./ProductCard";

function ProductsGrid({ products }) {
  return (
    <div className="catalog-grid">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductsGrid;