import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Faq = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const heading = "Frequently Asked Questions";
  const description =
    "Find answers to common questions about riding and driving with us. Can't find what you're looking for? Contact our support team.";

  const faqItems = [
    {
      id: "faq-1",
      question: "How do I book a ride?",
      answer:
        "Open the app, enter your destination, choose your preferred vehicle type, and tap 'Request Ride'. You'll be matched with a nearby driver instantly and can track their arrival in real-time.",
    },
    {
      id: "faq-2",
      question: "How do I become a driver?",
      answer:
        "To become a driver, download our driver app, complete the registration with your valid driver's license, vehicle documents, and insurance. After a quick background check, you'll be approved to start earning.",
    },
    {
      id: "faq-3",
      question: "What payment methods are accepted?",
      answer:
        "We accept cash, credit/debit cards, mobile wallets, and in-app balance. You can add or change your payment method in the app settings. Payments are processed securely after each ride.",
    },
    {
      id: "faq-4",
      question: "How is the fare calculated?",
      answer:
        "Fares are calculated based on distance traveled, time taken, and current demand. You'll see an estimated fare before booking. The final fare may vary slightly if the route changes during your trip.",
    },
    {
      id: "faq-5",
      question: "Can I schedule a ride in advance?",
      answer:
        "Yes! You can schedule rides up to 7 days in advance. Simply select 'Schedule Ride' when booking, choose your date and time, and a driver will be assigned shortly before your pickup time.",
    },
    {
      id: "faq-6",
      question: "What if I leave something in the car?",
      answer:
        "If you left an item in a vehicle, go to your trip history, select the ride, and tap 'I lost an item'. You can contact the driver directly through the app or our support team will help coordinate the return.",
    },
    {
      id: "faq-7",
      question: "Is it safe to ride alone at night?",
      answer:
        "Safety is our top priority. All drivers are background-checked and vehicles are inspected. Features include real-time GPS tracking, emergency assistance button, ride sharing with contacts, and 24/7 support. You can also share your trip details with family or friends.",
    },
    {
      id: "faq-8",
      question: "How do I cancel a ride?",
      answer:
        "You can cancel a ride anytime before the driver arrives. Tap on your active ride and select 'Cancel Trip'. Please note that cancellation fees may apply if canceled after a certain time period.",
    },
    {
      id: "faq-9",
      question: "What types of vehicles are available?",
      answer:
        "We offer multiple vehicle options including Economy (budget-friendly sedans), Comfort (premium sedans), XL (larger vehicles for groups), and Premium (luxury vehicles). Availability varies by location.",
    },
    {
      id: "faq-10",
      question: "How does the rating system work?",
      answer:
        "After each ride, both riders and drivers can rate each other on a 5-star scale. Ratings help maintain quality service. Drivers with consistently low ratings may face account review, and riders with poor ratings may have limited access.",
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  const filteredFaqItems = faqItems.filter((item) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query)
    );
  });

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-brand-50/50 via-white to-brand-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-brand-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header Section */}
          <div className="mx-auto flex max-w-2xl flex-col text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-r brand-gradient-bg flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="mb-4 text-3xl md:text-4xl font-bold brand-gradient-text">
              {heading}
            </h1>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>

          {/* FAQ Accordion */}
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-4">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search questions..."
              />
            </div>
            <div className="space-y-3">
              {filteredFaqItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-xl bg-card overflow-hidden hover:border-primary/40 dark:hover:border-brand-700 transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left group"
                    aria-expanded={openItem === item.id}
                    aria-controls={`${item.id}-panel`}
                  >
                    <span className="font-medium text-foreground dark:text-gray-100 text-sm md:text-base pr-4 group-hover:text-primary dark:group-hover:text-brand-400 transition-colors">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                        openItem === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  <div
                    id={`${item.id}-panel`}
                    className={`overflow-hidden transition-all duration-300 ${
                      openItem === item.id ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-4 pt-0">
                      <div className="h-px bg-gradient-to-r from-brand-200 to-brand-200 dark:from-brand-800 dark:to-brand-800 mb-4"></div>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredFaqItems.length === 0 && (
                <div className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
                  No FAQ items match your search.
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mx-auto max-w-2xl">
            <div className="bg-gradient-to-r from-brand-100 to-brand-100 dark:from-brand-950/40 dark:to-brand-950/30 rounded-2xl p-8 border border-primary/25 text-center">
              <h3 className="text-xl font-semibold text-foreground dark:text-gray-100 mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our support team is available 24/7 to help you with any concerns
              </p>
              <Button asChild className="brand-gradient-bg hover:opacity-90">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
