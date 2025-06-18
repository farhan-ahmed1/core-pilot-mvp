import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { signIn, signUp } from '../services/authService';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await signUp(email, password);
      } else {
        userCredential = await signIn(email, password);
      }
      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();
      // Register user in backend DB
      await axios.post(
        'http://localhost:8000/auth/register',
        { id_token: idToken }
      );
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </Typography>
      <form onSubmit={handleSubmit} aria-label={isSignUp ? 'Sign Up Form' : 'Sign In Form'}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
          aria-label="Email"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          aria-label="Password"
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          aria-label={isSignUp ? 'Sign Up' : 'Sign In'}
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button
          onClick={() => setIsSignUp(!isSignUp)}
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          aria-label={isSignUp ? 'Switch to Sign In' : 'Switch to Sign Up'}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;