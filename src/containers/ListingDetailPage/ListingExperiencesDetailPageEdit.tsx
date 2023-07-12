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
import { useHistory } from 'react-router-dom';
import ModalPhotos from "./ModalPhotos";

import ExperiencesDateSingleInput from "components/HeroSearchForm/ExperiencesDateSingleInput";
import { LocationType, RatingDataType } from "data/types";
import FormItem from "containers/PageAddListing1/FormItem";
import Select from "shared/Select/Select";
import NcInputNumber from "components/NcInputNumber/NcInputNumber";
import Textarea from "shared/Textarea/Textarea";
import axios from 'axios';

export interface ListingExperiencesDetailPageEditProps {
  className?: string;
  location?: LocationType;
}

export interface ImageFile {
  file: File | null;
  image: string;
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

const ListingExperiencesDetailPageEdit: FC<ListingExperiencesDetailPageEditProps> = ({
  className = "",
  location
}) => {
  let history = useHistory();
  let times = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM','11:00 PM']
  const [addedTimes, setAddedTimes] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [title, setTitle] = useState("");

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [maxGuests, setMaxGuests] = useState(4);
  const [experienceNumber, setExperienceNumber] = useState(4);
  const [maxTimeLength, setMaxTimeLength] = useState(1);

  const [description, setDescription] = useState("");

  const [price, setPrice] = useState("");

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [photo1, setPhoto1] = useState<ImageFile>(null);
  const [photo2, setPhoto2] = useState<ImageFile>(null);
  const [photo3, setPhoto3] = useState<ImageFile>(null);
  const [photo4, setPhoto4] = useState<ImageFile>(null);

  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);

  const [availableRepeat, setAvailableRepeat] = useState([null, null, null, null, null, null, null]);
  const [availableSpecificDays, setAvailableSpecificDays] = useState({});

  const [ratings, setRatings] = useState<RatingDataType[]>([]);


  useEffect(() => {
    console.log(location.state._id);
    if (location.state.editing) {
      axios.get('/api/experience/' + location.state._id).then((res) => {
        let { title, street, city, state, postalCode, maxGuests, experienceNumber, maxTimeLength, description, price, featuredImage, galleryImgs, availableRepeat, availableSpecificDays} = res.data;
        setTitle(title);
        setStreet(street);
        setCity(city);
        setState(state);
        setPostalCode(postalCode);
        setMaxGuests(maxGuests);
        setExperienceNumber(experienceNumber);
        setMaxTimeLength(maxTimeLength);
        setDescription(description);
        setPrice(price);
        setAvailableRepeat(availableRepeat);
        setAvailableSpecificDays(availableSpecificDays);
        if (featuredImage) setPhoto1({file: null, image:featuredImage});
        if (galleryImgs){ 
          setPhoto2({file: null, image:galleryImgs[0]})
          setPhoto3({file: null, image:galleryImgs[1]})
          setPhoto4({file: null, image:galleryImgs[2]})
        }
        console.log(photo1, photo2, photo3, photo4);
      });
    }

    axios.get('/api/reviews/' + location.state._id).then((res) => {
      setRatings(res.data.reverse());
    });
  }, [])

  function addTime(time) {
    if (addedTimes.includes(time)) {
      setAddedTimes(addedTimes.filter((thisTime) => thisTime !== time))
    } else {
      setAddedTimes([...addedTimes, time]);
    }
  }

