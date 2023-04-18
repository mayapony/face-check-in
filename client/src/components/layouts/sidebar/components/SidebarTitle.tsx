type TitleProps = {
  text: string;
};

export default function SidebarTitle({ text }: TitleProps) {
  return <p className="mt-1 mb-1 text-xs font-bold text-gray-300">{text}</p>;
}
