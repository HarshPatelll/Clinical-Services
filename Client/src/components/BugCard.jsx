import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import clsx from "clsx";
import { BGS, PRIOTITYSTYELS, BUG_TYPE, formatDate } from "../utils";
import BugDialog from "./bug/BugDialog";
import UserInfo from "./UserInfo";
import AddSubBug from "./bug/AddSubBug";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const BugCard = ({ bug, refetch }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleUpdateBug = async () => {
    // This function will be triggered when a bug is updated.
    await refetch(); // Refetch the bugs or trigger a state update
  };

  return (
    <>
      <div className="w-full h-fit bg-white shadow-md p-4 rounded">
        <div className="w-full flex justify-between">
          <div className={clsx("flex flex-1 gap-1 items-center text-sm font-medium", PRIOTITYSTYELS[bug?.priority])}>
            <span className="text-lg">{ICONS[bug?.priority]}</span>
            <span className="uppercase">{bug?.priority} Priority</span>
          </div>
          <BugDialog bug={bug} onUpdate={handleUpdateBug} refetch={refetch} /> {/* Pass the onUpdate handler */}
        </div>

        <div className="flex items-center gap-2">
          <div className={clsx("w-4 h-4 rounded-full", BUG_TYPE[bug.stage])} />
          <h4 className="line-clamp-1 text-black">{bug?.title}</h4>
        </div>
        <span className="text-sm text-gray-600">{formatDate(new Date(bug?.date))}</span>

        <div className="w-full border-t border-gray-200 my-2" />
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <BiMessageAltDetail />
              <span>{bug?.activities?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <MdAttachFile />
              <span>{bug?.assets?.length}</span>
            </div>
            <div className="flex gap-1 items-center text-sm text-gray-600">
              <FaList />
              <span>0/{bug?.subBugs?.length}</span>
            </div>
          </div>

          <div className="flex flex-row-reverse">
            {bug?.team?.map((m, index) => (
              <div key={index} className={clsx("w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1", BGS[index % BGS?.length])}>
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {bug?.subBugs?.length > 0 ? (
          <div className="py-4 border-t border-gray-200">
            <h5 className="text-base line-clamp-1 text-black">{bug?.subBugs[0].title}</h5>
            <div className="p-4 space-x-8">
              <span className="text-sm text-gray-600">{formatDate(new Date(bug?.subBugs[0]?.date))}</span>
              <span className="bg-blue-600/10 px-3 py-1 rounded0full text-blue-700 font-medium">{bug?.subBugs[0].tag}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 border-t border-gray-200"></div>
        )}

        <AddSubBug open={open} setOpen={setOpen} id={bug._id} />
      </div>
    </>
  );
};

export default BugCard;
