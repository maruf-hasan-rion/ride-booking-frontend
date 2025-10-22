import { Button } from "@/components/ui/button";
import { ArrowRight, Car, MapPin, Shield, Clock, DollarSign, Users } from "lucide-react";
import { Link } from "react-router";

const Features = () => {
  const features = [
    {
      title: "Real-Time Ride Booking",
      description:
        "Book your ride instantly with live driver tracking, estimated arrival time, and multiple vehicle options to choose from.",
      icon: <Car className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Smart Route Optimization",
      description:
        "Get the fastest routes with AI-powered navigation that adapts to traffic conditions in real-time for efficient travel.",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-emerald-400 to-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Multiple Payment Options",
      description:
        "Pay seamlessly with cash, credit card, mobile wallet, or in-app balance. Split fares easily with friends.",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-700",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Schedule Rides in Advance",
      description:
        "Plan ahead by scheduling rides for later. Perfect for airport trips, important meetings, or early morning commutes.",
      icon: <Clock className="w-6 h-6" />,
      color: "from-emerald-600 to-emerald-700",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Ride History & Receipts",
      description:
        "Access your complete trip history with detailed receipts, ratings, and route maps for all your journeys.",
      icon: <Users className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      title: "Safety First",
      description:
        "Verified drivers, 24/7 support, emergency assistance, ride sharing with contacts, and insurance coverage for peace of mind.",
      icon: <Shield className="w-6 h-6" />,
      color: "from-emerald-600 to-emerald-800",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 mb-6">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground dark:bg-gradient-to-r dark:from-emerald-400 dark:via-emerald-500 dark:to-emerald-600 dark:bg-clip-text dark:text-transparent">
            Your Journey, Simplified
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience hassle-free transportation with our comprehensive ride-sharing features designed for safety, convenience, and affordability.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index}>
              <div
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-800"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${feature.color}`}
                ></div>

                {/* Icon */}
                <div
                  className={`relative mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} ${feature.bgColor} shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="mb-3 text-xl font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link to="/register">
            <Button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
              <span>Book Your First Ride</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;