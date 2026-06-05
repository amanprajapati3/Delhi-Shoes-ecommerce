import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink for routing
import { 
  LayoutDashboard, 
  PlusCircle, 
  Edit, 
  Package, 
  ShoppingCart, 
  ChevronRight 
} from 'lucide-react';
import { FiHome } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";


const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Added 'path' for each route
  const menuItems = [
  { icon: <LayoutDashboard size={22} />, label: 'Dashboard', path: '/dashboard/dashboardHome' },
  { icon: <PlusCircle size={22} />, label: 'Add Product', path: '/dashboard/add' },
  { icon: <IoSettingsOutline size={22} />, label: 'Setting', path: '/dashboard/setting' },
  { icon: <Package size={22} />, label: 'Product Listing', path: '/dashboard/products' },
  { icon: <ShoppingCart size={22} />, label: 'Orders', path: '/dashboard/orders' },
  { icon: <FiHome size={22} />, label: 'Home', path: '/' },
];

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 z-50
        ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className="flex items-center h-20 px-6 mb-4">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Package className="text-white" size={24} />
        </div>
        <span className={`ml-4 font-bold text-white text-xl transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
          AdminPro
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 px-3">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            // NavLink gives us an 'isActive' boolean to style the current page
            className={({ isActive }) => `
              group flex items-center p-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-400'}
            `}
          >
            <div className="min-w-[40px] flex justify-center transition-colors">
              {item.icon}
            </div>
            
            <span className={`ml-3 font-medium whitespace-nowrap transition-all duration-300 
              ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}
            >
              {item.label}
            </span>

            {isExpanded && (
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;