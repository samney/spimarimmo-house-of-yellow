import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/public/home/HeroSection";
import { AboutWorkSection } from "@/components/public/home/AboutWorkSection";
import { ServicesSection } from "@/components/public/home/ServicesSection";
import { MethodSection } from "@/components/public/home/method/MethodSection";
import { ClosingSection } from "@/components/public/home/ClosingSection";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutWorkSection />
      <ServicesSection />
      <MethodSection />
      <ClosingSection />
    </>
  );
}
