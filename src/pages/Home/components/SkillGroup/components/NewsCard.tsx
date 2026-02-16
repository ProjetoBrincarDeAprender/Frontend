import "./NewsCard.css";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText?: string;
  href?: string;
}

export function NewsCard({
  title,
  description,
  imageUrl,
  imageAlt,
  buttonText = "SAIBA MAIS",
  href,
}: NewsCardProps) {
  return (
    <div className="news-card bg-purplish-blue-dark flex min-h-[420px] w-full max-w-[420px] flex-col items-center overflow-hidden rounded-2xl">
      <div className="w-full p-4 pb-0">
        <img
          className="h-[14rem] w-full rounded-xl object-cover"
          src={imageUrl}
          alt={imageAlt || title}
        />
      </div>
      <div className="flex flex-1 flex-col items-center gap-2 px-6 pt-5 pb-3 text-center">
        <h3 className="text-lg leading-tight font-extrabold tracking-wide text-white uppercase">
          {title}
        </h3>
        <p className="text-sm leading-relaxed font-normal text-gray-300">
          {description}
        </p>
      </div>
      <div className="px-6 pt-3 pb-6">
        <a
          className="news-card__button inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-transparent bg-yellow-500 px-7 py-2.5 text-sm font-extrabold tracking-wide text-[#150e45]"
          href={`/${href}`}
        >
          {buttonText.toUpperCase()} &gt;
        </a>
      </div>
    </div>
  );
}
