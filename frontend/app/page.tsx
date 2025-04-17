"use client";
import { Suspense, useEffect } from "react";
import Block from "@/components/block";
import Footer from "@/components/footer";
import Landing from "@/components/landing";
import Page from "@/components/new-page";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import User from "@/models/user-model";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const setUser = useUser((state) => state.setUser);
  const unauthorizedParam = searchParams.get('unauthorized');

  useEffect(() => {
    fetch("/api/user/verify", {
      method: "GET",
      cache: "no-store",
    }).then(async (response) => {
      const data = await response.json();
      if (response.ok && data.name !== null) {
        const user = new User(data.email);
        setUser(user);
      } else {
        setUser(undefined);
      }
    })
  }, [unauthorizedParam]);

  useEffect(() => {
    const handleUnauthorized = () => {
      const unauthorized: boolean = unauthorizedParam === 'true';
      if (unauthorized) {
        toast.error("You are not authorized to view this page.", {
          richColors: true,
          description: "Please log in to view this page.",
          position: "top-center"
        });
        window.history.replaceState({}, document.title, "/");
        return;
      }
    }

    setTimeout(() => {
      handleUnauthorized();
    }, 0);
  }, [unauthorizedParam]);

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

