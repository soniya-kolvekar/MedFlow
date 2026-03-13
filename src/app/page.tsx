import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-ash-grey-light font-sans text-charcoal-blue dark:bg-charcoal-blue dark:text-ash-grey selection:bg-muted-teal/30 selection:text-deep-teal dark:selection:bg-deep-teal/50 dark:selection:text-ash-grey overflow-x-hidden pt-0 m-0">
      <Navbar />
      <main className="flex flex-col w-full m-0 p-0 overflow-x-hidden">
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
