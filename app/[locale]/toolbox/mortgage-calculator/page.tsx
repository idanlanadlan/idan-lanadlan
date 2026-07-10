import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import MortgageCalculator from "@/components/tools/MortgageCalculator";

export const metadata: Metadata = {
  title: "מחשבון משכנתא | עידן לנדל״ן",
  description: "חשבו את ההחזר החודשי הצפוי למשכנתא, סך הריבית לאורך התקופה ואחוז המימון מול מגבלות בנק ישראל.",
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="מחשבון משכנתא"
        description="הזינו את פרטי הנכס וההלוואה וקבלו את ההחזר החודשי הצפוי, סך הריבית ואחוז המימון הנדרש."
        disclaimer="אומדן להמחשה בלבד ואינו מהווה ייעוץ משכנתאות — האישור הסופי וגובה הריבית נקבעים מול הבנק."
      >
        <MortgageCalculator />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
