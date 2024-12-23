"use client";

import { useCallback, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md"; // Importing cancel icon from react-icons
import Button from "../Button"; // Importing the custom Button component

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title: string;
  description?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  children?: React.ReactNode;
  actionLabel?: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  body,
  footer,
  children,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryLabel,
}) => {
  // Ensure the initial state of `showModal` is a boolean value
  const [showModal, setShowModal] = useState<boolean>(isOpen);

  // Update showModal state when isOpen prop changes
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Handle modal close action
  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  // Handle modal submit action
  const handleSubmit = useCallback(() => {
    if (disabled || !onSubmit) return;
    onSubmit();
  }, [disabled, onSubmit]);

  // Handle secondary action (if provided)
  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;
    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/70">
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
        <div
          className={`transform duration-300 h-full ${
            showModal ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={handleClose}
                className="p-1 border-0 hover:opacity-70 transition"
              >
                <MdCancel className="w-6 h-6" />
              </button>
            </div>

            {/* Description (optional) */}
            {description && (
              <div className="px-6 text-sm text-gray-600">{description}</div>
            )}

            {/* Body */}
            {body && <div className="relative p-6 flex-auto">{body}</div>}

            {/* Custom children */}
            {children && <div className="relative p-6">{children}</div>}

            {/* Footer */}
            <div className="flex flex-col gap-2 p-6">
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryLabel && secondaryAction && (
                  <Button
                    outline
                    disabled={disabled}
                    label={secondaryLabel}
                    onclick={handleSecondaryAction}
                  />
                )}
                {actionLabel && (
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onclick={handleSubmit}
                  />
                )}
              </div>
            </div>

            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
