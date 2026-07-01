import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToolShell from "@/components/tools/ToolShell";
import BuyVsRentSimulator from "@/components/tools/BuyVsRentSimulator";

export const metadata: Metadata = {
  title: "קנייה מול שכירות | עידן לנדל״ן",
  description: "השוואה חזותית של השווי הנקי שלכם בעוד 10 שנים — קניית נכס מול שכירות והשקעת ההון העצמי.",
};

export default function BuyVsRentPage() {
  return (
    <>
      <Header />
      <ToolShell
        title="קנייה מול שכירות"
        description="השוואה של השווי הנקי שלכם בעוד 10 שנים — רכישת נכס מול שכירות והשקעת ההון העצמי בשוק ההון."
        disclaimer="אומדן להמחשה בלבד המבוסס על הנחות מוצהרות (ריבית, ייסוף ותשואה) ואינו מהווה ייעוץ פיננסי."
      >
        <BuyVsRentSimulator />
      </ToolShell>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
