import type { SVGProps } from "react";

/** Plate/dish icon — matches Polaris 20×20 viewBox and fill convention. */
export function DishIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
      {/* Cloche dome */}
      <path
        fillRule="evenodd"
        d="M10 3.5a.75.75 0 0 1 .75.75v.29a5.751 5.751 0 0 1 5 5.71.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75 5.751 5.751 0 0 1 5-5.71v-.29A.75.75 0 0 1 10 3.5Zm-3.97 5.5h7.94A4.252 4.252 0 0 0 10 6a4.252 4.252 0 0 0-3.97 3Z"
      />
      {/* Plate base */}
      <path d="M3.25 12a.75.75 0 0 0 0 1.5h13.5a.75.75 0 0 0 0-1.5H3.25Z" />
      {/* Stand */}
      <path d="M6.75 15a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" />
    </svg>
  );
}
