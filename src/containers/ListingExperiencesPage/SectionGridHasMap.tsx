import React, { FC, useState } from "react";
import AnyReactComponent from "components/AnyReactComponent/AnyReactComponent";
import GoogleMapReact from "google-map-react";
import { DEMO_EXPERIENCES_LISTINGS } from "data/listings";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Checkbox from "shared/Checkbox/Checkbox";
import Pagination from "shared/Pagination/Pagination";
import TabFilters from "./TabFilters";
import Heading2 from "components/Heading/Heading2";
import ExperiencesCardH from "components/ExperiencesCardH/ExperiencesCardH";
import { ExperiencesDataType } from "data/types";

// const DEMO_EXPERIENCES = DEMO_EXPERIENCES_LISTINGS.filter((_, i) => i < 12);
const await data = fetch("http://localhost:5001/experience")
  .then((response) => response.json())
  .then((data) => console.log(data));

export interface SectionGridHasMapProps {}

const SectionGridHasMap: FC<SectionGridHasMapProps> = () => {
  const [currentHoverID, setCurrentHoverID] = useState<string | number>(-1);
  const [showFullMapFixed, setShowFullMapFixed] = useState(false);

  return (
    <div>
      <div className="relative flex min-h-screen">
        {/* CARDSSSS */}
        <div className="min-h-screen w-full xl:w-[780px] 2xl:w-[880px] flex-shrink-0 xl:px-8 ">
          <Heading2
            heading="Experiences in St. George"
            subHeading={
              <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
                233 experiences
                <span className="mx-2">·</span>
                Aug 12 - 18
                <span className="mx-2">·</span>2 Guests
              </span>
            }
          />
          <div className="mb-8 lg:mb-11">
            <TabFilters />
          </div>
          <div className="grid grid-cols-1 gap-8">
            {\ data && 
            {data.map((item: ExperiencesDataType | undefined) => (
              <div
                key={item.id}
                onMouseEnter={() => setCurrentHoverID((_) => item.id)}
                onMouseLeave={() => setCurrentHoverID((_) => -1)}
              >
                <ExperiencesCardH data={item} />
              </div>
            ))}c
            }
          </div>
          <div className="flex mt-16 justify-center items-center">
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionGridHasMap;
