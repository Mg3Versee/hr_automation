import React from "react";

type Props = {
  kind: "success" | "error";
  message: string;
};

const MessageBanner: React.FC<Props> = ({ kind, message }) => (
  <div
    role="status"
    style={{
      marginTop: 20,
      fontWeight: "bold",
      color: kind === "success" ? "#177245" : "#b00020",
    }}
  >
    {message}
  </div>
);

export default MessageBanner;
