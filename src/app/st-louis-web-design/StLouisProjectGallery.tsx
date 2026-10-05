"use client";

import ChicagoProjectGallery, { CHICAGO_PROJECTS, type ChicagoProject } from "../chicago-web-design/ChicagoProjectGallery";
import { SELECTED_PROJECTS } from "../website-design/_components/selected-projects";

const selected = (id: string) => SELECTED_PROJECTS.find(project => project.id === id)!;
const chicago = (id: string) => CHICAGO_PROJECTS.find(project => project.id === id)!;

const PROJECTS: ChicagoProject[] = [
  selected("mend"),
  chicago("lindas"),
  chicago("robinsons"),
  // Main Street Bar & Grill's verified project asset will go here.
  chicago("alwaysclean"),
  selected("wellness"),
];

export default function StLouisProjectGallery() {
  return <ChicagoProjectGallery projects={PROJECTS} />;
}
