import React from 'react';

import {
  Add as AddIcon,
  Link as LinkIcon,
  Subscriptions as SubscriptionsIcon,
  RssFeed as RssFeedIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  Payments as PaymentsIcon,
  Photo as PhotoIcon,
  Logout as LogoutIcon,
  Paid as PaidIcon,
  TrendingUp as TrendingUpIcon,
  Segment as SegmentIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

export interface IMenu {
  id: string;
  title: string;
  href?: string;
  level?: number;
  pages?: IMenu[]; 
  icon?: React.ReactNode;
}

export const ProfileSettingMenus: IMenu[] = [
  {
    id: 'reset_password',
    title: 'Reset Password',
    href: '/user/change-password',
    level: 0,
    icon: <LockIcon />
  },
  {
    id: 'plan',
    title: 'Your Plan',
    href: '/user/plan',
    level: 0,
    icon: <PaymentsIcon />
  },
  {
    id: 'upload_logo',
    title: 'Upload Logo',
    href: '/user/upload-logo',
    level: 1,
    icon: <PhotoIcon />
  },
];

export const AdminPortalMenus: IMenu[] = [
  {
    id: 'paid_link_earnings',
    title: 'Paid Link Earnings',
    href: '/admin/paid-link-earning',
    level: 2,
    icon: <PaidIcon />
  },
  {
    id: 'user_earnings_report',
    title: 'User Earnings Report',
    href: '/admin/user-earning-report',
    level: 2,
    icon: <PaidIcon />
  },
  {
    id: 'user_activity_export',
    title: 'User Activity Export',
    href: '/admin/user-activity-export',
    level: 2,
    icon: <TrendingUpIcon />
  },
  {
    id: 'link_report',
    title: 'Link Report',
    href: '/admin/link-report',
    level: 2,
    icon: <SegmentIcon />
  },
  {
    id: 'manage_users',
    title: 'Manage Users',
    href: '/admin/manage-user',
    level: 2,
    icon: <PeopleIcon />
  }
];

export const useNavigationMenu = (loggedIn: boolean): IMenu[] => {
  const beforePages: IMenu[] = [
    {
      id: 'compare_options',
      title: 'Compare Options',
      href: '/#compare-options',
      level: 0,
    },
    {
      id: 'blog',
      title: 'Blog',
      href: '/blog',
      level: 0,
    },
    {
      id: 'features',
      title: 'Features',
      href: '/#features',
      level: 0,
    },
    {
      id: 'plan_pricing',
      title: 'Plan and Pricing',
      href: '/#plan-and-pricing',
      level: 0,
    },
    {
      id: 'signin',
      title: 'Sign In',
      href: '/signin',
      level: 0,
    },
    {
      id: 'signup',
      title: 'Sign Up',
      href: '/signup',
      level: 0,
    }
  ];

  const afterPages: IMenu[] = [
    {
      id: 'create_new_link',
      title: 'Create New Link',
      href: '/create-new-link',
      level: 0,
      icon: <AddIcon />,
    },
    {
      id: 'manage_links',
      title: 'Manage Links',
      href: '/manage-link',
      level: 0,
      icon: <LinkIcon />
    },
    {
      id: 'manage_subscription',
      title: 'Manage Subscription',
      href: '/manage-subscription',
      level: 2,
      icon: <SubscriptionsIcon />
    },
    {
      id: 'blog',
      title: 'Blog',
      href: '/blog',
      level: 0,
      icon: <RssFeedIcon />
    },
    {
      id: 'profile',
      title: 'Account',
      icon: <SettingsIcon />,
      level: 0,
      pages: [
        ...ProfileSettingMenus,
        {
          id: 'sign_out',
          title: 'Sign-out',
          href: '/sign-out',
          level: 0,
          icon: <LogoutIcon />
        },
        ...AdminPortalMenus,
      ]
    }
  ];

  return loggedIn ? afterPages : beforePages;
};


