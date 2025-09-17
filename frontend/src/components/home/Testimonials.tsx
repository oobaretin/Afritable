'use client';

import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'Houston, TX',
    rating: 5,
    text: 'Afritable helped me discover amazing Ethiopian restaurants in my area. The booking process was seamless and the food was incredible!',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
  },
  {
    name: 'Michael Chen',
    location: 'New York, NY',
    rating: 5,
    text: 'As someone who loves trying new cuisines, Afritable has been a game-changer. I\'ve found so many hidden gems for African food.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    name: 'Aisha Williams',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'Finally, a platform that celebrates African cuisine! The restaurant recommendations are spot-on and the reservation system works perfectly.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
  },
  {
    name: 'David Rodriguez',
    location: 'Los Angeles, CA',
    rating: 5,
    text: 'I\'ve been using Afritable for months now and it\'s become my go-to for finding authentic African restaurants. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
  },
  {
    name: 'Fatima Al-Hassan',
    location: 'Washington, DC',
    rating: 5,
    text: 'The variety of cuisines available is amazing. From Moroccan tagines to Nigerian jollof rice, I can find it all on Afritable.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
  },
  {
    name: 'James Thompson',
    location: 'Houston, TX',
    rating: 5,
    text: 'Great platform for discovering new African restaurants. The reviews and ratings help me make informed decisions about where to dine.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have discovered their new favorite 
            African restaurants through Afritable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Restaurants</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">25K+</div>
            <div className="text-gray-600">Reservations Made</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
