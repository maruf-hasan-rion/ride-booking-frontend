import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, MapPin, Phone, Headphones, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactProps {
  title?: string;
  description?: string;
  phone?: string;
  email?: string;
  supportHours?: string;
}

const Contact = ({
  title = "Need Help? We're Here for You",
  description = "Whether you're a rider or driver, our support team is ready to assist you 24/7. Get in touch and we'll respond promptly.",
  phone = "+880 1234-567890",
  email = "support@rideapp.com",
  supportHours = "24/7 Available",
}: ContactProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Message sent successfully!", {
        description: "Our support team will get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message", {
        description: "Please try again later or call our support line.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50/30 via-green-50/20 to-teal-50/20 dark:from-emerald-950/20 dark:via-green-950/10 dark:to-teal-950/10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="mb-4 text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Get In Touch
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-muted-foreground">{phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/40 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <p className="font-medium">Email Support</p>
                      <a
                        href={`mailto:${email}`}
                        className="text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">Headquarters</p>
                      <p className="text-muted-foreground">Dhaka, Bangladesh</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Support Hours</p>
                      <p className="text-muted-foreground">{supportHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Section */}
              <div className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/30 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 rounded-full flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-lg">Why Choose Our Support?</h4>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    24/7 Customer & Driver Support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                    Average Response Time: Under 2 Hours
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Multilingual Support Team
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                    In-App Live Chat Available
                  </li>
                </ul>
              </div>

              {/* Safety Notice */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-amber-900 dark:text-amber-300">Emergency Support</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      For urgent safety concerns during a ride, use the in-app emergency button or call our emergency hotline immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-8 shadow-xl">
              <h3 className="text-xl font-semibold mb-6">
                Send Us a Message
              </h3>

              <Form {...form}>
                <div onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+880 1234-567890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Ride Issue, Payment Query, Driver Feedback"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your issue or inquiry in detail..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;