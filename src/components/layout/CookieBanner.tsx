import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  setCookieConsent,
  shouldShowCookieBanner,
  type CookieConsent,
} from "@/lib/cookie-consent";

const CHECK_INTERVAL_MS = 60_000;

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const syncVisibility = () => setVisible(shouldShowCookieBanner());

    syncVisibility();
    const intervalId = window.setInterval(syncVisibility, CHECK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleChoice = (choice: CookieConsent) => {
    setCookieConsent(choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-description"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-[360px] z-[100] rounded-2xl border border-border/60 bg-white p-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.35)]"
        >
          <h2
            id="cookie-banner-title"
            className="font-sans text-base font-semibold text-foreground mb-2"
          >
            Cookie-instellingen
          </h2>
          <p
            id="cookie-banner-description"
            className="font-sans text-sm text-muted-foreground leading-relaxed mb-5"
          >
            We gebruiken cookies om je ervaring te verbeteren, websiteverkeer te
            analyseren en gepersonaliseerde inhoud te tonen. Lees ons{" "}
            <Link
              to="/privacy#cookies"
              className="text-foreground/80 underline underline-offset-2 hover:text-foreground transition-colors"
            >
              cookiebeleid
            </Link>
            .
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => handleChoice("rejected")}
            >
              Weigeren
            </Button>
            <Button
              type="button"
              variant="default"
              className="w-full"
              onClick={() => handleChoice("accepted")}
            >
              Accepteren
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
