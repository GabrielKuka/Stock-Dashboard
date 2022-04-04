import React from "react";
import { useSelector } from "react-redux";

import ErrorModal from "./ErrorModal";
import PromptModal from "./PromptModal";

const CustomModal = () => {
  const modal = useSelector(({ modal }) => modal);

  if (modal?.data?.show) {
    switch (modal.modalType) {
      case "Error":
        return <ErrorModal />;
      case "Prompt":
        return <PromptModal />;
      default:
        return null;
    }
  }

  return null;
};

export default CustomModal;
