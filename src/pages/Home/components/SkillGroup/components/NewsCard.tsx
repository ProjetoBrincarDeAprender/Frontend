import "./NewsCard.css";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  href?: string;
}

export function NewsCard({
  title,
  description,
  imageUrl,
  imageAlt,
  buttonText = "SAIBA MAIS",
  onButtonClick,
  href,
}: NewsCardProps) {
  const handleClick = () => {
    if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className="news-card">
      <div className="news-card__image-wrapper">
        <img
          className="news-card__image"
          src={imageUrl}
          alt={imageAlt || title}
        />
      </div>
      <div className="news-card__content">
        <h3 className="news-card__title">{title}</h3>
        <p className="news-card__description">{description}</p>
      </div>
      <div className="news-card__action">
        <button className="news-card__button" onClick={handleClick}>
          {buttonText.toUpperCase()} &gt;
        </button>
      </div>
    </div>
  );
}
