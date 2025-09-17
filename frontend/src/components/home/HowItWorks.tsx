'use client';

import { MagnifyingGlassIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Search & Discover',
    description: 'Find African restaurants in your area by cuisine, location, or specific dishes you\'re craving.',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Book Your Table',
    description: 'Check real-time availability and book your reservation in just a few clicks.',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
  },
  {
    icon: CheckCircleIcon,
    title: 'Enjoy Your Meal',
    description: 'Arrive at your reservation time and enjoy authentic African cuisine in a welcoming atmosphere.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Afritable Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting your table at the best African restaurants is simple and fast. 
            Here's how you can discover and book your next amazing meal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center group">
              {/* Step Number */}
              <div className="relative mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="hidden md:block mt-8">
          <div className="flex justify-center items-center">
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="mx-4 w-3 h-3 bg-primary-600 rounded-full"></div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
            <div className="mx-4 w-3 h-3 bg-primary-600 rounded-full"></div>
            <div className="flex-1 h-0.5 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
