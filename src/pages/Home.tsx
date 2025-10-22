// import { useState } from "react";
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
//   ChevronRight,
  CheckCircle2,
  Phone,
  Smartphone,
  Navigation
} from "lucide-react";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
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
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-gray-900 dark:via-emerald-950/20 dark:to-gray-900 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

            <div className="flex flex-wrap gap-4">
             <Link to="/login"> <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                Book a Ride
                <ArrowRight className="w-5 h-5" />
              </button></Link>
             <Link to="/login"> <button className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 flex items-center gap-2">
                Become a Driver
                <Car className="w-5 h-5" />
              </button></Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Riders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">5K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Drivers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">4.9★</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
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
                        defaultValue="Mirpur 10, Dhaka"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <input 
                        type="text" 
                        placeholder="Where to?"
                        className="bg-transparent border-none outline-none text-gray-900 dark:text-white flex-1"
                        defaultValue="Dhanmondi 27"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
                      Find Ride
                    </button>
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
                      <Car className="w-6 h-6 mx-auto mb-1 text-purple-600" />
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
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900 -z-10 hidden lg:block last:hidden"></div>
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
    <section className="py-20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-gray-900 dark:to-emerald-950/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
      price: "৳50",
      features: ["Affordable rates", "Comfortable sedans", "4 seats", "AC included"],
      icon: <Car className="w-12 h-12" />,
      color: "from-emerald-500 to-emerald-600",
      popular: false
    },
    {
      name: "Comfort",
      description: "Premium sedans for a better experience",
      price: "৳80",
      features: ["Mid-range pricing", "Premium vehicles", "4 seats", "Extra legroom"],
      icon: <Car className="w-12 h-12" />,
      color: "from-teal-500 to-teal-600",
      popular: true
    },
    {
      name: "Premium",
      description: "Luxury vehicles for special occasions",
      price: "৳150",
      features: ["Top-tier comfort", "Luxury cars", "4 seats", "Professional drivers"],
      icon: <Car className="w-12 h-12" />,
      color: "from-purple-500 to-purple-600",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                  ? 'border-emerald-500 shadow-2xl scale-105' 
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

              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                vehicle.popular
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
              }`}>
                Select {vehicle.name}
              </button>
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
      stat: "4.9★ Rating"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

// Testimonials
const Testimonials = () => {
  const testimonials = [
    {
      name: "Anika Rahman",
      role: "Daily Commuter",
      avatar: "AR",
      rating: 5,
      text: "Best ride-sharing app in Dhaka! Drivers are always professional and the app is super easy to use."
    },
    {
      name: "Mehedi Hasan",
      role: "Business Professional",
      avatar: "MH",
      rating: 5,
      text: "I use this for my daily office commute. Always on time, great prices, and excellent service."
    },
    {
      name: "Fatima Akter",
      role: "University Student",
      avatar: "FA",
      rating: 5,
      text: "As a student, I love the affordable prices and safety features. Feel secure even traveling late at night."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-gray-900 dark:to-emerald-950/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Riders Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community has to say.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Download App
const DownloadApp = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Smartphone className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Download Our App Today
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Get the app and start riding in minutes. Available on iOS and Android.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-bold">App Store</div>
              </div>
            </button>

            <button className="px-8 py-4 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-bold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home