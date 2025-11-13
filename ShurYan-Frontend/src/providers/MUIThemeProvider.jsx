import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import stylisRTLPlugin from "@mui/stylis-plugin-rtl";
import { prefixer } from "stylis";
import createCache from '@emotion/cache';

const theme = createTheme({
    direction: 'rtl',
    shape: {
        borderRadius: 12,
    },
    palette: {
        primary: {
            main: '#14b8a6', // Teal-500 from our theme
            light: '#5eead4',
            dark: '#0f766e',
        },
        secondary: {
            main: '#10b981', // Emerald-500 from our theme
            light: '#6ee7b7',
            dark: '#047857',
        },
    },
    components: {
        // TextField - Most used input component
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 15, // rounded-2xl equivalent
                        backgroundColor: '#ffffff', // bg-white
                        '&:hover fieldset': {
                            borderColor: '#14b8a6', // border-teal-500
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#14b8a6', // border-teal-500
                            borderWidth: 2, // border-2
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#64748b', // text-slate-500
                        '&.Mui-focused': {
                            color: '#14b8a6', // text-teal-500
                        },
                    },
                },
            },
        },

        // Autocomplete - Used in SessionModal & PartnerSection
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 15, // rounded-2xl
                        backgroundColor: '#ffffff', // bg-white
                    },
                },
                paper: {
                    borderRadius: 12, // rounded-xl
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
                    border: '1px solid #e2e8f0', // border border-slate-200
                },
                option: {
                    padding: '12px 16px', // p-3 px-4
                    '&[aria-selected="true"]': {
                        backgroundColor: '#f0fdfa !important', // bg-teal-50
                        color: '#0f766e', // text-teal-700
                        fontWeight: 600, // font-semibold
                    },
                    '&:hover': {
                        backgroundColor: '#f0fdfa', // bg-teal-50
                        color: '#14b8a6', // text-teal-500
                    },
                },
                noOptions: {
                    color: '#64748b', // text-slate-500
                    padding: '16px', // p-4
                },
            },
        },

        // Button - Common patterns from components
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // rounded-xl
                    textTransform: 'none', // Remove uppercase
                    fontWeight: 600, // font-semibold
                    padding: '12px 24px', // py-3 px-6
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
                        transform: 'translateY(-1px)', // hover:scale-105 effect
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)', // bg-gradient-to-br from-teal-500 to-emerald-500
                    color: '#ffffff', // text-white
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)', // hover:from-teal-600 hover:to-emerald-600
                    },
                },
                containedSecondary: {
                    backgroundColor: '#f8fafc', // bg-slate-50
                    color: '#475569', // text-slate-600
                    border: '2px solid #e2e8f0', // border-2 border-slate-200
                    '&:hover': {
                        backgroundColor: '#f1f5f9', // hover:bg-slate-100
                        borderColor: '#cbd5e1', // hover:border-slate-300
                    },
                },
                outlined: {
                    borderColor: '#14b8a6', // border-teal-500
                    color: '#14b8a6', // text-teal-500
                    borderWidth: 2, // border-2
                    '&:hover': {
                        backgroundColor: '#f0fdfa', // hover:bg-teal-50
                        borderColor: '#0d9488', // hover:border-teal-600
                    },
                },
            },
        },

        // Chip - Used for tags and badges
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 9999, // rounded-full
                    fontWeight: 500, // font-medium
                },
                colorPrimary: {
                    backgroundColor: '#14b8a6', // bg-teal-500
                    color: '#ffffff', // text-white
                },
                colorSecondary: {
                    backgroundColor: '#10b981', // bg-emerald-500
                    color: '#ffffff', // text-white
                },
                outlined: {
                    borderColor: '#14b8a6', // border-teal-500
                    color: '#14b8a6', // text-teal-500
                },
            },
        },

        // Card - Common container pattern
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16, // rounded-2xl
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow-sm
                    border: '1px solid #f1f5f9', // border border-slate-100
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // hover:shadow-md
                    },
                },
            },
        },

        // Dialog - Modal patterns
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20, // rounded-3xl
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
                },
            },
        },

        // Alert - Common notification pattern
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12, // rounded-xl
                    padding: '16px', // p-4
                },
                standardSuccess: {
                    backgroundColor: '#d1fae5', // bg-green-100
                    color: '#047857', // text-green-700
                    border: '1px solid #a7f3d0', // border-green-200
                },
                standardError: {
                    backgroundColor: '#fee2e2', // bg-red-100
                    color: '#dc2626', // text-red-600
                    border: '1px solid #fecaca', // border-red-200
                },
                standardWarning: {
                    backgroundColor: '#fef3c7', // bg-yellow-100
                    color: '#d97706', // text-yellow-700
                    border: '1px solid #fde68a', // border-yellow-200
                },
                standardInfo: {
                    backgroundColor: '#dbeafe', // bg-blue-100
                    color: '#1d4ed8', // text-blue-700
                    border: '1px solid #bfdbfe', // border-blue-200
                },
            },
        },

        // Badge - Status indicators
        MuiBadge: {
            styleOverrides: {
                badge: {
                    borderRadius: 9999, // rounded-full
                    fontWeight: 600, // font-semibold
                    fontSize: '0.75rem', // text-xs
                },
                colorPrimary: {
                    backgroundColor: '#14b8a6', // bg-teal-500
                    color: '#ffffff', // text-white
                },
                colorSecondary: {
                    backgroundColor: '#10b981', // bg-emerald-500
                    color: '#ffffff', // text-white
                },
            },
        },
    },
});

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, stylisRTLPlugin],
});

export default function MUIThemeProvider({ children }) {
    return (
        <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </CacheProvider>
    )
}
