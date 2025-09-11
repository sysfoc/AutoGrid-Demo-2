"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  DollarSign,
  Users,
  Clock,
  Star,
  ChevronDown,
  ArrowRight,
  Phone,
  Car,
  CreditCard,
  CheckCircle,
  Gauge,
  Lock,
  LifeBuoy,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function SellMyCar() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const router = useRouter()

  const benefits = [
    {
      icon: <DollarSign className="text-2xl" />,
      title: "Best Market Price",
      description: "We help you get the highest value for your vehicle with professional valuation",
    },
    {
      icon: <Clock className="text-2xl" />,
      title: "Quick Process",
      description: "Our streamlined process makes selling faster than traditional methods",
    },
    {
      icon: <Shield className="text-2xl" />,
      title: "Secure Process",
      description: "Complete protection with verified processes and secure transactions",
    },
    {
      icon: <Users className="text-2xl" />,
      title: "Expert Network",
      description: "Access to our extensive network of automotive professionals",
    },
  ]

  const howItWorks = [
    {
      step: "01",
      icon: <Phone className="text-3xl" />,
      title: "Contact Our Team",
      description: "Get in touch with our automotive experts who will guide you through the entire selling process.",
      tip: "Pro tip: Have your vehicle details ready including make, model, year, and mileage",
    },
    {
      step: "02",
      icon: <ClipboardList className="text-3xl" />,
      title: "Professional Assessment",
      description: "Our experts will evaluate your vehicle and provide a comprehensive market analysis.",
      tip: "We consider all factors including condition, history, and current market trends",
    },
    {
      step: "03",
      icon: <CheckCircle className="text-3xl" />,
      title: "Selling Assistance",
      description: "We help facilitate the sale through our network of dealers and automotive professionals.",
      tip: "Our team handles all the paperwork and ensures a smooth transaction process",
    },
  ]

  const guides = [
    {
      icon: <Car className="text-4xl text-app-button" />,
      title: "Car Preparation",
      description: "Learn how to prepare your vehicle to maximize its appeal and value in the market.",
      color: "from-app-button to-orange-500",
    },
    {
      icon: <TrendingUp className="text-4xl text-app-button" />,
      title: "Market Analysis",
      description: "Understand current market trends and how they affect your vehicle value.",
      color: "from-app-button to-orange-500",
    },
    {
      icon: <CreditCard className="text-4xl text-app-button" />,
      title: "Transaction Security",
      description: "Learn about secure payment methods and transaction protection strategies.",
      color: "from-app-button to-orange-500",
    },
    {
      icon: <AlertTriangle className="text-4xl text-app-button" />,
      title: "Important Considerations",
      description: "Key factors to consider when selling your vehicle through professional channels.",
      color: "from-app-button to-orange-500",
    },
  ]

  const features = [
    {
      icon: <Gauge className="text-3xl" />,
      title: "Expert Consultation",
      description: "Get professional advice from automotive experts",
    },
    {
      icon: <Lock className="text-3xl" />,
      title: "Secure Process",
      description: "All transactions are handled with professional oversight",
    },
    {
      icon: <LifeBuoy className="text-3xl" />,
      title: "24/7 Support",
      description: "Our team is available to assist you throughout the process",
    },
  ]

  const faqs = [
    {
      question: "How does the car selling process work on your platform?",
      answer:
        "Our platform connects you with automotive professionals who specialize in vehicle sales. You contact our team, we assess your vehicle, and then help facilitate the sale through our network of dealers and professionals. All transactions are handled with professional oversight for your security.",
    },
    {
      question: "What documents do I need to sell my car?",
      answer:
        "You will need your vehicle title, registration, maintenance records, and if applicable, your loan payoff information. Our team will guide you through exactly what is required in your state during the consultation process.",
    },
    {
      question: "How is my car value determined?",
      answer:
        "Our automotive experts use comprehensive market analysis including recent sales data, current market trends, vehicle condition, mileage, and location to provide the most accurate valuation for your specific vehicle.",
    },
    {
      question: "Is it safe to sell my car through your platform?",
      answer:
        "Absolutely. All sales are facilitated through our network of verified automotive professionals. We provide consultation, professional assessment, and transaction oversight to ensure a secure and smooth selling experience.",
    },
    {
      question: "How long does the selling process typically take?",
      answer:
        "The timeline varies depending on your vehicle and market conditions. Our team will provide you with realistic expectations during the initial consultation and work to facilitate the sale as efficiently as possible.",
    },
  ]

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleContactUs = () => {
    // This would typically open a contact form or navigate to contact page
    router.push("/contact")
  }

