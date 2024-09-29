import React, { useEffect, useState } from "react";
import AddEditBoardModal from "./Modals/AddEditBoard";
import Column from "./Column";
import EmptyBoard from "./EmptyBoard";

function Home({ setIsBoardModalOpen, isBoardModalOpen, project }) {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const columns = project.columns;
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <>
      <div className="bg-[f3f4f6] scrollbar-hide h-screen flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between py-2 mb-2">
          
          <button
            onClick={() => setIsBoardModalOpen(true)}
            className="bg-[#cfdffd] text-[#635FC7] font-bold py-2 px-10  rounded-lg hover:bg-[#635FC7] hover:text-white transition duration-300"
          >
            + New Column
          </button>
        </div>

        {/* Columns Section */}
        <div className="flex overflow-x-scroll gap-6">
          {columns.length > 0 ? (
            columns.map((col, index) => (
              <Column key={index} colIndex={index} project={project} />
            ))
          ) : (
            <EmptyBoard type="edit" />
          )}
        </div>

        {isBoardModalOpen && (
          <AddEditBoardModal
            type="edit"
            setIsBoardModalOpen={setIsBoardModalOpen}
            project={project}
          />
        )}
      </div>
    </>
  );
}

export default Home;
