import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import RenovationEstimator from "@/components/tools/RenovationEstimator";

export const metadata: Metadata = {
  title: "אומדן עלויות שיפוץ | עידן לנדל״ן",
  description: "אומדן הנדסי לעלות שיפוץ דירה לפי שטח, רמת גימור ושדרוגים מיוחדים.",
};

export default function RenovationEstimatorPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="אומדן עלויות שיפוץ הנדסי"
        description="הזינו את שטח הדירה, בחרו רמת שיפוץ וסמנו שדרוגים מיוחדים — קבלו טווח עלות משוער."
        disclaimer="אומדן גס להמחשה בלבד ואינו מהווה הצעת מחיר מחייבת."
      >
        <RenovationEstimator />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
