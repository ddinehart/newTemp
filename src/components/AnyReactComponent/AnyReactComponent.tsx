import { Transition } from "@headlessui/react";
import ExperiencesCard from "components/ExperiencesCard/ExperiencesCard";
import { ExperiencesDataType } from "data/types";
import React, { FC, Fragment } from "react";
import { useState } from "react";

export interface AnyReactComponentProps {
  className?: string;
  experiences?: ExperiencesDataType;
  isSelected?: boolean;
  lat: number;
  lng: number;
}

const AnyReactComponent: FC<AnyReactComponentProps> = ({
  className = "",
  experiences,
  isSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`nc-AnyReactComponent relative  ${className}`}
      data-nc-id="AnyReactComponent"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span
        className={`flex px-2 py-1 rounded-lg bg-white dark:bg-neutral-900 text-sm font-semibold items-center justify-center min-w-max shadow-lg hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-colors ${
          isSelected
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
            : ""
        }`}
      >
        { experiences?.price }
      </span>
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="absolute z-50 bottom-full pb-3 -left-12 w-[260px] aspect-w-1">
          {experiences && (
            <ExperiencesCard
              size="small"
              data={experiences}
              className="shadow-2xl bg-white dark:bg-neutral-900 pt-3 px-3 rounded-3xl"
            />
          )}
        </div>
      </Transition>
    </div>
  );
};

export default AnyReactComponent;
