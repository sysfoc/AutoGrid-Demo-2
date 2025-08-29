"use client";

import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

const ClientBlog = ({ slug }: { slug: string }) => {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const trackAndFetchViews = async () => {
      try {
        const res = await fetch(`/api/blog/view/${slug}`, {
          method: "POST",
          signal: controller.signal,
        });

        const data = await res.json();
        setViews(data.totalViews || 0);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch views:", err);
          setViews(0);
        }
      }
    };

    trackAndFetchViews();
    return () => controller.abort();
  }, [slug]);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <FaEye fontSize={16} />
      <span>
        {views !== null
          ? `${views} ${views === 1 ? "view" : "views"}`
          : "Loading..."}
      </span>
    </div>
  );
};

export default ClientBlog;
