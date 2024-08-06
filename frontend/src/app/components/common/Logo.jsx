import React from "react";
import { Icon } from "@iconify/react";
import storefrontIcon from "@iconify/icons-mdi/storefront"; // Replace with the icon you chose

const Logo = () => {
  return (
    <div className="flex items-center">
      <Icon icon={storefrontIcon} className="text-blue-500 text-3xl" />
      <span className="ml-2 text-xl font-bold">E-commerce</span>
    </div>
  );
};

export default Logo;
