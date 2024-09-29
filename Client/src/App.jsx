import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import { setOpenSidebar } from "./redux/slices/authSlice";
import Project from "./pages/Project";
import Bugs from "./pages/Bugs";
import Main from "./components/Kanban/Main";
import Home from "./components/Kanban/Home";
import BugDetails from "./pages/BugDetails";

function Layout() {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/log-in' state={{ from: location }} replace />
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.auth);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <div
          ref={mobileMenuRef}
          className={clsx(
            "fixed inset-0 z-50 bg-black/40 transition-all duration-700 transform",
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={closeSidebar}
        >
          <div
            className='bg-white w-3/4 h-full shadow-lg'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='w-full flex justify-end p-3'>
              <button
                onClick={closeSidebar}
                className='flex justify-end items-end'
              >
                <IoClose size={25} />
              </button>
            </div>

            <div className='-mt-10'>
              <Sidebar />
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6] '>
      <Routes>
        <Route element={<Layout />}>
          <Route index path='/' element={<Navigate to='/project' />} />
          <Route path="/bug/:id" element={<BugDetails />} />
          <Route path='/team' element={<Users />} />
          <Route path='/trashed' element={<Trash />} />
          <Route path="/project" element={<Project/>}/>
          <Route path='/project/:id/tasks' element={< Main/>} />
          <Route path="/project/:projectId/bugs" element={<Bugs />} />
          <Route path="/boards/:boardId" element={<Home />} />
        </Route>

        <Route path='/log-in' element={<Login/>} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;