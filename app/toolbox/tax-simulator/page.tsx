import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import TaxSimulator from "@/components/tools/TaxSimulator";

export const metadata: Metadata = {
  title: "סימולטור מיסים בעסקת נדל״ן | עידן לנדל״ן",
  description: "מס רכישה מלא לפי סטטוס הרוכש (דירה יחידה, דירה נוספת, תושב חוץ) והערכת מס שבח עתידי בעת מכירה.",
};

export default function TaxSimulatorPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="סימולטור מיסים בעסקת נדל״ן"
        description="חשבו את מס הרכישה הצפוי בעת הקנייה, והבינו מהו מס השבח שיחול בעת מכירה עתידית."
        disclaimer="אומדן להמחשה בלבד ואינו מהווה ייעוץ מס — יש לאמת מדרגות עדכניות מול רשות המסים או רו״ח."
      >
        <TaxSimulator />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
