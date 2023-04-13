import React from "react";

type TitleProps = {
  text: string;
};

export default function SidebarTitle({ text }: TitleProps) {
  return <p className="mt-4 mb-4 text-sm font-bold text-gray-400">{text}</p>;
}
