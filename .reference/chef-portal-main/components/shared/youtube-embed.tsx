"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface YouTubeEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * YouTube URL - can be a single video or playlist URL
   * Examples:
   * - Single video: https://www.youtube.com/watch?v=dQw4w9WgXcQ
   * - Short URL: https://youtu.be/dQw4w9WgXcQ
   * - Playlist: https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLM9LHIoKc4o4uL1_PW
   * - Embedded playlist: https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmRdnEQy6nuLM9LHIoKc4o4uL1_PW
   */
  url: string;
  /**
   * Aspect ratio for the embed (default: 16/9)
   */
  aspectRatio?: number;
  /**
   * Whether to show related videos from other channels (default: false)
   */
  showRelatedVideos?: boolean;
  /**
   * Whether to enable autoplay (default: false)
   */
  autoplay?: boolean;
  /**
   * Whether to enable loop (default: false)
   * Note: Only works for single videos, not playlists
   */
  loop?: boolean;
  /**
   * Whether to enable muted autoplay (default: false)
   */
  muted?: boolean;
  /**
   * Start time in seconds (default: 0)
   */
  start?: number;
  /**
   * Whether to show player controls (default: true)
   */
  controls?: boolean;
  /**
   * Whether to show video title and player actions (default: true)
   */
  modestBranding?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
}

/**
 * Extracts video ID from various YouTube URL formats
 */
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts playlist ID from YouTube URL
 */
function extractPlaylistId(url: string): string | null {
  const playlistMatch = url.match(/[?&]list=([^&\n?#]+)/);
  return playlistMatch ? playlistMatch[1] : null;
}

/**
 * Builds the YouTube embed URL with all parameters
 */
function buildEmbedUrl(
  videoId: string | null,
  playlistId: string | null,
  options: {
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    start?: number;
    controls?: boolean;
    modestBranding?: boolean;
    showRelatedVideos?: boolean;
  }
): string | null {
  if (!videoId && !playlistId) {
    return null;
  }

  const params = new URLSearchParams();

  // If we have a playlist, use playlist embed format
  if (playlistId) {
    // For playlist embeds, include the list parameter
    params.append("list", playlistId);
    // If we also have a video ID, YouTube will start from that video in the playlist
  } else if (videoId) {
    // Single video embed
    params.append("enablejsapi", "1");
    if (options.loop) {
      params.append("loop", "1");
      params.append("playlist", videoId); // Required for loop to work
    }
  }

  // Common parameters
  if (options.autoplay) {
    params.append("autoplay", "1");
  }
  if (options.muted) {
    params.append("mute", "1");
  }
  if (options.start && options.start > 0) {
    params.append("start", options.start.toString());
  }
  if (options.controls === false) {
    params.append("controls", "0");
  }
  if (options.modestBranding) {
    params.append("modestbranding", "1");
  }
  if (!options.showRelatedVideos) {
    params.append("rel", "0");
  }

  // Build the final URL
  if (playlistId) {
    // Playlist embed URL - if we have a video ID, embed that video with playlist
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    // Pure playlist (no starting video)
    return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
  } else if (videoId) {
    // Single video embed URL
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  return null;
}

export function YouTubeEmbed({
  url,
  aspectRatio = 16 / 9,
  showRelatedVideos = false,
  autoplay = false,
  loop = false,
  muted = false,
  start = 0,
  controls = true,
  modestBranding = true,
  className,
  ...props
}: YouTubeEmbedProps) {
  const [embedUrl, setEmbedUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!url) {
      setError("YouTube URL is required");
      setIsLoading(false);
      return;
    }

    try {
      const videoId = extractVideoId(url);
      const playlistId = extractPlaylistId(url);

      if (!videoId && !playlistId) {
        setError("Invalid YouTube URL. Please provide a valid video or playlist URL.");
        setIsLoading(false);
        return;
      }

      const builtUrl = buildEmbedUrl(
        videoId,
        playlistId,
        {
          autoplay,
          loop,
          muted,
          start,
          controls,
          modestBranding,
          showRelatedVideos,
        }
      );

      if (builtUrl) {
        setEmbedUrl(builtUrl);
        setError(null);
        setIsLoading(false);
      } else {
        setError("Failed to build embed URL");
        setIsLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the YouTube URL"
      );
      setIsLoading(false);
    }
  }, [
    url,
    autoplay,
    loop,
    muted,
    start,
    controls,
    modestBranding,
    showRelatedVideos,
  ]);

  if (error) {
    return (
      <Alert variant="destructive" className={cn("w-full", className)} {...props}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>YouTube Embed Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      data-slot="youtube-embed"
      className={cn("w-full overflow-hidden rounded-lg border border-border", className)}
      {...props}
    >
      <AspectRatio ratio={aspectRatio} className="bg-muted">
        {isLoading && (
          <Skeleton className="absolute inset-0" />
        )}
        {embedUrl && (
          <iframe
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={cn(
              "absolute inset-0 h-full w-full border-0",
              isLoading && "opacity-0",
              !isLoading && "opacity-100 transition-opacity duration-300"
            )}
            onLoad={() => setIsLoading(false)}
          />
        )}
      </AspectRatio>
    </div>
  );
}