  function addAvailability() {
    if (selectedDate === null) {
      let newAvailibility = availableRepeat;
      for (const date in availableSpecificDays) {
        if (moment(date).day() === 1 && monday) delete availableSpecificDays[date];
        if (moment(date).day() === 2 && tuesday) delete availableSpecificDays[date];
        if (moment(date).day() === 3 && wednesday) delete availableSpecificDays[date];
        if (moment(date).day() === 4 && thursday) delete availableSpecificDays[date];
        if (moment(date).day() === 5 && friday) delete availableSpecificDays[date];
        if (moment(date).day() === 6 && saturday) delete availableSpecificDays[date];
        if (moment(date).day() === 0 && sunday) delete availableSpecificDays[date];
      }
      if (addedTimes.length > 0) {
        if (monday) newAvailibility = [newAvailibility[0], addedTimes, ...newAvailibility.slice(2)];
        if (tuesday) newAvailibility = [...newAvailibility.slice(0, 2), addedTimes, ...newAvailibility.slice(3)];
        if (wednesday) newAvailibility = [...newAvailibility.slice(0, 3), addedTimes, ...newAvailibility.slice(4)];
        if (thursday) newAvailibility = [...newAvailibility.slice(0, 4), addedTimes, ...newAvailibility.slice(5)];
        if (friday) newAvailibility = [...newAvailibility.slice(0, 5), addedTimes, ...newAvailibility.slice(6)];
        if (saturday) newAvailibility = [...newAvailibility.slice(0, 6), addedTimes];
        if (sunday) newAvailibility = [addedTimes, ...newAvailibility.slice(1)];
      } else {
        if (monday) newAvailibility = [newAvailibility[0], null, ...newAvailibility.slice(2)];
        if (tuesday) newAvailibility = [...newAvailibility.slice(0, 2), null, ...newAvailibility.slice(3)];
        if (wednesday) newAvailibility = [...newAvailibility.slice(0, 3), null, ...newAvailibility.slice(4)];
        if (thursday) newAvailibility = [...newAvailibility.slice(0, 4), null, ...newAvailibility.slice(5)];
        if (friday) newAvailibility = [...newAvailibility.slice(0, 5), null, ...newAvailibility.slice(6)];
        if (saturday) newAvailibility = [...newAvailibility.slice(0, 6), null];
        if (sunday) newAvailibility = [null, ...newAvailibility.slice(1)];
      }
      setAvailableRepeat(newAvailibility);
      setMonday(false);
      setTuesday(false);
      setWednesday(false);
      setThursday(false);
      setFriday(false);
      setSaturday(false);
      setSunday(false);
      setAddedTimes([]);
    } else {
      let newAvailibility = availableSpecificDays;
      if (addedTimes.length > 0) newAvailibility[selectedDate.format('ll')] = addedTimes;
      else delete newAvailibility[selectedDate.format('ll')];
      setAvailableSpecificDays(newAvailibility);
      setSelectedDate(null);
      setAddedTimes([]);
    }
  }


  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);

  useEffect(() => {
    if (selectedDate !== null) {
      if (availableSpecificDays[selectedDate.format('ll')]) setAddedTimes(availableSpecificDays[selectedDate.format('ll')]);
      else {
        if (availableRepeat[selectedDate.day()] !== null) setAddedTimes(availableRepeat[selectedDate.day()])
        else setAddedTimes([]);
      }
    }
  }, [selectedDate]);

  const [dates, setDates] = useState<moment.Moment[]>([]);

  function handleDateChange(date: moment.Moment) {
    const wasPreviouslyPicked = dates.some((d) => d.isSame(date));
    if (wasPreviouslyPicked) {
      setDates((previousDates) => previousDates.filter((d) => !d.isSame(date)));
    } else {
      setDates((previousDates) => [...previousDates, date]);
    }
  }
  const windowSize = useWindowSize();


  async function createNewExperience() {

    if (photo1?.image?.substring(0, 27) === "blob:http://localhost:3000/") {
      const formData = new FormData();
      formData.append('file', photo1.file);
      let data = await axios.post('/api/imageUpload', formData)
      photo1.image = data.data;
    } if (photo2?.image?.substring(0, 27) === "blob:http://localhost:3000/") {
      const formData = new FormData();
      formData.append('file', photo2.file);
      let data = await axios.post('/api/imageUpload', formData)
      photo2.image = data.data;
    } if (photo3?.image?.substring(0, 27) === "blob:http://localhost:3000/") {
      const formData = new FormData();
      formData.append('file', photo3.file);
      let data = await axios.post('/api/imageUpload', formData)
      photo3.image = data.data;
    } if (photo4?.image?.substring(0, 27) === "blob:http://localhost:3000/") {
      const formData = new FormData();
      formData.append('file', photo4.file);
      let data = await axios.post('/api/imageUpload', formData)
      photo4.image = data.data;
    }
    // } 
    if (!buttonDisabled) {
      let photos = [photo2?.image, photo3?.image, photo4?.image];
      setButtonDisabled(true);
      let address = city + ", " + state + " " + street + ", " + postalCode;
      axios.post("/api/experience", {title, address, city, state, street, postalCode, maxGuests, experienceNumber, maxTimeLength, description, price, userId: location.state._id, galleryImgs:photos, featuredImage:photo1?.image, availableRepeat: availableRepeat, availableSpecificDays: availableSpecificDays, quantities: {}, firstName:location.state.firstName, lastName:location.state.lastName, ratingCount:0, starRating:0, ratings:[]})
      .then((res) => {
        history.push({pathname: '/add-listing-1', state:location.state})
      })
    }

  }

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

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleSave = () => {
    console.log("saving");
  };

  const handleCloseModal = () => setIsOpen(false);

  const renderSection1 = () => {
    return (
      <div className="listingSection__wrap !space-y-6">
        {/* 1 */}
 

        {/* 2 */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          Experience Title
        </h2>
        <Input onChange={(e) => setTitle(e.target.value)} value={title} type="text"></Input>

        {/* 3 */}
        {/* <div className="flex items-center space-x-4">
          <StartRating />
          <span>·</span>
          <span>
            <i className="las la-map-marker-alt"></i>
            <span className="ml-1"> St. George, Utah</span>
          </span>
        </div> */}

        {/* 4 */}
        {/* <div className="flex items-center">
          <Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
          <span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
            Hosted by{" "}
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">
              Dylan Dinehart
            </span>
          </span>
        </div> */}

        {/* 5 */}
        {/* <div className="w-full border-b border-neutral-100 dark:border-neutral-700" /> */}

        {/* 6 */}
        {/* <div className="flex items-center justify-between xl:justify-start space-x-8 xl:space-x-12 text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-clock text-2xl"></i>
            <span className="">3.5 hours</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-user-friends text-2xl"></i>
            <span className="">Up to 8 people</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 text-center sm:text-left sm:space-x-3 ">
            <i className="las la-language text-2xl"></i>
            <span className="">English, VietNames</span>
          </div>
        </div> */}
      </div>
    );
  };

  const renderSection2 = () => {
    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">Pickup Location</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* <ButtonSecondary>
            <LocationMarkerIcon className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
            <span className="ml-3">Use current location</span>
          </ButtonSecondary> */}
          {/* ITEM */}
          {/* <FormItem label="Country/Region"> */}
            {/* <Select disabled>
              <option value="United States">United States</option>
              {/* <option value="Thailand">Thailand</option>
              <option value="France">France</option>
              <option value="Singapore">Singapore</option>
              <option value="Jappan">Jappan</option>
              <option value="Korea">Korea</option>
              <option value="...">...</option> */}
            {/* </Select> */} 
          {/* </FormItem> */}
          <FormItem label="Street">
            <Input placeholder="83 N 500 E Mary Street" onChange={(e) => setStreet(e.target.value)} value={street}/>
          </FormItem>
          {/* <FormItem label="Room number (optional)">
            <Input />
          </FormItem> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-5">
            <FormItem label="City">
              <Input onChange={(e) => setCity(e.target.value)} value={city}/>
            </FormItem>
            <FormItem label="State">
              <Input onChange={(e) => setState(e.target.value)} value={state} />
            </FormItem>
            <FormItem label="Postal code">
              <Input onChange={(e) => setPostalCode(e.target.value)} value={postalCode}/>
            </FormItem>
          </div>
      </div>
      </div>
    );
  };

  const renderSection3 = () => {
    return (
      <div className="listingSection__wrap">
        {/* <div>
          <h2 className="text-2xl font-semibold">Include </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Included in the price
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}
        {/* 6 */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-neutral-700 dark:text-neutral-300 ">
          {includes_demo
            .filter((_, i) => i < 12)
            .map((item) => (
              <div key={item.name} className="flex items-center space-x-3">
                <i className="las la-check-circle text-2xl"></i>
                <span>{item.name}</span>
              </div>
            ))}
        </div> */}
        <h2 className="text-2xl font-semibold">Size of your Experience</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          {/* <FormItem label="Acreage (m2)">
            <Select>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
            </Select>
          </FormItem> */}
          <NcInputNumber label="Max # of guests per experience" defaultValue={maxGuests} onChange={(e) => setMaxGuests(e)} min={1} />
          <NcInputNumber label="Number of Experiences per time slot" defaultValue={experienceNumber} onChange={(e) => setExperienceNumber(e)} min={1} />
          <NcInputNumber label="Minimum Length of experience in hours" defaultValue={maxTimeLength} onChange={(e) => setMaxTimeLength(e)} min={1}/>
          {/* <NcInputNumber label="Bedroom" defaultValue={4} />
          <NcInputNumber label="Beds" defaultValue={4} />
          <NcInputNumber label="Bathroom" defaultValue={2} />
          <NcInputNumber label="Kitchen" defaultValue={2} /> */}
        </div>
      </div>
    );
  };

  const renderSectionCheckIndate = () => {
    return (
      <div className="listingSection__wrap overflow-hidden">
        {/* HEADING */}
        {/* <div>
          <h2 className="text-2xl font-semibold">Availability</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Prices may increase on weekends or holidays
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}
        {/* CONTENT */}

        {/* <div className="listingSection__wrap__DayPickerRangeController flow-root">
          <div className="-mx-4 sm:mx-auto xl:mx-[-22px]">
            <DayPickerSingleDateController
              date={selectedDate}
              onDateChange={(date) => setSelectedDate(date)}
              onFocusChange={() => {}}
              focused
              initialVisibleMonth={null}
              numberOfMonths={windowSize.width < 1280 ? 1 : 2}
              daySize={getDaySize()}
              hideKeyboardShortcutsPanel
            />
          </div>
        </div> */}
        <div>
          <h2 className="text-2xl font-semibold">
            Your place description for client
          </h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Mention the best features of your experience, any special
            amenities like free breath mints or awesome parking, as well as things you like
            about the experience.
          </span>
        </div>

        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description of Experience" rows={14} />
      </div>
    );
  };

  const renderSection5 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        {/* <h2 className="text-2xl font-semibold">Host Information</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}

        {/* host */}
        {/* <div className="flex items-center space-x-4">
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
        </div> */}

        {/* desc */}
        {/* <span className="block text-neutral-6000 dark:text-neutral-300">
          Providing lake views, The Symphony 9 Tam Coc in Ninh Binh provides
          accommodation, an outdoor swimming pool, a bar, a shared lounge, a
          garden and barbecue facilities...
        </span> */}

        {/* info */}
        {/* <div className="block text-neutral-500 dark:text-neutral-400 space-y-2.5">
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
        </div> */}

        {/* == */}
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        <div>
          <ButtonSecondary href="##">See host profile</ButtonSecondary>
        </div> */}
         {/* <div> */}
          {/* <h2 className="text-2xl font-semibold">How long is your experience?</h2> */}
          {/* <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Shorter trips can mean more reservations, but you'll turn over your
            space more often.
          </span> */}
        {/* </div> */}
        {/* <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}
        {/* FORM */}
        {/* <div className="space-y-7"> */}
          {/* ITEM */}
          {/* <NcInputNumber label="Hours min" defaultValue={1} />
          <NcInputNumber label="Hours max" defaultValue={99} />
        </div> */}

        {/*  */}
        <div>
          <h2 className="text-2xl font-semibold">Set your availability</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            Editing your calendar is easy—just select a date to block or unblock
            it. You can always make changes after you publish. You are responsible for notifying guests if a date gets block after they have booked. 
          </span>
        </div>
        <div className="availabilityCreator">

          <div className="nc-SetYourAvailabilityData">
            <DayPickerSingleDateController
              onDateChange={(e) => e && selectedDate !== e ? setSelectedDate(e) : setSelectedDate(null)}
              focused={false}
              onFocusChange={console.log}
              date={null}
              isDayHighlighted={(day) => (availableRepeat[day.day()] != null || day.isSame(selectedDate, "day") || (day.format("ll") in availableSpecificDays))}
              isOutsideRange={(day) => day.diff(moment().subtract(1, 'day')) < 0}
              keepOpenOnDateSelect
              daySize={getDaySize()}
              initialVisibleMonth={null}
            />
          </div>
          <div className="pickAvailability">
            {selectedDate === null ? <div className="pickWeek">
              <button onClick={() => setMonday(!monday)} className={`weekday ${monday ? 'weekdayHovered' : ''}`}>M</button>
              <button onClick={() => setTuesday(!tuesday)} className={`weekday ${tuesday ? 'weekdayHovered' : ''}`}>Tu</button>
              <button onClick={() => setWednesday(!wednesday)} className={`weekday ${wednesday ? 'weekdayHovered' : ''}`}>W</button>
              <button onClick={() => setThursday(!thursday)} className={`weekday ${thursday ? 'weekdayHovered' : ''}`}>Th</button>
              <button onClick={() => setFriday(!friday)} className={`weekday ${friday ? 'weekdayHovered' : ''}`}>F</button>
              <button onClick={() => setSaturday(!saturday)} className={`weekday ${saturday ? 'weekdayHovered' : ''}`}>Sa</button>
              <button onClick={() => setSunday(!sunday)} className={`weekday ${sunday ? 'weekdayHovered' : ''}`}>Su</button>
            </div> : <h2 className="text-2xl font-semibold pickWeek">{selectedDate.format('ll')}</h2>}
            {(monday || tuesday || wednesday || thursday || friday || saturday || sunday || selectedDate !== null) && 
            <>
            <div className= "pickTime">
              {times.map((time) => <button onClick={() => addTime(time)} className={`hour ${addedTimes.includes(time) ? 'hourHovered' : ''}`}>{time}</button>)}
            </div>
            <ButtonPrimary onClick={addAvailability} className="add-availability-button">Add Availability</ButtonPrimary>
            </>
            }
          </div>
        </div>
      </div>
    );
  };

  const renderSection6 = () => {
    return (
      <div className="listingSection__wrap">
        
        {/* HEADING */}
        {/* <h2 className="text-2xl font-semibold">Reviews (23 reviews)</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div> */}

        {/* Content */}
        {/* <div className="space-y-5">
          <FiveStartIconForRate iconClass="w-6 h-6" className="space-x-0.5" />
          <div className="relative">
            <Input
              fontClass=""
              sizeClass="h-16 px-4 py-3"
              rounded="rounded-3xl"
              placeholder="Share your thoughts ..."
            />
            <ButtonCircle
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              size=" w-12 h-12 "
            >
              <ArrowRightIcon className="w-5 h-5" />
            </ButtonCircle>
          </div>
        </div> */}

        {/* comment */}
        {/* <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <CommentListing className="py-8" />
          <div className="pt-8">
            <ButtonSecondary>View more 20 reviews</ButtonSecondary>
          </div>
        </div> */}
        <div>
          <h2 className="text-2xl font-semibold">Pictures of the place</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            A few beautiful photos will help customers have more sympathy for
            your property.
          </span>
        </div>
        <header className="container 2xl:px-14 rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-3 row-span-3 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              <NcImage
                containerClassName="absolute inset-0"
                className="object-cover w-full h-full rounded-md sm:rounded-xl"
                src={photo1 ? photo1.image : null}
              />
              <label
                      htmlFor="file-upload-1"
                      className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 edit-upload"
                    >
                      {photo1 ? <></> : <span>Upload a file</span>}
                      <input
                        id="file-upload-1"
                        name="file-upload-1"
                        type="file"
                        onChange={(e) => {
                           setPhoto1({file:(e.target as HTMLInputElement).files[0], image:URL.createObjectURL((e.target as HTMLInputElement).files[0])});
                          }}
                        className="sr-only"
                      />
                    </label>
              
              
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
                  src={index === 0 ? photo2?.image : index === 1 ? photo3?.image : photo4?.image}
                />
                <label
                      htmlFor={"file-upload-" + index + 2}
                      className="relative cursor-pointer  rounded-md font-medium text-primary-6000 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 edit-upload-mini"
                    >
                      {photo1 ? <></> : <span>Upload a file</span>}
                      <input
                        id={"file-upload-" + index + 2}
                        name={"file-upload-" + index + 2}
                        type="file"
                        onChange={(e) => {
                            let file = {file:(e.target as HTMLInputElement).files[0], image:URL.createObjectURL((e.target as HTMLInputElement).files[0])};
                            if (index === 0) {
                              if (photo1?.image) setPhoto2(file);
                              else setPhoto1(file);
                            } else if (index === 1) {
                              if (photo1?.image && photo2?.image) setPhoto3(file);
                              else if (photo1?.image) setPhoto2(file);
                              else setPhoto1(file);
                            } else {
                              if (photo1?.image && photo2?.image && photo3?.image) setPhoto4(file);
                              else if (photo1?.image && photo2?.image) setPhoto3(file);
                              else if (photo1?.image) setPhoto2(file);
                              else setPhoto1(file);
                            }
                          }}
                        className="sr-only"
                      />
                    </label>

                {/* OVERLAY */}
                <div
                  className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => handleOpenModal(index + 1)}
                />
              </div>
            ))}
          </div>
        </header>


      </div>
    );
  };

  const renderSection7 = () => {
    return (
      // <div className="listingSection__wrap">
      //   {/* HEADING */}
      //   <div>
      //     <h2 className="text-2xl font-semibold">Location</h2>
      //     <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
      //       San Diego, CA, United States of America (SAN-San Diego Intl.)
      //     </span>
      //   </div>
      //   <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" />

      //   {/* MAP */}
      //   <div className="aspect-w-5 aspect-h-5 sm:aspect-h-3">
      //     <div className="rounded-xl overflow-hidden">
      //       <GoogleMapReact
      //         bootstrapURLKeys={{
      //           key: "AIzaSyDxJaU8bLdx7sSJ8fcRdhYS1pLk8Jdvnx0",
      //         }}
      //         defaultZoom={15}
      //         yesIWantToUseGoogleMapApiInternals
      //         defaultCenter={{
      //           lat: 55.9607277,
      //           lng: 36.2172614,
      //         }}
      //       >
      //         <LocationMarker lat={55.9607277} lng={36.2172614} />
      //       </GoogleMapReact>
      //     </div>
      //   </div>
      // </div>
      <div className="listingSection__wrap">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold">Reviews ({ratings.length} {ratings.length !== 1 ? "reviews" : "review"})</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

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

  const renderSection8 = () => {
    return (
      <div className="listingSection__wrap">
        {/* HEADING */}
        {/* <h2 className="text-2xl font-semibold">Things to know</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" /> */}

        {/* CONTENT */}
        {/* <div>
          <h4 className="text-lg font-semibold">Cancellation policy</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Any experience can be canceled and fully refunded within 24 hours of
            purchase, or at least 7 days before the experience starts.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" /> */}

        {/* CONTENT */}
        {/* <div>
          <h4 className="text-lg font-semibold">Guest requirements</h4>
          <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
            Up to 10 guests ages 4 and up can attend. Parents may also bring
            children under 2 years of age.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700" /> */}

        {/* CONTENT */}
        {/* <div>
          <h4 className="text-lg font-semibold">What to bring</h4>
          <div className="prose sm:prose">
            <ul className="mt-3 text-neutral-500 dark:text-neutral-400 space-y-2">
              <li>
                Formal Wear To Visit Bai Dinh Pagoda Be ready before 7.30 Am.
              </li>
              <li>We will pick up from 07.30 to 08.00 AM</li>
            </ul>
          </div>
        </div> */}
        <div>
          <h2 className="text-2xl font-semibold">Price your Experience</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            The host's revenue is directly dependent on the setting of rates and
            regulations on the number of guests, the number of nights, and the
            cancellation policy.
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
        {/* FORM */}
        <div className="space-y-8">
          {/* ITEM */}
          {/* <FormItem label="Currency">
            <Select>
              <option value="USD">USD</option>
              <option value="VND">VND</option>
              <option value="EURRO">EURRO</option>
            </Select>
          </FormItem> */}
          <FormItem label="Base price cost for minimum length of experience">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input className="!pl-8 !pr-10" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">USD</span>
              </div>
            </div>
          </FormItem>
          {/* ----- */}
          {/* <FormItem label="Base price  (Friday-Sunday)">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input className="!pl-8 !pr-10" placeholder="0.00" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">USD</span>
              </div>
            </div>
          </FormItem> */}
          {/* ----- */}
          {/* <FormItem label="Long term price (Monthly discount) ">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
              <Input className="!pl-8 !pr-10" placeholder="0.00" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">every month</span>
              </div>
            </div>
          </FormItem> */}
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    return (
      <div className="listingSectionSidebar__wrap shadow-xl">
        {/* PRICE */}
        <div className="flex justify-between">
          <span className="text-3xl font-semibold">
            $19
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /person
            </span>
          </span>
          <StartRating />
        </div>

        {/* FORM */}
        <form className="flex flex-col sm:flex-row border divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-700 border-neutral-200 dark:border-neutral-700 rounded-3xl ">
          <div className="flex-1">
            <ExperiencesDateSingleInput
              defaultValue={selectedDate}
              anchorDirection={windowSize.width > 1400 ? "left" : "right"}
              fieldClassName="p-5"
              className="h-full"
            />
          </div>
          <div className="flex-1">
            {/* <GuestsInput
              fieldClassName="p-5"
              defaultValue={{
                guestAdults: 1,
                guestChildren: 0,
                guestInfants: 0,
              }}
            /> */}
          </div>
        </form>

        {/* SUM */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>$19 x 3 adults</span>
            <span>$57</span>
          </div>
          <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
            <span>Service charge</span>
            <span>$0</span>
          </div>
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>$199</span>
          </div>
        </div>

        {/* SUBMIT */}
        <ButtonPrimary>Reserve</ButtonPrimary>
      </div>
    );
  };

  return (
    <div
      className={`nc-ListingExperiencesDetailPage  ${className}`}
      data-nc-id="ListingExperiencesDetailPage"
    >
      {/* SINGLE HEADER */}
      <>
        
        {/* MODAL PHOTOS */}
        {/* <ModalPhotos
          imgs={PHOTOS}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName="nc-ListingExperiencesDetailPage__modalPhotos"
        /> */}
      </>

      {/* MAIn */}
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full lg:w-5/5 xl:w-3/3 space-y-8 lg:pr-10 lg:space-y-10">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          {location.state.editing ? "Edit Experience" : "Create Experience"}
        </h2>
          {renderSection1()} {/* TITLE */}
          {renderSection6()} {/* IMAGES */}
          {renderSectionCheckIndate()} {/* DESCRIPTION */}
          {renderSection2()} {/* LOCATION */}
          
          
          {/* {renderSection7()} */}
          {renderSection3()} {/* SIZE OF EXPERIENCE */}
          {renderSection5()} {/* AVAILABILITY */}
          {renderSection8()} {/* PRICE */}
          {renderSection7()} {/* REVIEWS */}
          {location.state.editing ? <ButtonPrimary onClick={createNewExperience} className="float-right">Update Experience</ButtonPrimary> :
          <ButtonPrimary onClick={createNewExperience} className="float-right">Create Experience</ButtonPrimary>}
        </div>

        {/* SIDEBAR */}
        {/* <div className="block flex-grow mt-14 lg:mt-0">
          <div className="sticky top-24">{renderSidebar()}</div>
        </div> */}
      </main>

      {/* STICKY FOOTER MOBILE */}
      {/* <div className="block lg:hidden fixed bottom-0 inset-x-0 py-4 bg-white text-neutral-900 border-t border-neutral-200 z-20">
        <div className="container flex items-center justify-between">
          <span className="text-2xl font-semibold">
            $311
            <span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
              /person
            </span>
          </span>

          <ButtonPrimary href="##">Reserve</ButtonPrimary>
        </div>
      </div> */}

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

export default ListingExperiencesDetailPageEdit;
