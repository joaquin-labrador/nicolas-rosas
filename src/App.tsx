import { useCallback, useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { StatsSection } from "./components/sections/StatsSection";
import { ProfileSection } from "./components/sections/ProfileSection";
import { CareerSection } from "./components/sections/CareerSection";
import { MediaSection } from "./components/sections/MediaSection";
import { FollowSection } from "./components/sections/FollowSection";
import { ContactSection } from "./components/sections/ContactSection";
import { PrintProfile } from "./components/PrintProfile";
import { SiteDialogs } from "./components/dialogs/SiteDialogs";
import type { DialogName } from "./components/dialogs/SiteDialogs";
import { useReveal } from "./hooks/useReveal";
import { useI18n } from "./i18n/I18nProvider";
import { useFootballFeed } from "./lib/useFootballFeed";

/** App solo organiza la página; cada sección gestiona su propio comportamiento. */
export default function App() {
  const { copy } = useI18n();
  const [dialog, setDialog] = useState<DialogName | null>(null);
  const closeDialog = useCallback(() => setDialog(null), []);
  const football = useFootballFeed();
  useReveal();

  return (
    <>
      <a className="skip-link" href="#contenido">
        {copy.accessibility.skipContent}
      </a>
      <Header />
      <main id="contenido">
        <HeroSection />
        <StatsSection feed={football.feed} />
        <ProfileSection />
        <CareerSection />
        <MediaSection onContact={() => setDialog("contact")} />
        <FollowSection football={football} onWatch={() => setDialog("watch")} />
        <ContactSection onContact={() => setDialog("contact")} />
      </main>
      <Footer onSources={() => setDialog("sources")} />
      <PrintProfile />
      <SiteDialogs active={dialog} onClose={closeDialog} />
    </>
  );
}
