import Container from './Container';
import MovieGrid from '../movie/MovieGrid';
import { Skeleton } from './Skeleton';

export const MovieCardSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="aspect-[2/3] w-full" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const MovieGridSkeleton = ({ count = 10 }) => (
  <MovieGrid>
    {Array.from({ length: count }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </MovieGrid>
);

export const HomeSkeleton = () => (
  <div className="flex-1 flex flex-col pb-32 w-full">
    <div className="mb-24 w-full h-[60vh] relative">
      <Skeleton className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 z-10 px-6 py-16 md:px-12 md:py-24 lg:py-32 flex flex-col justify-end gap-6 max-w-4xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 md:h-24 w-full md:w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-12 w-40 mt-4" />
      </div>
    </div>
    <Container>
      <div className="mb-24">
        <Skeleton className="h-10 w-64 mb-8" />
        <MovieGridSkeleton count={5} />
      </div>
      <div>
        <Skeleton className="h-10 w-64 mb-8" />
        <MovieGridSkeleton count={5} />
      </div>
    </Container>
  </div>
);

export const DetailsSkeleton = () => (
  <div className="flex-1 flex flex-col pb-32">
    <Skeleton className="w-full h-[50vh] md:h-[70vh]" />
    <Container className="relative -mt-32 md:-mt-48 z-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="w-2/3 mx-auto md:w-1/3 lg:w-1/4 flex-shrink-0">
          <Skeleton className="aspect-[2/3] w-full shadow-2xl" />
        </div>
        <div className="flex flex-col pt-4 md:pt-12 w-full">
          <Skeleton className="h-16 md:h-20 w-3/4 mb-6" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="space-y-3 mb-10">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </Container>
  </div>
);
