import { useEffect, useState } from "react";
import { 
  Car, 
  MapPin, 
  Shield, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  ArrowRight,
  Zap,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Phone,
  Smartphone,
  Navigation
} from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <HeroSection />
      <HowItWorks />
      <Features />
      <VehicleTypes />
      <WhyChooseUs />
      <SafetyFirst />
      <Testimonials />
      <DownloadApp />
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-16 sm:py-20 md:py-24 lg:py-28 dark:from-gray-900 dark:via-emerald-950/20 dark:to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="section-shell relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Your ride, on demand
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Get There Faster,
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Safer, Smarter
              </span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
              Book a ride in seconds. Track in real-time. Arrive with confidence. 
              Your trusted transportation partner for every journey.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Book a Ride
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Become a Driver
                <Car className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-3 dark:border-gray-800">
              <div>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Live Tracking
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Know exactly where your ride is
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                  Transparent Fare
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Clear pricing before you confirm
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Safety First
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Verified drivers and emergency support
                </div>
              </div>
            </div>

          </div>

          {/* Right Content - Mock Phone */}
          <div className="relative">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-300 dark:border-gray-700">
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Your Location</span>
                    <Navigation className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <input
                        type="text" 
                        placeholder="Pickup location"
                        className="bg-transparent border-none outline-none text-gray-900 dark:text-white flex-1"
                        readOnly
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <input
                        type="text" 
                        placeholder="Where to?"
                        className="bg-transparent border-none outline-none text-gray-900 dark:text-white flex-1"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="block w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-center font-medium text-white transition-all hover:shadow-lg"
                    >
                      Find Ride
                    </Link>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Car className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      <div className="text-xs text-gray-600 dark:text-gray-400">Economy</div>
                    </div>
                    <div className="flex-1 text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Car className="w-6 h-6 mx-auto mb-1 text-teal-600" />
                      <div className="text-xs text-gray-600 dark:text-gray-400">Comfort</div>
                    </div>
                    <div className="flex-1 text-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <Car className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      <div className="text-xs text-gray-600 dark:text-gray-400">Premium</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works
