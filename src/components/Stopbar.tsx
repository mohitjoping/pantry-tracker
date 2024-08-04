'use client'
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logOut } from '../lib/auth';
import { Padding } from '@mui/icons-material';

const Stopbar: React.FC = () => {
  const { user } = useAuth();

  const handleSignIN = async () => {
    try{
      await signInWithGoogle();
  }
    catch(error){
      console.log(error);
    }
  }

  const handleSignOut = async () => {
    try{
      await logOut();
    }
    catch(error){
      console.log(error);
    }
  }
  console.log(user);
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" p={2} px={4} bgcolor="black" color="white" height='12vh'>
      {user ? (
        <>
          <Stack direction="row" spacing={2}>
            {user.photoURL && <Avatar alt="Remy Sharp" src={user.photoURL} />}
          </Stack>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography >Welcome, {user.displayName}</Typography>
            <Button
              variant="outlined"
              color="warning"
              sx={{ "&:hover": { backgroundColor: "#ed6c03", color: "black" } }}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography variant="h5">Grocery Tracker</Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
            <Button variant="outlined" color="success" onClick={handleSignIN}>
              Sign In
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Stopbar;
