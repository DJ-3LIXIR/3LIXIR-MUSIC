import { Navbar } from "@/components/layout/Navbar";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function Licenses() {
  const { addToCart } = useCart();

  const handleAddRoyaltyToken = () => {
    addToCart({
      id: "royalty-token",
      title: "Royalty Token License",
      artist: "3LIXIR",
      price: 50,
      cover: "/ChatGPT%20Image%20Jan%206,%202026%20at%2009_05_34%20PM.png",
      quantity: 1,
    });
  };

  const handleSubscribe = (tier: { name: string; price: number }) => {
    addToCart({
      id: `subscription-${tier.name.toLowerCase()}`,
      title: `${tier.name} Subscription`,
      artist: "3LIXIR",
      price: tier.price,
      cover: "/ChatGPT%20Image%20Jan%206,%202026%20at%2009_05_34%20PM.png",
      quantity: 1,
    });
  };

  const subscriptionTiers = [
    {
      name: "Basic",
      price: 10,
      perks: [
        "Skip $50 royalty token on all purchases",
        "Standard beat quality",
        "Email support",
        "Download history",
      ],
    },
    {
      name: "Plus",
      price: 15,
      popular: true,
      perks: [
        "Skip $50 royalty token on all purchases",
        "10% discount on all beats",
        "Priority email support",
        "Early access to new releases",
        "Exclusive monthly beat drops",
      ],
    },
    {
      name: "Premium",
      price: 20,
      perks: [
        "Skip $50 royalty token on all purchases",
        "20% discount on all beats",
        "Production service discounts",
        "Merchandise discounts",
        "Priority support",
        "Exclusive content & stems",
        "Higher royalty splits",
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
            Choose how you want to license your beats. Purchase per song or
            subscribe for unlimited access.
          </p>
        </div>

        {/* Per-Song License */}
        <div className="mb-20">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            Pay Per Song
          </h2>
          <div className="max-w-4xl mx-auto">
            <div
              onClick={handleAddRoyaltyToken}
              className="border border-white/10 rounded-2xl p-8 md:p-12 bg-gradient-to-br from-white/5 to-transparent hover:border-[hsl(var(--gold))]/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* License Image */}
                <div className="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <img
                    src="/ChatGPT%20Image%20Jan%206,%202026%20at%2009_05_34%20PM.png"
                    alt="Royalty Token License"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* License Details */}
                <div>
                  <h3 className="text-3xl font-display font-bold mb-4">
                    Royalty Token License
                  </h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-bold text-[hsl(var(--gold))]">
                      $50
                    </span>
                    <span className="text-muted-foreground">per song</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Purchase a one-time royalty token for each song. Keep the
                    rights forever, even without a subscription.
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
                  <p className="text-sm text-[hsl(var(--gold))] font-semibold">
                    Click to add to cart →
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-3xl font-display font-bold mb-4 text-center">
            Subscription Plans
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Subscribe monthly to skip the $50 token fee and unlock additional
            perks. Keep rights forever for beats purchased while subscribed.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionTiers.map((tier) => (
              <div
                key={tier.name}
                className={`border rounded-2xl p-8 relative ${
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
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-[hsl(var(--gold))]">
                      ${tier.price}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
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

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">What happens when I subscribe?</h3>
              <p className="text-muted-foreground text-sm">
                When you purchase beats, you'll skip the $50 royalty token fee
                automatically. The beats you buy while subscribed grant you
                royalty rights forever, even if you cancel later.
              </p>
            </div>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">
                What if I cancel my subscription?
              </h3>
              <p className="text-muted-foreground text-sm">
                You keep the royalty rights for all beats purchased while
                subscribed. However, new beat purchases will require the $50
                token fee per song unless you resubscribe.
              </p>
            </div>
            <div className="border border-white/10 rounded-xl p-6 bg-white/5">
              <h3 className="font-bold mb-2">Can I mix and match?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can purchase individual $50 tokens for specific songs,
                or subscribe to get unlimited token access plus additional
                perks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
