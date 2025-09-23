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
            <div key={rating._id} className="border-b pb-4 last:border-0">
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
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
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
        <div className="bg-muted/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <p className="mb-2">Your Rating</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={isPending}
                    onClick={() => { setRating(i + 1); }}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
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
                onChange={(e) => { setComment(e.target.value); }}
                className="min-h-[100px]"
              />
            </div>
            <Button
              type="submit"
              disabled={rating === 0 || !comment.trim() || isPending}
            >
              Submit Review
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
