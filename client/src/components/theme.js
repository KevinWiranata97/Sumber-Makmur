import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif', // Use Poppins as the global font
    fontSize: 16, // Set base font size
    fontWeightBold: 1600, // Global bold weight
    h1: {
      fontWeight: 600, // Bolder weight for headers
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    button: {
      fontWeight: 700, // Bold button text
    },
    body1: {
      fontWeight: 400, // Normal body text weight
    },
  },
  palette: {
    primary: {
      main: '#5D5FEF', // Soft primary color for accents
    },
    secondary: {
      main: '#FFFFFF', // White secondary color for buttons, etc.
    },
    text: {
      primary: '#2c2c2c', // Main text color
      secondary: '#6b6b6b', // Muted text color
    },
    background: {
      default: '#f9f9f9', // Light gray background
      paper: '#ffffff', // Card background
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase for buttons
          borderRadius: '12px', // Rounded corners for buttons
          padding: '10px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // Soft shadow
          fontWeight: 600,
        },
        contained: {
          backgroundColor: '#5D5FEF', // Primary button color
          color: '#ffffff', // White text on primary button
          '&:hover': {
            backgroundColor: '#4b4ecc',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px',
          backgroundColor: '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)', // Soft shadow
        },
        input: {
          padding: '10px',
          fontSize: '16px',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        "root": {
          "&.Mui-checked": {
            "color": "#5D5FEF"
          }
        }
      }
      
    },
    MuiCheckbox: {
      styleOverrides: {
        "root": {
          "&.Mui-checked": {
            "color": "#5D5FEF"
          }
        }
      }
      
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Rounded card corners
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Soft shadow for card
          padding: '20px',
        },
      },
    },
  },
});

export default theme;
