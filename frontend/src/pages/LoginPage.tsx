import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { signIn, signUp } from '../services/authService';
import { registerUserInBackend } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated, loading: authLoading, refreshUserProfile } = useAuth();

  // Get the intended destination from location state or default to dashboard
  const from = location.state?.from || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      console.log('User already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      console.log('Starting authentication process...');
      
      let userCredential;
      if (isSignUp) {
        console.log('Creating new user account...');
        userCredential = await signUp(email, password);
      } else {
        console.log('Signing in existing user...');
        userCredential = await signIn(email, password);
      }
      
      console.log('Firebase authentication successful, registering with backend...');
      
      // Register/login user in backend database
      const backendUser = await registerUserInBackend();
      console.log('Backend registration successful:', backendUser);
      
      // Explicitly refresh the user profile in AuthContext
      console.log('Refreshing AuthContext profile...');
      await refreshUserProfile();
      
      // Wait a bit more for AuthContext to fully update
      console.log('Waiting for AuthContext to update...');
      setTimeout(() => {
        console.log('Final navigation attempt...');
        navigate(from, { replace: true });
      }, 500);
      
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
    // Note: Don't set loading to false immediately on success - let navigation handle it
  };

  // Show loading screen if checking auth state
  if (authLoading) {
    return (
      <Container maxWidth="sm" sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Box textAlign="center">
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Checking authentication...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <Fade in timeout={800}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: 4, 
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            width: '100%',
            maxWidth: 500
          }}
        >
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              textAlign="center"
              fontWeight="800"
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}
            >
              Core Pilot
            </Typography>
            
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              textAlign="center"
              fontWeight="600"
              sx={{ mb: 4 }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}
            
            {loading && (
              <Alert 
                severity="info" 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">
                    {isSignUp ? 'Creating your account...' : 'Signing you in...'}
                  </Typography>
                </Box>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} aria-label={isSignUp ? 'Sign Up Form' : 'Sign In Form'}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                disabled={loading}
                aria-label="Email"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3 
                  } 
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                disabled={loading}
                aria-label="Password"
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 3 
                  } 
                }}
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : undefined}
                sx={{ 
                  mt: 3, 
                  mb: 2, 
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                }}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
              
              <Box textAlign="center">
                <Button
                  onClick={() => setIsSignUp(!isSignUp)}
                  disabled={loading}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Container>
  );
};

export default LoginPage;