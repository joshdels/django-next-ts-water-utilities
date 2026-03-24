import Link from "next/link";
import { usePathname } from "next/navigation";

import { projectTemplate24, utilityNetwork24 } from "@esri/calcite-ui-icons";

const navigations = [
  { label: "Project", icon: projectTemplate24, path: "/projects" },
  { label: "Utility Map", icon: utilityNetwork24, path: "/dashboard" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-10">
      {navigations.map((nav, index) => {
        const isActive = pathname.startsWith(nav.path);

        return (
          <Link
            key={index}
            href={nav.path}
            className="relative flex flex-col items-center px-2 py-1 transition-all"
          >
            <svg
              className={`h-6 w-6 transition-all ${
                isActive ? "text-blue-600" : "text-gray-500"
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d={nav.icon} />
            </svg>

            <span
              className={`mt-1 text-sm transition-all ${
                isActive
                  ? "font-semibold text-blue-600"
                  : "text-gray-600 group-hover:text-blue-600"
              }`}
            >
              {nav.label}
            </span>

            <span
              className={`absolute -bottom-1 left-0 h-1 w-full rounded-full bg-blue-600 transition-all duration-300 ${
                isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}
