import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as React from 'react';
import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Accelerometer, DeviceMotion } from 'expo-sensors';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSpring } from 'react-native-reanimated';


const SHAKE_THRESHOLD = 0.8;
// Define types for Stack and Tab navigators
type StackParamList = {
  Screen1: undefined;
  Screen2: undefined;
};

type TabParamList = {
  Tab1: { screen: keyof StackParamList };
  Tab2: { screen: keyof StackParamList };
};

const Stack = createStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

type StackNavigatorProps = {
  route: RouteProp<TabParamList, 'Tab1'> | RouteProp<TabParamList, 'Tab2'>;
  navigation: StackNavigationProp<StackParamList>;
};

function StackNavigator({ route }: StackNavigatorProps) {
  const initialScreen = route.params?.screen || 'Screen1';

  return (
    <Stack.Navigator initialRouteName={initialScreen}>
      <Stack.Screen name="Screen1" component={Game} options={{ headerShown: false }} />
      <Stack.Screen name="Screen2" component={Details} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Tab1"
        component={StackNavigator}
        initialParams={{ screen: 'Screen1' }}
        options={{ title: 'Bootleg Pocket' }}
      />

      <Tab.Screen
        name="Tab2"
        component={StackNavigator}
        initialParams={{ screen: 'Screen2' }}
        options={{ title: 'Details' }}
      />
    </Tab.Navigator>
  );
}

export function Details({ navigation }: { navigation: StackNavigationProp<StackParamList> }) {
  return (

      <View style={styles.container}>
        <Text style={styles.textHead}>Details</Text>
        <Text>Welcome to my bootleg pokemon game</Text>
        <Text>Here you will find information on the behaviors</Text>
        <Text>of all the attacks for both the player and the enemy</Text>
        <Text> aswell as the use of all the buttons</Text>
        <Text></Text>
        <Text style={styles.textHead}>Enemy Behavior</Text>
        <Text>The Enemy has 4 main moves:</Text>
        <Text>Attack 1: Hits for A random damage ammount between 5 and 10</Text>
        <Text>Attack 2: Hits for A random damage ammount between 2 and 7</Text>
        <Text>Attack 3: Hits for either 0 damage or 10 damage</Text>
        <Text>Heal: Heals for A random number between 2 and 7</Text>
        <Text></Text>
        <Text style={styles.textHead}>Player Attacks</Text>
        <Text>The Player has 4 main moves:</Text>
        <Text>Attack 1: Hits for A random damage ammount between 5 and 10</Text>
        <Text>Attack 2: Has a 1/100 chance to one shot the opponenet</Text>
        <Text>Attack 3: Has a 50/50 chance to hit for 10 damage or 0</Text>
        <Text>Heal: Has the user shake the phone for 3 seconds</Text>
        <Text> and adds health based on how over 10 </Text>
        <Text>If heal is for less then 10 then it will not apply</Text>
        <Text></Text>
        <Text style={styles.textHead}>Other Game mechanics</Text>
        <Text>Reset Game: Resets the health, turns, and current pokemon</Text>
        <Text>Critcal hit: There is a 1/10 chance to hit double damage</Text>
        <Text>Note: Doesn't affect to healing or one shot</Text>
        <Text>Game End: Game ends after a player hits 0 health</Text>
        
      </View>
  );
}

