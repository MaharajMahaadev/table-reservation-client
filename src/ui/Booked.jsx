import { Check, X } from "lucide-react";

export default function Booked({ val, setVal, time, date }) {
  return (
    <>
      {val === 1 ? (
        <div className="flex-col justify-evenly h-full p-5 bg-slate-100 rounded-lg">
          <p className="font-sans grid grid-flow-col w-fit font-semibold text-xl text-green-500">
            <Check />
            Success
          </p>
          <p className="font-sans text-xl">
            Successfully Reserved the table for the date:{date} & time:{time}{" "}
            slot.
          </p>
        </div>
      ) : (
        <div className="flex-col justify-between h-full p-5 bg-slate-100 rounded-lg">
          <p className="font-sans font-semibold grid grid-flow-col w-fit text-xl text-red-500">
            <X />
            Failed
          </p>
          <p className="font-sans text-xl">
            Error In Booking, please try again after some time.
          </p>
        </div>
      )}
      <button
        className="bg-neutral-200 hover:bg-neutral-300 rounded-full p-3 m-1 duration-500"
        onClick={() => setVal(0)}
      >
        Go Home
      </button>
    </>
  );
}
