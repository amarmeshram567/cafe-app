import React from 'react';
import Hero from '../components/Hero';
import Menu from './Menu';
import TableBooking from './TableBooking';
import FloatingMenu from '../components/FloatingMenu';
import VisitPage from './VisitPage';

const Home = () => {
    return (
        <>
            <Hero />
            <Menu />
            <TableBooking />
            <FloatingMenu />
            <VisitPage />
        </>
    );
}

export default Home;
