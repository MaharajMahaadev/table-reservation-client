"use client";

import { useState } from "react";
import DateView from "@/app/slots/page.jsx";
import Booked from "@/ui/Booked.jsx";

export default function Bookings() {
  const [show, setShow] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [val, setVal] = useState(0);
  const [correct, setCorrect] = useState(true);

  const fetchBookedSlots = async () => {
    try {
      await fetch(
        "https://table-reservation-backend-4waq.onrender.com/reservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: date, time: time }),
        }
      );

      setVal(1);
    } catch (error) {
      setVal(2);
      console.log("Error In Booking", error);
    }
  };

  function handleForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!correct) {
      alert("Please enter correct details");
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const date = data.get("date") as string;
    const guests = data.get("guests") as string;
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const phone = data.get("phone") as string;
    console.log({ date, guests, name, email, phone });

    fetchBookedSlots();
  }

  function checkInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "phone") {
      if (e.target.value.length !== 10) {
        alert("Phone number must be 10 digits long");
        setCorrect(false);
      } else {
        setCorrect(true);
      }
    }
    if (e.target.name === "guests") {
      if (parseInt(e.target.value) > 10 || parseInt(e.target.value) < 1) {
        alert("Number of guests must be between 1 to 10");
        setCorrect(false);
      } else {
        setCorrect(true);
      }
    }
  }

  return (
    <>
      {show === true ? (
        <DateView setShow={setShow} setDate={setDate} setTime={setTime} />
      ) : (
        <div className="flex flex-col absolute top-0 left-0 right-0 bottom-0 m-auto h-[70vh] w-[60vw] bg-red-100 p-5">
          <h1 className="text-2xl font-bold">Restaurant Table Reservation</h1>
          {val === 0 ? (
            <form
              onSubmit={(e) => handleForm(e)}
              className="flex flex-col w-full h-full justify-between"
            >
              <button onClick={() => setShow(true)}>
                Select Reservation Slot
              </button>
              <span>
                {time}, {date}
              </span>
              <input
                className="rounded-full focus:outline-none ring-4 ring-sky-400 focus:ring-sky-900 p-[0.5%] m-[0.1%]"
                type="number"
                min={1}
                max={10}
                placeholder="Number of Guests"
                name="guests"
                onBlur={(e) => checkInput(e)}
              ></input>
              <input
                className="rounded-full focus:outline-none ring-4 ring-sky-400 focus:ring-sky-900 p-[0.5%] m-[0.1%]"
                type="text"
                placeholder="Enter Name"
                name="name"
                onBlur={(e) => checkInput(e)}
              ></input>
              <input
                className="rounded-full focus:outline-none ring-4 ring-sky-400 focus:ring-sky-900 p-[0.5%] m-[0.1%]"
                type="email"
                placeholder="Email"
                name="email"
                onBlur={(e) => checkInput(e)}
              ></input>
              <input
                className="rounded-full focus:outline-none ring-4 ring-sky-400 focus:ring-sky-900 p-[0.5%] m-[0.1%]"
                type="tel"
                placeholder="Phone"
                name="phone"
                onBlur={(e) => checkInput(e)}
              ></input>
              <button
                className="p-3 hover:bg-sky-400 duration-300 bg-sky-200 font-semibold w-fit rounded-full"
                type="submit"
              >
                Book
              </button>
            </form>
          ) : (
            <Booked val={val} setVal={setVal} time={time} date={date} />
          )}
        </div>
      )}
    </>
  );
}
