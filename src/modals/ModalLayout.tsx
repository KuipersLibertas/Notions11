import React from 'react';

import { Modal } from '@mui/material';

type ModalProps = {
  opened: boolean,
  onClose: () => void,
  children: JSX.Element
}
export type StyledBoxProps = {
  modalType: number,
} 

const ModalLayout = ({ opened, onClose, children }: ModalProps): JSX.Element => {
  return (
    <Modal
      open={opened}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {children}
    </Modal>
  );
};

export default ModalLayout;