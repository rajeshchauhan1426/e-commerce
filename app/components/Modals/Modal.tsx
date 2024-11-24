"use client";

import { useCallback, useEffect, useState } from "react";
import { MdCancel } from "react-icons/md"; // Importing cancel icon from react-icons
import Button from "../Button"; // Importing the custom Button component

interface ModelProps {
  isOpen?: boolean;
  onclose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryLabel?: string;
}

const Modal: React.FC<ModelProps> = ({
  isOpen,
  onclose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  // Update showModal state when isOpen prop changes
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // Handle modal close action
  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    setShowModal(false);
    setTimeout(() => {
      onclose();
    }, 300);
  }, [disabled, onclose]);

  // Handle modal submit action
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  // Handle secondary action (if provided)
  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }
    secondaryAction();
  }, [disabled, secondaryAction]);

  // If modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Modal background overlay */}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
          <div
            className={`translate duration-300 h-full ${
              showModal ? "translate-y-0" : "-translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            {/* Modal container */}
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/* Modal header */}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
                <button
                  onClick={handleClose}
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                >
                  <MdCancel /> {/* Cancel icon button */}
                </button>
                <div className="text-lg font-semibold">{title}</div> {/* Modal title */}
              </div>

              {/* Modal body */}
              <div className="relative p-6 flex-auto">{body}</div>

              {/* Modal footer */}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row items-center gap-4 w-full">
                  {/* Secondary action button (if provided) */}
                  {secondaryLabel && secondaryAction && (
                    <Button
                      outline
                      disabled={disabled}
                      label={secondaryLabel}
                      onclick={handleSecondaryAction}
                    />
                  )}
                  {/* Primary action button */}
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onclick={handleSubmit}
                  />
                </div>
              </div>

              {/* Custom footer (if provided) */}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
