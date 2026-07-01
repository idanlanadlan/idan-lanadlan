import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import RoiCalculator from "@/components/tools/RoiCalculator";

export const metadata: Metadata = {
  title: "מחשבון תשואה להשקעה | עידן לנדל״ן",
  description: "חשבו את התשואה השנתית הנטו הצפויה מנכס להשקעה — מחיר, שכ״ד, ניהול ומס רכישה.",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="מחשבון תשואה להשקעה"
        description="הזינו את פרטי הנכס וקבלו את אחוז התשואה השנתי הנטו הצפוי מהשקעה."
        disclaimer="אומדן להמחשה בלבד ואינו מהווה ייעוץ פיננסי או השקעתי."
      >
        <RoiCalculator />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
