import React from "react";
import { BsCheck2All } from "react-icons/bs";
import { PiCheck } from "react-icons/pi";



const Landing = () => {
  // message.status → "sent" | "delivered" | "read"
  const messages = [
    {
      id: 1,
      fromMe: false,
      text: "Hey! How are you?",
      time: "10:20 AM",
    },
    {
      id: 2,
      fromMe: true,
      text: "Hi, I’m doing good! What about you?",
      time: "10:21 AM",
      status: "read",
    },
    {
      id: 3,
      fromMe: false,
      text: "I'm great! Are you coming to the office today?",
      time: "10:22 AM",
    },
    {
      id: 4,
      fromMe: true,
      text: "Yes, I’ll be there in 20 mins.",
      time: "10:23 AM",
      status: "delivered",
    },
    {
      id: 5,
      fromMe: false,
      text: "Perfect, see you soon!",
      time: "10:24 AM",
    },
    {
      id: 6,
      fromMe: true,
      text: "Sure! Bring the meeting documents.",
      time: "10:25 AM",
      status: "sent",
    },
    {
      id: 7,
      fromMe: false,
      text: "Yes noted!",
      time: "10:26 AM",
    },
  ];

  const renderStatus = (status) => {
    if (!status) return null;

    // Blue double check (Read)
    if (status === "read") {
      return <span className="text-green-300 ml-1 text-xs"><BsCheck2All size={21} /></span>;
    }

    // Gray double check (Delivered)
    if (status === "delivered") {
      return <span className="text-slate-200 ml-1 text-xs"><BsCheck2All size={21} /></span>;
    }

    // Single gray check (Sent)
    if (status === "sent") {
      return <span className="text-slate-200 ml-1 text-xs"><PiCheck size={21} /></span>;
    }

    return null;
  };

  return (
    <div className="h-full w-full bg-slate-50 p-4 flex flex-col justify-end overflow-y-auto">

      <div className="flex flex-col gap-3">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-xl shadow-sm text-sm ${
                msg.fromMe
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-white text-slate-900 border rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>

              {/* Time + Status */}
              <span
                className={` text-xs flex justify-end items-center gap-1 mt-1 ${
                  msg.fromMe ? "text-green-100" : "text-slate-500"
                }`}
              >
                {msg.time}
                {msg.fromMe && renderStatus(msg.status)}
              </span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Landing;
