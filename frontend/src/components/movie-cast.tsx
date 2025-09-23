import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Credit } from "@/types";

interface MovieCastProps {
  directors: Credit[];
  actors: Credit[];
}

export function MovieCast({ directors, actors }: MovieCastProps) {
  return (
    <div className="space-y-6">
      {directors.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Directors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {directors.map((director) => (
              <Card key={director.id}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage
                      src={director.profileAvatar || "/placeholder.svg"}
                      alt={director.name}
                    />
                    <AvatarFallback>{director.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{director.name}</p>
                    <p className="text-sm text-muted-foreground">Director</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {actors.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {actors.map((actor) => (
              <Card key={actor.id}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage
                      src={actor.profileAvatar || "/placeholder.svg"}
                      alt={actor.name}
                    />
                    <AvatarFallback>{actor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{actor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {actor.characterName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
