import React from 'react';
import axios from 'axios';
import ProductDetail from '../../components/ProductDetails';

const ProductDetailPage = ({ product }) => {
  return (
    <div>
      <h1 className={styles.title}>Welcome to Eyewear Shop</h1>
      <NavBar />
      <ProductDetail product={product} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(`http://localhost:3000/api/products/${params.id}`);
    const product = response.data[0];
    return { props: { product } };
  } catch (err) {
    return { notFound: true };
  }
}

export default ProductDetailPage;