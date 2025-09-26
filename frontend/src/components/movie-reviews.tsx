import type React from "react";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2 } from "lucide-react";
import {
  useDeleteRating,
  useGetRatingsByMovieId,
  useMutateRating,
} from "@/hooks/useMovies";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth";

interface MovieReviewsProps {
  movieId: string;
}

export function MovieReviews({ movieId }: MovieReviewsProps) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { data: ratingsData } = useGetRatingsByMovieId(movieId);
  const { mutate, isPending } = useMutateRating();
  const { mutate: deleteMutate, isPending: deletePending } = useDeleteRating();

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the review to the backend
    mutate(
      { rating, comment, movieId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["movies", movieId, "ratings"],
          });
          toast.success("Rating successful");
        },
        onError: () => toast.success("Something went wrong"),
      }
    );
    // Reset form
    setRating(0);
    setComment("");
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Reviews</h3>

        {ratingsData && ratingsData?.length > 0 ? (
          ratingsData?.map((rating) => (
            <div
              key={rating._id}
              className="border-b border-gray-700/40 pb-4 last:border-0 hover:bg-muted/30 transition-colors rounded-lg p-3"
            >
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {rating.userId.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{rating.userId.username}</p>
                      <div className="flex gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            disabled={isPending}
                            onClick={() => setRating(i + 1)}
                            className="focus:outline-none group"
                          >
                            <Star
                              className={`h-8 w-8 transition-all duration-200 
                                  ${
                                    i < rating.rating
                                      ? "fill-yellow-400 text-yellow-400 scale-110 drop-shadow-md"
                                      : "text-gray-400 group-hover:text-yellow-300 hover:scale-110"
                                  }`}
                            />
                          </button>
                        ))}
                      </div>

                      <p className="text-sm mt-1 text-muted-foreground">
                        {formatDate(rating.createdAt)}
                      </p>
                    </div>
                    {auth.user?._id === rating.userId._id && (
                      <Button
                        disabled={deletePending}
                        variant={"destructive"}
                        onClick={() => {
                          deleteMutate(
                            { movieId },
                            {
                              onSuccess: () => {
                                queryClient.invalidateQueries({
                                  queryKey: ["movies", movieId, "ratings"],
                                });
                                toast.success("Rating deleted successful");
                              },
                              onError: () =>
                                toast.success("Something went wrong"),
                            }
                          );
                        }}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                  <p className="mt-2">{rating.comment}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No review yet</p>
        )}
      </div>

      {!!auth.user && (
        <div className="bg-chart-3/60 backdrop-blur-sm p-6 rounded-xl border border-gray-700/40 shadow-md">
          <h3 className="text-lg  font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <p className="mb-2">Your Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setRating(i + 1);
                    }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-all duration-200
                         ${
                           i < rating
                             ? "fill-amber-500  text-amber-500"
                             : "text-gray-300 hover:text-amber-500"
                         }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <Textarea
                disabled={isPending}
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                className="
                min-h-[100px] w-full resize-none rounded-xl border border-gray-700/50
                bg-background/60 px-4 py-3 text-sm text-foreground
              placeholder:text-black/80 placeholder:opacity-100
              focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all duration-200 ease-in-out
                "
              />
            </div>
            <Button
              type="submit"
              disabled={rating === 0 || !comment.trim() || isPending}
              className="
                 mt-2 w-full sm:w-auto rounded-lg px-6 py-2 font-semibold
                  bg-gradient-to-r from-amber-600 via-amber-800 to-chart-3 text-white
                 shadow-md transition-all duration-200 ease-in-out
                 hover:from-chart-3  hover:to-amber-600 hover:scale-105 hover:shadow-lg
                  disabled:opacity-50 cursor-pointer disabled:
                 "
            >
              Submit Review
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
