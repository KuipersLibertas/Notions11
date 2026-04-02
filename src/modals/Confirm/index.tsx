import React from 'react';
import ModalLayout from '@/modals/ModalLayout';

import { Box, Button, Typography } from '@mui/material';

type ConfirmModalProps = {
  opened: boolean,
  message: string;
  onClose: () => void,
  onOk: () => void,
}
const Confirm = ({
  opened,
  onClose,
  message,
  onOk,
}: ConfirmModalProps): JSX.Element => {
  return (
    <ModalLayout
      opened={opened}
      onClose={onClose}
    >
      <Box
        position="absolute"
        display="flex"
        flexDirection="column"
        sx={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: {
            xs: '85%',
            md: '29rem'
          },
          backgroundColor: 'background.paper',
          overflowY: 'auto',
          borderRadius: '1.2rem',
          padding: '2rem 1.5rem'
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={500}>Confirm</Typography>
          <Typography mt={1} dangerouslySetInnerHTML={{ __html: message }}></Typography>
        </Box>
        <Box flexGrow={1}>&nbsp;</Box>
        <Box display="flex" mt={2} justifyContent="flex-end">
          <Button onClick={onOk}>Ok</Button>
          <Button onClick={onClose}>Cancel</Button>
        </Box>
      </Box>
    </ModalLayout>
  );
};

export default Confirm;