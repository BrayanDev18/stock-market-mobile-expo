import {useState} from 'react';
import {View, Text, ScrollView, Pressable, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {LinearGradient} from 'expo-linear-gradient';
import {Image} from 'expo-image';
import {
  IconSettings,
  IconBell,
  IconChevronRight,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconUser,
  IconShieldLock,
  IconBadgeFilled,
  IconCrown,
  IconFingerprint,
  IconLanguage,
  IconCurrencyDollar,
  IconMap2,
  IconReceipt2,
  IconBookmarks,
  IconClockHour4,
  IconChartCandle,
  IconNews,
  IconHelpCircle,
  IconMessageCircle,
  IconStar,
  IconFileText,
  IconFileCertificate,
  IconLicense,
  IconLogout,
  IconCircleCheckFilled,
  IconEdit,
} from '@tabler/icons-react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOptionProps {
  id: ThemeMode;
  label: string;
  Icon: typeof IconSun;
}

const THEME_OPTIONS: ThemeOptionProps[] = [
  {id: 'light', label: 'Light', Icon: IconSun},
  {id: 'dark', label: 'Dark', Icon: IconMoon},
  {id: 'system', label: 'System', Icon: IconDeviceDesktop},
];

interface MenuRowProps {
  Icon: typeof IconSettings;
  iconColor: string;
  iconBg: string;
  label: string;
  value?: string;
  valueColor?: string;
  showChevron?: boolean;
  onPress?: () => void;
}

const MenuRow = ({
  Icon,
  iconColor,
  iconBg,
  label,
  value,
  valueColor = 'text-neutral-500',
  showChevron = true,
  onPress,
}: MenuRowProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center py-3.5 px-4"
  >
    <View
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{backgroundColor: iconBg}}
    >
      <Icon size={18} color={iconColor}/>
    </View>

    <Text className="text-neutral-200 text-base flex-1 ml-3">{label}</Text>

    {value && (
      <Text className={`text-sm ${valueColor} mr-1`}>{value}</Text>
    )}

    {showChevron && <IconChevronRight size={16} color="#525252"/>}
  </Pressable>
);

