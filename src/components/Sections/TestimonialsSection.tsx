import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

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
    img: "SIS2.png",
    rating: 5,
  },
  {
    name: "Mithilesh Kumar Singh",
    username: "Reporter, JharkhandBihar Update",
    body: "Professional and quick delivery. Excellent work.",
    img: "JB_update.png",
    rating: 5,
  },
  {
    name: "Surya Dutta",
    username: "Professor, Smart Invest Solutions",
    body: "Clear guidance and honest advice.",
    img: "SIS.png",
    rating: 4,
  },
  {
    name: "Shatadip Mukherjee",
    username: "Medical Representatives, Smart Invest Solutions",
    body: "Very Good Guidance & services.",
    img: "SIS3.png",
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
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex items-start gap-3">
        <img
          className="rounded-full"
          width="36"
          height="36"
          alt={name}
          src={img}
        />

        <div className="flex flex-col">
          {/* Name */}
          <figcaption className="text-sm font-semibold dark:text-white">
            {name}
          </figcaption>

          {/* Username */}
          <p className="text-xs font-medium text-muted-foreground">
            {username}
          </p>

          {/* ⭐ Rating (NOW AFTER NAME + USERNAME) */}
          <Stars rating={rating} />
        </div>
      </div>

      <blockquote className="mt-3 text-sm text-muted-foreground">
        {body}
      </blockquote>
    </figure>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real feedback from clients who trusted ULMIND with their projects.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </Marquee>

          <Marquee reverse pauseOnHover className="[--duration:20s]">
            {secondRow.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
        </div>
      </div>
    </section>
  );
};
