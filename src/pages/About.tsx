import userIcon from "@/assets/icons/user.png";
import Logo from "@/assets/icons/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Car,
  CheckCircle,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const SUPPORT_EMAIL = "support@gomove.app";

const features = [
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: "Seamless Ride Booking",
    description:
      "Book rides instantly across Bangladesh with transparent fares and live driver tracking.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Safe and Secure",
    description:
      "Every driver is verified and every ride is monitored end-to-end.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Trusted Drivers",
    description:
      "Background-checked drivers provide reliable service for daily commuting.",
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Smart Navigation",
    description:
      "Optimized route selection helps reduce delays and improve fare efficiency.",
  },
] as const;

const stats = [
  { label: "Active Riders", value: "50K+" },
  { label: "Registered Drivers", value: "10K+" },
  { label: "Daily Rides", value: "8K+" },
  { label: "Ride Completion Rate", value: "99.7%" },
] as const;

const values = [
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Safety First",
    description:
      "SOS alerts, verified drivers, and live location updates on active rides.",
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: "Eco-Friendly Mobility",
    description:
      "We promote fuel-efficient transportation options for city movement.",
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "Innovation in Motion",
    description:
      "Modern product design and reliable APIs keep rider-driver workflows smooth.",
  },
] as const;

const teamMembers = [
  {
    name: "Md. Maruf Hasan Rion",
    position: "Founder & Lead Developer",
    image: userIcon,
    bio: "Builds and maintains full-stack architecture for scalable ride operations.",
    email: "rion@gomove.app",
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Noshin Alam",
    position: "Head of Design",
    image: userIcon,
    bio: "Leads UX consistency across public pages and role dashboards.",
    email: SUPPORT_EMAIL,
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Sabbir Ahmed",
    position: "Operations Manager",
    image: userIcon,
    bio: "Improves service quality, support flow, and ride fulfillment standards.",
    email: SUPPORT_EMAIL,
    linkedin: "https://www.linkedin.com",
  },
  {
    name: "Waqar Shams",
    position: "Backend Engineer",
    image: userIcon,
    bio: "Maintains secure APIs, status workflows, and data integrity across modules.",
    email: SUPPORT_EMAIL,
    linkedin: "https://www.linkedin.com",
  },
] as const;

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-background to-brand-100 dark:from-gray-900 dark:via-gray-950 dark:to-brand-950">
      <section className="bg-background py-16 text-center dark:bg-gray-950 md:py-24">
        <div className="section-shell">
          <Badge
            variant="outline"
              className="mb-4 border-brand-700 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            About Our Ride Platform
          </Badge>
          <motion.h1
            className="mb-6 text-pretty text-3xl font-extrabold leading-tight tracking-tight text-primary dark:text-brand-400 md:text-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Driving Bangladesh Towards Smarter Mobility
          </motion.h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Our platform connects riders and drivers with simplicity and trust - offering fast,
            safe, and affordable transportation powered by real-time technology.
          </p>
          <div className="mt-10 flex justify-center">
            <Logo />
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 dark:bg-gray-900">
        <div className="section-shell">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-brand-500 text-primary">
              What We Offer
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Simplifying Everyday Travel
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              From quick city rides to longer trips, every journey is designed for consistency,
              safety, and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.08 }}
              >
                <Card className="h-full bg-background text-center transition-shadow duration-300 hover:border-brand-400 hover:shadow-lg dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="mb-4 flex justify-center">{feature.icon}</div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 dark:bg-gray-950 md:py-24">
        <div className="section-shell grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              We redefine urban transportation through innovation, safety, and accessibility -
              empowering riders and drivers alike.
            </p>
            <div className="space-y-4">
              {values.map((value) => (
                <div key={value.title} className="flex items-start gap-3">
                  {value.icon}
                  <div>
                    <h3 className="font-semibold text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 rounded-2xl bg-gradient-to-br from-brand-100/40 to-brand-50/60 p-8 dark:from-brand-900/30 dark:to-gray-800/30">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 dark:bg-gray-900 md:py-24">
        <div className="section-shell text-center">
          <Badge variant="outline" className="mb-4 border-brand-500 text-primary">
            Our Team
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            The Minds Driving Our Platform
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            A focused team of engineers, designers, and operators building cleaner mobility
            workflows across the app.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Card key={member.name} className="bg-background text-center transition-shadow duration-300 hover:border-brand-400 hover:shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-24 w-24 rounded-full border-2 border-brand-400 object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-foreground">{member.name}</h3>
                  <p className="mb-3 font-medium text-primary">
                    {member.position}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    <Button asChild variant="outline" size="sm" className="border-brand-500 p-2 hover:bg-primary hover:text-primary-foreground">
                      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="border-brand-500 p-2 hover:bg-primary hover:text-primary-foreground">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 text-center dark:bg-gray-950 md:py-24">
        <div className="section-shell">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Ready to Ride with Us?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of riders and drivers across Bangladesh and start your journey today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              variant="default"
              size="lg"
              className="bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
            >
              <Link to="/login">
                Book a Ride
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-brand-500 text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
            >
              <Link to="/login">Become a Driver</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
