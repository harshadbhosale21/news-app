
import Footer from "@/components/Footer";
import HomePage from "@/components/Home-page";

export default function Home() {
  return (
    <>
      <section className="w-full p-3 flex justify-start items-center h-[100px]">
        <img src='/new-pratidin-logo.webp' alt="pratidin logo" className="w-20" />
      </section>
      <section className="pb-24">
        <HomePage />
      </section>
      <Footer />
    </>
  );
} 
