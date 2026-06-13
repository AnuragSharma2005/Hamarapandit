/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ArrowRight, Calendar, Bookmark, Eye, Mail, X } from "lucide-react";
import { BLOGS_DATA } from "../data/astrologyData";
import { BlogArticle } from "../types";

export default function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail) return;
    setIsSubscribed(true);
    setSubscriberEmail("");
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10" id="blogs-section">
      {/* Blog Listing Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
        <div>
          <span className="px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-amber-500 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
            📚 Recent Articles
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Get in Touch with Our
            <span className="block mt-1">Latest News & Blog</span>
          </h2>
        </div>

        <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-100 hover:border-amber-400 hover:text-amber-400 transition-all font-semibold uppercase tracking-wider">
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of articles matching image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {BLOGS_DATA.map((article) => (
          <article
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="flex flex-col bg-slate-900/30 border border-slate-850 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/20 transition-all duration-300 group shadow-lg"
          >
            {/* Cover Image */}
            <div className="relative h-48 md:h-52 overflow-hidden bg-slate-950">
              <img
                src={article.imageUrl}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                {article.category}
              </div>
            </div>

            {/* Contents */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  <span>{article.date}</span>
                  <span className="mx-1.5">•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-base font-semibold leading-snug text-slate-100 group-hover:text-amber-400 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Action read more */}
              <div className="mt-5 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs font-semibold text-slate-350 group-hover:text-white transition-colors">
                <span className="uppercase tracking-wider">Read Article</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Subscription Banner below matching the image */}
      <div className="mt-20 bg-slate-900/50 backdrop-blur-md border border-slate-850 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/5 rounded-full blur-2xl" />
        
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
            Join Our Newsletter for Latest Blogs
          </h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Stay updated with the latest celestial shifts, transits alignments, and special community updates!
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full md:w-auto max-w-md flex flex-col sm:flex-row gap-3 relative z-10">
          {isSubscribed ? (
            <div className="p-3 text-center sm:text-left text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-900/50 rounded-xl">
              ✨ Subscription active! Stargazer newsletters arriving soon.
            </div>
          ) : (
            <>
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="email"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-full px-5 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 transition-all pr-10"
                  required
                />
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-500" />
              </div>
              <button
                type="submit"
                className="bg-slate-100 text-slate-950 hover:bg-slate-200 hover:scale-[1.02] border border-transparent font-semibold rounded-xl md:rounded-full px-8 py-3 text-xs transition-all tracking-wider font-sans shrink-0 cursor-pointer shadow-lg"
              >
                Subscribe
              </button>
            </>
          )}
        </form>
      </div>

      {/* Blog Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-purple-500" />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all border border-slate-800 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable Contents */}
            <div className="overflow-y-auto p-6 md:p-8 space-y-6">
              {/* Cover Image in modal */}
              <div className="relative h-56 md:h-64 rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-800 text-[10px] font-semibold text-amber-500 uppercase tracking-widest">
                  {selectedArticle.category}
                </div>
              </div>

              {/* Title & metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-100">
                  {selectedArticle.title}
                </h3>
              </div>

              {/* Paragraph content */}
              <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-slate-200 border-l-2 border-amber-500 pl-3">
                  {selectedArticle.excerpt}
                </p>
                <p>
                  {selectedArticle.content}
                </p>
                <p>
                  Vedic Astrology emphasizes that each Eclipse triggers an essential karmic house correction. The gravitational and electromagnetic shifts during alignment cause natural resets in mental flow (Moon) and life energy (Sun). Utilizing this reading checklist helps guide practitioners safely through structural transitions...
                </p>
              </div>

              {/* Close and bookmark actions */}
              <div className="pt-4 border-t border-slate-950 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-full py-3 rounded-xl bg-slate-950 border border-slate-850 text-sm font-medium hover:bg-slate-850 text-slate-300 transition-all"
                >
                  Close Article Reader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
