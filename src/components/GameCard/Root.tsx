import type { GameCardBadgeProps } from "./Badge";
import GameCardBadge from "./Badge";
import GameCardButton, { type GameCardButtonProps } from "./Button";
import type { GameCardContentProps } from "./Content";
import GameCardContent from "./Content";
import type { GameCardPreviewProps } from "./Preview";
import GameCardPreview from "./Preview";
import { GameCardWrapper, type GameCardWrapperProps } from "./Wrapper";

export const GameCard = {
  Wrapper: (props: GameCardWrapperProps) => <GameCardWrapper {...props} />,
  Content: (props: GameCardContentProps) => <GameCardContent {...props} />,
  Preview: (props: GameCardPreviewProps) => <GameCardPreview {...props} />,
  Button: (props: GameCardButtonProps) => <GameCardButton {...props} />,
  Badge: (props: GameCardBadgeProps) => <GameCardBadge {...props} />,
};
