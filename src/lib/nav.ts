export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Qui sommes-nous", href: "/qui-sommes-nous" },
  { label: "Expertises", href: "/expertises" },
  { label: "Événements & Productions", href: "/evenements-productions" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
];

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "YouTube", href: "https://www.youtube.com" },
];
