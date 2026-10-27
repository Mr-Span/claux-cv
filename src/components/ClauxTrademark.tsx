import { sitePath } from "../sitePaths";

type TrademarkSurface = "light" | "cocoa";
type TrademarkFormat = "compact" | "full";

type ClauxTrademarkProps = {
  surface?: TrademarkSurface;
  format?: TrademarkFormat;
  className?: string;
  decorative?: boolean;
};

const trademarkAssets = {
  compact: {
    width: 490,
    height: 128,
    light: "/brand/claux/svg/claux-compact-primary.svg",
    cocoa: "/brand/claux/svg/claux-compact-reverse.svg",
  },
  full: {
    width: 920,
    height: 256,
    light: "/brand/claux/svg/claux-primary-light.svg",
    cocoa: "/brand/claux/svg/claux-reverse-cocoa.svg",
  },
} as const;

export function ClauxTrademark({
  surface = "light",
  format = "compact",
  className,
  decorative = false,
}: ClauxTrademarkProps) {
  const asset = trademarkAssets[format];
  const classes = ["claux-trademark", className].filter(Boolean).join(" ");

  return (
    <img
      className={classes}
      src={sitePath(asset[surface])}
      alt={decorative ? "" : "CLAUX"}
      aria-hidden={decorative || undefined}
      width={asset.width}
      height={asset.height}
      decoding="async"
      draggable={false}
    />
  );
}
