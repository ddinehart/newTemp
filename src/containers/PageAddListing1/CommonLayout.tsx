import React from "react";
import { FC, useEffect, useState} from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import ExperiencesCard from "components/ExperiencesCard/ExperiencesCard";
import DataTable from 'react-data-table-component';
import Pagination from "shared/Pagination/Pagination";
import Heading2 from "components/Heading/Heading2";
import { Link } from "react-router-dom";
import { LocationType } from "data/types";
import axios from 'axios';
import moment from "moment";
import { useHistory } from "react-router-dom";

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
  const [pastBookings, setPastBookings] = useState([]);
  const [futureBookings, setFutureBookings] = useState([]);

  const columns = [
    {name: "Title", selector: (row) => row.title},
    {name: "Date", selector: (row) => row.date},
    {name: "Price", selector: (row) => "$" + row.price}
  ]

  const history = useHistory();
  console.log(location);
    useEffect(() => {
      if (location.state) {
      fetch('/api/experiences/' + location.state._id)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error(error));

      fetch('/api/bookings/' + location.state._id)
      .then(response => response.json())
      .then(data => {
        setFutureBookings(data.filter((booking) => moment(booking.date).diff(moment()) >= 0).sort((a, b) => moment(a.date).diff(moment(b.date))))
        setPastBookings(data.filter((booking) => moment(booking.date).diff(moment()) < 0).sort((a, b) => moment(b.date).diff(moment(a.date))))
      })
      .catch(error => console.log(error));
      }
    }, [])

    function deleteExperience (_id) {
      axios.delete('/api/experience/' + _id).then((res) =>{
        setData(data.filter((item) => item._id !== _id));
      })
    }

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
        <div className="edit add-new" onClick={() => console.log({id:location.state._id, editing:true})}>
          <Link to={{pathname: '/listing-experiences-detail-edit', state: {editing:false, _id:location.state._id, firstName:location.state.firstName, lastName:location.state.lastName}}}>
          <ButtonPrimary>
              +
          </ButtonPrimary>
          </Link>
          </div>
        {data.map((stay) => (
          <div className="edit" onClick={() => console.log({id:stay._id, editing:true})}>
            <button onClick={() => deleteExperience(stay._id)} className='deleteButton'>x</button>
            <ExperiencesCard onClick={() => history.push({pathname: '/listing-experiences-detail-edit', state:{_id:stay._id, editing:true}})} key={stay._id} editing={true} data={stay} />
          </div>
        ))}
      </div>
      <Heading2
        heading="My Bookings"
        subHeading={
          <span className="block text-neutral-500 dark:text-neutral-400 mt-3">
            {pastBookings.length + futureBookings.length} {pastBookings.length + futureBookings.length === 1 ? "booking" : "bookings"}
          </span>
        }
      />
      <DataTable 
        title="Future Bookings"
        columns={columns}
        data={futureBookings}
      />

      <DataTable 
        title="Past Bookings"
        columns={columns}
        data={pastBookings}
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
