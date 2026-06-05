import { useEffect, useState } from "react";
import axios from "../services/Axios";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAnnouncement = async () => {
    try {
      const res = await axios.get("/setting/announcement");

      if (res.data.success) {
        setAnnouncement(res.data.announcement);
      }
    } catch (error) {
      console.log("Announcement error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnnouncement();
  }, []);

  if (loading || !announcement?.isActive) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: announcement.backgroundColor,
        color: announcement.textColor,
      }}
    >
      {/* MARQUEE WRAPPER */}
      <div className="flex whitespace-nowrap">
        <div className="flex animate-marquee py-2 text-sm tracking-wide font-medium">
          <span className="mx-10">{announcement.text}</span>
          <span className="mx-10">{announcement.text}</span>
          <span className="mx-10">{announcement.text}</span>
          <span className="mx-10">{announcement.text}</span>
        </div>

        {/* duplicate for seamless loop */}
        <div className="flex animate-marquee py-2 text-sm tracking-wide font-medium">
          <span className="mx-10">{announcement.text}</span>
          <span className="mx-10">{announcement.text}</span>
          <span className="mx-10">{announcement.text}</span>
          <span className="mx-10">{announcement.text}</span>
        </div>
      </div>

      {/* TAILWIND CUSTOM ANIMATION */}
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          .animate-marquee {
            display: flex;
            min-width: 100%;
            animation: marquee ${announcement.speed || 20}s linear infinite;
          }

          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
};

export default Announcement;