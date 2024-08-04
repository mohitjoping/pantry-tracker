import { signInWithGoogle } from '@/src/lib/auth';
import { Container, Typography, Button, Box } from '@mui/material';
// import { #ed6c03 } from '@mui/material/colors';

const LandingPage: React.FC = () => {

    const handleGetStarted = () => {
        signInWithGoogle();
    };

    return (
        
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
                <Typography variant="h1" fontSize='64px' sx={{ color: '#ed6c03'}}>Welcome to Grocery Tracker!</Typography>
            </Container>
        
    );
};

export default LandingPage;