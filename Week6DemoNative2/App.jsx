import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer, DeviceMotion} from 'expo-sensors';
import * as Battery from 'expo-battery';

const ACCELEROMETER_UPDATE_INTERVAL = 100;
  const SHAKE_THRESHOLD = 0.8;
  const SHAKE_TIME_WINDOW = 200;
  let shakeBatter = 0;

export default function App() {
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [subscription1, setSubscription1] = useState(null);
  const [batteryColor, setBatteryColor] = useState('red');
  const [batteryWidth, setBatteryWidth] = useState(0);

  

  const _subscribe1 = async () => {
    const batteryLevel = await Battery.getBatteryLevelAsync();
    setBatteryLevel(batteryLevel);

    setSubscription1(
      Battery.addBatteryLevelListener(({ batteryLevel }) => {
        setBatteryLevel(batteryLevel);
        console.log('batteryLevel changed!', batteryLevel);
      })
    );
  };

  const _unsubscribe1 = useCallback(() => {
    subscription1 && subscription1.remove();
    setSubscription1(null);
  }, [subscription1]);

  useEffect(() => {
    _subscribe1();
    return () => _unsubscribe1();
  }, []);
  
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  
  const [isShaking, setIsShaking] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const currentTime = Date.now();
  const timeSinceLastShake = currentTime - lastShakeTime;
  useEffect(() => {
    shakeBatter = batteryLevel * 100
  }, [])
  useEffect(() => {
  if (
    (Math.abs(x) > SHAKE_THRESHOLD ||
      Math.abs(y) > SHAKE_THRESHOLD) &&
    timeSinceLastShake > SHAKE_TIME_WINDOW
  ) {
    setIsShaking(true);
    setLastShakeTime(currentTime);
    if (shakeBatter < 100){
      let tempWidth = shakeBatter * 3.9;
      setBatteryWidth(tempWidth); 
      shakeBatter += 5;
      if (shakeBatter < 20){
        setBatteryColor('red')
      }
      else if (shakeBatter < 50){
        setBatteryColor('yellow')
      }
      else{
        setBatteryColor('green')
      }
      
    }
    else{
      shakeBatter = "full";
    }
    
  } else {
    setIsShaking(false); // Reset shaking state after time window elapses
  }
  }, [x])
  

  const [subscription2, setSubscription2] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const _subscribe2 = () => {
    setSubscription2(Accelerometer.addListener(setData));
  };

  const _unsubscribe2 = () => {
    subscription2 && subscription2.remove();
    setSubscription2(null);
  };

  useEffect(() => {
    _subscribe2();
    return () => _unsubscribe2();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>x: {Math.round(x * 100) / 100}</Text>
      <Text style={styles.text}>y: {Math.round(y * 100) / 100}</Text>
      <Text style={styles.text}>z: {Math.round(z * 100) / 100}</Text> */}
      <Text style={[styles.text, {color: batteryColor}]}>Battery: {shakeBatter}</Text>
      <View style={{width: 390, height: 100 }}>
        <View style={{backgroundColor: batteryColor, width: batteryWidth || 0, height: 70, marginTop: 25}}>

        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscription2 ? _unsubscribe2 : _subscribe2}
          style={styles.button}
        >
          <Text>{subscription2 ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  
});