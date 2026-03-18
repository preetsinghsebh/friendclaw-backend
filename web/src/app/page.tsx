import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import PersonaSection from '@/components/PersonaSection'
import ChatCardsSection from '@/components/ChatCardsSection'
import GradientDivider from '@/components/GradientDivider'
import HowItWorks from '@/components/HowItWorks'
import Testimonials from '@/components/Testimonials'
import FeaturesSection from '@/components/FeaturesSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import FloatingChatButton from '@/components/FloatingChatButton'
import ExitIntentPopup from '@/components/ExitIntentPopup'
import MobileCtaBar from '@/components/MobileCtaBar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <GradientDivider variant="gold" />
        <PersonaSection />
        <GradientDivider variant="violet" />
        <ChatCardsSection />
        <GradientDivider variant="gold" />
        <HowItWorks />
        <GradientDivider variant="cyan" />
        <Testimonials />
        <GradientDivider variant="violet" />
        <FeaturesSection />
        <GradientDivider variant="gold" />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingChatButton />
      <ExitIntentPopup />
      <MobileCtaBar />
    </>
  )
}
