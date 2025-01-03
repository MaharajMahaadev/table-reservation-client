import { Check, X } from "lucide-react";

export default function Booked({ val, setVal, time, date }) {
  return (
    <>
      {val === 1 ? (
        <div className="flex-col justify-evenly h-full p-5">
          <p className="font-sans font-semibold text-xl text-green-500">
            <Check />
            Success
          </p>
          <p className="font-sans text-xl">
            Successfully Reserved the table for the {date} and {time} slot.
          </p>
        </div>
      ) : (
        <div className="flex-col justify-between h-full p-5">
          <p className="font-sans font-semibold text-xl text-red-500">
            <X />
            Failed
          </p>
          <p className="font-sans text-xl">
            Error In Booking, please try again after some time.
          </p>
        </div>
      )}
      <button className="bg-sky-200 p-3 rounded-full" onClick={() => setVal(0)}>
        Go Home
      </button>
    </>
  );
}
