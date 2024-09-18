import { useEffect, useState, useCallback } from 'react';
import * as Battery from 'expo-battery';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [subscription, setSubscription] = useState<Battery.Subscription | null>;

  const _subscribe = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    setBatteryLevel(batteryLevel);

    setSubscription(
      Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
        console.log('batteryLevel changed!', batteryLevel);
      })
    );
  };

  const _unsubscribe = useCallback(() => {
    subscription && subscription.remove();
    setSubscription(null);
  }, [subscription]);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, [_unsubscribe]);

  return (
    <View style={styles.container}>
      <Text>Current Battery Level: {batteryLevel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});