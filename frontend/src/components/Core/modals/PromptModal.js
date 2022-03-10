import React from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { promptModal } from "../../../reducers/modalReducer";

const PromptModal = () => {
  const dispatch = useDispatch();
  const modalData = useSelector(({ modal }) => modal.data);
  const showStatus = modalData.show;

  const confirm = (ans) => dispatch(promptModal("", !showStatus, ans));

  const modalStyle = {
    modalHeader: {
      padding: "1rem 1rem 0.4rem 1rem",
      color: "red",
    },
    modalBody: {
      padding: "2rem 2rem 2rem 1rem",
    },
    modalFooter: {
      padding: "0.5rem 0.5rem 0.5rem 0.5rem",
    },
  };

  return (
    <div>
      <Modal isOpen={showStatus} toggle={() => confirm(false)}>
        <ModalBody style={modalStyle.modalBody}>
          <b>{modalData.text}</b>
        </ModalBody>
        <ModalFooter style={modalStyle.modalFooter}>
          <Button
            color="secondary"
            outline={true}
            onClick={() => confirm(false)}
          >
            Cancel
          </Button>{" "}
          <Button color="info" outline={true} onClick={() => confirm(true)}>
            Okay
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default PromptModal;
