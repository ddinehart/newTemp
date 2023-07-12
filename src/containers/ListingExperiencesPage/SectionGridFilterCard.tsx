import { FC } from "react";
import { StayDataType } from "data/types";
import Pagination from "shared/Pagination/Pagination";
import Heading2 from "components/Heading/Heading2";
import ExperiencesCard from "components/ExperiencesCard/ExperiencesCard";
import { useHistory } from "react-router-dom";

export interface SectionGridFilterCardProps {
  className?: string;
  data?: StayDataType[];
}


const SectionGridFilterCard: FC<SectionGridFilterCardProps> = ({
  className = "",
  data
}) => {

  const history = useHistory();
  return (
    <div
      className={`nc-SectionGridFilterCard ${className}`}
      data-nc-id="SectionGridFilterCard"
    >
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

      {/* <div className="mb-8 lg:mb-11">
        <TabFilters />
      </div> */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data.map((stay) => (
          <ExperiencesCard onClick={() => history.push({pathname: '/listing-experiences-detail', state:{...stay, editing:false}})} key={stay._id} data={stay} />
        ))}
      </div>
      <div className="flex mt-16 justify-center items-center">
        <Pagination />
      </div>
    </div>
  );
};

export default SectionGridFilterCard;
