import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import OlehTaxSimulator from "@/components/tools/OlehTaxSimulator";

export const metadata: Metadata = {
  title: "סימולטור מס לעולים חדשים | עידן לנדל״ן",
  description: "אמדו את מס הרכישה המוזל לעולים חדשים ומפת דרכים לרכישת נכס בישראל.",
};

export default function OlehTaxPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="סימולטור מס עולים חדשים"
        description="הזינו את מחיר הנכס והמטבע — קבלו אומדן למס הרכישה המוזל לעולים חדשים ומפת דרכים לרכישה."
        disclaimer="אומדן להמחשה בלבד ואינו מהווה ייעוץ מס או משפטי."
      >
        <OlehTaxSimulator />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
