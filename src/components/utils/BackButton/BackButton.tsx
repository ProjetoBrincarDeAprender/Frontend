import { useNavigate } from "react-router";
import btnVoltar from "../../../assets/btn-voltar.svg";
import "./BackButton.css";

export function BackButton() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleGoBack}
      className="back-button"
      aria-label="Voltar para página anterior"
      title="Voltar"
    >
      <img src={btnVoltar} alt="Botão Voltar" />
    </button>
  );
}