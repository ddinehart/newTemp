import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import SectionHeroArchivePage from "components/SectionHeroArchivePage/SectionHeroArchivePage";
import { FC } from "react";
import SectionGridFilterCard from "./SectionGridFilterCard";
import { Helmet } from "react-helmet";

export interface ListingExperiencesPageProps {
  className?: string;
}


const ListingExperiencesPage: FC<ListingExperiencesPageProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`nc-ListingExperiencesPage relative overflow-hidden ${className}`}
      data-nc-id="ListingExperiencesPage"
    >
      <Helmet>
        <title>ZVExperiences</title>
      </Helmet>
      <BgGlassmorphism />

      <div className="container relative">
        {/* SECTION HERO */}
        <SectionHeroArchivePage
          currentPage="Experiences"
          currentTab="Experiences"
          listingType={
            <>
              <i className="text-2xl las la-umbrella-beach"></i>
              <span className="ml-2.5">1599 experiences</span>
            </>
          }
          className="pt-10 pb-24 lg:pb-32 lg:pt-16 "
        />

        {/* SECTION */}
        <SectionGridFilterCard className="pb-24 lg:pb-32" />

        {/* SECTION 1 */}
        {/* <div className="relative py-16">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore top experiences ✈"
            // subHeading="Explore thousands of experiencess around the world"
            categoryCardType="card4"
            itemPerRow={4}
            categories={DEMO_CATS}
            sliderStyle="style2"
            uniqueClassName="ListingExperiencesPage"
          />
        </div> */}

        {/* SECTION */}
        {/* <SectionSubscribe2 className="py-24 lg:py-32" /> */}
      </div>
    </div>
  );
};

export default ListingExperiencesPage;
