import React, { useEffect, useState, useRef } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import { IServerLink } from '@/types';

type UpgradeProModalProps = {
  linkInfo: IServerLink,
  onClose: () => void,
  opened: boolean,
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface IAnalytics {
  city: string;
  count: number;
}
const AnalyticsModal = ({ opened, linkInfo, onClose }: UpgradeProModalProps): JSX.Element => {
  const theme = useTheme();
  const initiatedRef = useRef<boolean>(false);

  const [isLoadProcessing, setIsLoadProcessing] = useState<boolean>(false);
  const [totalDownloadCount, setTotalDownloadCount] = useState<number>();
  const [totalCityCount, setTotalCityCount] = useState<number>();
  const [list, setList] = useState<IAnalytics[]>([]);

  useEffect(() => {
    if (initiatedRef.current) return;

    initiatedRef.current = true;
    getAnalyticsData();
  }, [linkInfo]);

  const getAnalyticsData = async (): Promise<void> => {
    if (isLoadProcessing) return;

    setIsLoadProcessing(true);
    try {
      const response = await fetch(
        '/api/gateway/link-analytics',
        {
          method: 'POST',
          body: JSON.stringify({ id: linkInfo.id })
        }
      );
      const json = await response.json();

      if (json.success) {
        setTotalDownloadCount(json.data.downloadCount);
        setTotalCityCount(json.data.ipCount);
        setList(json.data.city ?? []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadProcessing(false);
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
          borderRadius: '15px',
          
        },
        '& .MuiDialogContent-root': {
          paddingTop: '2rem',
          paddingBottom: '2rem'
        },
        '& .MuiDialogActions-root': {
          paddingTop: '2rem',
        },
      }}
    >
      <DialogTitle
        variant="h5"
        fontWeight={500}
        align="center"
      >
        Analytics
      </DialogTitle>
      <DialogContent dividers sx={{ position: 'relative' }}>
        <Box>
          <Typography>Name: {linkInfo.files[0].url}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Viewed/Downloaded&nbsp;
            <Typography component="strong" fontWeight={700} color="error">{totalDownloadCount}</Typography>&nbsp;
            times by&nbsp;
            <Typography component="strong" fontWeight={700} color="error">{totalCityCount}</Typography>&nbsp;
            unique users.
          </Typography>
        </Box>
        <Box mt={2}>
          {isLoadProcessing&& <LoadingSpinner />}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            borderBottom = {`1px solid ${theme.palette.common.gray}`}
            p={1}
            columnGap={2}
            bgcolor="background.level2"
          >
            <Box width={150}>
              <Typography variant="subtitle2" fontWeight={500} color="text.secondary">Location</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight={500} color="text.secondary" sx={{ textWrap: 'nowrap' }}>Unique Users({totalCityCount})</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight={500} color="text.secondary" sx={{ textWrap: 'nowrap' }}>Total Downloads({totalDownloadCount})</Typography>
            </Box>
          </Box>
          {list?.map((item: IAnalytics, index: number) =>
            <Box
              key={index}
              display="flex"
              flexDirection={{ xs: 'column', md: 'row' }}
              borderBottom = {`1px solid ${theme.palette.common.gray}`}
              p={1}
              columnGap={2}
            >
              <Box width={150}>
                <Typography>{item.city || 'Unknown'}</Typography>
              </Box>
              <Box flex={1}>
                <Typography>{item.count}</Typography>
              </Box>
              <Box flex={1}>
                <Typography>—</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsModal;