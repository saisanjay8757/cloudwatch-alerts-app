import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  LinearProgress,
  Typography,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  styled
} from '@mui/material';
import { 
  CheckCircle as ResolveIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import moment from 'moment';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  backgroundColor: '#f5f7fa',
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3)
}));

const TitleText = styled(Typography)({
  fontWeight: 700,
  color: '#2d3748'
});

const StyledTable = styled(Table)({
  minWidth: 650,
  borderRadius: '8px',
  overflow: 'hidden'
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#4a5568',
  '& th': {
    color: 'white',
    fontWeight: 600
  }
});

const StateChip = styled(Chip)(({ theme, state }) => ({
  fontWeight: 600,
  color: 'white',
  ...(state === 'ALARM' && {
    backgroundColor: theme.palette.error.main
  }),
  ...(state === 'OK' && {
    backgroundColor: theme.palette.success.main
  }),
  ...(state === 'INSUFFICIENT_DATA' && {
    backgroundColor: theme.palette.warning.main
  }),
  ...(!['ALARM', 'OK', 'INSUFFICIENT_DATA'].includes(state) && {
    backgroundColor: theme.palette.info.main
  })
}));

const ResolveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '6px 16px'
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '300px'
});

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: '#718096'
}));

const TimestampText = styled(Typography)({
  color: '#718096',
  fontSize: '0.875rem'
});

const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [resolverName, setResolverName] = useState('');
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts');
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveClick = (alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleResolveConfirm = async () => {
    try {
      const response = await fetch(`/api/alerts/${selectedAlert.id}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolvedBy: resolverName }),
      });

      if (!response.ok) throw new Error('Failed to resolve alert');

      const updatedAlert = await response.json();
      setAlerts(alerts.map(a => a.id === updatedAlert.id ? updatedAlert : a));
      setOpenDialog(false);
      setResolverName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'ALARM': return <ErrorIcon />;
      case 'OK': return <ResolveIcon />;
      case 'INSUFFICIENT_DATA': return <WarningIcon />;
      default: return <InfoIcon />;
    }
  };

  const getRowStyle = (state) => {
    switch (state) {
      case 'ALARM': return { backgroundColor: '#fff5f5', '&:hover': { backgroundColor: '#ffecec' } };
      case 'OK': return { backgroundColor: '#f0fff4', '&:hover': { backgroundColor: '#e6ffed' } };
      case 'INSUFFICIENT_DATA': return { backgroundColor: '#fffaf0', '&:hover': { backgroundColor: '#fff5e6' } };
      default: return {};
    }
  };

  if (loading) {
    return (
      <StyledContainer>
        <LoadingContainer>
          <CircularProgress size={60} />
        </LoadingContainer>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Typography color="error" variant="h6" align="center">
          Error: {error}
        </Typography>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <HeaderBox>
        <TitleText variant="h4">CloudWatch Alerts Dashboard</TitleText>
        <Tooltip title="Refresh alerts">
          <IconButton 
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ marginLeft: 2 }}
          >
            <RefreshIcon color={refreshing ? 'disabled' : 'primary'} />
          </IconButton>
        </Tooltip>
      </HeaderBox>

      {alerts.length === 0 ? (
        <EmptyState>
          <Typography variant="h6">No alerts found</Typography>
          <Typography>CloudWatch alerts will appear here when triggered</Typography>
        </EmptyState>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <StyledTable aria-label="alerts table">
            <StyledTableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Alert Name</TableCell>
                <TableCell>Instance ID</TableCell>
                <TableCell>Account ID</TableCell>
                <TableCell>Time</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow 
                  key={alert.id}
                  sx={getRowStyle(alert.state)}
                >
                  <TableCell>
                    <StateChip 
                      icon={getStateIcon(alert.state)} 
                      label={alert.state === 'INSUFFICIENT_DATA' ? 'INSUFFICIENT DATA' : alert.state}
                      state={alert.state}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="500">{alert.alertName}</Typography>
                    {alert.resolvedBy && (
                      <Typography variant="caption" color="textSecondary">
                        Resolved by {alert.resolvedBy}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{alert.instanceId}</TableCell>
                  <TableCell>{alert.accountId}</TableCell>
                  <TableCell>
                    <Typography>{moment(alert.createdAt).format('MMM D, YYYY')}</Typography>
                    <TimestampText>
                      {moment(alert.createdAt).format('h:mm A')}
                    </TimestampText>
                  </TableCell>
                  <TableCell align="right">
                    {alert.state === 'ALARM' && (
                      <ResolveButton
                        variant="contained"
                        onClick={() => handleResolveClick(alert)}
                        startIcon={<ResolveIcon />}
                      >
                        Resolve
                      </ResolveButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      )}

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: 3
          }
        }}
      >
        <DialogTitle>Resolve Alert</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            You are resolving: <strong>{selectedAlert?.alertName}</strong>
          </Typography>
          <Typography gutterBottom color="textSecondary" variant="body2">
            Instance: {selectedAlert?.instanceId}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            type="text"
            fullWidth
            variant="outlined"
            value={resolverName}
            onChange={(e) => setResolverName(e.target.value)}
            placeholder="Enter your name to track resolution"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleResolveConfirm} 
            color="primary" 
            variant="contained"
            disabled={!resolverName.trim()}
          >
            Confirm Resolution
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default AlertsDashboard;
