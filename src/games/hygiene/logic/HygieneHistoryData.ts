export const HistoryData: {
  images: { path: string; scale: number }[] | null;
  text: string;
}[] = [
  {
    images: null,
    text: "Olá! Vamos aprender sobre higiene pessoal!",
  },
  {
    images: null,
    text: "A higiene pessoal é muito importante para nossa saúde e bem-estar",
  },
  {
    images: [
      { path: "/assets/hygieneGame/history/sabao.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/lavandoMao.png", scale: 0.6 },
    ],
    text: "Devemos sempre LAVAR AS MÃOS antes das refeições e após usar o banheiro",
  },
  {
    images: [
      { path: "/assets/hygieneGame/history/pastaEscova.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/escovandoDente.png", scale: 0.6 },
    ],
    text: "É importante ESCOVAR OS DENTES após as refeições com ESCOVA e PASTA DE DENTE",
  },
  {
    images: [{ path: "/assets/hygieneGame/history/fioDental.png", scale: 1 }],
    text: "O FIO DENTAL ajuda a limpar entre os dentes onde a escova não alcança",
  },
  {
    images: [
      { path: "/assets/hygieneGame/history/shampoo.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/tomandoBanho.png", scale: 0.5 },
      { path: "/assets/hygieneGame/history/sabao.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/toalha.png", scale: 0.7 },
    ],
    text: "TOMAR BANHO regularmente com SABÃO e SHAMPOO mantém nosso corpo limpo",
  },
  {
    images: [
      { path: "/assets/hygieneGame/history/pente.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/penteandoCabelo.png", scale: 0.6 },
      { path: "/assets/hygieneGame/history/escovaCabelo.png", scale: 0.7 },
    ],
    text: "Cuidar do CABELO é muito importante, utilizamos o PENTE para PENTEAR e a ESCOVA para ESCOVAR o cabelo",
  },
  {
    images: [
      { path: "/assets/hygieneGame/history/cortaUnha.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/cortandoUnha.png", scale: 0.6 },
    ],
    text: "É muito importante também CORTAR AS UNHAS regularmente para evitar sujeira e bactérias",
  },
  {
    images: [
      { path: "/assets/hygieneGame/history/mascara.png", scale: 0.7 },
      { path: "/assets/hygieneGame/history/usandoMascara.png", scale: 0.6 },
    ],
    text: "Usar MÁSCARA quando necessário também faz parte dos cuidados com a higiene",
  },
  {
    images: null,
    text: "Agora que você conhece os cuidados de higiene, vamos testar seus conhecimentos!",
  },
];
