import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar({ name, image, className }: { name?: string; image?: string | null; className?: string }) {
  return (
    <Avatar className={className}>
      {image ? <AvatarImage src={image} alt={name || "User"} /> : null}
      <AvatarFallback className="bg-teal-100 font-semibold text-teal-800">
        {(name || "U").charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}