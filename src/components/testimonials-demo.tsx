import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonails';

// Adapted data to be facts/information instead of user testimonials
const informationFacts = [
  {
    title: 'سرعة الإنجاز بـ 10 أضعاف',
    body: 'باستخدام الـ Vibe Coding، يمكنك تحويل فكرتك إلى تطبيق حقيقي في ساعات بدلاً من أسابيع عبر كتابة تعليمات واضحة للذكاء الاصطناعي.',
    category: '✨ إنتاجية',
  },
  {
    title: 'التصميم المرئي أولاً',
    body: 'البدء بجمع إلهام بصري يقلل من التعديلات اللاحقة. الذكاء الاصطناعي يستطيع محاكاة تصاميمك المفضلة بدقة عالية.',
    category: '🎨 تصميم',
  },
  {
    title: 'لا حاجة لتعلم البرمجة المعقدة',
    body: 'اللغة الطبيعية (البرومبت) أصبحت هي لغة البرمجة الجديدة. قدرتك على صياغة المنطق أهم من حفظ الأكواد.',
    category: '💡 مبدأ',
  },
  {
    title: 'مكتبات UI جاهزة (Copy/Paste)',
    body: 'استخدام مكتبات مثل shadcn يوفر عليك بناء المكونات الأساسية ويضمن لك واجهة متجاوبة وجميلة فوراً.',
    category: '🛠 أدوات',
  },
  {
    title: 'أدوات التوليد المرئي المتقدمة',
    body: 'توفر أدوات التوليد عبر الذكاء الاصطناعي صوراً وخلفيات عالية الجودة تعطي لمسة احترافية لا مثيل لها وبأقل تكلفة.',
    category: '🖼 الأصول البصرية',
  },
  {
    title: 'النشر الفوري للسيرفرات',
    body: 'بضغطة زر واحدة يمكنك نشر مشروعك على منصات عالمية ليصبح متاحاً للمستخدمين في ثوانٍ معدودة.',
    category: '🚀 إطلاق',
  },
];

function InfoCard({ title, body, category }: (typeof informationFacts)[number]) {
  return (
    <Card className="w-80 bg-[#121214] border-transparent shrink-0 shadow-none rounded-2xl relative overflow-hidden transition-colors hover:bg-white/5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none opacity-50" />
      <CardContent className="pt-6 relative z-10">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">{category}</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1" dir="rtl">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-white/70 leading-relaxed font-medium" dir="rtl">{body}</p>
      </CardContent>
    </Card>
  );
}

export default function InformationDemo() {
  return (
    <div className="relative h-[550px] w-full flex items-center justify-center overflow-hidden bg-transparent mx-auto [perspective:1000px]">
      <div 
        className="absolute left-1/2 top-1/2 w-[200vw] md:w-[150vw] flex flex-row items-center justify-center gap-4 py-4"
        style={{
          transform: 'translate(-50%, -50%) rotateX(20deg) rotateY(-10deg) rotateZ(15deg)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      >
        {/* Additional Left Column */}
        <Marquee vertical reverse repeat={2} pauseOnHover className="[--duration:28s] hidden md:flex">
          {[...informationFacts].sort((a,b) => b.title.localeCompare(a.title)).map((fact, i) => (
            <InfoCard key={`col-1-${i}`} {...fact} />
          ))}
        </Marquee>
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical repeat={2} pauseOnHover className="[--duration:35s]">
          {[...informationFacts].reverse().map((fact, i) => (
            <InfoCard key={`col0-${i}`} {...fact} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical reverse repeat={2} pauseOnHover className="[--duration:25s]">
          {informationFacts.map((fact, i) => (
            <InfoCard key={`col1-${i}`} {...fact} />
          ))}
        </Marquee>
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical repeat={2} pauseOnHover className="[--duration:20s]">
          {[...informationFacts].sort((a,b) => a.title.localeCompare(b.title)).map((fact, i) => (
            <InfoCard key={`col2-${i}`} {...fact} />
          ))}
        </Marquee>
        {/* Vertical Marquee (upwards) */}
        <Marquee vertical reverse repeat={2} pauseOnHover className="[--duration:30s]">
          {informationFacts.map((fact, i) => (
            <InfoCard key={`col3-${i}`} {...fact} />
          ))}
        </Marquee>
        {/* Vertical Marquee (downwards) */}
        <Marquee vertical repeat={2} pauseOnHover className="[--duration:28s]">
          {[...informationFacts].reverse().map((fact, i) => (
            <InfoCard key={`col4-${i}`} {...fact} />
          ))}
        </Marquee>
        {/* Additional Right Column */}
        <Marquee vertical reverse repeat={2} pauseOnHover className="[--duration:32s] hidden md:flex">
          {informationFacts.map((fact, i) => (
            <InfoCard key={`col5-${i}`} {...fact} />
          ))}
        </Marquee>
      </div>
    </div>
  );
}