const HowItWorks = () => {
  const steps = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Download the App",
      description: "Get started in minutes with our easy-to-use mobile app",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Set Your Destination",
      description: "Enter pickup and drop-off locations with just a few taps",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Get Matched",
      description: "We'll connect you with a nearby driver in seconds",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Enjoy Your Ride",
      description: "Track your driver in real-time and arrive safely",
      color: "from-emerald-600 to-teal-600"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="section-shell">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Getting around has never been easier. Just four simple steps to your destination.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section
const Features = () => {
  const features = [
    {
      title: "Real-Time Ride Booking",
      description: "Book your ride instantly with live driver tracking and estimated arrival time.",
      icon: <Car className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Smart Route Optimization",
      description: "AI-powered navigation adapts to traffic for the fastest routes.",
      icon: <MapPin className="w-6 h-6" />,
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "Multiple Payment Options",
      description: "Pay with cash, card, or mobile wallet. Split fares with friends easily.",
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Schedule in Advance",
      description: "Plan ahead by scheduling rides up to 7 days in advance.",
      icon: <Clock className="w-6 h-6" />,
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "Ride History & Receipts",
      description: "Access complete trip history with detailed receipts and ratings.",
      icon: <Users className="w-6 h-6" />,
      color: "from-teal-600 to-green-600"
    },
    {
      title: "Safety First",
      description: "Verified drivers, 24/7 support, and emergency assistance for peace of mind.",
      icon: <Shield className="w-6 h-6" />,
      color: "from-green-600 to-emerald-600"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-gray-900 dark:to-emerald-950/10">
      <div className="section-shell">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience seamless transportation with features designed for your comfort and safety.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Vehicle Types
const VehicleTypes = () => {
  const vehicles = [
    {
      name: "Economy",
      description: "Budget-friendly rides for everyday travel",
      price: "BDT 50+",
      features: ["Affordable rates", "Comfortable sedans", "4 seats", "AC included"],
      icon: <Car className="w-12 h-12" />,
      color: "from-emerald-500 to-emerald-600",
      popular: false
    },
    {
      name: "Comfort",
      description: "Premium sedans for a better experience",
      price: "BDT 80+",
      features: ["Mid-range pricing", "Premium vehicles", "4 seats", "Extra legroom"],
      icon: <Car className="w-12 h-12" />,
      color: "from-teal-500 to-teal-600",
      popular: true
    },
    {
      name: "Premium",
      description: "Luxury vehicles for special occasions",
      price: "BDT 150+",
      features: ["Top-tier comfort", "Luxury cars", "4 seats", "Professional drivers"],
      icon: <Car className="w-12 h-12" />,
      color: "from-emerald-600 to-teal-600",
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="section-shell">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Ride
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect vehicle type for your journey and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {vehicles.map((vehicle, index) => (
            <div 
              key={index}
              className={`relative bg-white dark:bg-gray-900 rounded-2xl p-8 border-2 ${
                vehicle.popular 
                  ? "border-emerald-500 shadow-2xl lg:scale-105" 
                  : 'border-gray-200 dark:border-gray-800'
              } transition-all duration-300 hover:shadow-xl`}
            >
              {vehicle.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${vehicle.color} flex items-center justify-center text-white mb-6`}>
                {vehicle.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                {vehicle.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                {vehicle.description}
              </p>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {vehicle.price}
                </div>
                <div className="text-sm text-gray-500">Starting fare</div>
              </div>

              <ul className="space-y-3 mb-8">
                {vehicle.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/login"
                className={`block w-full rounded-xl py-3 text-center font-semibold transition-all duration-300 ${
                  vehicle.popular
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg"
                    : "bg-gray-100 text-gray-900 hover:bg-emerald-50 dark:bg-gray-800 dark:text-white dark:hover:bg-emerald-950/20"
                }`}
              >
                Select {vehicle.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Choose Us
const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Best Prices",
      description: "Competitive fares with no hidden charges",
      stat: "30% Lower"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Pickup",
      description: "Average wait time of just 3 minutes",
      stat: "3 Min Avg"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Secure",
      description: "All drivers verified with background checks",
      stat: "100% Verified"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Top Rated",
      description: "Consistently high ratings from riders",
      stat: "Top Rated Service"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
      <div className="section-shell">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Riders Choose Us
          </h2>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            Join thousands of satisfied riders who trust us for their daily commute.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                {reason.icon}
              </div>
              <div className="text-3xl font-bold mb-2">{reason.stat}</div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-emerald-100">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Safety First
const SafetyFirst = () => {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-950">
      <div className="section-shell">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-full border border-emerald-200 dark:border-emerald-800 mb-6">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Your Safety Matters
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ride with Confidence
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Your safety is our top priority. We've built comprehensive safety features into every ride.
            </p>

            <div className="space-y-4">
              {[
                "24/7 emergency support available",
                "Real-time GPS tracking on every ride",
                "Share trip details with loved ones",
                "In-app SOS button for emergencies",
                "All drivers background verified",
                "Insurance coverage on every trip"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/30 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Shield className="w-8 h-8" />, label: "Verified Drivers", value: "100%" },
                  { icon: <Star className="w-8 h-8" />, label: "Safety Rating", value: "4.9/5" },
                  { icon: <Users className="w-8 h-8" />, label: "Safe Rides", value: "1M+" },
                  { icon: <Phone className="w-8 h-8" />, label: "Support", value: "24/7" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center">
                    <div className="text-emerald-600 dark:text-emerald-400 mb-3 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Rider Story Carousel
const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "I book two rides daily for office commute. Pickup time is usually under 5 minutes, and fare estimates stay accurate.",
      name: "Nusrat Ahmed",
      role: "Daily Rider, Dhaka",
      rating: "4.9/5",
    },
    {
      quote:
        "Driver details, vehicle info, and live tracking make late-night rides feel safe and transparent for my family.",
      name: "Sabbir Hasan",
      role: "University Rider",
      rating: "4.8/5",
    },
    {
      quote:
        "I switched from random street pickups to GoMove for reliability. Trip history and receipts are very useful.",
      name: "Rafiul Karim",
      role: "Frequent Business Rider",
      rating: "4.9/5",
    },
    {
      quote:
        "The app has clean UX. I can request, track, and share trip details without confusion, even on mobile data.",
      name: "Mitu Chowdhury",
      role: "Occasional Rider",
      rating: "4.7/5",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setActiveIndex((previous) =>
      previous === 0 ? testimonials.length - 1 : previous - 1
    );
  };

  const goToNext = () => {
    setActiveIndex((previous) => (previous + 1) % testimonials.length);
  };

  const activeItem = testimonials[activeIndex];

  return (
    <section className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 py-16 dark:from-gray-900 dark:to-emerald-950/10 md:py-20">
      <div className="section-shell">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            What Riders Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            Real rider feedback from daily commuting, family travel, and business trips.
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl">
            "{activeItem.quote}"
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{activeItem.name}</p>
              <p className="text-sm text-muted-foreground">{activeItem.role}</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              {activeItem.rating}
            </span>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    index === activeIndex ? "bg-emerald-600" : "bg-emerald-200 dark:bg-emerald-900"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={goToPrevious}
                className="rounded-md border p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="rounded-md border p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Download App
const DownloadApp = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-emerald-600 to-teal-700">
      <div className="section-shell">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Smartphone className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Download Our App Today
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Get the app and start riding in minutes. Available on iOS and Android.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-semibold text-emerald-600 transition-all duration-300 hover:bg-emerald-50">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </Link>

            <Link to="/contact" className="flex items-center gap-3 rounded-xl bg-white px-8 py-4 font-semibold text-emerald-600 transition-all duration-300 hover:bg-emerald-50">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home
