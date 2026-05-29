import {NativeTabs} from 'expo-router/unstable-native-tabs';

import {Colors} from '@/core/constants';

const RootLayout = () => {
  return (
    <NativeTabs tintColor={Colors.accent}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon sf={{default: 'house', selected: 'house.fill'}} md="home"/>
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="market">
        <NativeTabs.Trigger.Icon sf="chart.line.uptrend.xyaxis" md="show_chart"/>
        <NativeTabs.Trigger.Label>Market</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="portfolio">
        <NativeTabs.Trigger.Icon sf={{default: 'chart.pie', selected: 'chart.pie.fill'}} md="pie_chart"/>
        <NativeTabs.Trigger.Label>Portfolio</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf={{default: 'person', selected: 'person.fill'}} md="person"/>
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search"/>
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
};

export default RootLayout;
