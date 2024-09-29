import React from "react";
import BugCard from "./BugCard";

const BugBoardView = ({ bugs, refetch }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {bugs?.map((bug, index) => (
        <BugCard bug={bug} key={index} refetch={refetch} />
      ))}
    </div>
  );
};

export default BugBoardView;