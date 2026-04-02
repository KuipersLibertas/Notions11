import React from 'react';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
  // All other props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

const Container = ({ children, ...rest }: Props): JSX.Element => (
  <Box
    maxWidth={{ sm: 720, md: 1440 }}
    width={1}
    margin={'0 auto'}
    paddingX={2}
    paddingY={{ xs: '2rem', sm: '3rem', md: '4rem' }}
    {...rest}
  >
    {children}
  </Box>
);

export default Container;
