import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

interface AnimatedScreenProps {
  setShowAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AnimationScreen({
  setShowAnimation,
}: AnimatedScreenProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  const player = useVideoPlayer(require("@/assets/splash/video.mp4"), (playerInstance) => {
    playerInstance.loop = false;
    playerInstance.muted = true;
    playerInstance.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShowAnimation(false);
        }
      });
    });

    return () => {
      subscription.remove();
    }; 
  }, [opacity, player, setShowAnimation]);

  return (
    <Animated.View
      className="flex-1 items-center justify-center bg-[#f4f4f4] px-6"
      style={{ opacity }}
    >
      <VideoView
        player={player}
        contentFit="contain"
        nativeControls={false}
        allowsFullscreen={false}
        style={{
          width: 600,
          height: 600,

        }}
      />
    </Animated.View>
  );
}
