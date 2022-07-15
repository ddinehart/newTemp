import React, { FC } from "react";
import TabFilters from "./TabFilters";
import Heading2 from "components/Heading/Heading2";
import ButtonPrimary from "shared/Button/ButtonPrimary";

export interface SectionGridFilterCardProps {
  className?: string;
}



const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
      <Heading2
        heading="Singapore - Tokyo"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            22 flights
            <span className="mx-2">·</span>
            round trip
            <span className="mx-2">·</span>2 Guests
          </span>
        }
      />
      <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div>
     
    </div>
  );
};

export default SectionGridFilterCard;
