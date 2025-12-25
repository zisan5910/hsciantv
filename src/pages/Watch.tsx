import { useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SkipBack, SkipForward, Share2, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import RecommendedVideos from '@/components/RecommendedVideos';
import { videos } from '@/data/videos';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Scroll to top on page load/navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const currentVideo = useMemo(() => {
    return videos.find((v) => v.id === id);
  }, [id]);

  const categoryVideos = useMemo(() => {
    if (!currentVideo) return [];
    return videos.filter((v) => v.category === currentVideo.category);
  }, [currentVideo]);

  const currentIndex = useMemo(() => {
    return categoryVideos.findIndex((v) => v.id === id);
  }, [categoryVideos, id]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/watch/${categoryVideos[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < categoryVideos.length - 1) {
      navigate(`/watch/${categoryVideos[currentIndex + 1].id}`);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentVideo?.title,
          url: url,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Video link has been copied to clipboard.",
      });
    }
  };

  const handlePdfOpen = () => {
    if (currentVideo?.pdfUrl) {
      window.open(currentVideo.pdfUrl, '_blank');
    }
  };

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Video not found</p>
      </div>
    );
  }

  // Mobile Layout - Fixed video player, scrollable recommendations
  if (isMobile) {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <Navbar />
        
        {/* Fixed Video Section */}
        <div className="flex-shrink-0 pt-14">
          <div className="px-3 pt-2">
            <VideoPlayer embedUrl={currentVideo.embedUrl} title={currentVideo.title} />
          </div>
          
          {/* Video Details - Fixed */}
          <div className="px-3 py-2 border-b border-border">
            <h1 className="text-base font-medium text-foreground line-clamp-2">
              {currentVideo.title}
            </h1>
            
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-muted-foreground text-xs">
                HSCian • {currentVideo.views} views
              </p>

              {/* Mobile Controls */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous"
                >
                  <SkipBack size={16} />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === categoryVideos.length - 1}
                  className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next"
                >
                  <SkipForward size={16} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Share"
                >
                  <Share2 size={16} />
                </button>

                <button
                  onClick={handlePdfOpen}
                  className="flex items-center gap-0.5 px-1.5 py-1 text-muted-foreground hover:text-foreground transition-colors text-xs font-medium"
                  aria-label="PDF"
                >
                  <FileText size={14} />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Recommended Videos */}
        <div className="flex-1 overflow-y-auto">
          <RecommendedVideos
            videos={categoryVideos}
            currentVideoId={currentVideo.id}
          />
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        <div className="flex flex-col lg:flex-row">
          {/* Video Section */}
          <div className="lg:flex-1 lg:max-h-[calc(100vh-3.5rem)] lg:overflow-y-auto">
            <div className="p-4">
              <VideoPlayer embedUrl={currentVideo.embedUrl} title={currentVideo.title} />
              
              {/* Video Details */}
              <div className="mt-4">
                <h1 className="text-xl font-medium text-foreground">
                  {currentVideo.title}
                </h1>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-muted-foreground text-sm">
                    HSCian • {currentVideo.views} views
                  </p>
                </div>

                {/* Desktop Controls */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="control-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack size={18} />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === categoryVideos.length - 1}
                    className="control-button disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <SkipForward size={18} />
                  </button>

                  <button onClick={handleShare} className="control-button">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>

                  <button onClick={handlePdfOpen} className="control-button">
                    <FileText size={18} />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Videos */}
          <div className="lg:w-96 lg:border-l lg:border-border lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto py-4">
            <RecommendedVideos
              videos={categoryVideos}
              currentVideoId={currentVideo.id}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
