import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    title: "Economy",
    fare: "BDT 50+",
    description: "Affordable daily rides with verified drivers.",
  },
  {
    title: "Comfort",
    fare: "BDT 80+",
    description: "Premium ride experience for regular commuting.",
  },
  {
    title: "Premium",
    fare: "BDT 150+",
    description: "Top-tier comfort for business and special trips.",
  },
];

export default function Pricing() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h1 className="text-3xl font-bold md:text-4xl">Transparent Pricing</h1>
          <p className="mt-3 text-muted-foreground">
            Choose the ride type that matches your budget and comfort.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.title}>
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-primary">{plan.fare}</p>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
