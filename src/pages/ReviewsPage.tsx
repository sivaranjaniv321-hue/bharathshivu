import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Review } from '../types';

interface ReviewsPageProps {
  reviews: Review[];
  onAddReview: (name: string, rating: number, text: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ reviews, onAddReview }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setError('Please enter both your name and review message.');
      return;
    }
    setError('');
    onAddReview(name, rating, text);
    setName('');
    setRating(5);
    setText('');
    setSubmittedNotice(true);
    setTimeout(() => setSubmittedNotice(false), 4000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="pb-6 border-b border-[#E5DDD0]">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B1826]">
          Guest Stories
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#2B1810]">
          Customer Reviews
        </h1>
        <p className="mt-2 text-sm text-[#5C4B41]">
          Sample reviews are clearly labelled below. Share your own dining experience with Bharath Delights.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-[#E5DDD0] rounded-xl p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-[#D4A017] text-[#D4A017]' : 'text-[#D8CCBC]'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="text-xs text-[#6B5A4E]">
                  {review.isSample ? 'Sample Review' : 'Customer Review'} · {review.date}
                </span>
              </div>

              <p className="text-sm text-[#3F3128] leading-relaxed">
                &ldquo;{review.text}&rdquo;
              </p>
              <p className="mt-4 pt-3 border-t border-[#F0E8DC] text-sm font-semibold text-[#2B1810]">
                {review.customerName}
              </p>
            </article>
          ))}
        </div>

        {/* Submit Review Form */}
        <aside className="lg:col-span-5 bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold text-[#2B1810] mb-1">
            Write a Review
          </h2>
          <p className="text-xs text-[#5C4B41] mb-5">
            Your feedback helps us serve authentic Tamil Nadu flavors better.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reviewerName" className="block text-sm font-medium text-[#2B1810] mb-1">
                Your Name <span className="text-[#8C1D2D]">*</span>
              </label>
              <input
                id="reviewerName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-11 px-3.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-[#2B1810] mb-1.5">
                Rating
              </span>
              <div className="flex items-center gap-1.5" role="group" aria-label="Select star rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="p-1.5 rounded-md hover:bg-[#FAF6EF] cursor-pointer"
                    aria-label={`${value} stars`}
                    aria-pressed={rating === value}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        value <= rating
                          ? 'fill-[#D4A017] text-[#D4A017]'
                          : 'text-[#D8CCBC]'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-[#5C4B41] tabular-nums">
                  {rating} / 5
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="reviewText" className="block text-sm font-medium text-[#2B1810] mb-1">
                Your Review <span className="text-[#8C1D2D]">*</span>
              </label>
              <textarea
                id="reviewText"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share what you ordered and how it tasted..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CCBC] bg-white text-sm focus:outline-none focus:border-[#6B1826]"
              />
            </div>

            {error && <p className="text-xs text-[#8C1D2D]">{error}</p>}
            {submittedNotice && (
              <p className="text-xs font-medium text-[#1E6B3A] bg-[#E8F5EE] p-3 rounded-lg">
                Thank you! Your review has been added.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-lg bg-[#6B1826] hover:bg-[#4F101B] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
};
