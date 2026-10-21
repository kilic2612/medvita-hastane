import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarCheck, CalendarDays, Clock, Info, X } from 'lucide-react';
import { useState } from 'react';
import { useAppointment } from '../../context/AppointmentContext';
import { blogPosts, type BlogPost } from '../../data/blog';
import { getDoctor } from '../../data/doctors';
import { formatDate } from '../../lib/format';
import { gridItem, hoverTap } from '../../lib/motion';
import { btn } from '../../lib/styles';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';
import { SectionHeading } from '../ui/SectionHeading';

const categories = ['Tümü', ...new Set(blogPosts.map((p) => p.category))];

export function Blog() {
  const [category, setCategory] = useState('Tümü');
  const [reading, setReading] = useState<BlogPost | null>(null);
  const visible = category === 'Tümü' ? blogPosts : blogPosts.filter((p) => p.category === category);

  return (
    <section id="blog" className="scroll-mt-20 bg-surface py-24">
      <div className="wrap">
        <SectionHeading
          eyebrow="Sağlık Rehberi"
          title="Hekimlerimizden Sağlık Önerileri"
          description="Koruyucu hekimlikten güncel tedavi yöntemlerine, uzman hekimlerimizin kaleminden güvenilir sağlık içerikleri."
        />

        <div className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 sm:flex-wrap sm:justify-center">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === c ? 'bg-navy text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-accent hover:ring-accent'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                custom={i}
                variants={gridItem}
                initial="hidden"
                whileInView="show"
                exit="exit"
                viewport={{ once: true, margin: '-60px' }}
              >
                <BlogCard post={post} onRead={() => setReading(post)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>{reading && <BlogReader post={reading} onClose={() => setReading(null)} />}</AnimatePresence>
    </section>
  );
}

function BlogCard({ post, onRead }: { post: BlogPost; onRead: () => void }) {
  const author = getDoctor(post.authorId);
  return (
    <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/10" onClick={onRead}>
      <div className={`relative grid aspect-[16/9] place-items-center overflow-hidden bg-linear-to-br ${post.gradient}`}>
        <span
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '18px 18px' }}
        />
        <span aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-white/15 transition-transform duration-700 group-hover:scale-150" />
        <post.icon className="relative size-16 text-white/90 drop-shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1.5} />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy backdrop-blur">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {post.readTime} dk okuma
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-navy transition-colors group-hover:text-brand">{post.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {author && (
            <span className="flex min-w-0 items-center gap-2">
              <Avatar src={author.photo} name={author.name} className="size-8 shrink-0 rounded-full" />
              <span className="truncate text-xs font-semibold text-slate-600">
                {author.title} {author.name}
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRead();
            }}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-accent"
          >
            Oku
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
}

function BlogReader({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const author = getDoctor(post.authorId);
  const openAppointment = useAppointment();

  return (
    <Modal onClose={onClose} label={post.title} className="max-w-2xl">
      <div className={`relative shrink-0 overflow-hidden bg-linear-to-br px-6 pb-7 pt-6 text-white sm:px-8 ${post.gradient}`}>
        <span aria-hidden className="absolute -right-12 -top-12 size-48 rounded-full bg-white/15" />
        <div className="relative flex items-start justify-between gap-4">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">{post.category}</span>
          <button type="button" onClick={onClose} aria-label="Kapat" className="grid size-10 shrink-0 place-items-center rounded-full bg-white/20 transition hover:bg-white/30">
            <X className="size-5" />
          </button>
        </div>
        <h2 className="relative mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">{post.title}</h2>
        <p className="relative mt-3 flex items-center gap-4 text-sm text-white/80">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime} dk okuma</span>
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 sm:px-8">
        <p className="text-lg font-medium leading-relaxed text-navy">{post.excerpt}</p>
        <div className="mt-5 space-y-4 leading-relaxed text-slate-600">
          {post.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <p className="mt-7 flex items-start gap-2 rounded-xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-100">
          <Info className="mt-0.5 size-4 shrink-0" />
          Bu içerik genel bilgilendirme amaçlıdır; tanı ve tedavi için mutlaka hekiminize danışınız.
        </p>

        {author && (
          <div className="mt-7 flex flex-col items-start gap-4 rounded-2xl bg-surface p-5 ring-1 ring-slate-200 sm:flex-row sm:items-center">
            <Avatar src={author.photo} name={author.name} className="size-14 shrink-0 rounded-2xl" />
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Yazar</p>
              <p className="font-bold text-navy">
                {author.title} {author.name}
              </p>
              <p className="text-sm text-slate-500">{author.specialty}</p>
            </div>
            <motion.button
              type="button"
              {...hoverTap}
              onClick={() => {
                onClose();
                openAppointment({ departmentId: author.departmentId, doctorId: author.id });
              }}
              className={`${btn.primary} px-5 py-2.5`}
            >
              <CalendarCheck className="size-4" />
              Randevu Al
            </motion.button>
          </div>
        )}
      </div>
    </Modal>
  );
}
