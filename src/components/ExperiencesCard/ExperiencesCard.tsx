import { FC, MouseEventHandler } from "react";
import GallerySlider from "components/GallerySlider/GallerySlider";
import { DEMO_EXPERIENCES_LISTINGS } from "data/listings";
import { ExperiencesDataType } from "data/types";
import StartRating from "components/StartRating/StartRating";
import { Link } from "react-router-dom";
import SaleOffBadge from "components/SaleOffBadge/SaleOffBadge";
import Badge from "shared/Badge/Badge";

export interface ExperiencesCardProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  ratioClass?: string;
  data?: ExperiencesDataType;
  size?: "default" | "small";
  editing?: boolean;
}

// const data: ExperiencesDataType = fetch("http://localhost:5001/experience")
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// const data = fetch(`http://swapi.co/api/people/1/`)
//   .then((res) => res.json())
//   .then((res: ExperiencesDataType) => {
//     // res is now an Actor
//   });

// const data: Promise<any> =  function {
//   return fetch("http://localhost:5001/experience")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(response.statusText);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       /* <-- data inferred as { data: T }*/
//       return Promise.resolve(data);
//     });
// }

// console.log(data);

const DEMO_DATA: ExperiencesDataType = DEMO_EXPERIENCES_LISTINGS[0];
// const DEMO_DATA: ExperiencesDataType = data;

const ExperiencesCard: FC<ExperiencesCardProps> = ({
  size = "default",
  className = "",
  data = DEMO_DATA,
  ratioClass = "aspect-w-3 aspect-h-3",
  editing,
  onClick
}) => {
  const {
    galleryImgs,
    address,
    title,
    saleOff,
    isAds,
    price,
    featuredImage,
    starRating,
    ratingCount,
  } = data;

  console.log(data);

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full rounded-2xl overflow-hidden">
        <GallerySlider
          uniqueID={`ExperiencesCard_${data._id}`}
          ratioClass={ratioClass}
          galleryImgs={[featuredImage, ...galleryImgs ]}
        />
        {/* <BtnLikeIcon isLiked={like} className="absolute right-3 top-3" /> */}
        {saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "py-4 space-y-4" : "py-3 space-y-2"}>
        <div className="space-y-2">
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-2">
            {size === "default" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
            <span className="">{address}</span>
          </div>

          <div className="flex items-center space-x-2">
            {isAds && <Badge name="ADS" color="green" />}
            <h2
              className={` font-medium capitalize ${
                size === "default" ? "text-base" : "text-base"
              }`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>
        </div>
        <div className="border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">
            ${price}
            {` `}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                /experience
              </span>
            )}
          </span>
          <StartRating reviewCount={ratingCount} point={starRating} />
        </div>
      </div>
    );
  };
  return (
    <div
      className={`nc-ExperiencesCard group relative cursor-pointer ${className}`}
      data-nc-id="ExperiencesCard"
      onClick={onClick}
    >
      {editing ? <>{renderSliderGallery()}
        {renderContent()}</> : <>
        {renderSliderGallery()}
        {renderContent()}
        </>
      }
    </div>
  );
};

export default ExperiencesCard;
