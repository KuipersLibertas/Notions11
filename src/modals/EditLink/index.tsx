import React, { useState } from 'react';

import { IFile, IServerLink, IValidationError } from '@/types';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Slide,
  TextField,
  Typography
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { Edit as EditIcon } from '@mui/icons-material';
import { AppMode, CustomToastOptions, ThemeMode, UserLevel } from '@/utils/constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TransitionProps } from '@mui/material/transitions';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

type EditLinkModalProps = {
  opened: boolean;
  linkInfo: IServerLink;
  onSave: (link: IServerLink) => void;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditLink = ({
  opened,
  linkInfo,
  onSave,
  onClose,
}: EditLinkModalProps): JSX.Element => {
  const theme = useTheme();
  const { data: session } = useSession();

  const [isProcessing, setIsProcessing] = useState<boolean>();

  const [customLink, setCustomLink] = useState<string>(linkInfo.link);
  const [customPassword, setCustomPassword] = useState<string>(linkInfo.password);
  const [files, setFiles] = useState<IFile[]>(linkInfo.files);

  const [selectedExpiry, setSelectedExpiry] = useState<boolean>(
    (linkInfo.expiryCount > 0 || linkInfo.expiryOn?.length > 0) ? true : false
  );
  const [selectedTrackIp, setSelectedTrackIp] = useState<boolean>(linkInfo.trackIp);
  const [selectedNotifyEmail, setSelectedNotifyEmail] = useState<boolean>(linkInfo.emailNotify);
  const [expiryCount, setExpiryCount] = useState<string>(`${linkInfo.expiryCount}`);
  const [selectedExpiryType, setSelectedExpiryType] = useState<string>(
    !linkInfo.expiryOn?.length ? 'count' : 'date'
  );
  const [selectedPaid, setSelectedPaid] = useState<boolean>(linkInfo.cost > 0);
  const [cost, setCost] = useState<string>(`${linkInfo.cost}`);
  const [expiryDate, setExpiryDate] = useState<string>(linkInfo.expiryOn);
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

    if (files.length === 0) {
      errors_['files'] = { message: 'Please add a valid link' };
    }

    for (let i = 0; i < files.length; i++) {
      const link = files[i].url;
      if (!link.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.notion.(site|so)\/[-a-zA-Z0-9@:%._+~#=]+/gm)) {
        errors_['files'] = { message: 'Please enter a valid link' };
        break;
      }
    }
    
    const data = {
      id: linkInfo.id,
      link: customLink,
      password: customPassword,
      files: files,
      emailNotify: selectedNotifyEmail,
      trackIp: selectedTrackIp,
      cost: 0,
      expiryCount: 0,
      expiryOn: '',
    };

    if (selectedExpiry) {
      if (selectedExpiryType === 'count') {
        const count = expiryCount.length > 0 ? parseInt(expiryCount, 10) : 0;
        if (count > 0) {
          data['expiryCount'] = count;
        } else {
          errors_['expiryCount'] = { message: 'Please enter a valid number' };
        }
      }

      if (selectedExpiryType === 'date') {
        if (expiryDate.length > 0) {
          data['expiryOn'] = expiryDate;
        } else {
          errors_['expiry_on'] = { message: 'Please select a valid date' };
        }
      }
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
        '/api/gateway/update-link',
        {
          method: 'POST',
          body: JSON.stringify(data)
        }
      );

      const json = await response.json();

      setIsProcessing(false);

      if (json.success) {
        toast.success('Successfully updated', CustomToastOptions); 
        onSave(
          { 
            ...data,
            service: linkInfo.service,
            linkType: linkInfo.linkType,
            downloadCount: linkInfo.downloadCount
          });
      } else {
        toast.error(json.message, CustomToastOptions); 
      }
    } catch (e: any) {
      setIsProcessing(false);
      toast.error(e.message, CustomToastOptions);  
    }
  };

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{
        '& .MuiPaper-root': {
          padding: '1rem 1rem 2rem',
          width: {
            xs: '85%',
            md: '60rem'
          },
          maxHeight: {
            md: 'calc(100vh - 130px)'
          },
          borderRadius: '15px',
        },
        '& .MuiDialogContent-root': {
          paddingTop: '1rem',
          paddingBottom: '2rem'
        },
        '& .MuiDialogActions-root': {
          paddingTop: '2rem',
        },
      }}
    > 
      <DialogTitle>Edit this Notions11 link</DialogTitle>
      <DialogContent dividers>
        <Box>
          <Box
            display="flex"
            alignItems="center"
            borderBottom={`1px solid ${theme.palette.common.gray}`}
            p={1}
            bgcolor="background.level1"
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
            >
              Link
            </Typography>
          </Box>
          {files.map((file: IFile, index: number) =>
            <Box
              key={index}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`1px solid ${theme.palette.common.gray}`}
              py={0.5}
            >
              {/* <Typography
                variant="subtitle1"
                color="text.primary"
              >
                {file.url}
              </Typography>
              <IconButton>
                <EditIcon />
              </IconButton> */}
              <TextField
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </InputAdornment>,
                }}
                type="text"
                variant="outlined"
                sx={{
                  width: '100%',
                  pt: 0,
                }}
                value={file.url}
                onChange={(e) => {
                  files[index].url = e.target.value;
                  setFiles([...files]);
                }}
                error={!!errors?.files}
                helperText={errors?.files?.message}
              />
            </Box>
          )}
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
        {(session?.user.level === UserLevel.Admin)&&
          <Box>
            <Box py={2}>
              <Divider />
            </Box>
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
                  },
                  pt: 0,
                }}
                inputMode="numeric"
                disabled={!selectedPaid}
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </Box>            
          </Box>
        }
        {((session?.user.level !== undefined && session?.user.level >= UserLevel.Pro) || AppMode.Free)&&
          <Box>
            <Box py={2}>
              <Divider />
            </Box>
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
                label="Delete Link"
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
                      width: '50px'
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
          </Box>
        }
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
        <LoadingButton
          variant="contained"
          onClick={() => handleSave()}
          loading={isProcessing}
        >
          Save Changes
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditLink;