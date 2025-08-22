import * as React from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Typography,
  useMediaQuery
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import {useTheme as useCustomTheme} from '../theme/ThemeProvider';
import {useTheme} from '@mui/material/styles';

export default function Settings() {
  const {mode, toggleTheme, setTheme} = useCustomTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.value as 'light' | 'dark');
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <SettingsIcon sx={{mr: 2, color: 'primary.main'}}/>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Settings
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" gutterBottom sx={{mb: 4}}>
        Customize your Prompt Studio experience with these settings.
      </Typography>

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <PaletteIcon sx={{mr: 1, color: 'primary.main'}}/>
                <Typography variant="h6" fontWeight="bold">
                  Appearance
                </Typography>
              </Box>

              <Box sx={{mb: 3}}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{mb: 2, fontWeight: 'medium'}}>
                    Theme Mode
                  </FormLabel>
                  <RadioGroup
                    value={mode}
                    onChange={handleThemeChange}
                    sx={{ml: 1}}
                  >
                    <FormControlLabel
                      value="light"
                      control={<Radio/>}
                      label={
                        <Box display="flex" alignItems="center">
                          <LightModeIcon sx={{mr: 1, fontSize: 20}}/>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              Light Mode
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Clean and bright interface
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="dark"
                      control={<Radio/>}
                      label={
                        <Box display="flex" alignItems="center">
                          <DarkModeIcon sx={{mr: 1, fontSize: 20}}/>
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              Dark Mode
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Easy on the eyes for low-light environments
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Divider sx={{my: 3}}/>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Quick Theme Toggle
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toggle between light and dark mode
                  </Typography>
                </Box>
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleTheme}
                  inputProps={{'aria-label': 'Toggle theme mode'}}
                />
              </Box>

              <Box sx={{mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1}}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Current theme:</strong> {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                  <Chip
                    size="small"
                    label={mode === 'light' ? 'Light' : 'Dark'}
                    color="primary"
                    variant="outlined"
                    sx={{ml: 1}}
                  />
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications Settings */}
        <Grid item xs={12} lg={6}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <NotificationsIcon sx={{mr: 1, color: 'primary.main'}}/>
                <Typography variant="h6" fontWeight="bold">
                  Notifications
                </Typography>
              </Box>

              <Box sx={{mb: 2}}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Email Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive updates about your prompts via email
                    </Typography>
                  </Box>
                  <Switch defaultChecked/>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Push Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get browser notifications for important updates
                    </Typography>
                  </Box>
                  <Switch/>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      Activity Alerts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Notifications when prompts are created or modified
                    </Typography>
                  </Box>
                  <Switch defaultChecked/>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <SecurityIcon sx={{mr: 1, color: 'primary.main'}}/>
                <Typography variant="h6" fontWeight="bold">
                  Security & Privacy
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                    <Switch/>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Session Timeout
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Automatically log out after period of inactivity
                      </Typography>
                    </Box>
                    <Switch defaultChecked/>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Activity Logging
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Keep track of account access and changes
                      </Typography>
                    </Box>
                    <Switch defaultChecked/>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Data Analytics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Help improve the application with usage analytics
                      </Typography>
                    </Box>
                    <Switch/>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Theme Preview */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{mt: 2}}>
            <Typography variant="body2">
              <strong>Theme changes are saved automatically</strong> and will persist across browser sessions.
              You can also use the quick toggle in the top navigation to switch themes instantly.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
}
