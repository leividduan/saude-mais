import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { Doctor } from "@/data/mockData";

interface DoctorCardProps {
  doctor: Doctor;
  onClick: () => void;
  selected: boolean;
}

export const DoctorCard = ({ doctor, onClick, selected }: DoctorCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all-smooth hover:shadow-card-hover ${
        selected ? "border-primary border-2 bg-accent" : "border-border"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
            <AvatarFallback>{doctor.name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground mb-1">{doctor.crm}</p>
            <p className="text-sm text-muted-foreground mb-2">{doctor.experience}</p>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{doctor.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
