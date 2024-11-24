import { create } from 'zustand';

// TypeScript interface for the store's state and methods
interface RegisterModalStore {
  isOpen: boolean; // Boolean to track if the modal is open
  onOpen: () => void; // Function to open the modal
  onClose: () => void; // Function to close the modal
}

// Zustand store definition
const useRegisterModal = create<RegisterModalStore>((set) => ({
  isOpen: false, // Initial state: modal is closed
  onOpen: () => set({ isOpen: true }), // Function to open the modal
  onClose: () => set({ isOpen: false }), // Function to close the modal
}));

export default useRegisterModal;
