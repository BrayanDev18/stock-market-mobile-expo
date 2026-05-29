import {useState} from 'react';
import {IconBell, IconFingerprint, IconChartCandle, IconNews} from '@tabler/icons-react-native';

import {Colors, trendAlpha} from '@/core/constants';
import {Section, Divider} from './Section';
import {ToggleRow} from './ToggleRow';

/** Quick Settings group: self-contained toggles (biometric, push, price/news alerts). */
export const QuickSettingsSection = () => {
  const [biometric, setBiometric] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);

  return (
    <Section title="Quick Settings">
      <ToggleRow
        Icon={IconFingerprint}
        iconColor={Colors.accentLight}
        iconBg={trendAlpha.up(0.12)}
        label="Biometric Login"
        description="Use Face ID to sign in"
        value={biometric}
        onValueChange={setBiometric}
      />
      <Divider/>
      <ToggleRow
        Icon={IconBell}
        iconColor="#3b82f6"
        iconBg="rgba(59, 130, 246, 0.12)"
        label="Push Notifications"
        description="Real-time app alerts"
        value={pushNotifications}
        onValueChange={setPushNotifications}
      />
      <Divider/>
      <ToggleRow
        Icon={IconChartCandle}
        iconColor="#f472b6"
        iconBg="rgba(244, 114, 182, 0.12)"
        label="Price Alerts"
        description="Get notified on big moves"
        value={priceAlerts}
        onValueChange={setPriceAlerts}
      />
      <Divider/>
      <ToggleRow
        Icon={IconNews}
        iconColor="#fbbf24"
        iconBg="rgba(251, 191, 36, 0.12)"
        label="News & Updates"
        description="Market news digests"
        value={newsAlerts}
        onValueChange={setNewsAlerts}
      />
    </Section>
  );
};
