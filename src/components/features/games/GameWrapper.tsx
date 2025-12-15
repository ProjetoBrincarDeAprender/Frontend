import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { useUser } from "@/hooks/User/useUser";
import { useEffect, useRef } from "react";
import Phaser from "phaser";

interface GameWrapperProps {
  gameConfig: Phaser.Types.Core.GameConfig;
  activityId?: number;
}

export function GameWrapper({ gameConfig, activityId }: GameWrapperProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (gameRef.current || !user) return;

    const config = {
      ...gameConfig,
      parent: containerRef.current,
    };

    gameRef.current = new Phaser.Game(config);

    if (user) {
      gameRef.current.registry.set("userData", user);
      if (activityId) {
        gameRef.current.registry.set("activityId", activityId);
      }
    }
  }, [user, activityId]);

  return (
    <>
      <div className="mt-28 mb-20 flex justify-center py-4">
        <Header />
        <BackButton />
        <div
          ref={containerRef}
          className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
        ></div>
      </div>
      <Footer />
    </>
  );
}
