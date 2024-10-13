import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IUser {
  _id: string;
  name: string;
  role: string;
  email: string;
  profilePhoto: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export type TPost = {
  _id: string;
  sharedUser: User;
  description: string | null | TrustedHTML;
  isShared: boolean;
  share: string[];
  comments: Comment[];
  votes: Vote;
  createdAt: string;
  post: TInsidePost;
};

type TInsidePost = {
  _id: string;
  category: string;
  comments: Comment[];
  createdAt: string;
  description: string | null | TrustedHTML;
  images: string[];
  isPremium: boolean;
  share: Share[];
  updatedAt: string;
  user: User;
  votes: Vote | null;
  isShared: boolean;
  sharedUser: User | null;
};

type Comment = {
  _id: string;
  createdAt: string;
  text: string;
  user: User;
  votes: Vote;
  replies: Comment[]; // assuming replies are nested comments
};

type Share = {
  // Define fields related to a share if needed
};

type User = {
  _id: string;
  name: string;
  profilePhoto: string;
};

type Vote = {
  _id: string;
  upvote: string[];
  downvote: string[];
};
