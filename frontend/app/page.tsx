"use client";
import { useEffect } from "react";
import Block from "@/components/block";
import Footer from "@/components/footer";
import Landing from "@/components/landing";
import Page from "@/components/new-page";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const searchParams = useSearchParams();

  const handleUnauthorized = () => {
    const unauthorized: boolean = searchParams.get('unauthorized') === 'true';

    if (unauthorized) {
      toast.error("You are not authorized to view this page.", {
        richColors: true,
        description: "Please log in to view this page.",
        position: "top-center"
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      handleUnauthorized();
    }, 0);
  }, []);

  return (
    <Page>
      <Landing />
      <Block
        title="Learn the ways of the stock market"
        content="StockSensAI is a platform that uses AI to help you make better decisions in the stock market. Using a practice balance, we'll give you an AI friend to help you make the best decisions."
        className="bg-secondary text-black"
      />
      <Block
        title="Industry standard algorithms"
        content="StockSensAI lets you choose and learn about stock-trading algorithms, and shows you how your trades compare to your selected trading strategy."
        className="bg-gradient-to-l from-orange-400 to-orange-800"
        reverse
      />
      <Block
        title="Learn which stocks to buy"
        content="With sentiment analysis, StockSensAI can help you determine which stocks are worth buying, and which ones are worth selling."
      />
      <Footer />
    </Page>
  );
}

