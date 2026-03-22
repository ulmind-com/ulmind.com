import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import BlurBlob from "@/components/BlurBlob";

const reviews = [
  {
    name: "Milan Kumar Mondal",
    username: "Owner, Maa Laxmirani Restaurant",
    body: "Great experience with ULMIND, they built a modern website that improved our online ordering.",
    img: "/MLR.png",
    rating: 5,
  },
  {
    name: "Dibyendu Pramanik",
    username: "Owner, Jamai Da Hotel",
    body: "A nice experience with a well-made website that improved our online presence.",
    img: "/JamaiDa.png",
    rating: 4,
  },
  {
    name: "Ayan Bagdi",
    username: "Engineer, Smart Invest Solutions",
    body: "Very satisfied with the service. Proper guidance and quick response.",
    img: "/SIS2.png",
    rating: 5,
  },
  {
    name: "Mithilesh Kumar Singh",
    username: "Reporter, JharkhandBihar Update",
    body: "Professional and quick delivery. Excellent work.",
    img: "/JB_update.png",
    rating: 5,
  },
  {
    name: "Surya Dutta",
    username: "Professor, Smart Invest Solutions",
    body: "Clear guidance and honest advice.",
    img: "/SIS.png",
    rating: 4,
  },
  {
    name: "Shatadip Mukherjee",
    username: "Medical Representatives, Smart Invest Solutions",
    body: "Very Good Guidance & services.",
    img: "/SIS3.png",
    rating: 5,
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

/* ⭐ Star renderer */
const Stars = ({ rating }) => (
  <div className="flex gap-0.5 mt-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>
);

const ReviewCard = ({ img, name, username, body, rating }) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-300",
        "border-gray-950/10 bg-gray-950/5 hover:bg-gray-950/10",
        "dark:border-gray-50/10 dark:bg-gray-50/10 dark:hover:bg-gray-50/15"
      )}
    >
      <div className="flex items-start gap-3">
        <img
          className="rounded-full object-cover"
          width="40"
          height="40"
          alt={name}
          src={img}
        />

        <div className="flex flex-col">
          <figcaption className="text-sm font-semibold dark:text-white">
            {name}
          </figcaption>

          <p className="text-xs font-medium text-muted-foreground">
            {username}
          </p>

          <Stars rating={rating} />
        </div>
      </div>

      <blockquote className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {body}
      </blockquote>
    </figure>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden max-w-[100vw]">
      <BlurBlob position={{ top: "30%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-pink-300" opacityClass="opacity-20" />
      <BlurBlob position={{ top: "70%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200" opacityClass="opacity-20" />
      <div className="max-w-7xl mx-auto z-10 relative px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-6">
            What Our Clients Say
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real feedback from clients who trusted ULMIND with their projects.
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-8 z-10">

        {/* Top Row → Left to Right */}
        <Marquee
          pauseOnHover
          className="[--duration:30s]"
        >
          {firstRow.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </Marquee>

        {/* Bottom Row → Right to Left */}
        <Marquee
          reverse
          pauseOnHover
          className="[--duration:30s]"
        >
          {secondRow.map((review, i) => (
            <ReviewCard key={i} {...review} />
          ))}
        </Marquee>

      </div>
    </section>
  );
};