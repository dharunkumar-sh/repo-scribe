"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Senior Frontend Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    content: "RepoScribe completely changed my workflow. I used to dread writing documentation for my open-source projects, but now it's my favorite part. The AI understands my Next.js apps perfectly.",
  },
  {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    content: "The quality of the generated READMEs is mind-blowing. It correctly identified all my Python dependencies, setup instructions, and even generated badges automatically. 10/10.",
  },
  {
    name: "Marcus Johnson",
    role: "DevOps Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    content: "I've tried other AI doc generators, but none match the premium feel and accuracy of RepoScribe. The output is clean, formatted beautifully, and genuinely helpful for onboarding.",
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 relative">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#22D3EE]/10 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by <span className="text-gradient">Developers</span>
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Don't just take our word for it. Here's what engineers are saying about RepoScribe.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass p-8 rounded-3xl border border-white/10 hover:border-[#7C3AED]/40 hover:-translate-y-2 transition-all duration-300 shadow-xl"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-[#E4E4E7] text-lg mb-8 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden border border-white/20">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#FAFAFA]">{testimonial.name}</h4>
                  <p className="text-sm text-[#A1A1AA]">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
