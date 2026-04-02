export type IServerLink = {
  id?: number,
  files: IFile[],
  emailNotify : boolean,
  service: number,
  link: string,
  password: string,
  linkType: number,
  trackIp : boolean,
  cost: number,
  expiryCount: number,
  expiryOn: string,
  downloadCount?: number,
}

export type IServerLinkDetail = {
  id: number;
  files: IFile[];
  emailNotify : boolean;
  service: number;
  link: string;
  linkType: number;
  trackIp : boolean;
  cost: number;
  expiryCount: number;
  expiryOn: string;
  downloadCount?: number;
  userId: number;
  ownerName: string;
  ownerEmail: string;
  ownerLevel: number;
  ownerLogo: string;
  requirePaid: boolean;
  ignoreValidate: boolean;
}

export interface IValidationError {
  [k: string]: {
    message: string;
  }
}

export interface IResponseError {
  message: string;
}

export interface IPopupOptions {
  [k: string]: any
}

export interface IChooseLink {
  link: string;
  password: string;
  files: IFile[],
  service: number,
}

export interface IFile {
  url: string;
}

export type IUser = {
  user_name: string,
  user_email: string,
  id: number,
}

export interface IPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html: string;
  comment_id: string;
  feature_image: string;
  featured: boolean;
  visibility: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  custom_excerpt: string;
  feature_image_caption: string;
  feature_image_alt: string;
  frontmatter: string;
  email_subject: string;
  meta_description: string;
  meta_title: string;
  twitter_description: string;
  twitter_title: string;
  twitter_image: string;
  og_image: string;
  og_title: string;
  og_description: string;
  comments: boolean;
  access: boolean;
  reading_time: number;
  excerpt: string;
  url: string;
  canonical_url: string;
  primary_author: {
    name: string;
  }
}

export interface IEarningLink {
  passdrop_url: string;
  link_id: number;
  status: number;
  price: number;
  total: number;
  fee?: number;
}

export interface ILinkReport {
  sno: number;
  id: number;
  user_name: string;
  user_email: string;
  passdrop_url: string;
  period_download_count: number;
  total_download_count: number;
  is_pro: boolean;
  expiry_count: number;
  expiry_on: string;
}

export interface IUserAnalytics {
  sno: number,
  id: number,
  link_count: number,
  download_count: number,
  user_name: string;
  user_email: string;
  stripe_id: string;
  subscription_id: string;
  logo: string;
  is_pro: number;
}


