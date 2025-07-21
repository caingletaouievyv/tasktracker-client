// src/components/PrivateLayout.jsx

import Navbar from '../components/Navbar/Navbar';

export default function PrivateLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
