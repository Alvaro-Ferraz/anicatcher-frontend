import { motion } from "framer-motion";

interface AnimeCardSkeletonProps {
  items?: number;
  primaryColor?: string;
  secondaryColor?: string;
  pulseDuration?: string;
}

const AnimeCardSkeleton: React.FC<AnimeCardSkeletonProps> = ({
  items = 12,
  primaryColor = "#374151",
  secondaryColor = "#4B5563",
  pulseDuration = "1.8s"
}) => {
  return (
    <>
      {Array.from({ length: items }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2"
        >
          <div
            className="w-full aspect-[3/4] rounded-md animate-pulse"
            style={{
              backgroundColor: primaryColor,
              animationDuration: pulseDuration
            }}
          />

          <div
            className="h-5 w-3/4 rounded-md animate-pulse"
            style={{
              backgroundColor: secondaryColor,
              animationDuration: pulseDuration
            }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default AnimeCardSkeleton;
