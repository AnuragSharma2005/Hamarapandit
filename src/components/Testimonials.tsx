/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { TESTIMONIALS_DATA } from "../data/astrologyData";

export default function Testimonials() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10" id="testimonials-section">
      <div className="text-center mb-12">
        <span className="px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-purple-400 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
          💬 Client's Testimonials
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          We love to hear from Our Customers
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
          Read direct feedback from amateur stargazers and professional astro-consultants operating with our spatial calculations.
        </p>
      </div>

      {/* Grid layout matching the card design in attachment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS_DATA.map((testimonial, idx) => {
          // Alternative coloring mockups for badge dots as in the photo
          const colorBadge = idx === 0 ? "bg-sky-500" : idx === 1 ? "bg-amber-400" : "bg-emerald-400";
          return (
            <div
              key={testimonial.id}
              className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300 relative group"
            >
              <div className="space-y-4">
                {/* 5 Star Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>

              {/* Reviewer signature info */}
              <div className="flex items-center gap-3 mt-6 border-t border-slate-900/60 pt-4">
                <img
                  src={testimonial.avatarUrl}
                  alt={testimonial.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-800"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    <span>{testimonial.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 fill-blue-950" />
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {testimonial.role}
                  </p>
                </div>

                {/* Aesthetic status dots */}
                <div className="ml-auto flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${colorBadge} shadow-lg`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
