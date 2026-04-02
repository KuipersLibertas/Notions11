
import React from 'react';
import { CircularProgress } from '@mui/material';
import { Box } from '@mui/material';
import { SpinnerSize } from '@/utils/constants';

type LoadingSpinnerProps = {
  children?: React.ReactNode,
  _size?: number,  
  color?: string,
}

const LoadingSpinner = (props: LoadingSpinnerProps): JSX.Element => {
  const { children, _size, color = 'common.black' } = props;
  const getCircleSize = (): number => {   
    return _size?? SpinnerSize.Normal;
  };

  const getPadding = (): string => {
    if (_size === SpinnerSize.Normal)
      return '1.875rem';
    return '1.875rem';
  };

  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      top={0}
      bottom={0}
      component="div"
      display="flex"
      columnGap="0.625rem"
      alignItems="center"
      justifyContent="center"
      padding={getPadding()}
      sx={{
        bgcolor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1
      }}
    >
      <CircularProgress
        sx={{
          color: color
        }}
        size={getCircleSize()}
      />
      {children}
    </Box>
  );
};

export default LoadingSpinner;