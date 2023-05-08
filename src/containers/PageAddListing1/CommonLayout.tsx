import React from "react";
import { FC, useEffect, useState} from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import ExperiencesCard from "components/ExperiencesCard/ExperiencesCard";
import Pagination from "shared/Pagination/Pagination";
import Heading2 from "components/Heading/Heading2";
import { Link } from "react-router-dom";
import { LocationType } from "data/types";

export interface CommonLayoutProps {
  index: string;
  nextHref: string;
  backtHref: string;
  nextBtnText?: string;
  location?: LocationType;
}

const CommonLayout: FC<CommonLayoutProps> = ({
  children,
  nextHref,
  nextBtnText,
  backtHref,
  location
}) => {

  const [data, setData] = useState([]);
  console.log(location);
    useEffect(() => {
      if (location.state) {
      fetch('/api/experiences/' + location.state.id)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));
      }
    }, [])

  return (
    <div
      className={`nc-PageAddListing1 px-4 max-w-3xl mx-auto pb-24 pt-14 sm:py-24 lg:pb-32`}
      data-nc-id="PageAddListing1"
    >
      <div className="space-y-11">
      <Heading2
        heading="My Experiences"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            {data.length} {data.length === 1 ? "experience" : "experiences"}
          </span>
        }
      />
      <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <div className="edit add-new" onClick={() => console.log("EDITING")}>
          <Link to={{pathname: '/listing-experiences-detail-edit', state: {id:location.state.id}}}>
          <ButtonPrimary>
              +
          </ButtonPrimary>
          </Link>
          </div>
        {data.map((stay) => (
          <div className="edit" onClick={() => console.log("EDITING")}>
            <ExperiencesCard key={stay.id} editing={true} data={stay} />
          </div>
        ))}
      </div>
      <Heading2
        heading="My Bookings"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            {data.length} {data.length === 1 ? "booking" : "bookings"}
          </span>
        }
      />
      {/* <div className="flex mt-16 justify-center items-center">
        <Pagination />
      </div> */}
        {/* <div>
          <span className="text-4xl font-semibold">{index}</span>{" "}
          <span className="text-lg text-neutral-500 dark:text-neutral-400">
            / 10
          </span>
        </div> */}

        {/* --------------------- */}
        {/* <div className="listingSection__wrap ">{children}</div> */}

        {/* --------------------- */}
        {/* <div className="flex justify-end space-x-5">
          <ButtonSecondary href={backtHref}>Go back</ButtonSecondary>
          <ButtonPrimary href={nextHref}>
            {nextBtnText || "Continue"}
          </ButtonPrimary>
        </div> */}
      </div>
    </div>
  );
};

export default CommonLayout;
