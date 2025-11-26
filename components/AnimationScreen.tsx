import { useEffect } from "react";
import { View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { Text } from "react-native";

interface AnimatedScreenProps {
  setShowAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AnimationScreen({
  setShowAnimation,
}: AnimatedScreenProps) {
  const player = useVideoPlayer(require("@/assets/splash/video.mp4"), (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.muted = true;
    playerInstance.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      setTimeout(() => {
        setShowAnimation(false);
      }, 100);
    });

    return () => {
      subscription.remove();
    };
  }, [player, setShowAnimation]);

  return (
    <View className="flex-1 items-center justify-center bg-[#f4f4f4] px-6 dark:bg-black">
      <VideoView
        player={player}
        contentFit="contain"
        nativeControls={false}
        allowsFullscreen={false}
        style={{
          width: 600,
          height: 400,
          marginRight: 60,
        }}
      />
    </View>
  );
}
