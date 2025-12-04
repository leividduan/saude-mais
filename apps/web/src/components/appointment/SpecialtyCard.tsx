import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface SpecialtyCardProps {
  name: string;
  icon: string;
  onClick: () => void;
  selected: boolean;
}

export const SpecialtyCard = ({ name, icon, onClick, selected }: SpecialtyCardProps) => {
  const IconComponent = (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Stethoscope;

  return (
    <Card
      className={`cursor-pointer transition-all-smooth hover:shadow-card-hover ${
        selected ? "border-primary border-2 bg-accent" : "border-border"
      }`}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 gap-4">
        <div
          className={`p-4 rounded-full ${
            selected ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          <IconComponent className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-center">{name}</h3>
      </CardContent>
    </Card>
  );
};
