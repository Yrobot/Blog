import React, { useState, useEffect } from 'react';

import Footer from 'components/Footer';
import styles from './index.module.sass';

export default function Layout({ children }) {
  return (
    <div className='mx-auto md:max-w-screen-lg 2xl:max-w-screen-2xl'>
      <div className='md:flex flex-row items-start justify-between'>{children}</div>
      <Footer />
    </div>
  );
}
