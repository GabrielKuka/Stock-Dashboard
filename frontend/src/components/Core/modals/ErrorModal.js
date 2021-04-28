import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {useSelector, useDispatch} from 'react-redux'
import {errorModal} from '../../../reducers/modalReducer'

const ErrorModal = () => {

  const dispatch = useDispatch()
  const modalData = useSelector(({modal})=>modal.data)
  const showStatus = modalData.show

  const toggle = ()=> dispatch(errorModal('', !showStatus))

  const modalStyle = {
    
    modalHeader: {
      padding: '1rem 1rem 0.4rem 1rem',
      color: 'red',
    },
    modalBody: {
      padding: '2rem 2rem 2rem 1rem',
    },
    modalFooter: {
      padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    }
  }

  return (
    <div>
      <Modal isOpen={showStatus} toggle={toggle}>
        <ModalHeader style={modalStyle.modalHeader} toggle={toggle}>
          <b>Error</b>
        </ModalHeader>
        <ModalBody style={modalStyle.modalBody}>
            <b>{modalData.text}</b>
        </ModalBody>
        <ModalFooter style={modalStyle.modalFooter}>
          <Button  color="info" outline={true} onClick={toggle}>Okay</Button>{' '}
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ErrorModal;