import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Pharmacy.module.css';
import CartContext from '../context/CartContext';

export default function Pharmacy() {
  const [inventory, setInventory] = useState([]);
  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    (async () => setInventory(await (await fetch('/api/pharmacy')).json()))();
  }, []);

  return (
    <div className={styles.container}>
      <Head><title>Pharmacy</title></Head>
      <header className={styles.header}>
        <h1>Pharmacy</h1>
        <Link href="/cart" legacyBehavior>
          <a className={styles.cartLink}>Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</a>
        </Link>
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>
          {inventory.map((item) => (
            <div key={item.id} className={styles.card}>
              <h2>{item.name}</h2>
              <p className={styles.price}>₹{Number(item.price).toFixed(2)}</p>
              <p className={item.stock > 0 ? styles.inStock : styles.outOfStock}>
                {item.stock > 0 ? `In Stock: ${item.stock}` : 'Out of Stock'}
              </p>
              <button onClick={() => addToCart(item)} disabled={item.stock === 0}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
