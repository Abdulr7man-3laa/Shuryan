import React from 'react';
import { 
  Autocomplete, 
  TextField, 
  Box, 
  Typography, 
  Chip,
  Avatar,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

// Create RTL theme for Arabic support
const theme = createTheme({
  direction: 'rtl',
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            direction: 'rtl',
            fontFamily: 'inherit',
          },
        },
        listbox: {
          direction: 'rtl',
          fontFamily: 'inherit',
        },
        option: {
          direction: 'rtl',
          fontFamily: 'inherit',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            textAlign: 'right',
            fontFamily: 'inherit',
          },
          '& .MuiInputLabel-root': {
            right: 14,
            left: 'auto',
            transformOrigin: 'top right',
            fontFamily: 'inherit',
          },
        },
      },
    },
  },
});

/**
 * PartnerAutocomplete Component
 * MUI Autocomplete wrapper for partner selection with RTL support
 */
const PartnerAutocomplete = ({
  title,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
  options = [],
  value,
  onChange,
  loading = false,
  placeholder = "ابحث...",
  type = "pharmacy" // pharmacy or laboratory
}) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={`bg-gradient-to-br ${gradient} border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-sm`}>
            <Icon className="text-white text-lg" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>

        {/* MUI Autocomplete */}
        <Autocomplete
          options={options}
          value={value}
          onChange={(event, newValue) => onChange(newValue)}
          loading={loading}
          getOptionLabel={(option) => option?.name || ''}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: type === 'pharmacy' ? '#10b981' : '#06b6d4',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: type === 'pharmacy' ? '#10b981' : '#06b6d4',
                    borderWidth: '2px',
                  },
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ direction: 'rtl', fontFamily: 'inherit' }}>
              <div className="flex items-center gap-3 w-full py-2">
                {/* Avatar */}
                <Avatar
                  src={option.profileImageUrl}
                  alt={option.name}
                  sx={{ width: 40, height: 40 }}
                >
                  {option.name?.charAt(0)}
                </Avatar>
                
                {/* Info */}
                <div className="flex-1">
                  <Typography 
                    variant="body2" 
                    sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}
                  >
                    {option.name}
                  </Typography>
                  
                  {/* Address */}
                  {option.address && (
                    <div className="flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-slate-400 text-xs" />
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#64748b', fontFamily: 'inherit' }}
                      >
                        {option.address}
                      </Typography>
                    </div>
                  )}
                  
                  {/* Rating */}
                  {option.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <FaStar className="text-amber-400 text-xs" />
                      <Typography 
                        variant="caption" 
                        sx={{ color: '#64748b', fontFamily: 'inherit' }}
                      >
                        {option.rating.toFixed(1)}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            </Box>
          )}
          noOptionsText="لا توجد نتائج"
          loadingText="جاري التحميل..."
          sx={{
            '& .MuiAutocomplete-listbox': {
              maxHeight: '200px',
            },
          }}
        />

        {/* Selected Partner Display */}
        {value && (
          <div className="mt-4 p-4 bg-white/50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Avatar
                src={value.profileImageUrl}
                alt={value.name}
                sx={{ width: 32, height: 32 }}
              >
                {value.name?.charAt(0)}
              </Avatar>
              <div className="flex-1">
                <Typography 
                  variant="body2" 
                  sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}
                >
                  {value.name}
                </Typography>
                {value.address && (
                  <Typography 
                    variant="caption" 
                    sx={{ color: '#64748b', fontFamily: 'inherit' }}
                  >
                    {value.address}
                  </Typography>
                )}
              </div>
              <Chip 
                label="محدد" 
                size="small" 
                color={type === 'pharmacy' ? 'success' : 'info'}
                sx={{ fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default PartnerAutocomplete;
