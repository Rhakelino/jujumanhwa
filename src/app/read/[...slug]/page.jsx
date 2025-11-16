"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchChapterContent } from "@/lib/api";
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen } from "lucide-react";

// Custom Image Component with loading state
const PageImage = ({ src, alt, index, totalImages, onImageLoad }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full flex justify-center relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <img
        src={hasError ? "/placeholder.png" : src}
        alt={alt}
        className={`max-w-full h-auto object-contain rounded-lg shadow-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => {
          setIsLoading(false);
          if (onImageLoad) {
            onImageLoad();
          }
        }}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        loading="lazy"
      />
    </div>
  );
};

export default function ReaderPage() {
  const { slug } = useParams(); // This will be [chapterSlug] (single slug parameter)
  const router = useRouter();
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentComicSlug, setCurrentComicSlug] = useState(null);
  const [currentChapterSlug, setCurrentChapterSlug] = useState(null);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);

  useEffect(() => {
    if (slug && slug.length > 0) {
      // Join all parts of the slug to form the complete chapter slug
      const chapterSlug = slug.join('/');

      setCurrentChapterSlug(chapterSlug);

      const getChapterContent = async () => {
        try {
          setLoading(true);
          const data = await fetchChapterContent(chapterSlug);
          setChapterData(data);
          setError(null);

          // Extract comic slug from chapter slug - typically the part before the chapter number
          const extractedComicSlug = chapterSlug.replace(/-chapter-\d+.*$/, '').replace(/-chapter-\d+$/, '');
          setCurrentComicSlug(extractedComicSlug);

          // Reset loaded images count when new chapter data is set
          setLoadedImagesCount(0);
        } catch (err) {
          setError(err);
          console.error("Error fetching chapter content:", err);
        } finally {
          setLoading(false);
        }
      };

      getChapterContent();

      // Reset loaded images count when chapter changes
      setLoadedImagesCount(0);
    }
  }, [slug]);

  const navigateToChapter = (chapterSlug) => {
    router.push(`/read/${currentComicSlug}/${chapterSlug}`);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Failed to load chapter</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
        <Button asChild>
          <Link href="/">
            <RotateCcw className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const { manga_title, chapter_title, images, navigation } = chapterData;
  const prevChapterSlug = navigation?.previousChapter;
  const nextChapterSlug = navigation?.nextChapter;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold line-clamp-1">{manga_title}</h1>
          <h2 className="text-lg text-muted-foreground">{chapter_title}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {prevChapterSlug && (
            <Button asChild variant="outline">
              <Link href={`/read/${prevChapterSlug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Link>
            </Button>
          )}

          {navigation?.chapterList && (
            <Button asChild variant="outline">
              <Link href={`/comic/${currentComicSlug}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Chapters
              </Link>
            </Button>
          )}

          {nextChapterSlug && (
            <Button asChild variant="outline">
              <Link href={`/read/${nextChapterSlug}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="w-full">
        {images && images.length > 0 ? (
          <>
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(loadedImagesCount / images.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-1">
                {loadedImagesCount} / {images.length} pages loaded
              </div>
            </div>

            {images.map((image, index) => (
              <PageImage
                key={index}
                src={image}
                alt={`Page ${index + 1}`}
                index={index}
                totalImages={images.length}
                onImageLoad={() => setLoadedImagesCount(prev => prev + 1)}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pages available for this chapter.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button asChild variant="outline">
          <Link href={`/comic/${currentComicSlug}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Comic
          </Link>
        </Button>

        <div className="flex gap-2">
          {prevChapterSlug && (
            <Button asChild>
              <Link href={`/read/${prevChapterSlug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Link>
            </Button>
          )}

          {nextChapterSlug && (
            <Button asChild>
              <Link href={`/read/${nextChapterSlug}`}>
                Next Chapter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}