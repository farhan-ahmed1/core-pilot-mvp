import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  Paper,
  Chip,
  Badge,
  Snackbar,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  FormGroup} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Shield as ShieldIcon,
  Verified as VerifiedIcon,
  School as SchoolIcon,
  TrendingUp as StatsIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import axios from 'axios';
import LoadingScreen from '../components/LoadingScreen';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  photo_url?: string;
  created_at: string;
  last_login?: string;
  courses_count?: number;
  assignments_count?: number;
  verified?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: 'en'
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/auth/profile');
      setProfile(res.data);
      setFullName(res.data.full_name);
      setPhotoUrl(res.data.photo_url || '');
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    try {
      const res = await axios.put('/auth/profile', {
        full_name: fullName,
        photo_url: photoUrl,
      });
      setProfile(res.data);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setPhotoUrl(profile?.photo_url || '');
    setIsEditing(false);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingScreen message="Loading your profile..." />;
  }

  if (error && !profile) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!profile) return null;

  return (
    <>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.1),
            zIndex: 0
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{xs:12, md:3}}>
              <Box sx={{ textAlign: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    profile.verified ? (
                      <VerifiedIcon sx={{ color: 'success.main', bgcolor: 'white', borderRadius: '50%', p: 0.5 }} />
                    ) : null
                  }
                >
                  <Avatar
                    src={photoUrl}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: `4px solid ${alpha('#fff', 0.3)}`,
                      bgcolor: alpha('#fff', 0.15)
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                </Badge>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                  {profile.full_name}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  {profile.email}
                </Typography>
                {profile.verified && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified Account"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: alpha('#fff', 0.15),
                      color: 'white',
                      border: `1px solid ${alpha('#fff', 0.3)}`
                    }}
                  />
                )}
              </Box>
            </Grid>
            
            <Grid size={{xs:12, md:9}}>
              <Grid container spacing={3}>
                <Grid size={{xs:12, md:4}}>
                  <Card sx={{ 
                    bgcolor: alpha('#fff', 0.15), 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha('#fff', 0.2)}`
                  }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white', p: 3 }}>
                      <SchoolIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h3" fontWeight="800">
                        {profile.courses_count || 0}
                      </Typography>
                      <Typography variant="body2">Courses</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs:12, md:4}}>
                  <Card sx={{ 
                    bgcolor: alpha('#fff', 0.15), 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha('#fff', 0.2)}`
                  }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white', p: 3 }}>
                      <StatsIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h3" fontWeight="800">
                        {profile.assignments_count || 0}
                      </Typography>
                      <Typography variant="body2">Assignments</Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{xs:12, md:4}}>
                  <Card sx={{ 
                    bgcolor: alpha('#fff', 0.15), 
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha('#fff', 0.2)}`
                  }}>
                    <CardContent sx={{ textAlign: 'center', color: 'white', p: 3 }}>
                      <CalendarIcon sx={{ fontSize: 32, mb: 1 }} />
                      <Typography variant="h6" fontWeight="800">
                        Member Since
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(profile.created_at)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Tabs Navigation */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px 8px 0 0',
                minHeight: 64
              }
            }}
          >
            <Tab 
              label="Profile Information" 
              icon={<PersonIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Security" 
              icon={<SecurityIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Preferences" 
              icon={<PaletteIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Profile Information Tab */}
        <TabPanel value={activeTab} index={0}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                Profile Information
              </Typography>
              {!isEditing && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <form onSubmit={handleSave}>
              <Grid container spacing={3}>
                <Grid size={{xs:12, md:6}}>
                  <TextField
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    fullWidth
                    required
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
                <Grid size={{xs:12, md:6}}>
                  <TextField
                    label="Email Address"
                    value={profile.email}
                    fullWidth
                    disabled
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    label="Profile Photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    fullWidth
                    disabled={!isEditing}
                    placeholder="https://example.com/your-photo.jpg"
                    InputProps={{
                      startAdornment: <PhotoCameraIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
                
                {/* Account Information */}
                <Grid size={{xs:12}}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Account Information
                  </Typography>
                </Grid>
                <Grid size={{xs:12, md:6}}>
                  <Box display="flex" alignItems="center" p={2} bgcolor="grey.50" borderRadius={3}>
                    <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Member Since
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDate(profile.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {profile.last_login && (
                  <Grid size={{xs:12, md:6}}>
                    <Box display="flex" alignItems="center" p={2} bgcolor="grey.50" borderRadius={3}>
                      <ShieldIcon sx={{ mr: 2, color: 'success.main' }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Last Login
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatDate(profile.last_login)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {isEditing && (
                <Box display="flex" gap={2} mt={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 4 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 4 }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </form>
          </CardContent>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={1}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Security Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Manage your account security and authentication preferences
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{xs:12, md:6}}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <ShieldIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Password
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Change your account password
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                  >
                    Change Password
                  </Button>
                </Card>
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <SecurityIcon sx={{ mr: 2, color: 'warning.main' }} />
                    <Typography variant="h6" fontWeight="bold">
                      Two-Factor Auth
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Add an extra layer of security
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                  >
                    Enable 2FA
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>

        {/* Preferences Tab */}
        <TabPanel value={activeTab} index={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
              Customize your experience and notification settings
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{xs:12, md:6}}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Notifications
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                      />
                    }
                    label="Push Notifications"
                  />
                </FormGroup>
              </Grid>
              <Grid size={{xs:12, md:6}}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Display
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                      />
                    }
                    label="Dark Mode"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </CardContent>
        </TabPanel>
      </Card>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProfilePage;
