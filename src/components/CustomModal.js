import React from 'react';
import { Modal, Button } from 'rsuite';

const CustomModal = ({title,open,handleClose, content, handleSubmit}) => {
  return (
    <Modal size="calc(85% - 120px)" open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content()}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit} appearance="primary">
          Enregistrer
        </Button>
        <Button onClick={handleClose} appearance="subtle">
          Annuler
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;