interface ToggleRowProps {
  Icon: typeof IconSettings;
  iconColor: string;
  iconBg: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleRow = ({
  Icon,
  iconColor,
  iconBg,
  label,
  description,
  value,
  onValueChange,
}: ToggleRowProps) => (
  <View className="flex-row items-center py-3.5 px-4">
    <View
      className="w-9 h-9 rounded-full items-center justify-center"
      style={{backgroundColor: iconBg}}
    >
      <Icon size={18} color={iconColor}/>
    </View>

    <View className="flex-1 ml-3">
      <Text className="text-neutral-200 text-base">{label}</Text>
      {description && (
        <Text className="text-neutral-500 text-xs mt-0.5">{description}</Text>
      )}
    </View>

    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{false: '#262626', true: '#4ade80'}}
      thumbColor="white"
      ios_backgroundColor="#262626"
    />
  </View>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({title, children}: SectionProps) => (
  <View className="mt-6 gap-3">
    <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider px-5">
      {title}
    </Text>
    <View className="bg-surface-light rounded-2xl mx-4 overflow-hidden">
      {children}
    </View>
  </View>
);

const Divider = () => <View className="h-px bg-neutral-800/80 ml-16"/>;

const ProfileScreen = () => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [biometric, setBiometric] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);

  return (
    <View className="flex-1 bg-surface">
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
            <Text className="text-white text-2xl font-bold">Settings</Text>

            <Pressable
              className="w-11 h-11 rounded-2xl bg-neutral-900/70 items-center justify-center border border-neutral-800"
            >
              <IconBell size={18} color="white"/>
            </Pressable>
          </View>

          {/* Profile Hero */}
          <View className="mx-4">
            <LinearGradient
              colors={['#1a1a1a', '#0f0f0f']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                padding: 20,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: '#262626',
              }}
            >
              <View className="flex-row items-center">
                <View className="relative">
                  <Image
                    source={{uri: 'https://editorial.uefa.com/resources/027b-16a6f83fcf8f-179708787343-1000/cristiano_ronaldo_of_portugal_celebrates_after_scoring_a.jpeg'}}
                    style={{width: 64, height: 64, borderRadius: 20}}
                  />
                  <View className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
                    <IconCircleCheckFilled size={18} color="#4ade80"/>
                  </View>
                </View>

                <View className="ml-4 flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-white text-lg font-bold">Cristiano Ronaldo</Text>
                    <IconBadgeFilled size={14} color="#3b82f6"/>
                  </View>
                  <Text className="text-neutral-400 text-xs">cristiano@quantix.app</Text>

                  <View className="flex-row items-center gap-1.5 mt-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-2.5 py-1 self-start">
                    <IconCrown size={12} color="#fbbf24"/>
                    <Text className="text-yellow-400 text-[10px] font-semibold">Pro Member</Text>
                  </View>
                </View>

                <Pressable className="w-9 h-9 rounded-full bg-neutral-800 items-center justify-center">
                  <IconEdit size={16} color="white"/>
                </Pressable>
              </View>

              {/* Stats row */}
              <View className="flex-row mt-5 pt-4 border-t border-neutral-800">
                <View className="flex-1 items-center gap-0.5">
                  <Text className="text-neutral-500 text-[10px] uppercase tracking-wider">Portfolio</Text>
                  <Text className="text-white text-sm font-semibold">$89.4K</Text>
                </View>
                <View className="w-px bg-neutral-800"/>
                <View className="flex-1 items-center gap-0.5">
                  <Text className="text-neutral-500 text-[10px] uppercase tracking-wider">Member</Text>
                  <Text className="text-white text-sm font-semibold">2 yrs</Text>
                </View>
                <View className="w-px bg-neutral-800"/>
                <View className="flex-1 items-center gap-0.5">
                  <Text className="text-neutral-500 text-[10px] uppercase tracking-wider">Trades</Text>
                  <Text className="text-white text-sm font-semibold">148</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Theme Switch */}
          <View className="mt-6 gap-3">
            <Text className="text-neutral-500 text-xs font-semibold uppercase tracking-wider px-5">
              Appearance
            </Text>

            <View className="bg-surface-light rounded-2xl mx-4 p-1.5 flex-row">
              {THEME_OPTIONS.map(({id, label, Icon}) => {
                const isActive = theme === id;

                return (
                  <Pressable
                    key={id}
                    onPress={() => setTheme(id)}
                    className="flex-1"
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={['#4ade80', '#22c55e']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          paddingVertical: 12,
                          borderRadius: 14,
                        }}
                      >
                        <Icon size={16} color="black"/>
                        <Text className="text-black text-sm font-semibold">{label}</Text>
                      </LinearGradient>
                    ) : (
                      <View className="flex-row items-center justify-center gap-1.5 py-3">
                        <Icon size={16} color="#a3a3a3"/>
                        <Text className="text-neutral-400 text-sm font-medium">{label}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Quick toggles */}
          <Section title="Quick Settings">
            <ToggleRow
              Icon={IconFingerprint}
              iconColor="#4ade80"
              iconBg="rgba(74, 222, 128, 0.12)"
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

          {/* Account */}
          <Section title="Account">
            <MenuRow
              Icon={IconUser}
              iconColor="#60a5fa"
              iconBg="rgba(96, 165, 250, 0.12)"
              label="Personal Information"
            />
            <Divider/>
            <MenuRow
              Icon={IconShieldLock}
              iconColor="#4ade80"
              iconBg="rgba(74, 222, 128, 0.12)"
              label="Security & Privacy"
            />
            <Divider/>
            <MenuRow
              Icon={IconBadgeFilled}
              iconColor="#3b82f6"
              iconBg="rgba(59, 130, 246, 0.12)"
              label="Identity Verification"
              value="Verified"
              valueColor="text-green-400"
            />
            <Divider/>
            <MenuRow
              Icon={IconCrown}
              iconColor="#fbbf24"
              iconBg="rgba(251, 191, 36, 0.12)"
              label="Subscription"
              value="Pro"
              valueColor="text-yellow-400"
            />
          </Section>

          {/* Trading */}
          <Section title="Trading">
            <MenuRow
              Icon={IconReceipt2}
              iconColor="#4ade80"
              iconBg="rgba(74, 222, 128, 0.12)"
              label="Order Preferences"
            />
            <Divider/>
            <MenuRow
              Icon={IconBookmarks}
              iconColor="#a855f7"
              iconBg="rgba(168, 85, 247, 0.12)"
              label="Watchlists"
              value="4"
            />
            <Divider/>
            <MenuRow
              Icon={IconClockHour4}
              iconColor="#f472b6"
              iconBg="rgba(244, 114, 182, 0.12)"
              label="Trading Hours"
            />
          </Section>

          {/* Region & Format */}
          <Section title="Region & Format">
            <MenuRow
              Icon={IconLanguage}
              iconColor="#60a5fa"
              iconBg="rgba(96, 165, 250, 0.12)"
              label="Language"
              value="English"
            />
            <Divider/>
            <MenuRow
              Icon={IconCurrencyDollar}
              iconColor="#4ade80"
              iconBg="rgba(74, 222, 128, 0.12)"
              label="Currency"
              value="USD"
            />
            <Divider/>
            <MenuRow
              Icon={IconMap2}
              iconColor="#fbbf24"
              iconBg="rgba(251, 191, 36, 0.12)"
              label="Region"
              value="United States"
            />
          </Section>

          {/* Support */}
          <Section title="Support">
            <MenuRow
              Icon={IconHelpCircle}
              iconColor="#60a5fa"
              iconBg="rgba(96, 165, 250, 0.12)"
              label="Help Center"
            />
            <Divider/>
            <MenuRow
              Icon={IconMessageCircle}
              iconColor="#4ade80"
              iconBg="rgba(74, 222, 128, 0.12)"
              label="Contact Support"
            />
            <Divider/>
            <MenuRow
              Icon={IconStar}
              iconColor="#fbbf24"
              iconBg="rgba(251, 191, 36, 0.12)"
              label="Rate QuantiX"
            />
          </Section>

          {/* Legal */}
          <Section title="Legal">
            <MenuRow
              Icon={IconFileText}
              iconColor="#a3a3a3"
              iconBg="rgba(163, 163, 163, 0.12)"
              label="Terms of Service"
            />
            <Divider/>
            <MenuRow
              Icon={IconFileCertificate}
              iconColor="#a3a3a3"
              iconBg="rgba(163, 163, 163, 0.12)"
              label="Privacy Policy"
            />
            <Divider/>
            <MenuRow
              Icon={IconLicense}
              iconColor="#a3a3a3"
              iconBg="rgba(163, 163, 163, 0.12)"
              label="Licenses"
            />
          </Section>

          {/* Log out */}
          <View className="mt-8 px-4">
            <Pressable className="flex-row items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 rounded-2xl py-4">
              <IconLogout size={18} color="#f87171"/>
              <Text className="text-red-400 text-base font-semibold">Log Out</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="items-center gap-1 mt-6 mb-32">
            <Text className="text-neutral-600 text-xs">QuantiX v1.0.0</Text>
            <Text className="text-neutral-700 text-[10px]">Build 2026.04.10</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
