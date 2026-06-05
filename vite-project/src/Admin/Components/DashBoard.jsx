import React, {
  useState,
  useEffect,
} from "react";

import {
  Outlet,
  useNavigate,
} from "react-router-dom";

import SideBar from "./SideBar";

import {
  Menu,
  Bell,
  User,
  X,
} from "lucide-react";
import axios from "../../services/axios";



const Dashboard = () => {
  const navigate = useNavigate();

  const [isMobileMenuOpen,
    setIsMobileMenuOpen,
  ] = useState(false);

  const [admin, setAdmin] =
    useState(null);

  // FETCH ADMIN
  useEffect(() => {
    const fetchAdmin =
      async () => {
        try {
          const res =
            await axios.get(
              "/auth/me"
            );

          setAdmin(
            res.data.user
          );
        } catch (error) {
          console.log(error);
        }
      };

    fetchAdmin();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-20">
        <SideBar />
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`
          lg:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="relative">
          <button
            onClick={() =>
              setIsMobileMenuOpen(
                false
              )
            }
            className="absolute top-4 right-[-44px] z-50 p-2 bg-white rounded-r-xl shadow-md text-slate-600 hover:bg-slate-100"
          >
            <X size={20} />
          </button>

          <SideBar />
        </div>
      </aside>

      {/* BACKDROP */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() =>
            setIsMobileMenuOpen(
              false
            )
          }
        />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">

        {/* HEADER */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">

          {/* LEFT */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            <button
              onClick={() =>
                setIsMobileMenuOpen(
                  true
                )
              }
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600"
            >
              <Menu size={22} />
            </button>

            {/* LOGO / TITLE */}
            <div>
              <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
                Admin Dashboard
              </h1>

              <p className="text-xs text-slate-400 hidden sm:block">
                Manage products,
                orders & customers
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* ADMIN PROFILE */}
            <button
              onClick={() =>
                navigate(
                  "/dashboard/adminProfile"
                )
              }
              className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 transition-all px-2 py-1.5 rounded-full"
            >
              {/* IMAGE */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center shrink-0 border border-slate-200">

                {admin?.images?.[0]
                  ?.url ? (
                  <img
                    src={
                      admin
                        .images[0]
                        .url
                    }
                    alt="admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    size={18}
                    className="text-indigo-600"
                  />
                )}
              </div>

              {/* INFO */}
              <div className="hidden sm:flex flex-col items-start leading-tight">

                <span className="text-sm font-semibold text-slate-800">
                  {admin?.name ||
                    "Admin"}
                </span>

                <span className="text-xs text-slate-400">
                  {
                    admin?.email
                  }
                </span>
              </div>
            </button>
          </div>
        </header>

        {/* PAGE */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;