import {
  FaStar,
  FaUtensils,
  FaTshirt,
  FaHammer,
  FaLaptop,
  FaBriefcase,
  FaEllipsisH,
} from "react-icons/fa";

const tabs = [
  { label: "Semua", icon: <FaStar /> },
  { label: "Makanan", icon: <FaUtensils /> },
  { label: "Fashion", icon: <FaTshirt /> },
  { label: "Kerajinan", icon: <FaHammer /> },
  { label: "Teknologi", icon: <FaLaptop /> },
  { label: "Jasa", icon: <FaBriefcase /> },
  { label: "Lainnya", icon: <FaEllipsisH /> },
];

export default function UmkmTab({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex justify-start items-center gap-2 bg-white rounded-lg p-1 border border-gray-100 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onChange(tab.label)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-colors whitespace-nowrap ${
            value === tab.label
              ? "bg-primary text-white"
              : "text-foreground hover:bg-gray-50"
          }`}
        >
          <span
            className={`text-sm ${
              value === tab.label ? "text-white" : "text-primary"
            }`}
          >
            {tab.icon}
          </span>
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
