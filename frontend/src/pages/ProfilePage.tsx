import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  photo_url?: string;
  created_at: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get('/auth/profile')
      .then(res => {
        setProfile(res.data);
        setFullName(res.data.full_name);
        setPhotoUrl(res.data.photo_url || '');
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await axios.put('/auth/profile', {
        full_name: fullName,
        photo_url: photoUrl,
      });
      setProfile(res.data);
      setSuccess(true);
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return null;

  return (
    <Box maxWidth={400} mx="auto" mt={8}>
      <Typography variant="h4" component="h1" gutterBottom>Profile</Typography>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Avatar src={photoUrl} sx={{ width: 80, height: 80, mb: 1 }} />
        <TextField
          label="Photo URL"
          value={photoUrl}
          onChange={e => setPhotoUrl(e.target.value)}
          fullWidth
          margin="normal"
          aria-label="Photo URL"
        />
      </Box>
      <form onSubmit={handleSave} aria-label="Profile Form">
        <TextField
          label="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          fullWidth
          margin="normal"
          required
          aria-label="Full Name"
        />
        <TextField
          label="Email"
          value={profile.email}
          fullWidth
          margin="normal"
          disabled
          aria-label="Email"
        />
        {success && <Alert severity="success" sx={{ mt: 2 }}>Profile updated!</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={saving}
          aria-label="Save Profile"
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Box>
  );
};

export default ProfilePage;
