import userIcon from "@/assets/icons/user.png";
import Logo from "@/assets/icons/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Shield,
  Users,
  // Zap,
  Car,
} from "lucide-react";
import { Link } from "react-router";

const About = () => {
  const features = [
    {
      icon: <Car className="h-8 w-8 text-emerald-600" />,
      title: "Seamless Ride Booking",
      description:
        "Book rides instantly across Bangladesh with transparent fares and real-time driver tracking.",
    },
    {
      icon: <Shield className="h-8 w-8 text-emerald-600" />,
      title: "Safe & Secure",
      description:
        "Your safety is our top priority. Every driver is verified, and every ride is monitored end-to-end.",
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Trusted Drivers",
      description:
        "Ride with confidence knowing that all drivers are background-checked and trained for safe driving.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-emerald-600" />,
      title: "Smart Navigation",
      description:
        "Optimized routes powered by smart navigation ensure faster and more affordable rides.",
    },
  ];

  const stats = [
    { label: "Active Riders", value: "50K+" },
    { label: "Registered Drivers", value: "10K+" },
    { label: "Daily Rides", value: "8K+" },
    { label: "Ride Completion Rate", value: "99.7%" },
  ];

  const values = [
    {
      icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
      title: "Safety First",
      description:
        "We ensure every trip is secure through verified drivers, SOS alerts, and live ride tracking.",
    },
    {
      icon: <Globe className="h-6 w-6 text-emerald-600" />,
      title: "Eco-Friendly Mobility",
      description:
        "Promoting sustainable transport with fuel-efficient and electric ride options.",
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-600" />,
      title: "Innovation in Motion",
      description:
        "Using modern technology to enhance ride efficiency, driver performance, and user satisfaction.",
    },
  ];

  const teamMembers = [
    {
      name: "Md. Maruf Hasan Rion",
      position: "Founder & Lead Developer",
      image: userIcon,
      bio: "Full-stack developer passionate about building smart and scalable ride-booking systems for Bangladesh.",
      linkedin: "#",
    },
    {
      name: "Noshin Alam",
      position: "Head of Design",
      image: userIcon,
      bio: "Designs clean, intuitive user interfaces to ensure seamless experiences for both riders and drivers.",
      linkedin: "#",
    },
    {
      name: "Sabbir Ahmed",
      position: "Operations Manager",
      image: userIcon,
      bio: "Ensures every ride, driver, and route operates efficiently with high customer satisfaction.",
      linkedin: "#",
    },
    {
      name: "Waqar Shams",
      position: "Backend Engineer",
      image: userIcon,
      bio: "Focuses on robust backend systems, ensuring smooth API performance and real-time ride data handling.",
      linkedin: "#",
    },
  ];

  return (
 <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-emerald-100 dark:from-gray-900 dark:via-gray-950 dark:to-emerald-950">
  {/* Hero Section */}
  <section className="py-16 md:py-24 text-center bg-background dark:bg-gray-950">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Badge
        variant="outline"
        className="bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 transition-colors mb-4"
      >
        About Our Ride Platform
      </Badge>
      <motion.h1
        className="text-pretty text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-emerald-700 dark:text-emerald-400 mb-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Driving Bangladesh Towards Smarter Mobility
      </motion.h1>
      <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
        Our platform connects riders and drivers with simplicity and trust —
        offering fast, safe, and affordable transportation solutions powered
        by technology.
      </p>
      <div className="flex justify-center mt-10">
        <Logo />
      </div>
    </div>
  </section>

  {/* Features Section */}
  <section className="py-16 bg-muted dark:bg-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 border-emerald-500 text-emerald-600 dark:text-emerald-400">
          What We Offer
        </Badge>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Simplifying Everyday Travel
        </motion.h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          From quick city rides to longer trips, we ensure your journey is
          smooth, secure, and enjoyable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
          >
            <Card className="text-center hover:shadow-lg hover:border-emerald-400 transition-shadow duration-300 bg-background dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>

  {/* Mission Section */}
  <section className="py-16 md:py-24 bg-background dark:bg-gray-950">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid items-center gap-12 lg:grid-cols-2">
      <div className="space-y-6">
        <motion.h2
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Mission
        </motion.h2>
        <p className="text-muted-foreground text-lg">
          To redefine urban transportation in Bangladesh through innovation,
          safety, and accessibility — empowering riders and drivers alike.
        </p>
        <div className="space-y-4">
          {values.map((value, index) => (
            <div key={index} className="flex items-start gap-3">
              {value.icon}
              <div>
                <h3 className="font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        className="grid grid-cols-2 gap-6 rounded-2xl bg-gradient-to-br from-emerald-100/40 to-emerald-50/60 p-8 dark:from-emerald-900/30 dark:to-gray-800/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {stat.value}
            </div>
            <div className="text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>

  {/* Team Section */}
  <section className="py-16 md:py-24 bg-muted dark:bg-gray-900">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <Badge variant="outline" className="mb-4 border-emerald-500 text-emerald-600 dark:text-emerald-400">
        Our Team
      </Badge>
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-foreground mb-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        The Minds Driving Our Platform
      </motion.h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
        A team of passionate innovators working together to create smarter,
        safer, and more efficient rides.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="text-center bg-background dark:bg-gray-800 hover:shadow-lg hover:border-emerald-400 transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-emerald-400"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-foreground">
                {member.name}
              </h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                {member.position}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                {member.bio}
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="sm" className="p-2 border-emerald-500 hover:bg-emerald-600 hover:text-white">
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2 border-emerald-500 hover:bg-emerald-600 hover:text-white">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>

  {/* CTA Section */}
  <section className="py-16 md:py-24 text-center bg-background dark:bg-gray-950">
    <motion.div
      className="container mx-auto px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Ready to Ride with Us?
      </h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
        Join thousands of satisfied riders and drivers across Bangladesh. Start your journey today!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/login">
        <Button
          variant="default"
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Book a Ride
          <ArrowRight className="ml-2 size-4" />
        </Button></Link>
         <Link to="/login">
        <Button
          variant="outline"
          size="lg"
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300"
        >
          Become a Driver
        </Button></Link>
      </div>
    </motion.div>
  </section>
</div>

  );
};

export default About;
