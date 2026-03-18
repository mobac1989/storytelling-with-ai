import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowLeft, 
  Play, 
  Camera, 
  Mic, 
  Palette,
  Smile,
  MapPin,
  Send,
  Plus,
  Minus,
  X
} from 'lucide-react';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number; key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const Section = ({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`py-10 md:py-14 px-6 md:px-12 max-w-6xl mx-auto w-full ${className}`}>
    {children}
  </section>
);

const CTAButton = ({ href = "#registration-form", children, primary = true }: { href?: string; children: React.ReactNode; primary?: boolean }) => (
  <a 
    href={href} 
    className={`px-6 md:px-8 py-4 font-bold transition-all duration-300 inline-flex items-center justify-center gap-2 md:gap-4 text-sm md:text-base border whitespace-nowrap ${
      primary 
      ? "bg-neon-pink text-white border-neon-pink cta-glow" 
      : "bg-white text-black border-black md:hover:bg-neon-pink md:hover:text-white md:hover:border-neon-pink cta-glow"
    }`}
  >
    {children}
    <ArrowLeft size={20} />
  </a>
);

const SmartImage = ({ 
  src, 
  alt, 
  className = "", 
  priority = false,
  aspectRatio = "aspect-square"
}: { 
  src: string; 
  alt: string; 
  className?: string; 
  priority?: boolean;
  aspectRatio?: string;
}) => {
  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority={priority ? "high" : "low"}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const next = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="mt-2 md:mt-8 group/slider max-w-full overflow-hidden">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-transparent">
        <motion.div 
          className={`flex h-full ${images.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (images.length <= 1) return;
            const threshold = 50;
            if (info.offset.x > threshold) {
              prev();
            } else if (info.offset.x < -threshold) {
              next();
            }
          }}
          animate={{ x: `${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0">
              <SmartImage 
                src={img} 
                alt={`Slide ${i}`} 
                aspectRatio="aspect-[16/9]"
                className="w-full h-full"
              />
            </div>
          ))}
        </motion.div>
        
        {/* Navigation Arrows - Top Left - Hidden on mobile, shown on hover on desktop */}
        {images.length > 1 && (
          <div className="absolute top-6 left-6 hidden md:flex gap-4 z-10 opacity-0 group-hover/slider:opacity-100 transition-opacity">
            <button 
              onClick={next}
              className="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-full"
            >
              <ChevronLeft size={20} strokeWidth={1} className="text-white" />
            </button>
            <button 
              onClick={prev}
              className="p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors rounded-full"
            >
              <ChevronRight size={20} strokeWidth={1} className="text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Dots - Centered in mobile, Left Aligned in desktop (RTL) */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 justify-center md:justify-end">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`h-[1px] w-8 transition-all duration-500 ${i === currentIndex ? "bg-neon-pink" : "bg-black/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AccordionItem = ({ 
  index, 
  title, 
  desc, 
  longDesc,
  images, 
  isOpen, 
  onToggle 
}: { 
  index: number; 
  title: string; 
  desc: string; 
  longDesc?: string;
  images: string[]; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div 
      className={`border mb-4 md:mb-6 transition-all duration-500 overflow-hidden ${isOpen ? "bg-[#f9f9f9] shadow-xl border-neon-pink" : "border-black bg-white md:hover:border-neon-pink"}`}
    >
      <button 
        onClick={onToggle}
        className="w-full py-6 md:py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 px-6 md:px-10 text-right group cursor-pointer max-w-full overflow-hidden"
      >
        <div className="flex items-center justify-between md:justify-start md:w-32">
          <span className={`text-4xl md:text-5xl font-black transition-all duration-500 ${isOpen ? "opacity-100 text-neon-pink" : "opacity-[0.05] md:group-hover:opacity-100 md:group-hover:text-neon-pink"}`}>
            0{index + 1}
          </span>
          <div className={`transition-transform duration-500 md:hidden ${isOpen ? "rotate-180" : ""}`}>
            {isOpen ? (
              <Minus size={24} strokeWidth={1} className="text-neon-pink" />
            ) : (
              <Plus size={24} strokeWidth={1} className="md:group-hover:text-neon-pink transition-colors" />
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between gap-4">
          <div className="text-right transition-transform duration-300 group-hover:-translate-x-2 md:group-hover:-translate-x-4">
            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 mb-3 md:mb-4">
              <h3 className="text-xl md:text-2xl font-bold tracking-tight break-words">{title}</h3>
            </div>
            <p className="text-sm md:text-lg font-light opacity-60 leading-relaxed max-w-3xl break-words">{desc}</p>
          </div>
          <div className="hidden md:flex items-center gap-4 md:gap-6 shrink-0">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-neon-pink opacity-0 md:group-hover:opacity-100 transition-opacity">
              {isOpen ? "סגור" : "הצצה למפגש"}
            </span>
            <div className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}>
              {isOpen ? (
                <Minus size={24} md:size={32} strokeWidth={1} className="text-neon-pink" />
              ) : (
                <Plus size={24} md:size={32} strokeWidth={1} className="md:group-hover:text-neon-pink transition-colors" />
              )}
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 px-6 md:px-10 md:pr-44 w-full">
              {longDesc && (
                <p className="text-sm md:text-lg font-light opacity-80 leading-relaxed mb-10 border-r-2 border-neon-pink pr-6 break-words max-w-3xl">
                  {longDesc}
                </p>
              )}
              <div className="max-w-4xl">
                <ImageSlider images={images} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      const structureSection = document.getElementById('structure');
      
      if (aboutSection && structureSection) {
        const aboutRect = aboutSection.getBoundingClientRect();
        const structureRect = structureSection.getBoundingClientRect();
        
        // Show when about section is scrolled into view
        // Hide when structure section is reached
        const shouldShow = aboutRect.top < window.innerHeight * 0.5 && structureRect.top > window.innerHeight * 0.8;
        setShowFloatingCTA(shouldShow);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement('script');
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isVideoModalOpen && (window as any).instgrm) {
      // Small delay to ensure the modal DOM is fully rendered
      setTimeout(() => {
        (window as any).instgrm.Embeds.process();
      }, 100);
    }
  }, [isVideoModalOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Client-side check for honeypot
    if (formData.get('_honey')) {
      console.log('Bot detected');
      return;
    }
    
    // Add FormSubmit specific fields
    formData.append('_subject', "פנייה חדשה מהאתר: " + (formData.get('name') || 'ללא שם'));
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');

    try {
      const response = await fetch('https://formsubmit.co/ajax/mobac89@gmail.com', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      console.log('FormSubmit Response:', result);

      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-neon-pink selection:text-white font-sans overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-black/5 z-[100]">
        <motion.div
          className="h-full bg-neon-pink origin-right"
          style={{ scaleX }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:pl-12 md:pr-36 overflow-hidden py-12 md:py-0">
        
        <div className="max-w-7xl w-full mx-auto grid md:grid-cols-12 gap-4 md:gap-10 items-center">
          <div className="md:col-span-6 text-center md:text-right order-1 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <div className="h-[1px] w-8 md:w-12 bg-black" />
                <span className="text-[9px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase whitespace-normal text-center md:text-right">סדרת מפגשים ליצירה עם AI</span>
                <div className="h-[1px] w-8 bg-black md:hidden" />
              </div>
              
              <h1 className="text-6xl sm:text-8xl md:text-[7.5rem] font-black tracking-tighter mb-8 leading-[0.85] md:leading-[0.8] uppercase relative text-center md:text-right">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, staggerChildren: 0.05 }}
                >
                  {"איך לספר".split("").map((char, i) => (
                    <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
                <br />
                <span className="text-outline relative inline-block">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    סיפורים
                  </motion.span>
                  <motion.span 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8, ease: "circOut" }}
                    className="absolute -bottom-1 md:-bottom-2 right-0 h-1 bg-neon-pink"
                  />
                </span> <br />
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  עם AI
                </motion.span>
              </h1>
              
              <div className="flex flex-col gap-6 items-center md:items-start">
                <div className="max-w-md">
                  <p className="text-base md:text-xl font-light leading-relaxed opacity-60 md:border-r-2 md:border-black pr-0 md:pr-8 text-center md:text-right break-words">
                    קורס יצירתי שמראה איך לקחת רגע —<br />
                    ולהפוך אותו לסצנה בעזרת בינה מלאכותית.
                  </p>
                </div>
                <CTAButton>לשמוע עוד על הקורס</CTAButton>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-6 order-2 md:order-2 flex justify-center md:-mt-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="relative w-full max-w-[470px] md:max-w-[625px] aspect-square flex items-center justify-center overflow-hidden group"
            >
              <SmartImage 
                src="https://i.postimg.cc/K4SjqVcC/anita.gif" 
                alt="Hero Graphic" 
                priority={true}
                className="w-full h-full"
              />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 md:gap-6 z-10 opacity-20 md:opacity-40">
          <span className="text-[8px] md:text-[10px] font-bold tracking-widest uppercase">ספר לי עוד</span>
          <motion.div 
            animate={{ height: [20, 40, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] bg-neon-pink" 
          />
        </div>
      </section>

      {/* Intro Section - Refined Grid */}
      <Section id="intro" className="border-t-[0.5px] border-black pt-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-8">
            <FadeIn>
              <div className="mb-12">
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 mb-4 block">01 / השאלה</span>
                <h2 className="text-4xl md:text-6xl font-black leading-[0.9] tracking-tighter break-words">
                  איך משחזרים <br />רגע שלא צולם?
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 text-base md:text-lg font-light leading-relaxed">
                <div className="space-y-6">
                  <p className="break-words">
                    בקורס הזה נלמד איך להשתמש בכלי AI<br />
                    כדי להפוך רגעים וזיכרונות לסצנות.
                  </p>
                  <p className="break-words">המפגשים מתקיימים בקבוצה קטנה ובאווירה יצירתית, ומשלבים הרצאות, הדגמות ותהליך עבודה אמיתי של יצירה בעזרת AI.</p>
                </div>
                <div className="space-y-6">
                  <div className="p-6 md:p-8 border border-black relative">
                    <div className="absolute -top-2 md:-top-3 -right-2 md:-right-3 w-4 md:w-6 h-4 md:h-6 bg-white border border-black flex items-center justify-center text-[8px] md:text-[10px] font-bold">!</div>
                    <p className="font-bold text-lg md:text-xl leading-tight mb-4 break-words">
                      לאורך הקורס נחזור שוב ושוב לדמות אחת — אניטה פללי.
                    </p>
                    <p className="text-base font-light opacity-70 break-words">
                      דרך הסיפור שלה נראה איך רגעים וזיכרונות יכולים להפוך לסצנות בעזרת בינה מלאכותית.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-4 self-center">
            <FadeIn delay={0.2}>
              <div 
                onClick={() => setIsVideoModalOpen(true)}
                className="relative aspect-[4/5] overflow-hidden border-[0.5px] border-black group cursor-pointer"
              >
                <SmartImage 
                  src="https://i.postimg.cc/MZRGHQkn/escape.jpg" 
                  alt="Creative Process" 
                  aspectRatio="aspect-[4/5]"
                  className="transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 mix-blend-multiply transition-opacity group-hover:opacity-0" />
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-white flex items-center justify-center border border-black md:group-hover:bg-neon-pink md:group-hover:text-white transition-all">
                    <Play size={20} />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* About Me Section - Light Version */}
      <div className="bg-[#f9f9f9] py-12 md:py-20 border-y-[0.5px] border-black">
        <Section id="about">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start w-full">
            <div className="md:col-span-5 md:sticky md:top-24 w-full">
              <FadeIn>
                <div className="relative w-full">
                  <div className="relative aspect-[4/5] overflow-hidden border border-black w-full">
                    <SmartImage 
                      src="https://i.postimg.cc/WbX6fH5p/anita-gif.gif" 
                      alt="Moti and Anita" 
                      aspectRatio="aspect-[4/5]"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="md:col-span-7 w-full">
              <FadeIn delay={0.2}>
                <span className="text-[10px] font-bold opacity-40 mb-6 md:mb-8 block tracking-[0.5em] uppercase">02 / היוצר</span>
                <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tighter break-words">היי, אני מוטי.</h2>
                <div className="space-y-6 md:space-y-8 text-base md:text-lg font-light leading-relaxed max-w-2xl break-words w-full">
                  <p className="text-lg md:text-xl font-bold leading-tight">אני מוביל את תחום עיצוב המוצר בחברת הייטק, בוגר המחלקה לארכיטקטורה בבצלאל, ויוצר פרויקטים שמחברים בין סיפור, ויזואליה וטכנולוגיה.</p>
                  <p className="opacity-60">הקשר שלי עם אניטה פללי התחיל עוד כשהייתי בן 15 — אז נהגתי לחקות אותה. יותר מעשרים שנה אחר כך פגשתי אותה במקרה ברחוב בפלורנטין.</p>
                  <p className="opacity-60">המפגש הזה הוביל לקשר בינינו, לפתיחת עמוד אינסטגרם עבורה ולניסיון להחזיר את הסיפורים שלה לתודעה. כשניסיתי לספר רגעים שלא תועדו במצלמה, התחלתי להשתמש בכלי AI כדי לשחזר אותם.</p>
                  <p className="opacity-60">מתוך הניסיונות האלה התפתחה שיטה יצירתית שמאפשרת לקחת רגע — ולהפוך אותו לסצנה. <span className="opacity-100 font-bold">השיטה הזו היא הבסיס לקורס.</span></p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Section>
      </div>

      {/* Course Core Section - Bento Style */}
      <Section id="course" className="pt-32 pb-20">
        <FadeIn>
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="text-[10px] font-bold mb-6 block tracking-[0.5em] uppercase opacity-40">03 / הליבה</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6 break-words">על מה הקורס?</h2>
              <p className="text-base md:text-xl font-light leading-relaxed opacity-60 break-words">
                כלי AI מאפשרים היום ליצור כמעט כל תמונה או סרטון. אבל השאלה החשובה היא לא מה אפשר ליצור — אלא מה אנחנו רוצים לספר.
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-px bg-black border border-black">
          {[
            {
              icon: <Mic size={18} md:size={20} className="text-neon-pink" />,
              title: "מהסיפור לסצנה",
              desc: "נלמד איך לקחת רגע — זיכרון, חלום או שיחה — ולהפוך אותו לסצנה ויזואלית."
            },
            {
              icon: <Camera size={18} md:size={20} className="text-neon-pink" />,
              title: "תהליך יצירתי",
              desc: "נלמד תהליך שמתחיל בסיפור ומתקדם לבניית סצנה בעזרת כלי AI ודוגמאות אמיתיות."
            },
            {
              icon: <Sparkles size={18} md:size={20} className="text-neon-pink" />,
              title: "מאחורי הקלעים",
              desc: "הצצה לניסויים אמיתיים ולתהליך העבודה שמוביל לתוצאות הסופיות."
            }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-8 md:p-10 bg-white h-full md:hover:bg-black md:hover:text-white transition-colors duration-0 group cursor-default">
                <div className="mb-6 md:mb-8 opacity-40 md:group-hover:opacity-100 transition-opacity">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 tracking-tight break-words">{item.title}</h3>
                <p className="text-sm md:text-lg font-light opacity-60 md:group-hover:opacity-100 leading-relaxed break-words">{item.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* For Whom Section - Refined */}
      <div className="bg-[#f2f2f2] py-12 md:py-20 border-y-[0.5px] border-black">
        <Section>
          <div className="grid md:grid-cols-12 gap-20">
            <div className="md:col-span-6">
              <FadeIn>
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-8 block">04 / קהל יעד</span>
                <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter break-words">למי הקורס מתאים?</h2>
                <div className="space-y-4 break-words">
                  {[
                    "מעצבים ויוצרים ויזואליים",
                    "סטודנטים לעיצוב, קולנוע או אמנות",
                    "יוצרים דוקומנטריים",
                    "יוצרי תוכן ואנשים שמתעניינים בסטוריטלינג",
                    "אנשים סקרנים שרוצים להיכנס לעולם ה-AI דרך יצירה"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4 md:gap-6 group border-b border-black/10 pb-4 last:border-0">
                      <span className="text-[10px] md:text-xs font-bold text-neon-pink">0{i + 1}</span>
                      <span className="text-lg md:text-xl font-light opacity-80 group-hover:opacity-100 transition-opacity">{text}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            <div className="md:col-span-6 self-end">
              <FadeIn delay={0.2}>
                <div className="w-full max-w-[224px] mx-auto mb-0">
                  <SmartImage 
                    src="https://i.postimg.cc/wBYBhXCX/facegif.gif" 
                    alt="Creative Process" 
                    aspectRatio="aspect-square"
                    className="bg-transparent"
                  />
                </div>
                <div className="p-10 border border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-2xl font-bold leading-tight mb-6">
                    אין צורך בידע טכני מתקדם — רק סקרנות ורצון ליצור.
                  </p>
                  <div className="h-[1px] w-16 bg-black mb-6" />
                  <p className="text-lg font-light opacity-60">הקורס פתוח גם למי שרוצה רק להקשיב, לקבל השראה ולהכיר את התהליך. ההתנסות היצירתית במהלך הקורס היא לגמרי אופציונלית.</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </Section>
      </div>

      {/* What You'll Learn - Technical Grid */}
      <Section className="pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <FadeIn>
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-8 block">05 / תוכנית הלימודים</span>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter break-words">מה תלמדו?</h2>
              <div className="space-y-4 text-lg font-light opacity-40 leading-relaxed break-words">
                <p>בקורס נלמד שיטה יצירתית שמאפשרת להפוך רגע או סיפור לסצנה.</p>
                <p>זה תהליך שפיתחתי מתוך ניסיונות אמיתיים לשחזר רגעים שלא צולמו — כולל המפגש שלי עם אניטה פללי.</p>
              </div>
            </FadeIn>
          </div>
          <div className="md:col-span-8 grid sm:grid-cols-2 gap-px bg-black border border-black">
            {[
              "איך למצוא סיפור ששווה לספר",
              "איך להתחיל מסיפור או אודיו - ולא מתמונה",
              "איך לפרק סיפור לרגעים ויזואליים",
              "איך ליצור דמויות ולוקיישנים בעזרת AI",
              "איך ליצור פריימים ויזואליים עם כלי AI",
              "איך להנפיש את הסצנה ולהפוך אותה לתוצר סופי"
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white p-8 h-full md:hover:bg-black md:hover:text-white transition-colors duration-0 group">
                  <span className="text-[10px] font-bold opacity-30 mb-2 block tracking-widest md:group-hover:text-neon-pink md:group-hover:opacity-100 transition-colors">שלב 0{i + 1}</span>
                  <p className="text-xl font-bold leading-tight transition-transform break-words">{item}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Different - High Contrast */}
      <div className="bg-white py-12 md:py-20 border-t-[0.5px] border-black">
        <Section>
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="md:w-1/2">
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-8 block">06 / פילוסופיה</span>
                <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none break-words">למה הקורס <br />הזה שונה?</h2>
              </div>
              <div className="md:w-1/2 space-y-12">
                <p className="text-3xl font-black leading-[0.9] tracking-tighter break-words">
                  רוב קורסי ה-AI מלמדים איך להשתמש בכלים. <span className="text-outline">אנחנו מתחילים מהסיפור.</span>
                </p>
                <div className="space-y-8 text-lg font-light opacity-60 leading-relaxed border-r-2 border-black md:pr-12 pr-6 break-words">
                  <p>המטרה היא לא רק ללמוד ליצור עם הכלים, אלא להבין איך להשתמש בהם כדי לספר סיפור.</p>
                  <p>במהלך הקורס נלמד שיטה יצירתית שפיתחתי מתוך ניסיונות אמיתיים: איך לקחת רגע — זיכרון, שיחה או voice-over — ולהפוך אותו לסצנה באמצעות AI.</p>
                  <p>נראה איך מתחילים מסיפור קטן, ומתקדמים צעד אחר צעד עד לסצנה חיה.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </Section>
      </div>

      {/* First Cohort Info - Minimalist Impact */}
      <div className="py-12 md:py-20 bg-[#f9f9f9]">
        <Section>
          <div className="border border-black p-8 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-6 h-6 md:w-24 md:h-24 border-b border-l border-black" />
            <div className="absolute bottom-0 left-0 w-6 h-6 md:w-24 md:h-24 border-t border-r border-black" />
            
            <FadeIn>
              <div className="text-center max-w-4xl mx-auto">
                <span className="text-[10px] font-bold opacity-40 mb-8 block tracking-[0.8em] uppercase">מספר מקומות מוגבל</span>
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter break-words">ניסוי יצירתי משותף.</h2>
                <p className="text-lg font-light opacity-60 mb-12 leading-relaxed break-words">
                  זה המחזור הראשון של הקורס. <br />
                  הקבוצה תהיה קטנה ואינטימית, כדי לאפשר שיחה פתוחה והתנסות משותפת בתהליך שנמצא עדיין בהתפתחות.
                </p>
                <CTAButton>להרשמה למחזור הראשון</CTAButton>
              </div>
            </FadeIn>
          </div>
        </Section>
      </div>

      {/* Course Structure - Refined List */}
      <Section id="structure" className="py-12 md:py-20">
        <FadeIn>
          <div className="mb-16">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-6 block">07 / לוח זמנים</span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter break-words">מבנה הקורס</h2>
            <p className="text-lg font-light opacity-40 max-w-2xl break-words">הקורס בנוי כסדרה של מפגשים פרונטליים שמלווים תהליך יצירתי. מי שירצה יוכל לעבוד על סצנה משלו במהלך הקורס — אבל ההתנסות היא לגמרי אופציונלית.</p>
          </div>
        </FadeIn>

        <div className="w-full overflow-hidden">
          {[
            { 
              title: "מפגש 1 – הרגע שמתחיל את הסיפור", 
              desc: "איך מזהים רגע, זיכרון או רעיון שיכול להפוך לסצנה ולהיות נקודת ההתחלה של תהליך היצירה.",
              longDesc: "נפתח בזיהוי הרגע שממנו מתחיל הסיפור: זיכרון, חלום, שיחה או קטע אודיו שיכול להפוך לסצנה. דרך הדוגמאות מהעבודה שלי עם אניטה נראה איך רגע אחד הופך למנוע יצירתי. נלמד איך לבחור את הרגע שנרצה לפתח במהלך הקורס.",
              images: [
                "https://i.postimg.cc/s24Zdbsn/interv.jpg"
              ]
            },
            { 
              title: "מפגש 2 – מהסיפור לאודיו", 
              desc: "איך לפרק רגע לסיפור וליצור את הבסיס הקולי של הסצנה (voice-over או אודיו).",
              longDesc: "נלמד איך להפוך רגע לסיפור ברור ולפרק אותו לרגעים ויזואליים. ניצור את הבסיס הקולי של הסצנה באמצעות voice-over או אודיו שמכתיב את הקצב והאווירה. זה השלב שבו הסיפור מקבל מבנה לפני שמתחילים לעבוד עם AI.",
              images: [
                "https://i.postimg.cc/rFPCBwBs/sound.jpg"
              ]
            },
            { 
              title: "מפגש 3 – איך הסיפור נראה", 
              desc: "איך לבחור את השפה הויזואלית של הסצנה ואיך הבחירה משפיעה על הסיפור.",
              longDesc: "נחקור איך לבחור את השפה הויזואלית של הסצנה. נראה איך אותו רגע יכול להיראות אחרת בסגנון ריאליסטי, מצוירת או אמנותי, ואיך הבחירה הזו משפיעה על הסיפור. נלמד לחשוב על הסצנה כמו במאי לפני יצירת התמונות.",
              images: [
                "https://i.postimg.cc/vHFW7mvs/style1.jpg",
                "https://i.postimg.cc/GhFvX1M0/style22.jpg",
                "https://i.postimg.cc/gkV3gPMb/style3.jpg"
              ]
            },
            { 
              title: "מפגש 4 – בניית העולם של הסצנה", 
              desc: "איך ליצור דמויות, לוקיישנים ועקביות ויזואלית בעזרת כלי AI.",
              longDesc: "נלמד איך לבנות את העולם של הסצנה בעזרת AI: דמויות, לוקיישנים ופרטים ויזואליים. נראה איך יוצרים בסיס עקבי שמאפשר לעבוד על אותה סצנה לאורך זמן. זה השלב שבו הסיפור מתחיל לקבל צורה ויזואלית.",
              images: [
                "https://i.postimg.cc/0jqKV29P/01character.jpg",
                "https://i.postimg.cc/QCrKfxj8/02costume.jpg",
                "https://i.postimg.cc/0jqKV295/03set.jpg"
              ]
            },
            { 
              title: "מפגש 5 – יצירת הפריימים", 
              desc: "איך להפוך את הסיפור לתמונות ולבנות את הסצנה פריים אחרי פריים.",
              longDesc: "ניצור את הפריימים שמרכיבים את הסצנה ונלמד לעבוד עם פרומפטים כדי להגיע לתוצאה מדויקת. נראה איך מייצרים כמה גרסאות, מתקנים תמונות ומשפרים אותן עד שמתקבל פריים נכון. כאן הסיפור מתחיל להפוך לתמונה.",
              images: [
                "https://i.postimg.cc/7YKWYc7v/frames1.jpg",
                "https://i.postimg.cc/PrSRrcZj/frames2.jpg",
                "https://i.postimg.cc/L8h0qTkQ/frames3.jpg"
              ]
            },
            { 
              title: "מפגש 6 – להכניס תנועה לסיפור", 
              desc: "איך להנפיש את הפריימים ולהוסיף תנועה ודיבור לדמויות.",
              longDesc: "נלמד איך להנפיש את הפריימים ולהכניס תנועה לסצנה. נחקור סוגי הנפשה שונים ונראה איך לגרום לדמויות לזוז ואפילו לדבר באמצעות lip sync. זה השלב שבו התמונות מתחילות להתעורר לחיים.",
              images: [
                "https://i.postimg.cc/QMyxr0NN/vid.gif"
              ]
            },
            { 
              title: "מפגש 7 – הסצנה השלמה", 
              desc: "איך לחבר קול, תמונה ותנועה לסצנה אחת ולהשלים את התהליך מהרעיון ועד הסיפור הויזואלי.",
              longDesc: "נחבר את כל המרכיבים: האודיו, הפריימים וההנפשה לסצנה אחת שלמה. נלמד איך לערוך את הסצנה, להתאים קצב בין קול לתמונה ולבנות רגע שמספר סיפור. נסיים בהבנה איך להמשיך להשתמש בשיטה הזו גם אחרי הקורס.",
              images: [
                "https://i.postimg.cc/yNNB85vv/edit.jpg"
              ]
            }
          ].map((session, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <AccordionItem 
                index={i}
                title={session.title}
                desc={session.desc}
                longDesc={session.longDesc}
                images={session.images}
                isOpen={openAccordionIndex === i}
                onToggle={() => setOpenAccordionIndex(openAccordionIndex === i ? null : i)}
              />
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Contact Form - Sophisticated Minimal */}
      <Section id="contact" className="py-12 md:py-20 border-t-[0.5px] border-black">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <FadeIn>
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-6 md:mb-8 block">08 / צרו קשר</span>
              <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 tracking-tighter break-words">בואו ניצור.</h2>
              <p className="text-base md:text-lg font-light opacity-40 mb-8 md:mb-12 leading-relaxed break-words">השאירו פרטים ואחזור אליכם עם כל המידע על המחזור הקרוב. המחזור צפוי להיפתח במהלך חודש מאי.</p>
              
              <div className="flex flex-col gap-3 md:gap-4 items-start">
                <div className="px-4 md:px-6 py-3 md:py-4 border border-black/10 flex items-center gap-4 md:gap-6 w-full max-w-[280px]">
                  <Users size={18} md:size={20} strokeWidth={1} className="text-neon-pink" />
                  <span className="text-sm md:text-base font-bold block">עד 15 משתתפים</span>
                </div>
                <div className="px-4 md:px-6 py-3 md:py-4 border border-black/10 flex items-center gap-4 md:gap-6 w-full max-w-[280px]">
                  <BookOpen size={18} md:size={20} strokeWidth={1} className="text-neon-pink" />
                  <span className="text-sm md:text-base font-bold block">7 מפגשים של 90 דקות</span>
                </div>
                <div className="px-4 md:px-6 py-3 md:py-4 border border-black/10 flex items-center gap-4 md:gap-6 w-full max-w-[280px]">
                  <MapPin size={18} md:size={20} strokeWidth={1} className="text-neon-pink" />
                  <span className="text-sm md:text-base font-bold block">תל־אביב · מאי–יוני 2026</span>
                </div>
                <div className="px-4 md:px-6 py-3 md:py-4 border border-black/10 flex items-center gap-4 md:gap-6 w-full max-w-[280px]">
                  <Sparkles size={18} md:size={20} strokeWidth={1} className="text-neon-pink" />
                  <span className="text-sm md:text-base font-bold block">מחיר היכרות</span>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="md:col-span-7">
            <FadeIn delay={0.2}>
              <div id="registration-form" className="p-6 md:p-10 border border-black relative">
                <div className="absolute top-0 left-0 w-2 md:w-4 h-2 md:h-4 bg-black" />
                <div className="absolute bottom-0 right-0 w-2 md:w-4 h-2 md:h-4 bg-black" />
                
                <AnimatePresence mode="wait">
                  {formStatus === 'success' ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 md:py-20"
                    >
                      <h3 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 tracking-tighter">נשלח.</h3>
                      <p className="text-lg md:text-xl font-light opacity-60">אחזור אליך בקרוב מאוד.</p>
                      <div className="mt-6 flex justify-center">
                        <img 
                          src="https://i.postimg.cc/L8k9QLbM/glory.png" 
                          alt="Glory" 
                          className="w-36 h-auto opacity-80"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <button 
                        onClick={() => setFormStatus('idle')}
                        className="mt-8 md:mt-12 text-[10px] md:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 hover:opacity-50 transition-opacity"
                      >
                        שליחה נוספת
                      </button>
                    </motion.div>
                  ) : formStatus === 'error' ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 md:py-20"
                    >
                      <h3 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 tracking-tighter text-red-500">אופס.</h3>
                      <p className="text-lg md:text-xl font-light opacity-60">הייתה בעיה בשליחת הטופס. אולי כדאי לנסות שוב או ליצור קשר ישירות.</p>
                      <button 
                        onClick={() => setFormStatus('idle')}
                        className="mt-8 md:mt-12 text-[10px] md:text-xs font-bold tracking-widest uppercase border-b border-black pb-2 hover:opacity-50 transition-opacity"
                      >
                        נסה שוב
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit} 
                      className="space-y-8 md:space-y-12"
                    >
                      {/* Honeypot field for spam protection */}
                      <input type="text" name="_honey" style={{ display: 'none' }} />
                      
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">שם מלא</label>
                        <input 
                          required
                          name="name"
                          type="text" 
                          autoComplete="name"
                          placeholder="השם שלך"
                          className="w-full bg-transparent border-b border-black/20 py-3 md:py-4 focus:outline-none focus:border-black transition-all text-xl md:text-2xl font-bold placeholder:opacity-25"
                        />
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">כתובת אימייל</label>
                        <input 
                          required
                          name="email"
                          type="email" 
                          autoComplete="email"
                          placeholder="email@example.com"
                          className="w-full bg-transparent border-b border-black/20 py-3 md:py-4 focus:outline-none focus:border-black transition-all text-xl md:text-2xl font-bold placeholder:opacity-25"
                        />
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">מספר טלפון</label>
                        <input 
                          required
                          name="phone"
                          type="tel" 
                          autoComplete="tel"
                          placeholder="050-0000000"
                          className="w-full bg-transparent border-b border-black/20 py-3 md:py-4 focus:outline-none focus:border-black transition-all text-xl md:text-2xl font-bold placeholder:opacity-25 text-right"
                          dir="ltr"
                        />
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">כמה מילים עליך (אופציונלי)</label>
                        <textarea 
                          name="message"
                          rows={2}
                          placeholder="למה זה מעניין אותך או מה היית רוצה ללמוד?"
                          className="w-full bg-transparent border-b border-black/20 py-3 md:py-4 focus:outline-none focus:border-black transition-all text-xl md:text-2xl font-bold placeholder:opacity-25 resize-none leading-relaxed"
                        />
                      </div>
                      <button 
                        disabled={formStatus === 'submitting'}
                        className="w-full py-4 md:py-5 bg-neon-pink text-white text-base md:text-lg font-black border border-neon-pink transition-all duration-300 disabled:opacity-50 group flex items-center justify-center gap-4 md:gap-6 cta-glow"
                      >
                        {formStatus === 'submitting' ? 'שולח...' : (
                          <>
                            <span>שלח לי עוד פרטים</span>
                            <Smile size={20} className="group-hover:scale-110 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          </div>
        </div>
      </Section>

      {/* Footer - Simplified & Delicate */}
      <footer className="py-12 border-t-[0.5px] border-black bg-[#f2f2f2]">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs md:text-sm font-black tracking-[0.2em] uppercase text-black break-words">איך לספר סיפורים עם AI</span>
            <p className="text-[10px] font-bold opacity-30 tracking-[0.3em] uppercase break-words">© 2026 — כל הזכויות שמורות</p>
          </div>
        </div>
      </footer>

      {/* Floating Mobile CTA */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-3 left-6 right-6 z-50 md:hidden flex justify-center pointer-events-none"
          >
            <a 
              href="#registration-form" 
              className="pointer-events-auto w-full bg-neon-pink/95 backdrop-blur-md text-white px-10 py-4 font-bold shadow-2xl flex items-center justify-center gap-4 text-sm border border-white/20 transition-transform active:scale-95"
            >
              אני רוצה להירשם
              <ArrowLeft size={20} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 cursor-pointer"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsVideoModalOpen(false);
              }}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-neon-pink transition-colors z-[110]"
            >
              <X size={40} strokeWidth={1} />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-[540px] bg-white shadow-2xl cursor-default overflow-y-auto rounded-lg"
            >
              <div className="p-4 flex justify-center">
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink="https://www.instagram.com/reel/DVtVX9SivGT/?utm_source=ig_embed&amp;utm_campaign=loading" 
                  data-instgrm-version="14" 
                  style={{ 
                    background: '#FFF', 
                    border: 0, 
                    borderRadius: '3px', 
                    boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
                    margin: '1px', 
                    maxWidth: '540px', 
                    minWidth: '326px', 
                    padding: 0, 
                    width: '99.375%' 
                  }}
                >
                  <div style={{ padding: '16px' }}>
                    <a href="https://www.instagram.com/reel/DVtVX9SivGT/?utm_source=ig_embed&amp;utm_campaign=loading" style={{ background: '#FFFFFF', lineHeight: 0, padding: '0 0', textAlign: 'center', textDecoration: 'none', width: '100%' }} target="_blank" rel="noreferrer">
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: 0, height: '40px', marginRight: '14px', width: '40px' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
                          <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', marginBottom: '6px', width: '100px' }}></div>
                          <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', width: '60px' }}></div>
                        </div>
                      </div>
                      <div style={{ padding: '19% 0' }}></div>
                      <div style={{ display: 'block', height: '50px', margin: '0 auto 12px', width: '50px' }}>
                        <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlnsXlink="https://www.w3.org/1999/xlink">
                          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                              <g>
                                <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div style={{ paddingTop: '8px' }}>
                        <div style={{ color: '#3897f0', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 550, lineHeight: '18px' }}>View this post on Instagram</div>
                      </div>
                      <div style={{ padding: '12.5% 0' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '14px', alignItems: 'center' }}>
                        <div>
                          <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', height: '12.5px', width: '12.5px', transform: 'translateX(0px) translateY(7px)' }}></div>
                          <div style={{ backgroundColor: '#F4F4F4', height: '12.5px', transform: 'rotate(-45deg) translateX(3px) translateY(1px)', width: '12.5px', flexGrow: 0, marginRight: '14px', marginLeft: '2px' }}></div>
                          <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', height: '12.5px', width: '12.5px', transform: 'translateX(9px) translateY(-18px)' }}></div>
                        </div>
                        <div style={{ marginLeft: '8px' }}>
                          <div style={{ backgroundColor: '#F4F4F4', borderRadius: '50%', flexGrow: 0, height: '20px', width: '20px' }}></div>
                          <div style={{ width: 0, height: 0, borderTop: '2px solid transparent', borderLeft: '6px solid #f4f4f4', borderBottom: '2px solid transparent', transform: 'translateX(16px) translateY(-4px) rotate(30deg)' }}></div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <div style={{ width: '0px', borderTop: '8px solid #F4F4F4', borderRight: '8px solid transparent', transform: 'translateY(16px)' }}></div>
                          <div style={{ backgroundColor: '#F4F4F4', flexGrow: 0, height: '12px', width: '16px', transform: 'translateY(-4px)' }}></div>
                          <div style={{ width: 0, height: 0, borderTop: '8px solid #F4F4F4', borderLeft: '8px solid transparent', transform: 'translateY(-4px) translateX(8px)' }}></div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', marginBottom: '6px', width: '224px' }}></div>
                        <div style={{ backgroundColor: '#F4F4F4', borderRadius: '4px', flexGrow: 0, height: '14px', width: '144px' }}></div>
                      </div>
                    </a>
                    <p style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', lineHeight: '17px', marginBottom: 0, marginTop: '8px', overflow: 'hidden', padding: '8px 0 7px', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <a href="https://www.instagram.com/reel/DVtVX9SivGT/?utm_source=ig_embed&amp;utm_campaign=loading" style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '17px', textDecoration: 'none' }} target="_blank" rel="noreferrer">A post shared by אניטה פללי (@anita_falali)</a>
                    </p>
                  </div>
                </blockquote>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
