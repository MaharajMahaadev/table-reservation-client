"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { format } from "date-fns";

export default function DateView({ setShow, setDate, setTime }) {
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [view, setView] = useState("calendar"); // 'calendar' or 'slots'

  const fetchBookedSlot = async (date) => {
    const thisDate = format(date, "yyyy-MM-dd");

    console.log("formatted date", thisDate);

    try {
      if (!date) {
        console.error("Date is required to fetch reservation times.");
        return [];
      }

      const response = await fetch(
        `https://table-reservation-backend-4waq.onrender.com/reservations?date=${encodeURIComponent(
          thisDate
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const times = await response.json();
      return times;
    } catch (error) {
      console.error("Error fetching reservation times:", error);
      return [];
    }
  };

  const generateTimeSlots = async (date) => {
    try {
      const bookedSlots = await fetchBookedSlot(date);
      const slots = [];
      let startTime = new Date(date);
      startTime.setHours(7, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(24, 0, 0, 0);

      while (startTime < endOfDay) {
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 30);

        const formattedSlot = `${format(startTime, "HH:mm")}-${format(
          endTime,
          "HH:mm"
        )}`;

        if (bookedSlots.includes(formattedSlot)) {
          slots.push({
            time: formattedSlot,
            booked: true,
          });
        } else {
          slots.push({
            time: formattedSlot,
            booked: false,
          });
        }

        startTime = endTime;
      }

      setTimeSlots(slots);
      console.log("Generated Time Slots:", slots);
    } catch (error) {
      console.error("Error generating time slots:", error);
    }
  };

  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    generateTimeSlots(info.date);
    setView("slots");
  };

  const handleConfirm = (slot) => {
    alert(`Confirmed: ${format(selectedDate, "yyyy-MM-dd")} ${slot}`);
    setDate(format(selectedDate, "yyyy-MM-dd"));
    setTime(slot);
    setShow(false);
  };

  return (
    <div className="p-4">
      <button onClick={() => setShow(false)}>Close</button>
      {view === "calendar" && (
        <div>
          <h1 className="text-xl font-bold mb-4">Select a Date</h1>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="dayGridMonth"
            initialDate={currentDate}
            headerToolbar={{ start: "prev,next", center: "title", end: "" }}
            validRange={{ start: format(currentDate, "yyyy-MM-dd") }}
            dateClick={handleDateClick}
          />
        </div>
      )}

      {view === "slots" && (
        <div>
          <button
            className="mb-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => setView("calendar")}
          >
            Back
          </button>

          <h2 className="text-lg font-semibold mb-4">
            Time Slots for {format(selectedDate, "yyyy-MM-dd")}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`p-2 rounded border text-center ${
                  slot.booked
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-green-400 hover:bg-green-500"
                }`}
                onClick={() => !slot.booked && handleConfirm(slot.time)}
                disabled={slot.booked}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