return (
  <div className="min-h-screen bg-white dark:bg-gray-900 mt-16">
    {/* Hero Section */}
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-zinc-900 to-stone-900"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 bg-black/20" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" aria-hidden="true"></div>
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-app-button/10 px-4 py-2 backdrop-blur-sm">
              <Star className="mr-2 text-yellow-400" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-200">Trusted automotive services</span>
            </div>
            <div className="space-y-6">
              <h1 id="hero-heading" className="text-5xl font-bold leading-tight text-white lg:text-6xl">
                We Sell Cars{" "}
                <span className="bg-gradient-to-r from-app-button to-orange-400 bg-clip-text text-transparent">
                  Professionally
                </span>
              </h1>
              <p className="text-xl text-gray-300 lg:text-2xl">
                Learn about our professional car selling services. Our automotive experts help you navigate the
                selling process with confidence and security.
              </p>
              <button
                onClick={handleContactUs}
                className="group relative inline-flex transform items-center justify-center overflow-hidden rounded-xl bg-app-button px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800"
                aria-label="Contact our automotive experts to get started"
              >
                <div className="absolute inset-0 bg-app-button-hover opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true"></div>
                <span className="relative z-10 mr-3">Contact Our Experts</span>
                <ArrowRight className="relative z-10 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-app-button/20 to-app-button/10 blur-2xl" aria-hidden="true"></div>
            <div className="relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <Image
                src="/Luxury SUV.webp"
                alt="Professional automotive consultation showing luxury SUV in dealership setting"
                width={600}
                height={400}
                className="w-full rounded-xl object-cover shadow-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" aria-hidden="true"></div>
            </div>
          </div>
        </div>
        {/* Benefits Section - Moved outside the two-column grid */}
        <div className="mt-16 flex w-full justify-center">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4" role="list" aria-label="Service benefits">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center" role="listitem">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-app-button/20 text-app-button backdrop-blur-sm" aria-hidden="true">
                  {benefit.icon}
                </div>
                <p className="text-sm font-medium text-white">{benefit.title}</p>
                <p className="text-xs text-gray-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section 
      className="bg-gray-50 py-20 dark:bg-gray-800"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 id="how-it-works-heading" className="mb-4 text-4xl font-bold text-app-text dark:text-white">
            How Our Service Works
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
            Our professional team guides you through every step of the car selling process. Here&apos;s how we help
            you sell your vehicle with confidence.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3" role="list" aria-label="Service process steps">
          {howItWorks.map((step, index) => (
            <div
              key={index}
              className="group relative"
              role="listitem"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-900">
                <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-app-button to-orange-500" aria-hidden="true"></div>
                <div className="mb-6 flex items-center justify-between">
                  <div 
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-app-button to-orange-500 text-white shadow-lg"
                    aria-label={`Step ${step.step} icon`}
                  >
                    {step.icon}
                  </div>
                  <div className="text-6xl font-bold text-gray-100 dark:text-gray-700" aria-hidden="true">{step.step}</div>
                </div>
                <h3 className="mb-4 text-2xl font-bold text-app-text dark:text-white">{step.title}</h3>
                <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">{step.description}</p>
                <div
                  className={`transform transition-all duration-500 ${
                    hoveredCard === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  aria-live="polite"
                >
                  <div className="rounded-lg bg-app-button/10 p-4 dark:bg-app-button/20">
                    <p className="text-sm font-medium text-app-button dark:text-orange-300">{step.tip}</p>
                  </div>
                </div>
              </div>
              {index < howItWorks.length - 1 && (
                <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 transform md:block" aria-hidden="true">
                  <ArrowRight className="text-2xl text-app-button/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section 
      className="bg-white py-10 dark:bg-gray-900"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 id="features-heading" className="mb-4 text-4xl font-bold text-app-text dark:text-white">
            Why Choose Our Service?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Experience professional automotive services with expert guidance
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3" role="list" aria-label="Service features">
          {features.map((feature, index) => (
            <div key={index} className="group text-center" role="listitem">
              <div 
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-app-button to-orange-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl"
                aria-label={`${feature.title} feature icon`}
              >
                {feature.icon}
              </div>
              <h3 className="mb-4 text-xl font-bold text-app-text dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section 
      className="bg-white py-20 dark:bg-gray-900"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 id="faq-heading" className="mb-4 text-4xl font-bold text-app-text dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get answers to common questions about our car selling services
          </p>
        </div>
        <div className="space-y-4" role="list" aria-label="Frequently asked questions">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              role="listitem"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-6 text-left transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-expanded={activeIndex === index}
                aria-controls={`faq-answer-${index}`}
                aria-label={`Toggle answer for: ${faq.question}`}
              >
                <span className="pr-4 text-lg font-semibold text-app-text dark:text-white">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-app-button transition-transform duration-300 dark:text-orange-400 ${
                    activeIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`transition-all duration-500 ease-in-out ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="px-6 pb-6">
                  <div className="mb-4 h-px bg-gradient-to-r from-app-button to-orange-500" aria-hidden="true"></div>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section 
      className="relative overflow-hidden bg-gradient-to-r from-app-button to-orange-600 py-20 dark:from-gray-800 dark:to-gray-900"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" aria-hidden="true"></div>
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="cta-heading" className="mb-6 text-4xl font-bold text-white dark:text-gray-100">
          Ready to Sell Your Car?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-200 dark:text-gray-300">
          Contact our automotive experts today to learn more about our professional car selling services and get
          expert guidance for your vehicle.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center" role="group" aria-label="Contact options">
          <button
            onClick={handleContactUs}
            className="group flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-app-button to-orange-500 px-8 py-4 font-semibold text-white shadow-lg hover:from-app-button-hover hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
            aria-label="Contact our automotive experts by phone"
          >
            Contact Our Experts
          </button>
          <Link
            href="/about"
            className="flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-gray-100 dark:hover:border-gray-500/70 dark:hover:bg-gray-600/60 focus:outline-none focus:ring-4 focus:ring-white/30"
            aria-label="Learn more about our company and services"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  </div>
)
}