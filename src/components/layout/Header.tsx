import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { OverOnsNav } from "@/components/layout/OverOnsNav";
import { NexavoLogo } from "@/components/layout/NexavoLogo";
import { Separator } from "@/components/ui/separator";
import { getHeroScrollEnd } from "@/lib/heroScroll";

import { ROUTES } from "@/lib/routes";

const navItems = [
  { label: "Prijzen", href: ROUTES.pricing },
  { label: "Contact", href: ROUTES.contact },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [atHero, setAtHero] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setAtHero(false);
      return;
    }

    const update = () => {
      setAtHero(window.scrollY < getHeroScrollEnd() - 72);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [isHome]);

  const navLinkClass = (href: string) => {
    const isActive = location.pathname === href;
    return cn(
      "text-sm font-medium transition-colors",
      atHero
        ? isActive
          ? "text-white"
          : "text-white/70 hover:text-white"
        : isActive
          ? "text-foreground"
          : "text-foreground/70 hover:text-foreground",
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        atHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/50 bg-white",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-5 md:px-8">
        <div className="flex min-w-0 items-center gap-8 lg:gap-10">
          <Link to="/" className="flex shrink-0 items-center" aria-label="Nexavo home">
            <NexavoLogo variant={atHero ? "hero" : "default"} />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <OverOnsNav useSolidStyle={!atHero} inverse={atHero} />
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={navLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={cn(
              !atHero && "border-border/60 bg-[#f5f5f7] hover:bg-[#ececea]",
              atHero &&
                "border-white/25 bg-white/[0.12] text-white shadow-card backdrop-blur-sm hover:border-white/35 hover:bg-white/20 hover:text-white",
            )}
          >
            <Link to={ROUTES.portal.login}>Login klantenportaal</Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant={atHero ? "outline" : "default"}
            className={cn(
              atHero &&
                "border-white bg-white text-foreground shadow-card hover:bg-white/90 hover:text-foreground",
            )}
          >
            <Link to={ROUTES.contact}>Plan demo</Link>
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "rounded-lg p-2 transition-colors lg:hidden",
                atHero
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-muted/60",
              )}
              aria-label="Menu openen"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
            <SheetHeader className="border-b border-border p-6 pb-4 text-left">
              <SheetTitle className="font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              <OverOnsNav
                useSolidStyle
                variant="mobile"
                onNavigate={() => setIsOpen(false)}
              />
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  className="rounded-lg px-2 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  activeClassName="bg-muted/50 text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <Separator className="my-4" />
              <Link to={ROUTES.portal.login} onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="mb-2 w-full border-border/60 bg-[#f5f5f7] hover:bg-[#ececea]">
                  Login klantenportaal
                </Button>
              </Link>
              <Link to={ROUTES.contact} onClick={() => setIsOpen(false)}>
                <Button variant="default" className="w-full">
                  Plan demo
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
