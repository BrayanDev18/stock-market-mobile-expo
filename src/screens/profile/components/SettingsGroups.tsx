import {Fragment, type ComponentType} from 'react';
import {
  IconUser,
  IconShieldLock,
  IconBadgeFilled,
  IconCrown,
  IconLanguage,
  IconCurrencyDollar,
  IconMap2,
  IconReceipt2,
  IconBookmarks,
  IconClockHour4,
  IconHelpCircle,
  IconMessageCircle,
  IconStar,
  IconFileText,
  IconFileCertificate,
  IconLicense,
} from '@tabler/icons-react-native';

import {Colors, trendAlpha} from '@/core/constants';
import {Section, Divider} from './Section';
import {MenuRow} from './MenuRow';

type IconComponent = ComponentType<{size?: number; color?: string}>;

interface SettingsRowProps {
  Icon: IconComponent;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  valueColor?: string;
}

interface SettingsGroupProps {
  title: string;
  rows: SettingsRowProps[];
}

const GROUPS: SettingsGroupProps[] = [
  {
    title: 'Account',
    rows: [
      {Icon: IconUser, iconColor: '#60a5fa', iconBg: 'rgba(96, 165, 250, 0.12)', label: 'Personal Information'},
      {Icon: IconShieldLock, iconColor: Colors.accentLight, iconBg: trendAlpha.up(0.12), label: 'Security & Privacy'},
      {Icon: IconBadgeFilled, iconColor: '#3b82f6', iconBg: 'rgba(59, 130, 246, 0.12)', label: 'Identity Verification', value: 'Verified', valueColor: 'text-green-400'},
      {Icon: IconCrown, iconColor: '#fbbf24', iconBg: 'rgba(251, 191, 36, 0.12)', label: 'Subscription', value: 'Pro', valueColor: 'text-yellow-400'},
    ],
  },
  {
    title: 'Trading',
    rows: [
      {Icon: IconReceipt2, iconColor: Colors.accentLight, iconBg: trendAlpha.up(0.12), label: 'Order Preferences'},
      {Icon: IconBookmarks, iconColor: '#a855f7', iconBg: 'rgba(168, 85, 247, 0.12)', label: 'Watchlists', value: '4'},
      {Icon: IconClockHour4, iconColor: '#f472b6', iconBg: 'rgba(244, 114, 182, 0.12)', label: 'Trading Hours'},
    ],
  },
  {
    title: 'Region & Format',
    rows: [
      {Icon: IconLanguage, iconColor: '#60a5fa', iconBg: 'rgba(96, 165, 250, 0.12)', label: 'Language', value: 'English'},
      {Icon: IconCurrencyDollar, iconColor: Colors.accentLight, iconBg: trendAlpha.up(0.12), label: 'Currency', value: 'USD'},
      {Icon: IconMap2, iconColor: '#fbbf24', iconBg: 'rgba(251, 191, 36, 0.12)', label: 'Region', value: 'United States'},
    ],
  },
  {
    title: 'Support',
    rows: [
      {Icon: IconHelpCircle, iconColor: '#60a5fa', iconBg: 'rgba(96, 165, 250, 0.12)', label: 'Help Center'},
      {Icon: IconMessageCircle, iconColor: Colors.accentLight, iconBg: trendAlpha.up(0.12), label: 'Contact Support'},
      {Icon: IconStar, iconColor: '#fbbf24', iconBg: 'rgba(251, 191, 36, 0.12)', label: 'Rate QuantiX'},
    ],
  },
  {
    title: 'Legal',
    rows: [
      {Icon: IconFileText, iconColor: '#a3a3a3', iconBg: 'rgba(163, 163, 163, 0.12)', label: 'Terms of Service'},
      {Icon: IconFileCertificate, iconColor: '#a3a3a3', iconBg: 'rgba(163, 163, 163, 0.12)', label: 'Privacy Policy'},
      {Icon: IconLicense, iconColor: '#a3a3a3', iconBg: 'rgba(163, 163, 163, 0.12)', label: 'Licenses'},
    ],
  },
];

/** Static settings groups (Account, Trading, Region, Support, Legal) rendered from data. */
export const SettingsGroups = () => (
  <>
    {GROUPS.map(({title, rows}) => (
      <Section key={title} title={title}>
        {rows.map((row, index) => (
          <Fragment key={row.label}>
            {index > 0 && <Divider/>}
            <MenuRow {...row}/>
          </Fragment>
        ))}
      </Section>
    ))}
  </>
);