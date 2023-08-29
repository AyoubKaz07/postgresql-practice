import React from 'react';
import styles from './ProductDetails.module.css'; // Import CSS module

const ProductDetail = ({ product }) => {
  if (!product) {
    return <div>Loading...</div>;
  }

  const {
    name,
    description,
    size,
    price,
    discount,
  } = product;

  return (
    <div className={styles.productDetail}>
      <h1 className={styles.productName}>{name}</h1>
      <div className={styles.productInfo}>
        <p>{description}</p>
        <p>Size: {size}</p>
        <p>Price: ${price}</p>
        <p>Discount: {discount}%</p>
      </div>
    </div>
  );
};

export default ProductDetail;