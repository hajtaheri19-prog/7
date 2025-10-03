"use client";

import React, { useState } from 'react';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { MessageSquareHeart, Send, CheckCircle, Mail, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual EmailJS or API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-effect rounded-3xl p-8 md:p-12 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border border-pink-500/20 shadow-[0_0_40px_#ec489922] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-rose-500/5 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8 text-center justify-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500/50 to-rose-500/30 shadow-[0_0_25px_#ec489966] flex items-center justify-center border border-pink-400/30"
                >
                  <MessageSquareHeart className="w-8 h-8 text-pink-200 drop-shadow-lg" />
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-display font-bold text-foreground text-glow"
                >
                  انتقادات و پیشنهادات
                </motion.h1>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-lg text-foreground/90 mb-8 leading-relaxed"
              >
                نظرات، پیشنهادات و انتقادات شما برای ما بسیار ارزشمند است. با ارسال بازخورد خود، در بهبود تجربه همه کاربران سهیم شوید.
              </motion.p>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="relative"
                    >
                      <label className="flex text-sm font-medium text-pink-200 mb-2 items-center gap-2">
                        <User className="w-4 h-4" />
                        نام شما
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-black/30 border border-pink-500/30 rounded-2xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="نام و نام خانوادگی خود را وارد کنید"
                      />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative"
                    >
                      <label className="flex text-sm font-medium text-pink-200 mb-2 items-center gap-2">
                        <Mail className="w-4 h-4" />
                        ایمیل شما
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-black/30 border border-pink-500/30 rounded-2xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder="example@email.com"
                      />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="relative"
                    >
                      <label className="flex text-sm font-medium text-pink-200 mb-2 items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        پیام شما
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full p-4 bg-black/30 border border-pink-500/30 rounded-2xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-300 backdrop-blur-sm resize-none"
                        placeholder="نظرات، پیشنهادات یا انتقادات خود را با ما در میان بگذارید..."
                      />
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-center"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold h-14 px-12 text-lg shadow-[0_0_20px_#ec489944] border border-pink-400/30 transition-all duration-300 hover:shadow-[0_0_30px_#ec489966] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <Send className="ml-3 h-6 w-6" />
                            ارسال پیام
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-500/50 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#10b98166]"
                    >
                      <CheckCircle className="w-10 h-10 text-green-200" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-green-300 mb-4">پیام شما با موفقیت ارسال شد!</h2>
                    <p className="text-foreground/80 text-lg">
                      از وقتی که گذاشتید متشکریم. پیام شما بررسی و در اسرع وقت پاسخ داده خواهد شد.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 text-center"
              >
                <p className="text-sm text-yellow-200/90">
                  همچنین می‌توانید مستقیماً از طریق ایمیل با ما در ارتباط باشید:
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-200 font-bold text-lg mt-2">
                  <Mail className="w-5 h-5" />
                  <span>tabdila.ir@gmail.com</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
