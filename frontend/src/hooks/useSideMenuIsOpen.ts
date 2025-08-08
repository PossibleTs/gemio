import { useState } from "react";

const useSideMenuIsOpen = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSideMenuIsOpen = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    handleSideMenuIsOpen,
  };
};

export default useSideMenuIsOpen;
