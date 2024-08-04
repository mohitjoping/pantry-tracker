import React from 'react';
import PantryManager from '@/src/components/PantryManager';
import LandingPage from '@/src/components/LandingPage';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';

import Stopbar from '../components/Stopbar';
import Typography from '@mui/material/Typography';

const Home = () => {
    const { user } = useAuth()
    return (
        <main className="flex h-full flex-col items-center justify-center p-2" style={{ backgroundColor: 'black', minHeight:"100vh" }}>
            {/* <Navbar /> */}
           <AuthProvider><Stopbar /></AuthProvider>
            
            {!user ? (<>
                <LandingPage />
            </>) : (
                <>
                    <Typography variant="h2" component="h1" display='flex' 
                    justifyContent={'center'}
                    bgcolor={'#000000'}
                    className="font-bold mb-4" style={{ color: '#ed6c03' }}>
                    Grocery Tracker
                </Typography>
                    <PantryManager />
                </>
            )}
        </main>
    );
};

export default Home;
