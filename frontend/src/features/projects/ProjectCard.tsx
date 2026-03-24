import Image from "next/image";

import {
  launch24,
  pencil24,
  projectTemplate24,
  trash24,
} from "@esri/calcite-ui-icons";

interface ProjectCardProps {
  name: string;
  date: string;
  image: string;
}

export default function ProjectCard({ name, date, image }: ProjectCardProps) {
  return (
    <div className="rounded-sm border border-gray-200 bg-white p-5 transition hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm uppercase">{date}</span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-md">
          <Image
            src={image || projectTemplate24}
            alt={name}
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h2 className="text font-semibold text-gray-800 uppercase">{name}</h2>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-2 px-10">
        <div>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d={pencil24} />
          </svg>
        </div>
        <div>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d={launch24} />
          </svg>
        </div>
        <div>
          <svg className="h-5 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d={trash24} />
          </svg>
        </div>
      </div>
    </div>
  );
}
