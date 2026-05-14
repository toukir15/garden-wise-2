import type { FC, SVGProps } from "react";

declare module "react-icons" {
  export type IconType = FC<
    SVGProps<SVGSVGElement> & {
      size?: string | number;
      color?: string;
      title?: string;
      titleId?: string;
    }
  >;
}
