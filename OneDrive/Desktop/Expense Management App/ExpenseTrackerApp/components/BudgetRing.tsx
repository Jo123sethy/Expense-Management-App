import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useEffect, useRef, useMemo } from "react";
import { ThemePalette } from "@/styles/globalStyles";

type BudgetRingProps = {
  progress: number;
  theme: ThemePalette;
  color: string;
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function BudgetRing({ progress, theme, color }: BudgetRingProps) {
  const size = 140;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 800,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [progress, animatedValue]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - progress)],
  });

  const backStroke = useMemo(() => circumference.toFixed(2), [circumference]);

  return (
    <View style={[styles.chart, { backgroundColor: theme.card, shadowColor: color }]}>      
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.gradientA} />
            <Stop offset="100%" stopColor={theme.gradientB} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.border}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.35}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${backStroke} ${backStroke}`}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    width: 152,
    height: 152,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 28,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
});
