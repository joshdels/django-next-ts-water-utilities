import ProjectCard from "./ProjectCard";
import { projects } from "@/mock/project";

export default function Projects() {
  return (
    <div className="h-[94vh] bg-gray-100 p-6">
      <div className="my-10">
        test
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            name={project.name}
            date={project.date}
            image={project.image}
          />
        ))}
      </div>
    </div>
  );
}
