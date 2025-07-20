
import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ value, onChange, className }, ref) => {
    const [hoverValue, setHoverValue] = React.useState(0);

    return (
      <div 
        ref={ref}
        className={cn("flex gap-1 justify-center", className)}
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= (hoverValue || value);
          return (
            <button
              key={star}
              type="button"
              className={cn(
                "p-1 rounded-md transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50",
                isActive ? "text-yellow-400" : "text-white/40 hover:text-yellow-300"
              )}
              onMouseEnter={() => setHoverValue(star)}
              onClick={() => onChange(star)}
              aria-label={`Rating ${star} dari 5`}
            >
              <Star 
                className={cn(
                  "h-7 w-7 transition-colors duration-200",
                  isActive ? "fill-current" : ""
                )} 
              />
            </button>
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";
