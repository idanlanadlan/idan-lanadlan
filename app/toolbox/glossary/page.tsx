import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import RealEstateGlossary from "@/components/tools/RealEstateGlossary";

export const metadata: Metadata = {
  title: "מילון מונחי נדל״ן | עידן לנדל״ן",
  description: "מילון מונחים בעברית פשוטה — טאבו, הערת אזהרה, נסח טאבו, מס שבח ועוד.",
};

export default function GlossaryPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="מילון מונחי נדל״ן"
        description="כל המונחים שתשמעו בעסקת נדל״ן — מוסברים בעברית פשוטה וברורה."
      >
        <RealEstateGlossary />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
