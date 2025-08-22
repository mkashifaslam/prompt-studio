import * as React from 'react';
import {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  CheckCircle as ActiveIcon,
  Description as PromptIcon,
  Person as UserIcon,
  Update as RecentIcon
} from '@mui/icons-material';
import {API_BASE_URL} from '../prompt/api';

interface DashboardStats {
  totalPrompts: number;
  activePrompts: number;
  inactivePrompts: number;
  recentPrompts: number;
  totalUsers: number;
  avgPromptsPerUser: number;
}

interface RecentPrompt {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  version: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatCard({title, value, icon, color, subtitle, trend}: StatCardProps) {
  const theme = useTheme();

  const getColorValue = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card elevation={2} sx={{height: '100%'}}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box
            sx={{
              backgroundColor: `${getColorValue()}15`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: getColorValue()
            }}
          >
            {icon}
          </Box>
          {trend && (
            <Chip
              size="small"
              label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
              color={trend.isPositive ? 'success' : 'error'}
              variant="outlined"
            />
          )}
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>

        <Typography variant="body1" color="text.primary" fontWeight="medium" gutterBottom>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPrompts, setRecentPrompts] = useState<RecentPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch prompts data
        const promptsResponse = await fetch(`${API_BASE_URL}/prompts`);
        if (!promptsResponse.ok) throw new Error('Failed to fetch prompts');
        const prompts = await promptsResponse.json();

        // Calculate stats
        const totalPrompts = prompts.length;
        const activePrompts = prompts.filter((p: any) => p.active).length;
        const inactivePrompts = totalPrompts - activePrompts;

        // Recent prompts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentPrompts = prompts.filter((p: any) =>
          new Date(p.createdAt) > sevenDaysAgo
        ).length;

        // Mock user data (since we don't have user endpoints yet)
        const totalUsers = 12; // Mock data
        const avgPromptsPerUser = totalPrompts > 0 ? Math.round(totalPrompts / totalUsers * 10) / 10 : 0;

        setStats({
          totalPrompts,
          activePrompts,
          inactivePrompts,
          recentPrompts,
          totalUsers,
          avgPromptsPerUser
        });

        // Set recent prompts for the activity feed
        const sortedPrompts = prompts
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        setRecentPrompts(sortedPrompts);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
        <CircularProgress size={48} sx={{mb: 2}}/>
        <Typography variant="h6" color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{mb: 3}}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="warning" sx={{mb: 3}}>
        No data available
      </Alert>
    );
  }

  const activePercentage = stats.totalPrompts > 0 ? (stats.activePrompts / stats.totalPrompts) * 100 : 0;

  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{mb: 4}}>
        Welcome to Prompt Studio. Here's an overview of your application metrics.
      </Typography>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{mb: 4}}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Prompts"
            value={stats.totalPrompts}
            icon={<PromptIcon/>}
            color="primary"
            subtitle="All prompts in system"
            trend={{value: 12, isPositive: true}}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Prompts"
            value={stats.activePrompts}
            icon={<ActiveIcon/>}
            color="success"
            subtitle="Ready for use"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Prompts"
            value={stats.recentPrompts}
            icon={<RecentIcon/>}
            color="info"
            subtitle="Created this week"
            trend={{value: 25, isPositive: true}}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<UserIcon/>}
            color="secondary"
            subtitle="Active users"
          />
        </Grid>
      </Grid>

      {/* Secondary Stats and Activity */}
      <Grid container spacing={3}>
        {/* Activity Overview */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{p: 3}}>
            <Box display="flex" alignItems="center" mb={3}>
              <AnalyticsIcon sx={{mr: 1, color: 'primary.main'}}/>
              <Typography variant="h6" fontWeight="bold">
                Prompt Activity Overview
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{mb: 3}}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Active Prompts
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {Math.round(activePercentage)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={activePercentage}
                    sx={{height: 8, borderRadius: 4}}
                    color="success"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
                    {stats.activePrompts} of {stats.totalPrompts} prompts are active
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{mb: 3}}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Average Prompts per User
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.avgPromptsPerUser}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((stats.avgPromptsPerUser / 10) * 100, 100)}
                    sx={{height: 8, borderRadius: 4}}
                    color="primary"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{mt: 1, display: 'block'}}>
                    Productivity metric across all users
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{my: 3}}/>

            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {stats.activePrompts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" color="warning.main">
                    {stats.inactivePrompts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Inactive
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" color="info.main">
                    {stats.recentPrompts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    This Week
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {stats.avgPromptsPerUser}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Avg/User
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{p: 3, height: 'fit-content'}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
              Latest prompt updates
            </Typography>

            {recentPrompts.length > 0 ? (
              <List dense>
                {recentPrompts.map((prompt, index) => (
                  <React.Fragment key={prompt.id}>
                    <ListItem disablePadding sx={{py: 1}}>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="body2" fontWeight="medium" noWrap>
                              {prompt.name}
                            </Typography>
                            <Chip
                              size="small"
                              label={prompt.active ? 'Active' : 'Inactive'}
                              color={prompt.active ? 'success' : 'default'}
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Version {prompt.version} • {new Date(prompt.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentPrompts.length - 1 && <Divider/>}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                No recent activity
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
