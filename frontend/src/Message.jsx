import { useEffect, useState } from "react";

function Message({ variant = "success", text, ref }) {
  return (
    <p className={`message ${variant}`} ref={ref}>
      {text}
    </p>
  );
}

export default Message;
