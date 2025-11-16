"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchLatestComics } from "@/lib/api"; // Asumsi path ini benar

export default function HomePage() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLatestComics = async () => {
      try {
        const data = await fetchLatestComics();
        setComics(data || []);
      } catch (error) {
        console.error("Error fetching latest comics:", error);
      } finally {
        setLoading(false);
      }
    };

    getLatestComics();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Latest Updates</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {comics.length > 0 ? (
            comics.map((comic, index) => {
              // --- PERBAIKAN DI SINI ---
              // Bersihkan slug dengan menghapus "manga/"
              const cleanSlug = comic.link.replace("manga/", "");

              return (
                // --- DAN GUNAKAN cleanSlug DI SINI ---
                <Link href={`/comic/${cleanSlug}`} key={index}>
                  <Card className="overflow-hidden hover:opacity-90 transition-opacity">
                    <img
                      src={comic.image}
                      alt={comic.title}
                      className="w-full h-64 object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{comic.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {comic.chapter ? `${comic.chapter}` : "No chapters"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <p className="col-span-full text-center py-8 text-muted-foreground">
              No comics found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}