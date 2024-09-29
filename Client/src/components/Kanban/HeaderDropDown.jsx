import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import boardIcon from "../../assets/icon-board.svg";
import { useGetAllBoardsQuery } from "../../redux/slices/api/boardSlice";
// import useDarkMode from "../hooks/useDarkMode";
// import darkIcon from "../../assets/icon-dark-theme.svg";
// import lightIcon from "../../assets/icon-light-theme.svg";

function HeaderDropDown({ setOpenDropdown, setIsBoardModalOpen }) {
  const dispatch = useDispatch();
  // const [colorTheme, setTheme] = useDarkMode();
  // const [darkSide, setDarkSide] = useState(
  //   colorTheme === "light" ? false : true
  // );

  // const toggleDarkMode = (checked) => {
  //   setTheme(colorTheme);
  //   setDarkSide(checked);
  // };

  const boards = useSelector((state) => state.boards.boards); // Adjusted selector

  return (
    <div
      className="py-10 px-6 absolute left-0 right-0 bottom-[-100vh] top-16 dropdown"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setOpenDropdown(false);
      }}
    >
      {/* DropDown Modal */}
      <div className="bg-white dark:bg-[#2b2c37] shadow-md shadow-[#364e7e1a] w-full py-4 rounded-xl">
        <h3 className="dark:text-gray-300 text-gray-600 font-semibold mx-4 mb-8">
          ALL BOARDS ({boards?.length})
        </h3>
        {boards?.map((board, i) => (
          <button
            key={i}
            onClick={() => {
              setOpenDropdown(false);
              dispatch(useGetAllBoardsQuery({ index: i })); // Adjusted dispatch
            }}
            className={`${
              board.isActive
                ? "bg-[#635fc7] text-white hover:bg-[#635fc7] hover:text-white"
                : "hover:bg-[#635fc71a] dark:text-white text-gray-700"
            } group w-full p-3 flex items-center space-x-3 font-bold text-[15px] tracking-wide`}
          >
            <img src={boardIcon} alt="Board Icon" className="ml-4" />
            <p className="group-hover:text-white">{board.name}</p>
          </button>
        ))}
        <button
          onClick={() => {
            setIsBoardModalOpen(true);
            setOpenDropdown(false);
          }}
          className="text-[#635fc7] w-full hover:bg-[#635fc71a] dark:text-white p-3 flex items-center space-x-3 font-bold text-[15px] tracking-wide"
        >
          <img src={boardIcon} alt="Board Icon" className="ml-4" />
          <p className="text-[#635fc7] group-hover:text-[#635fc7]">+ Create New Board</p>
        </button>

        {/* Dark/Light Mode Toggle */}
        <div className="bg-[#e4ebfa] mx-auto mt-6 rounded-md dark:bg-[#20212c] flex items-center justify-center space-x-4 w-[80%] py-2">
          <img src={lightIcon} alt="Light Icon" className="h-4" />
          <label className="switch">
            <input
              type="checkbox"
              checked={darkSide}
              onChange={(e) => toggleDarkMode(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
          <img src={darkIcon} alt="Dark Icon" className="h-4" />
        </div>
      </div>
    </div>
  );
}

export default HeaderDropDown;
