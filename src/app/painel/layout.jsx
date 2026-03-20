export const metadata = {
  title: "Casa Inteligente | Painel CMS",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function PainelLayout({ children }) {
  return children;
}
