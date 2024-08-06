import Link from "next/link";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";

const Header = () => {
  return (
    <header className="flex justify-center p-4">
      <div className="flex w-[70%] justify-evenly items-center border">
        <div>
          <LogoDevIcon style={{ fontSize: "2.5rem" }} />
          <span>Store</span>
        </div>
        <input
          type="text"
          id="first_name"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[70%] p-3"
          placeholder="Search for Product, Brands and More"
          required
        />
      </div>
      <nav className="w-[30%] border">
        <ul className="flex justify-center items-center gap-10">
          <li className="flex justify-center items-center gap-1">
            <span>
              <PersonPinIcon style={{ fontSize: "1.5rem" }} />
            </span>
            <Link href="/login">Login</Link>
          </li>
          <li className="flex justify-center items-center gap-1">
            <span>
              <ShoppingCartIcon style={{ fontSize: "1.5rem" }} />
            </span>
            <Link href="">Cart</Link>
          </li>
          <li className="flex justify-center items-center gap-1">
            <span>
              <StorefrontIcon style={{ fontSize: "1.5rem" }} />
            </span>
            <Link href="">Beacome a seller</Link>
          </li>
          <div>
            <MoreVertIcon />
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
