import React, { useEffect, useState } from "react";
import LocationInput from "./LocationInput";
import GuestsInput, { GuestsInputProps } from "./GuestsInput";
import ExperiencesDateSingleInput from "./ExperiencesDateSingleInput";
import ButtonSubmit from "./ButtonSubmit";
import moment from "moment";
import { FC } from "react";

// DEFAULT DATA FOR ARCHIVE PAGE
const defaultLocationValue = "ST George, Utah";
const defaultDate = moment();
const defaultGuestValue: GuestsInputProps["defaultValue"] = {
  guestAdults: 2,
  guestChildren: 2,
  guestInfants: 1,
};

export interface ExperiencesSearchFormProps {
  haveDefaultValue?: boolean;
  submitQuery: Function;
}

const ExperiencesSearchForm: FC<ExperiencesSearchFormProps> = ({
  haveDefaultValue,
  submitQuery
}) => {
  const [dateFocused, setDateFocused] = useState<boolean>(false);
  const [date, setDate] = useState<moment.Moment | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [guest, setGuest] = useState({});

  useEffect(() => {
    if (haveDefaultValue) {
      setDate(defaultDate);
      setInputValue(defaultLocationValue);
      setGuest(defaultGuestValue);
    }
  }, []);

  //

  const renderForm = () => {
    return (
      <form className="w-full relative mt-8 flex flex-col md:flex-row  rounded-3xl md:rounded-full shadow-xl dark:shadow-2xl bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700  md:divide-y-0">
        <LocationInput
          defaultValue={inputValue}
          onChange={(e) => setInputValue(e)}
          onInputDone={() => setDateFocused(true)}
        />

        <ExperiencesDateSingleInput
          defaultValue={date}
          onChange={(date) => setDate(date)}
          defaultFocus={dateFocused}
          onFocusChange={(focus: boolean) => {
            setDateFocused(focus);
          }}
        />

        <GuestsInput
          defaultValue={guest}
          onChange={(data) => setGuest(data)}
        />
        {/* BUTTON SUBMIT OF FORM */}
        <div onClick={() => submitQuery(date, inputValue, guest)} className="px-4 py-4 lg:py-0 flex items-center justify-center">
          <ButtonSubmit />
        </div>
      </form>
    );
  };

  return renderForm();
};

export default ExperiencesSearchForm;
