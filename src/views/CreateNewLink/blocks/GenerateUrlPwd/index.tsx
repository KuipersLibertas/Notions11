import React, { useState, useContext } from 'react';
import ApplicationContext from '@/contexts/ApplicationContext';

import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Chip,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { IChooseLink, IServerLink, IValidationError } from '@/types';
import { AppMode, CustomToastOptions, ThemeMode, UserLevel } from '@/utils/constants';
import { useSession } from 'next-auth/react';

type GenerateUrlPwdProps = {
  onSave: (link: string, password: string) => void,
  linkInfo: IChooseLink,
}

const GenerateUrlPwd = ({ onSave, linkInfo }: GenerateUrlPwdProps): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();
  const { authenticated } = useContext(ApplicationContext);
  
  const [isProcessing, setIsProcessing] = useState<boolean>();
  
  const [customLink, setCustomLink] = useState<string>(linkInfo.link);
  const [customPassword, setCustomPassword] = useState<string>(linkInfo.password);
  const [selectedExpiry, setSelectedExpiry] = useState<boolean>(false);
  const [selectedTrackIp, setSelectedTrackIp] = useState<boolean>(true);
  const [selectedNotifyEmail, setSelectedNotifyEmail] = useState<boolean>(false);
  const [expiryCount, setExpiryCount] = useState<string>('');
  const [selectedExpiryType, setSelectedExpiryType] = useState<string>('count');
  const [selectedPaid, setSelectedPaid] = useState<boolean>(false);
  const [cost, setCost] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [errors, setErrors] = useState<IValidationError>();
  
  const handleDatePickerChange = (value: any) => {
    const { $y: year, $M: month, $D: day } = value;
    setExpiryDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  };

  const handleSave = async (): Promise<void> => {
    if (isProcessing) return;
    
    let errors_: IValidationError = {};

    if (customLink.length === 0) {
      errors_['custom_link'] = { message: 'Please enter a valid link' };
    } 

    const data: IServerLink = {
      files: linkInfo.files,
      link: customLink,
      password: customPassword,
      service: linkInfo.service,
      linkType: 4,
      emailNotify: false,
      trackIp: false,
      cost: 0,
      expiryCount: 0,
      expiryOn: '',
    };

    if (session?.user.level && session?.user.level > UserLevel.Normal) {
      if (selectedExpiry) {
        if (selectedExpiryType === 'count') {
          const count = expiryCount.length > 0 ? parseInt(expiryCount, 10) : 0;
          if (count > 0) {
            data['expiryCount'] = count;
            const { expiry_count, ...rest } = errors_;
            console.log(expiry_count);
            errors_ = rest;
          } else {
            errors_['expiry_count'] = { message: 'Please enter a valid number' };
          }
        }

        if (selectedExpiryType === 'date') {
          if (expiryDate.length > 0) {
            data['expiryOn'] = expiryDate;
            const { expiry_on, ...rest } = errors_;
            console.log(expiry_on);
            errors_ = rest;
          } else {
            errors_['expiry_on'] = { message: 'Please select a valid date' };
          }
        }
      }

      data['emailNotify'] = selectedNotifyEmail;
      data['trackIp'] = selectedTrackIp;
    }

    if (session?.user.level === UserLevel.Admin) {
      if (selectedPaid) {
        data['cost'] = cost.length > 0 ? parseInt(cost, 10) : 0;
      }
    }

    setErrors(errors_);
    if (Object.keys(errors_).length > 0) return;

    setIsProcessing(true);
    try {
      const response = await fetch(
        '/api/gateway/save-link',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );

      const json = await response.json();

      setIsProcessing(false);

      if (json.success) {
        toast.success('Successfully saved', CustomToastOptions); 
        onSave(customLink, customPassword);
      } else {
        toast.error(json.message, CustomToastOptions); 
      }
    } catch (e: any) {
      setIsProcessing(false);
      toast.error(e.message, CustomToastOptions);  
    }
  };

  return (
    <Box>
      <Box pt={1}>
        <Box
          display="flex"
          justifyContent="center"
          py={1}
        >
          <Typography
            variant="subtitle1"
            color="text.primary"
          >
            {linkInfo.files[0].url}
          </Typography>
        </Box>
      </Box>
      <Box mt={3}>
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start">Notions11.com/</InputAdornment>,
          }}
          type="text"
          variant="outlined"
          sx={{
            width: '100%',
            pt: 0,
          }}
          value={customLink}
          onChange={(e) => setCustomLink(e.target.value)}
          error={!!errors?.custom_link}
          helperText={errors?.custom_link?.message}
        />
      </Box>
      <Box mt={1}>
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start">Password:</InputAdornment>,
          }}
          type="text"
          variant="outlined"
          sx={{
            width: '100%',
            pt: 0,
          }}
          value={customPassword}
          onChange={(e) => setCustomPassword(e.target.value)}
        />
      </Box>
      <Box py={2}>
        <Divider />
      </Box>
      {(authenticated && session?.user.level === UserLevel.Admin)&&
        <Box>
          <Box display="flex" alignItems="center" columnGap={1}>
            <Typography variant="h6">Accept Payments</Typography>
            <Chip
              component="div"
              variant="filled"
              label="BETA"
              color={theme.palette.mode === ThemeMode.dark ? 'secondary' : 'success'}
              sx={{
                py: '0.18rem',
                px: '0.4rem',
                mb: '0.35rem',
                mt: '0.5rem',
                height: 'unset',
              }}
              onClick={() => {}}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={<Checkbox />}
              label="Charge to download this file"
              checked={selectedPaid}
              onChange={(_, checked) => setSelectedPaid(checked)}
            />
          </Box>
          <Box>
            <TextField
              InputProps={{
                startAdornment: <InputAdornment position="start">{'Price ($ USD):'}</InputAdornment>,
              }}
              type="number"
              variant="outlined"
              sx={{
                width: {
                  xs: '100%',
                  sm: '50%',
                  md: '30%'
                },
                pt: 0,
              }}
              inputMode="numeric"
              disabled={!selectedPaid}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </Box>
          <Box py={2}>
            <Divider />
          </Box>
        </Box>
      }
      {((authenticated && session?.user.level !== undefined && session?.user.level >= UserLevel.Pro) || AppMode.Free)&&
        <Box>
          <Box>
            <Typography variant="h6">Link Expiry</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Delete the link"
              sx={{ mr: '5px' }}
              value={selectedExpiry}
              onChange={(_, checked) => setSelectedExpiry(checked)}
            />
            <Box
              display="flex"
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                {'(after'}&nbsp;&nbsp;
              </Typography>
              <RadioGroup
                row
                aria-labelledby=""
                defaultValue="date"
                name="expiry-group"
                sx={{
                  alignItems: 'center'
                }}
                value={selectedExpiryType}
                onChange={(e) => setSelectedExpiryType(e.target.value)}
              >
                <FormControlLabel
                  value="count"
                  control={<Radio />}
                  label=""
                  sx={{
                    mr: 0
                  }}
                  disabled={!selectedExpiry}
                />
                <TextField
                  variant="standard"
                  sx={{
                    width: '100px'
                  }}
                  disabled={!selectedExpiry || selectedExpiryType !== 'count'}
                  value={expiryCount}
                  inputMode="numeric"
                  onChange={(e) => setExpiryCount(e.target.value)}
                  error={!!errors?.expiry_count}
                  helperText={errors?.expiry_count?.message}
                />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  &nbsp;&nbsp;{'downloads or on'}&nbsp;&nbsp;
                </Typography>
                <Box display="flex" alignItems="center">
                  <FormControlLabel
                    value="date"
                    control={<Radio />}
                    label=""
                    sx={{
                      mr: 0
                    }}
                    disabled={!selectedExpiry}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disabled={!selectedExpiry || selectedExpiryType !== 'date'}
                      format="YYYY-MM-DD"
                      onChange={(value) => handleDatePickerChange(value)}
                    />
                  </LocalizationProvider>
                </Box>
              </RadioGroup>
            </Box>
          </Box>
          <Box py={2}>
            <Divider />
          </Box>
          <Box>
            <Typography variant="h6">Tracking and Analytics</Typography>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                control={<Checkbox />}
                label="Track recipient location(s)"
                sx={{ mr: '5px' }}
                checked={selectedTrackIp}
                onChange={(_, checked) => setSelectedTrackIp(checked)}
              />
              <Typography
                variant="subtitle2"
                color="text.secondary"
              >
                Required for Advanced Analytics
              </Typography>
            </Box>
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                label="Email me when accessed"
                checked={selectedNotifyEmail}
                onChange={(_, checked) => setSelectedNotifyEmail(checked)}
              />
            </Box>
          </Box>
          <Box py={2}>
            <Divider />
          </Box>
        </Box>
      }
      <Box
        display="flex"
        justifyContent="flex-end"
        columnGap={2}
      >
        <LoadingButton
          variant="contained"
          onClick={handleSave}
          loading={isProcessing}
        >
          Confirm and Save
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default GenerateUrlPwd;