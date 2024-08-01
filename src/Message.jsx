import { useEffect, useState } from "react";

function Message({ variant = "success", text }) {
  return <p className={`message ${variant}`}>{text}</p>;
}

export default Message;
