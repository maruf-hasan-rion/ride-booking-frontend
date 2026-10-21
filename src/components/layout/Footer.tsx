import { Link } from "react-router";

const footerGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Book a Ride", href: "/login" },
      { label: "Become a Driver", href: "/register" },
      { label: "Help Center", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Safety", href: "/features" },
      { label: "Support Team", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Terms of Service", href: "/faq" }],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="section-shell space-y-8 py-16 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Link
              to="/"
              className="brand-gradient-text text-2xl font-bold"
            >
              GoMove
            </Link>

            <p className="mt-4 max-w-xs text-muted-foreground">
              Dependable rides for every day travel, with verified drivers,
              secure trips, and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="font-medium text-foreground/90">{group.title}</p>

                <ul className="mt-6 space-y-4 text-sm">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}-${link.label}`}>
                      <Link
                        to={link.href}
                        className="text-foreground/85 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} GoMove. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
