import React from "react";
import Button from "../../components/ui/Button";
import { Play } from "lucide-react";

const FeaturedStreamBanner = ({
  liveStreams,
  featuredStream,
  setFeaturedStream,
  handleStreamClick,
}) => (
  <div className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl overflow-hidden">
    <img
      src={liveStreams[featuredStream]?.thumbnail}
      alt="Featured Stream"
      className="absolute inset-0 w-full h-full object-cover opacity-30"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://placehold.co/600x338/222/fff?text=No+Image";
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
    <div className="relative p-8 md:p-12">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-live px-3 py-1 rounded-full text-white text-sm font-bold mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          FEATURED LIVE
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {liveStreams[featuredStream]?.title}
        </h2>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={liveStreams[featuredStream]?.avatar}
            alt={liveStreams[featuredStream]?.streamer}
            className="w-12 h-12 rounded-full border-2 border-white"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(liveStreams[featuredStream]?.streamer) +
                "&background=0D8ABC&color=fff&size=60";
            }}
          />
          <div>
            <div className="text-white font-semibold">
              {liveStreams[featuredStream]?.streamer}
            </div>
            <div className="text-white/80 text-sm">
              {liveStreams[featuredStream]?.viewers.toLocaleString()} viewers
            </div>
          </div>
        </div>
        <Button
          variant="live"
          size="lg"
          onClick={() => handleStreamClick(liveStreams[featuredStream]?.id)}
          icon={<Play />}
        >
          Watch Now
        </Button>
      </div>
    </div>
    {/* Featured stream indicators */}
    <div className="absolute bottom-6 right-6 flex gap-2">
      {liveStreams.slice(0, 3).map((_, index) => (
        <button
          key={index}
          onClick={() => setFeaturedStream(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            index === featuredStream
              ? "bg-white w-6"
              : "bg-white/40 hover:bg-white/60"
          }`}
        ></button>
      ))}
    </div>
  </div>
);

export default FeaturedStreamBanner;
