"use client";

import { useState } from "react";

export const Modal = ({ id, show, setComments, setShow }) => {
  const [comment, setComment] = useState({ name: "", text: "" });

  const sendComments = () => {
    if (comment.name && comment.text) {
      const dataToSet = JSON.stringify([
        ...(JSON.parse(window.localStorage.getItem(id)) || []),
        comment,
      ]);
      window.localStorage.setItem(id, dataToSet);
    }
    setComments((prev) => [...prev, comment]);
    setComment({ name: "", text: "" });
    setShow(false);
  };
  if (!show) {
    return null;
  }
  return (
    <div
      className="h-screen w-full flex fixed top-0 left-0 z-10 items-center justify-center"
      style={{ backgroundColor: "#000000bf" }}>
      <div className="flex flex text-white flex-col bg-black rounded-md w-full max-w-xl p-10">
        <span className="mb-3">Имя</span>
        <input
          value={comment.name}
          onChange={(e) =>
            setComment((prev) => ({ ...prev, name: e.target.value }))
          }
          className="bg-transparent border-white border mb-3 p-3"
        />
        <span className="mb-2">Текст</span>
        <textarea
          onChange={(e) =>
            setComment((prev) => ({ ...prev, text: e.target.value }))
          }
          value={comment.text}
          className="bg-transparent border-white border mb-4 p-3"
        />
        <button
          onClick={sendComments}
          className="border border-white   p-4 mb-3  hover:bg-white hover:text-black">
          Send
        </button>
        <button
          onClick={() => setShow(false)}
          className="border border-white  p-4 hover:bg-white hover:text-black">
          Close
        </button>
      </div>
    </div>
  );
};
