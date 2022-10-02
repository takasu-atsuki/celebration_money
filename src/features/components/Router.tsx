import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './Home';
import { Add } from './Add';
import { Search } from './Search';

export const Router = memo(() => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="add" element={<Add />} />
        <Route path="search" element={<Search />} />
      </Routes>
    </>
  );
});