export function Game({ navigation }: { navigation: StackNavigationProp<StackParamList> }) {

  const [isShaking, setIsShaking] = useState(false);
  const [lastShakeTime, setLastShakeTime] = useState(0);
  const currentTime = Date.now();
  const timeSinceLastShake = currentTime - lastShakeTime;
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [updateBar, setUpdateBar] = useState('');
  const [text, setText] = useState('');
  const [playerHit, setPlayerHit] = useState('');
  const [enemyHit, setEnemyHit] = useState('');
  const [turn, setTurn] = useState(0);
  const [gameEnd, setGameEnd] = useState('');
  const [gameState, setGameState] = useState('live');
  const [poke1, setPoke1] = useState<{ name: string; sprite: string } | null>(null);
  const [poke2, setPoke2] = useState<{ name: string; sprite: string } | null>(null);
  const translateX = useSharedValue(0);

  useEffect(() => {
    fetchPokemon();
  }, []);
  async function fetchPokemon() {
    try {
      const poke1Id = Math.floor(Math.random() * (1025 - 1 + 1)) + 1;
      const poke2Id = Math.floor(Math.random() * (1025 - 1 + 1)) + 1;

      const poke1Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke1Id}`);
      const poke1Data = await poke1Response.json();

      const poke2Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke2Id}`);
      const poke2Data = await poke2Response.json();

      setPoke1({ name: poke1Data.name, sprite: poke1Data.sprites.front_default });
      setPoke2({ name: poke2Data.name, sprite: poke2Data.sprites.front_default });


    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  }

  const playerWobble = useSharedValue(0);
  const enemyWobble = useSharedValue(0);

  const playerWobbleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${playerWobble.value}deg` },
        { translateX: playerWobble.value }
      ],
    };
  });

  const enemyWobbleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${enemyWobble.value}deg` },
        { translateX: enemyWobble.value }
      ],
    };
  });

  useEffect(() => {
    if (playerHit) {
      playerWobble.value = withSpring(5, { damping: 1, stiffness: 100 });
      setTimeout(() => {
        playerWobble.value = withSpring(0, { damping: 1, stiffness: 100 });
      }, 100);
    }
  }, [playerHit]);

  useEffect(() => {
    if (enemyHit) {
      enemyWobble.value = withSpring(5, { damping: 1, stiffness: 100 });
      setTimeout(() => {
        enemyWobble.value = withSpring(0, { damping: 1, stiffness: 100 });
      }, 100);
    }
  }, [enemyHit]);

  useEffect(() => {
    if (playerHealth > 100) {
      setPlayerHealth(100);
    } else if (playerHealth < 0) {
      setGameEnd('GAME OVER || ENEMY WINS');
      setGameState('dead');
      setPlayerHealth(0);
    }

    if (enemyHealth > 100) {
      setEnemyHealth(100);
    } else if (enemyHealth < 0) {
      setGameEnd('GAME OVER || PLAYER WINS');
      setGameState('dead');
      setEnemyHealth(0);
    }
  }, [playerHealth, enemyHealth]);

  useEffect(() => {
    if (playerHealth < 1) {
      setGameEnd('GAME OVER || ENEMY WINS')
    }
    if (enemyHealth < 1) {
      setGameEnd('GAME OVER || PLAYER WINS')
    }

  }, [turn])
  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }
  function Reset(): void {
    setPlayerHealth(100);
    setEnemyHealth(100);
    setGameEnd('');
    setTurn(0);
    setGameState('live');
    fetchPokemon();

  }
  async function EnemyAttack(): Promise<void> {
    if (gameState === 'live') {
      setUpdateBar("");
      const min = 1;
      const max = 4;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const critChance = Math.floor(Math.random() * (10 - 1 + 1)) + 1;

      setText(randomNumber.toString());

      if (randomNumber === 1) {
        const min = 5;
        const max = 10;
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (critChance === 10) {
          randomNumber = randomNumber * 2;
          setUpdateBar("CRITICAL HIT ON PLAYER");
        } else {
          setUpdateBar("");
        }

        setPlayerHit(' - ' + randomNumber);
        setPlayerHealth((prevHealth) => prevHealth - randomNumber); // Using the previous health value
        await timeout(1000);
        setUpdateBar("");
        setPlayerHit('');
      } else if (randomNumber === 2) {
        const min = 2;
        const max = 7;
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (critChance === 10) {
          randomNumber = randomNumber * 2;
          setUpdateBar("CRITICAL HIT ON PLAYER");
        } else {
          setUpdateBar("");
        }

        setPlayerHit(' - ' + randomNumber);
        setPlayerHealth((prevHealth) => prevHealth - randomNumber); // Using the previous health value
        await timeout(1000);
        setUpdateBar("");
        setPlayerHit('');

      } else if (randomNumber === 3) {
        const min = 1;
        const max = 2;
        let hit = 0;
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        if (randomNumber === 1) {
          hit = 0;
        } else {
          hit = 10;
        }

        if (critChance === 10) {
          hit = hit * 2;
          setUpdateBar("CRITICAL HIT ON PLAYER");
        } else {
          setUpdateBar("");
        }

        setPlayerHit(' - ' + hit);
        setPlayerHealth((prevHealth) => prevHealth - hit); // Using the previous health value
        await timeout(1000);
        setUpdateBar("");
        setPlayerHit('');

      } else {
        const healMin = 2;
        const healMax = 7;
        const healAmount = Math.floor(Math.random() * (healMax - healMin + 1)) + healMin;
        setGameEnd("ENEMY HEALING");
        setEnemyHit(' + ' + healAmount); // Show healing text
        setEnemyHealth((prevHealth) => prevHealth + healAmount); // Update enemy health with healing
        await timeout(1000); // Wait before resetting the UI
        setGameEnd('');
        setEnemyHit(''); // Clear the healing text
      }

      setTurn((prevTurn) => prevTurn + 1);
    }
  }//FINSIHED ENEMY ATTACK [CAN UPDATE DAMAGE AND CHANCES]
  async function Attack1(): Promise<void> {
    if (gameState === 'live') {
      setUpdateBar("");
      const critChance = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
      const min = 5;
      const max = 10;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (critChance === 10) {
        randomNumber * 2;
        setUpdateBar("CRITICAL HIT ON ENEMY");
      }
      else {
        setUpdateBar("");

      }
      setEnemyHit(' - ' + randomNumber);
      let temp = enemyHealth;
      temp = temp - randomNumber;
      setEnemyHealth(temp);

      await timeout(1000);

      setEnemyHit('');
      EnemyAttack();
      await timeout(1000);
    }


  }
  async function Attack2(): Promise<void> {
    if (gameState === 'live') {
      setUpdateBar("");
      const min = 1;
      const max = 100;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      if (randomNumber === 100) {
        setUpdateBar("HIT ONE SHOT");
        setEnemyHit(' - ' + enemyHealth);
        setEnemyHealth(0);
      }
      else {
        setUpdateBar("MISS");
      }
      await timeout(1000);

      setEnemyHit('');
      EnemyAttack();
      await timeout(1000);
    }


  }
  async function Attack3(): Promise<void> {
    if (gameState === 'live') {
      let critChance = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
      const min = 1;
      const max = 2;
      let hit = 0;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

      if (randomNumber === 1) {
        hit = 0;
      } else {
        hit = 10;
      }

      if (critChance === 10) {
        hit = hit * 2;
        setUpdateBar("CRITICAL HIT ON PLAYER");
      } else {
        setUpdateBar("");
      }

      setEnemyHit(' - ' + hit);
      setEnemyHealth((prevHealth) => prevHealth - hit);
      await timeout(1000);
      setUpdateBar("");
      setEnemyHit('');
      EnemyAttack();
    }

  }
  async function Attack4(): Promise<void> {
    if (gameState === 'live') {
      let shakeCounter = 0;

      Accelerometer.setUpdateInterval(200);
      const subscription = Accelerometer.addListener(({ x, y, z }) => {
        const totalForce = Math.sqrt(x * x + y * y + z * z);


        if (totalForce > SHAKE_THRESHOLD) {
          shakeCounter += 1;
        }
      });

      setGameEnd("SHAKE YOUR PHONE");


      await timeout(3000);


      subscription && subscription.remove();
      setGameEnd("");


      if (shakeCounter > 10) {

        const healingAmount = shakeCounter;
        setPlayerHit(` + ${healingAmount}`);
        setPlayerHealth((prevHealth) => prevHealth + healingAmount);
      } else {

        setUpdateBar("Not enough shaking!");
      }
      await timeout(1000);
      setPlayerHit('');
      EnemyAttack();
    }

  }

  return (
    <View style={styles.container}>
      <View style={{
        width: 400,
        height: 500,
        borderColor: 'black',
        borderWidth: 2,

      }}>
        <View style={styles.updateText}>
          <Text style={styles.announcment}>{gameEnd}</Text>
          <Text style={styles.announcment} >Turn: {turn}</Text>
          <Text style={styles.announcment}>{updateBar}</Text>
        </View>
        <View style={[styles.boxText, styles.enemy]}>
          <Animated.View style={[styles.imageContainer, enemyWobbleStyle]}>
            <Image
              source={{ uri: `${poke2?.sprite}` }}
              style={styles.spriteImage}
            />
          </Animated.View>
          <Text>{poke2?.name.toUpperCase()}</Text>
          <Text >Enemies Health: {enemyHealth} &nbsp;{enemyHit}</Text>



        </View>
        <View style={[styles.boxText, styles.user]}>
          <Animated.View style={[styles.imageContainer, playerWobbleStyle]}>
            <Image
              source={{ uri: `${poke1?.sprite}` }}
              style={styles.spriteImage}
            />
          </Animated.View>
          <Text>{poke1?.name.toUpperCase()}</Text>
          <Text >Your Health: {playerHealth} &nbsp;{playerHit}</Text>



        </View>


      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.buttons, styles.attackButtons]} onPress={() => Attack1()}>
          <Text style={styles.buttonContent}>Attack 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttons, styles.attackButtons]} onPress={() => Attack2()}>
          <Text style={styles.buttonContent}>Attack 2</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.buttons, styles.attackButtons]} onPress={() => Attack3()}>
          <Text style={styles.buttonContent}>Attack 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttons, styles.healButtons]} onPress={() => Attack4()}>
          <Text style={styles.buttonContent}>Heal</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity style={[styles.buttons, styles.resetButton]} onPress={() => Reset()}>
          <Text style={styles.resetText}>Reset Game</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  user: {
    marginLeft: 50
  },
  enemy: {
    marginRight: 20,
    marginTop: -20
  },
  textHead:{
    fontSize: 30,
    marginTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    width: 150,
    padding: 20,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 60
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    margin: 15
  },
  updateText: {
    flex: 1,
    margin: 'auto',
    height: 30
  },
  boxText: {
    width: 180,
    margin: 'auto'
  },
  imageContainer: {
    width: 150,
    height: 150,
  },
  spriteImage: {
    width: 150,
    height: 150,
  },
  announcment: {
    fontSize: 20,
    margin: 'auto',
  },
  attackButtons: {
    backgroundColor: '#FF474C',
  },
  buttonContent:{
    color: 'white',
    margin: 'auto',
  },
  healButtons: {
    backgroundColor: '#EA4C89'
  },
  resetButton: {
    borderWidth: 1,
  },
  resetText: {
    margin: 'auto'
  }
});
