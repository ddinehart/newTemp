//  ######  CustomLink  ######## //
export interface CustomLink {
  label: string;
  href: string;
  targetBlank?: boolean;
}

//  ##########  PostDataType ######## //
export interface TaxonomyType {
  _id?: string | number;
  name: string;
  href: string;
  count?: number;
  thumbnail?: string;
  desc?: string;
  color?: TwMainColor | string;
  taxonomy: "category" | "tag";
  listingType?: "stay" | "experiences" | "car";
}

export interface AuthorType {
  _id?: string | number;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar: string;
  bgImage?: string;
  email?: string;
  count: number;
  desc: string;
  jobName: string;
  href: string;
  starRating?: number;
}

export interface PostDataType {
  _id?: string | number;
  author: AuthorType;
  date: string;
  href: string;
  categories: TaxonomyType[];
  title: string;
  featuredImage: string;
  desc?: string;
  commentCount: number;
  viewdCount: number;
  readingTime: number;
  postType?: "standard" | "video" | "gallery" | "audio";
}

export type TwMainColor =
  | "pink"
  | "green"
  | "yellow"
  | "red"
  | "indigo"
  | "blue"
  | "purple"
  | "gray";

export interface RatingDataType {
  name: string;
  rating: number;
  date: string;
  thoughts: string;
}
//
export interface StayDataType {
  _id: string | number;
  firstName: string;
  lastName: string;
  author: AuthorType;
  date: string;
  href: string;
  title: string;
  featuredImage: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: string[];
  price: number;
  listingCategory: TaxonomyType;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  saleOff?: string | null;
  editing?: boolean;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}
export interface LocationType {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: StayDataType;
}
//
export interface ExperiencesDataType {
  starRating?: number;
  _id: string | number;
  description?: string;
  quantities?: {};
  experienceNumber?: number;
  availableRepeat?: number[];
  availableSpecificDays?: {};
  userId?: string;
  author: AuthorType;
  maxTimeLength?: number;
  ratingCount?: number;
  date: string;
  firstName: string;
  lastName: string;
  href: string;
  title: string;
  featuredImage: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: string[];
  price: number;
  listingCategory: TaxonomyType;
  maxGuests: number;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}
export interface BookingsDataType {
  _id: string | number;
  userId?: string;
  quantity?: number;
  date: string;
  title: string;
  featuredImage: string;
  address: string;
  reviewCount: number;
  price: number;
  maxGuests: number;
}

//
export interface CarDataType {
  _id: string | number;
  author: AuthorType;
  date: string;
  href: string;
  title: string;
  featuredImage: string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: string[];
  price: number;
  listingCategory: TaxonomyType;
  seats: number;
  gearshift: string;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}
