import { useI18n } from "../../i18n/I18nProvider";
import { Modal } from "../ui/Modal";
import { ContactForm } from "./ContactForm";
import { SourcesContent } from "./SourcesContent";
import { WatchContent } from "./WatchContent";

export type DialogName = "contact" | "sources" | "watch";
export function SiteDialogs({
  active,
  onClose,
}: {
  active: DialogName | null;
  onClose: () => void;
}) {
  const { copy } = useI18n();
  if (active === null) return null;
  const labels = {
    contact: copy.form.dialogLabel,
    sources: copy.sources.dialogLabel,
    watch: copy.watch.dialogLabel,
  };
  return (
    <Modal label={labels[active]} onClose={onClose}>
      {active === "contact" && <ContactForm />}
      {active === "sources" && <SourcesContent />}
      {active === "watch" && <WatchContent />}
    </Modal>
  );
}
