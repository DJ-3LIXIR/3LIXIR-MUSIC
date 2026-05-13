import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Check, AlertCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useLocation } from "wouter";

export default function Licenses() {
  const { addToCart, items } = useCart();
  const [, setLocation] = useLocation();
  const [showBeatSelector, setShowBeatSelector] = useState(false);
  const [selectedBeat, setSelectedBeat] = useState<string>("");

  // Filter out licenses and subscriptions from cart to get only beats
  const beatsInCart = items.filter(
    (item) =>
      !item.id.startsWith("license-") &&
      !item.id.startsWith("subscription-") &&
      item.id !== "royalty-token",
  );

  const handleBlackLicenseClick = () => {
    // Check if there are beats in cart
    if (beatsInCart.length === 0) {
      // No beats in cart - show error and redirect to beats page
      alert(
        "You need to add a beat to your cart first before purchasing a license!",
      );
      setLocation("/beats");
      return;
    }

    // If only one beat in cart, auto-select it
    if (beatsInCart.length === 1) {
      const beat = beatsInCart[0];
      setLocation(
        `/license/design?beat=${encodeURIComponent(beat.title)}&price=${beat.price}&cover=${encodeURIComponent(beat.cover || "")}`,
      );
      return;
    }

    // Multiple beats in cart - show selector
    setShowBeatSelector(true);
  };

  const handleBeatSelection = () => {
    if (!selectedBeat) {
      alert("Please select a beat to license");
      return;
    }

    const beat = beatsInCart.find((b) => b.id === selectedBeat);
    if (beat) {
      setLocation(
        `/license/design?beat=${encodeURIComponent(beat.title)}&price=${beat.price}&cover=${encodeURIComponent(beat.cover || "")}`,
      );
    }
  };

  const handleSubscribe = (tier: { name: string; price: number }) => {
    setLocation(`/subscription/design?tier=${tier.name.toLowerCase()}`);
  };

  const subscriptionTiers = [
    {
      name: "Gold",
      price: 10,
      royaltySplit: "45/55",
      perks: [
        "Skip the $50 licensing fee",
        "45% royalty split (you get 45%, artist gets 55%)",
        "Gain early access to drops",
        "Exclusive beat drops",
        "Discounts on future merchandise",
        "Discounts on future events",
      ],
    },
    {
      name: "Diamond",
      price: 15,
      popular: true,
      royaltySplit: "50/50",
      perks: [
        "Skip the $50 licensing fee",
        "50% royalty split (equal partnership)",
        "Gain early access to drops",
        "Exclusive beat drops",
        "Discounts on future merchandise",
        "Discounts on future events",
        "10% discount storewide",
        "Priority email support",
      ],
    },
    {
      name: "Platinum",
      price: 20,
      royaltySplit: "55/45",
      perks: [
        "Skip the $50 licensing fee",
        "55% royalty split (you get 55%, artist gets 45%)",
        "Gain early access to drops",
        "Exclusive beat drops",
        "Discounts on future merchandise",
        "Discounts on future events",
        "15% discount storewide",
        "Production service discounts",
        "Priority support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6">
            Licensing Options
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose how you want to license beats. Purchase per song or subscribe
            for unlimited access with better royalty splits.
          </p>
        </div>

        {/* Per-Song License */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Pay Per Song
          </h2>
          <div className="max-w-4xl mx-auto">
            <div
              onClick={handleBlackLicenseClick}
              className="border border-white/10 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-white/5 to-transparent hover:border-[hsl(var(--gold))]/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* License Image */}
                <div className="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <img
                    src="ChatGPT Image Jan 6, 2026 at 09_05_34 PM.png"
                    alt="Black License"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* License Details */}
                <div>
                  <h3 className="text-3xl font-display font-bold mb-4">
                    The Black License
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-[hsl(var(--gold))]">
                      $50
                    </span>
                    <span className="text-muted-foreground">per song</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--gold))] mb-6 font-semibold">
                    40/60 royalty split (you get 40%, artist gets 60%)
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Purchase a one-time license for each beat. Keep the rights
                    forever, even without a subscription.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                      <span>Lifetime royalty collection rights</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                      <span>No recurring payments required</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                      <span>Rights remain yours forever</span>
                    </li>
                  </ul>
                  {beatsInCart.length > 0 ? (
                    <p className="text-sm text-[hsl(var(--gold))] font-semibold flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      {beatsInCart.length} beat
                      {beatsInCart.length > 1 ? "s" : ""} in cart - Click to
                      design license →
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Add a beat to cart first →
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beat Selector Modal */}
        {showBeatSelector && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-background border border-white/10 rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold mb-4">
                Select a Beat to License
              </h3>
              <p className="text-muted-foreground mb-6">
                You have multiple beats in your cart. Which one do you want to
                create a license for?
              </p>
              <div className="space-y-3 mb-6">
                {beatsInCart.map((beat) => (
                  <label
                    key={beat.id}
                    className="flex items-center gap-3 p-4 border border-white/10 rounded-lg cursor-pointer hover:border-[hsl(var(--gold))]/50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="beat"
                      value={beat.id}
                      checked={selectedBeat === beat.id}
                      onChange={(e) => setSelectedBeat(e.target.value)}
                      className="w-5 h-5 text-[hsl(var(--gold))]"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold">{beat.title}</p>
                      <p className="text-sm text-muted-foreground">
                        ${beat.price}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowBeatSelector(false);
                    setSelectedBeat("");
                  }}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBeatSelection}
                  className="flex-1 bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90 rounded-full"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Plans */}
        <div>
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Subscribe monthly to skip the $50 token fee and unlock better
            royalty splits. Keep rights forever for beats purchased and
            published while subscribed.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.name}
                className={`border rounded-2xl p-8 relative flex flex-col ${
                  tier.popular
                    ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[hsl(var(--gold))] text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold mb-2">
                    The {tier.name} License
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-[hsl(var(--gold))]">
                      ${tier.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-[hsl(var(--gold))] mt-2 font-semibold">
                    {tier.royaltySplit} royalty split
                  </p>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  {tier.perks.map((perk, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{perk}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(tier)}
                  className={`w-full rounded-full py-6 text-sm font-bold uppercase tracking-widest ${
                    tier.popular
                      ? "bg-[hsl(var(--gold))] text-black hover:bg-[hsl(var(--gold))]/90"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  Subscribe Now
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section - keeping your existing content */}
        <div className="mt-20 max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            How It Works
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to know about licensing, royalties, and what you
            get when you purchase.
          </p>

          {/* What You're Purchasing */}
          <div className="mb-8 border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-2xl font-display font-bold mb-6 text-[hsl(var(--gold))]">
              What You're Purchasing
            </h3>
            <p className="text-muted-foreground mb-6">
              When you purchase a beat, you're paying for the service and labor
              of production, plus a non-exclusive license to use the
              instrumental. Here's what's included in every download:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">WAV Audio File</p>
                    <p className="text-sm text-muted-foreground">
                      High-quality uncompressed audio ready to use
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Project File</p>
                    <p className="text-sm text-muted-foreground">
                      Full project file (Logic Pro or FL Studio format)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">One-Off Samples</p>
                    <p className="text-sm text-muted-foreground">
                      Custom sounds and samples used in the beat
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Instructions File</p>
                    <p className="text-sm text-muted-foreground">
                      List of all plugins used and setup notes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Royalty Splits Explained */}
          <div className="mb-8 border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-2xl font-display font-bold mb-6 text-[hsl(var(--gold))]">
              Understanding Royalty Splits
            </h3>
            <p className="text-muted-foreground mb-6">
              Your royalty percentage determines how streaming revenue is
              divided when your song is published on platforms like Spotify,
              Apple Music, YouTube, and others.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h4 className="font-bold mb-3 text-[hsl(var(--gold))]">
                  Black License ($50)
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">You:</span> 40% of streaming
                    royalties
                  </p>
                  <p>
                    <span className="font-semibold">3LIXIR:</span> 60% of
                    streaming royalties
                  </p>
                </div>
              </div>
              <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h4 className="font-bold mb-3 text-[hsl(var(--gold))]">
                  Gold Subscription ($10/mo)
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">You:</span> 45% of streaming
                    royalties
                  </p>
                  <p>
                    <span className="font-semibold">3LIXIR:</span> 55% of
                    streaming royalties
                  </p>
                </div>
              </div>
              <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h4 className="font-bold mb-3 text-[hsl(var(--gold))]">
                  Diamond Subscription ($15/mo)
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">You:</span> 50% of streaming
                    royalties
                  </p>
                  <p>
                    <span className="font-semibold">3LIXIR:</span> 50% of
                    streaming royalties
                  </p>
                </div>
              </div>
              <div className="border border-white/10 rounded-xl p-6 bg-white/5">
                <h4 className="font-bold mb-3 text-[hsl(var(--gold))]">
                  Platinum Subscription ($20/mo)
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">You:</span> 55% of streaming
                    royalties
                  </p>
                  <p>
                    <span className="font-semibold">3LIXIR:</span> 45% of
                    streaming royalties
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* License Terms */}
          <div className="mb-8 border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-2xl font-display font-bold mb-6 text-[hsl(var(--gold))]">
              License Terms & Usage Rights
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))]" />
                  Non-Exclusive License
                </h4>
                <p className="text-sm text-muted-foreground ml-7">
                  All licenses are non-exclusive unless you purchase exclusive
                  rights. This means other artists can also license the same
                  beat. Contact us for exclusive licensing options.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))]" />
                  Commercial Use Allowed
                </h4>
                <p className="text-sm text-muted-foreground ml-7">
                  You can use the beat for any commercial purpose: streaming
                  platforms, music videos, YouTube content, live performances,
                  and more. As long as your work is derivative (vocals, lyrics,
                  arrangement) and you've paid for licensing, you're good to go.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[hsl(var(--gold))]" />
                  Producer Credit Required
                </h4>
                <p className="text-sm text-muted-foreground ml-7">
                  You must credit 3LIXIR and any other artists involved in the
                  beat production. This can be in your song credits,
                  description, or wherever production credits are listed.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[hsl(var(--gold))]" />
                  No Subleasing
                </h4>
                <p className="text-sm text-muted-foreground ml-7">
                  You cannot sublease or sell the beat to other artists. The
                  license is for your use only.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[hsl(var(--gold))]" />
                  No Distribution Limits
                </h4>
                <p className="text-sm text-muted-foreground ml-7">
                  There are no limits on streams, downloads, or copies sold.
                  Once you have the license, distribute freely on all platforms.
                </p>
              </div>
            </div>
          </div>

          {/* How Royalties Work */}
          <div className="mb-8 border border-white/10 rounded-2xl p-8 bg-gradient-to-br from-white/5 to-transparent">
            <h3 className="text-2xl font-display font-bold mb-6 text-[hsl(var(--gold))]">
              How Royalty Collection Works
            </h3>
            <p className="text-muted-foreground mb-6">
              Here's how royalty splits are managed and how you're responsible
              for paying your agreed percentage:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[hsl(var(--gold))] font-bold text-sm">
                    1
                  </span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Distribute Your Song</p>
                  <p className="text-sm text-muted-foreground">
                    Upload your finished track to streaming platforms using any
                    distributor (DistroKid, TuneCore, CD Baby, etc.). When
                    uploading, you must register 3LIXIR as a
                    producer/songwriter. "Published" means your song is live on
                    platforms like Spotify, Apple Music, YouTube, etc.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[hsl(var(--gold))] font-bold text-sm">
                    2
                  </span>
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    Royalty Collection Systems
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-white">
                      For YouTube:
                    </span>{" "}
                    Royalty splits are managed through Content ID with assigned
                    ownership percentages based on your license tier.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-semibold text-white">
                      For Spotify, Apple Music & other platforms:
                    </span>{" "}
                    3LIXIR collects producer royalties through PRO registration
                    (ASCAP/BMI). You are contractually obligated to report and
                    pay the agreed royalty split percentage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--gold))]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[hsl(var(--gold))] font-bold text-sm">
                    3
                  </span>
                </div>
                <div>
                  <p className="font-semibold mb-1">Payment & Enforcement</p>
                  <p className="text-sm text-muted-foreground">
                    Your licensing agreement legally binds you to pay the agreed
                    royalty percentage. Failure to properly credit, report, or
                    pay royalties is a breach of contract and may result in DMCA
                    takedown notices and legal action. Payment terms and
                    reporting requirements will be outlined in your licensing
                    agreement at checkout.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-white">Important:</span> You
                are responsible for accurately reporting earnings and making
                royalty payments as specified in your license agreement. 3LIXIR
                monitors usage through Content ID and PRO registration to ensure
                compliance.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">What happens when I subscribe?</h3>
              <p className="text-muted-foreground text-sm">
                When you purchase beats while subscribed, you'll skip the $50
                licensing fee automatically and receive a better royalty split.
                The beats you buy while subscribed grant you royalty rights
                forever, even if you cancel later.
              </p>
            </div>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">
                What if I cancel my subscription?
              </h3>
              <p className="text-muted-foreground text-sm">
                You keep the royalty rights and splits for all beats purchased
                and published while subscribed. However, new beat purchases will
                require the $50 Black License fee (40/60 split) unless you
                resubscribe.
              </p>
            </div>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">
                What about exclusive licensing?
              </h3>
              <p className="text-muted-foreground text-sm">
                All standard purchases are non-exclusive. If you want exclusive
                rights to a beat (meaning no one else can use it and it will be
                removed from the store), please contact us directly to discuss
                exclusive licensing terms and pricing.
              </p>
            </div>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">Do I need to sign anything?</h3>
              <p className="text-muted-foreground text-sm">
                Yes. At checkout, you'll need to review and agree to the Terms
                of Service, License Agreement, and Refund Policy before
                completing your purchase. This protects both you and the artist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
