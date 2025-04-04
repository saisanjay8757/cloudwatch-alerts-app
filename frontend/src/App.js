import { createTheme, ThemeProvider } from '@mui/material/styles';
import AlertsDashboard from './components/AlertsDashboard';
const theme = createTheme({
  palette: {
    primary: { main: '#4a5568' },
    secondary: { main: '#3182ce' },
    error: { main: '#f44336' },
    success: { main: '#4caf50' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AlertsDashboard />
    </ThemeProvider>
  );
}
export default App;
