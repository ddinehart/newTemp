import React, { FC, useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/outline";
import CommentListing from "components/CommentListing/CommentListing";
import FiveStartIconForRate from "components/FiveStartIconForRate/FiveStartIconForRate";
import GuestsInput from "components/HeroSearchForm/GuestsInput";
import StartRating from "components/StartRating/StartRating";
import useWindowSize from "hooks/useWindowResize";
import moment from "moment";
import { DayPickerSingleDateController } from "react-dates";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonCircle from "shared/Button/ButtonCircle";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import Input from "shared/Input/Input";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "./LikeSaveBtns";
import ModalPhotos from "./ModalPhotos";
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';

import ExperiencesDateSingleInput from "components/HeroSearchForm/ExperiencesDateSingleInput";
import { LocationType, ExperiencesDataType, RatingDataType } from "data/types";
import { Link, useHistory } from "react-router-dom";

export interface ListingExperiencesDetailPageProps {
  className?: string;
  location?: LocationType;
}


const PHOTOS: string[] = [
  "https://www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg",
  "https://www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg",
  "https://www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg",

  "https://www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg",
];

const includes_demo = [
  { name: "Set Menu Lunch on boat" },
  { name: "Express Bus From Hanoi To Halong and Return" },
  { name: "Mineral Water On Express Bus" },
  { name: "Kayak or Bamboo Boat. Life Jacket." },
  { name: "Halong Bay Entrance Ticket" },
];

const ListingExperiencesDetailPage: FC<ListingExperiencesDetailPageProps> = ({
  className = "",
  location
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ExperiencesDataType>(null);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const windowSize = useWindowSize();

  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [thoughts, setThoughts] = useState("");
  const [ratingEnabled, setRatingEnabled] = useState(true);
  const [ratings, setRatings] = useState<RatingDataType[]>([]);
  const [maxQuantity, setMaxQuantity] = useState(data?.experienceNumber);

  const [experienceNumber, setExperienceNumber] = useState(1);

    useEffect(() => {
      axios.get('/api/experience/' + location.state._id).then((res) => {
        console.log(res.data);
        setData(res.data);
        setMaxQuantity(res.data.experienceNumber);
        setRatings(res.data.ratings.reverse());
      });
    }, [])


  const getDaySize = () => {
    if (windowSize.width <= 375) {
      return 34;
    }
    if (windowSize.width <= 500) {
      return undefined;
    }
    if (windowSize.width <= 1280) {
      return 56;
    }
    return 48;
  };

  const checkAvailability = (time: string) => {
    let date = moment(time);
    let maxHours = data.experienceNumber;
    for (let i = 0; i < data.maxTimeLength; i++) {
      console.log(data.quantities[date.format('lll')]);
      if (data.quantities[date.format('lll')] < maxHours) maxHours = data.quantities[date.format('lll')];
      console.log("Max Hours:", maxHours);
      date.add(1, 'hours');
    }
    return maxHours;
  };

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const submitRating = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ratingEnabled) {
      setRatingEnabled(false);
      const newRating = {rating, name, thoughts, date:moment().format('ll')};
      axios.post('/api/review/' + data._id + "/" + data.ratingCount + "/" + data.starRating, newRating)
      .then((res) => {
        setRatings([newRating, ...ratings]);
      });
    }
  };

  const handleSave = () => {
    console.log("saving");
  };

  const handleCloseModal = () => setIsOpen(false);

  const createBooking = async () => {
    const {title, featuredImage, address, price, userId} = data;
    console.log(experienceNumber);
    let newQuantities = data.quantities
    let date = moment(selectedDate.format('ll') + " " + selectedTime);
    for (let i = 0; i < data.maxTimeLength; i++) {
      if (newQuantities[date.format('lll')]) newQuantities[date.format('lll')] -= experienceNumber;
      else newQuantities[date.format('lll')] = data.experienceNumber - experienceNumber;
      date.add(1, 'hours');
    }
    if (selectedDate && selectedTime) {
      let fullBooking = {title, featuredImage, address, date: selectedDate.format('ll') + " " + selectedTime, price, userId, newQuantities, experienceId: data._id, quantity: experienceNumber};

      let thisURL = await axios.post('/api/create-checkout-session', {...fullBooking, newQuantities});
      console.log(thisURL);
      if (thisURL.data.url !== "/") window.location.replace(thisURL.data.url);

    } else {
      toast.error('Select a date and time');
    }
  }

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
        <div className="flex justify-between items-center">
          <Badge color="pink" name="Specific Tour" />
          <LikeSaveBtns />
        </div>

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          {data?.title}
        </h2>

        {/* 3 */}
        <div className="flex items-center space-x-4">
          <StartRating />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> {data?.address}</span>
          </span>
        </div>

        {/* 4 */}
        <div className="flex items-center">
          {/* <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" /> */}
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Hosted by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              {data?.firstName} {data?.lastName}
            </span>
          </span>
        </div>

        {/* 5 */}
        <div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

        {/* 6 */}
        <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-clock text-2xl"></i>
            <span className="">{data?.maxTimeLength} {data?.maxTimeLength == 1 ? "hour" : "hours"}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-user-friends text-2xl"></i>
            <span className="">Up to {data?.maxGuests} people</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-language text-2xl"></i>
            <span className="">English, VietNames</span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Experience description</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div className="text-neutral-6000 dark:text-neutral-300">
          <p>
            {data?.description}
          </p>
        </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">Include </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Included in the price
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* 6 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {includes_demo
            .filter((_, i) => i < 12)
            .map((item) => (
              <div key={item.name} className="flex items-center space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span>{item.name}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderSectionCheckIndate = () => {
    let hours = [];
    return (
      <div className="listingSection__wrap overflow-hidden">
        {/* HEADING */}
        <div>
          <h2 className="text-2xl font-semibold">Availability</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Prices may increase on weekends or holidays
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* CONTENT */}

        <div className="listingSection__wrap__DayPickerRangeController flow-root">
          <div className="-mx-4 sm:mx-auto xl:mx-[-22px]">
            <DayPickerSingleDateController
              date={selectedDate}
              onDateChange={(date) => {setSelectedDate(date); setSelectedTime('')}}
              onFocusChange={() => {}}
              focused
              // (availableRepeat[day.day()] != null || day.isSame(selectedDate, "day") || (day.format("ll") in availableSpecificDays))}
              isOutsideRange={(day) => day.diff(moment().subtract(1, 'day')) < 0 || (data?.availableRepeat[day.day()] === null && !(day.format("ll") in data?.availableSpecificDays))}
              initialVisibleMonth={null}
              numberOfMonths={windowSize.width < 1280 ? 1 : 2}
              daySize={getDaySize()}
              hideKeyboardShortcutsPanel
            />
            <div className="pickAvailability">
            {selectedTime && <h2 className="text-2xl font-semibold selectedTime">{selectedTime} - {moment(selectedDate.format('ll') + " " + selectedTime).add(data?.maxTimeLength, "hours").format("LT")}</h2>}
            
            {selectedDate !== null && 
            <div className= "pickTime">
              {(data?.availableSpecificDays[selectedDate.format('ll')] ? data?.availableSpecificDays[selectedDate.format('ll')] : data?.availableRepeat[selectedDate.day()]).filter((time) => {
                let formattedDate = selectedDate.format('ll') + " " + time;
                let maxHours = checkAvailability(formattedDate);
                if (maxHours > 0) hours.push(maxHours);
                return maxHours;
                }).map((time, i) => <div className="times-available"><button onClick={() => {setSelectedTime(time); setMaxQuantity(hours[i]); if (experienceNumber > hours[i]) setExperienceNumber(hours[i])}} className={`hour ${selectedTime === time ? 'hourHovered' : ''}`}>{time}</button><span className="available">({hours[i]} available)</span></div>)}
            </div>
            }
          </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* host */}
        <div className="flex items-center space-x-4">
          <Avatar
            hasChecked
            hasCheckedClass="w-4 h-4 -top-0.5 right-0.5"
            sizeClass="h-14 w-14"
            radius="rounded-full"
          />
          <div>
            <a className="block text-xl font-medium" href="##">
              Kevin Francis
            </a>
            <div className="mt-1.5 flex items-center text-sm text-neutral-500 dark:text-neutral-400">
              <StartRating />
              <span className="mx-2">·</span>
              <span> 12 places</span>
            </div>
          </div>
        </div>

        {/* desc */}
        <span className="block text-neutral-6000 dark:text-neutral-300">
          Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides
          accommodation, an outdoor swimming pool, a bar, a shared lounge, a
          garden and barbecue facilities...
        </span>

        {/* info */}
        <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Joined in March 2016</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span>Response rate - 100%</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span>Fast response - within a few hours</span>
          </div>
        </div>

        {/* == */}
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href="##">See host profile</ButtonSecondary>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Reviews ({ratings.length} {ratings.length !== 1 ? "reviews" : "review"})</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {/* Content */}
        <form onSubmit={(e) => submitRating(e)} className="space-y-5">
          <FiveStartIconForRate setRating={setRating} iconClass="w-6 h-6" className="space-x-0.5" />
          <Input
              
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Name ..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          <div className="relative">
            <Input
              required
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your thoughts ..."
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </form>

        {/* comment */}
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {ratings.map((rating) => (
            <CommentListing data={rating} className="py-8" />
          ))}
          {/* <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" /> */}
          {ratings.length === 20 && <div className="pt-8">
            <ButtonSecondary>View 20 more reviews</ButtonSecondary>
          </div>}
        </div>
      </div>
    );
  };

  // const renderSection7 = () => {
  //   return (
  //     <div className="listingSection__wrap">
  //       {/* HEADING */}
  //       <div>
  //         <h2 className="text-2xl font-semibold">Location</h2>
  //         <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
  //           San Diego, CA, United States of America (SAN-San Diego Intl.)
  //         </span>
  //       </div>
  //       <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

  //       {/* MAP */}
  //       <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
  //         <div className="rounded-xl overflow-hidden">
  //           <GoogleMapReact
  //             bootstrapURLKeys={{
  //               key: "AIzaSyDxJaU8bLdx7sSJ8fcRdhYS1pLk8Jdvnx0",
  //             }}
  //             defaultZoom={15}
  //             yesIWantToUseGoogleMapApiInternals
  //             defaultCenter={{
  //               lat: 55.9607277,
  //               lng: 36.2172614,
  //             }}
  //           >
  //             <LocationMarker lat={55.9607277} lng={36.2172614} />
  //           </GoogleMapReact>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Things to know</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

        {/* CONTENT */}
        {data?.cancellation && <> <div>
          <h4 className="text-lg font-semibold">Cancellation policy</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Any experience can be canceled and fully refunded within 24 hours of
            purchase, or at least 7 days before the experience starts.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
        </>
        }
        {/* CONTENT */}
        {data?.requirements && <>
        <div>
          <h4 className="text-lg font-semibold">Guest requirements</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Up to 10 guests ages 4 and up can attend. Parents may also bring
            children under 2 years of age.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />
        </>}
        {/* CONTENT */}
        {data?.toBring && <>
        <div>
          <h4 className="text-lg font-semibold">What to bring</h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              <li>
                Formal Wear To Visit Bai Dinh Pagoda Be ready before 7.30 Am.
              </li>
              <li>We will pick up from 07.30 to 08.00 AM</li>
            </ul>
          </div>
        </div>
        </>
        }
      </div>
    );
  };
  console.log(maxQuantity);
  const renderSidebar = () => {
    let hours = [];
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            ${data?.price}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /experience
            </span>
          </span>
          <StartRating reviewCount={data?.ratingCount} point={data?.starRating} />
        </div>

        {/* FORM */}
        <form className="flex flex-col sm:flex-row border divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-700 border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <div className="flex-1">
            <ExperiencesDateSingleInput
              defaultValue={selectedDate}
              isOutsideRange={(day) => day.diff(moment().subtract(1, 'day')) < 0 || (data?.availableRepeat[day.day()] === null && !(day.format("ll") in data?.availableSpecificDays))}
              onChange={(date) => {setSelectedDate(date); setSelectedTime('')}}
              anchorDirection={windowSize.width > 1400 ? "left" : "right"}
              fieldClassName="p-5"
              className="h-full"
            />
          </div>
          <div className="flex-1">
            
            <GuestsInput
              fieldClassName="p-5"
              experienceNumber={experienceNumber}
              onChange={(value) => {setExperienceNumber(value); console.log("working")}}
              maxQuantity={maxQuantity}
              defaultValue={{
                guestAdults: 1,
                guestChildren: 2,
                guestInfants: 0,
              }}
            />
          </div>
        </form>
        <div className="pickAvailability">
            {selectedTime && <p className="text-md font-semibold selectedTime less-margin">{selectedTime} - {moment(selectedDate.format('ll') + " " + selectedTime).add(data?.maxTimeLength, "hours").format("LT")}</p>}
            
            {selectedDate !== null && 
            <div className= "pickTime">
              {(data?.availableSpecificDays[selectedDate.format('ll')] ? data?.availableSpecificDays[selectedDate.format('ll')] : data?.availableRepeat[selectedDate.day()]).filter((time) => {
                let formattedDate = selectedDate.format('ll') + " " + time;
                let maxHours = checkAvailability(formattedDate);
                if (maxHours > 0) hours.push(maxHours);
                return maxHours;
                }).map((time, i) => <div className="times-available"><button onClick={() => {setSelectedTime(time); setMaxQuantity(hours[i]); if (experienceNumber > hours[i]) setExperienceNumber(hours[i])}} className={`hour ${selectedTime === time ? 'hourHovered' : ''}`}>{time}</button><span className="available">({hours[i]} available)</span></div>)}
            </div>
            }
          </div>
        {/* SUM */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>${data?.price} x {experienceNumber} experience</span>
            <span>${data?.price * experienceNumber}</span>
          </div>
          {/* <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Service charge</span>
            <span>$0</span>
          </div> */}
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${data?.price * experienceNumber}</span>
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary onClick={createBooking}>Reserve</ButtonPrimary>
      </div>
    );
  };

  return (
    <div
      className={`nc-ListingExperiencesDetailPage  ${className}`}
      data-nc-id="ListingExperiencesDetailPage"
    >
      <div><Toaster/></div>
      {/* SINGLE HEADER */}
      <>
        <header className="container 2xl:px-14 rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-3 row-span-3 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              <NcImage
                containerClassName="absolute inset-0"
                className="object-cover w-full h-full rounded-md sm:rounded-xl"
                src={data?.featuredImage}
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {PHOTOS.filter((_, i) => i >= 1 && i < 4).map((item, index) => (
              <div
                key={index}
                className={`relative rounded-md sm:rounded-xl overflow-hidden ${
                  index >= 2 ? "block" : ""
                }`}
              >
                <NcImage
                  containerClassName="aspect-w-4 aspect-h-3"
                  className="object-cover w-full h-full rounded-md sm:rounded-xl "
                  src={data?.galleryImgs[index] || ""}
                />

                {/* OVERLAY */}
                <div
                  className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleOpenModal(index + 1)}
                />
              </div>
            ))}

            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={() => handleOpenModal(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Show all photos
              </span>
            </div>
          </div>
        </header>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={[data?.featuredImage, ...data?.galleryImgs ?? [] ]}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName="nc-ListingExperiencesDetailPage__modalPhotos"
        />
      </>

      {/* MAIn */}
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:pr-10 lg:space-y-10">
          {renderSection1()}
          {renderSection2()}
          {/* {renderSection3()} */}
          {renderSectionCheckIndate()}
          {/* {renderSection5()} */}
          {renderSection6()}
          {/* {renderSection7()} */}
          {(data?.cancellation || data?.toBring || data?.requirements) && renderSection8()}
        </div>

        {/* SIDEBAR */}
        <div className="block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-24">{renderSidebar()}</div>
        </div>
      </main>

      {/* STICKY FOOTER MOBILE */}
      <div className="block lg:hidden fixed bottom-0 inset-x-0 py-4 bg-white text-neutral-900 border-t border-neutral-200 z-20">
        <div className="container flex items-center justify-between">
          <span className="text-2xl font-semibold">
            ${data?.price}
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /experience
            </span>
          </span>

          <ButtonPrimary onClick={createBooking}>Reserve</ButtonPrimary>
        </div>
      </div>

      {/* OTHER SECTION */}
      <div className="container py-24 lg:py-32">
        {/* SECTION 1 */}
        {/* <div className="relative py-16"> */}
        {/* <BackgroundSection /> */}
        {/* <SectionSliderNewCategories
            heading="Explore by types of stays"
            subHeading="Explore houses based on 10 types of stays"
            categoryCardType="card5"
            itemPerRow={5}
            sliderStyle="style2"
            uniqueClassName="ListingExperiencesDetailPage"
          />
        </div> */}

        {/* SECTION */}
        {/* <SectionSubscribe2 className="pt-24 lg:pt-32" /> */}
      </div>
    </div>
  );
};

export default ListingExperiencesDetailPage;
