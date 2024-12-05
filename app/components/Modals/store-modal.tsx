"use client";

import { useState } from "react";
import { useStoreModal } from "../hooks/use-store-modal";
import { Modal } from "../ui/modal";

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [isOpen, setIsOpen] = useState(storeModal.isOpen);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new Store to manage products and categories"
      isOpen={isOpen}
      setIsOpen={handleClose}
    >
        Future Create Store Form 
    </Modal>
  );
};
