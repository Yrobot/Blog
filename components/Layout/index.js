import React, { useState, useEffect } from 'react';

import Footer from 'components/Footer';
import styles from './index.module.sass';

export default function Layout({ children }) {
  return (
    <div className='mx-auto 2xl:max-w-screen-2xl md:max-w-screen-lg'>
      <div className='md:flex flex-row items-start justify-between'>{children}</div>
      <Footer />
    </div>
  );
}
