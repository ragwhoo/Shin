"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Mail } from "lucide-react";

interface ContactData {
  phone: string;
  email: string;
}

export const Contact = () => {
  const [data, setData] = useState<ContactData | null>(null);

  useEffect(() => {
    fetch("/content/contact.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return null;

  const cleanPhone = data.phone.replace(/[^0-9+]/g, "");
  const waLink = `https://wa.me/${cleanPhone.replace("+", "")}?text=Hi!%20I'm%20interested%20in%20RUTAM%20oils.`;

  return (
    <section id="contact" className="bg-[#365F37] px-6 py-24">
      <div className="w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 block text-xs font-medium tracking-[0.25em] uppercase text-[#fdffee]/70/70">
            Connect
          </span>
          <h2 className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] text-[#fdffee]">
            Contact
          </h2>
          <p className="mt-6 mx-auto max-w-lg text-sm tracking-[0.15em] uppercase text-center text-[#fdffee]/70/70">
            Have questions or want to place an order? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#fdffee]/20 px-8 py-4 text-[#fdffee] hover:bg-[#365F37] sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>

          <a
            href={`tel:${cleanPhone}`}
            className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#fdffee] px-8 py-4 font-semibold text-[#365F37] transition-opacity hover:opacity-90 sm:w-auto"
          >
            <Phone className="h-5 w-5" />
            {data.phone}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex items-center justify-center gap-2 text-sm text-[#fdffee]/60/60"
        >
          <Mail className="h-4 w-4" />
          <a href={`mailto:${data.email}`} className="hover:text-[#fdffee]/90/90">
            {data.email}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 border-t border-[#fdffee]/10 pt-8 text-xs text-center text-[#fdffee]/50/10/50"
        >
          RUTAM Wood-Pressed Oils &mdash; by Sri Krishna Enterprises
          <br />
          FSSAI Certified &middot; Wood Cold-Pressed &middot; 100% Pure & Natural
          <br />
          &copy; {new Date().getFullYear()} Sri Krishna Enterprises
        </motion.div>
      </div>
    </section>
  );
};







