"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface ModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void; // Pass state updater function
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  setIsOpen,
  children,
}) => {
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open); // Toggle modal state
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
       
      </DialogContent>
    </Dialog>
  );
};
