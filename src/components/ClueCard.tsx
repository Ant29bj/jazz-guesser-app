import { Card } from '@/components/ui/card';

interface ClueCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const ClueCard = ({ label, value, icon }: ClueCardProps) => {
  return (
    <Card className="gradient-card border-border/50 hover:border-primary/30 transition-smooth p-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-foreground font-semibold text-lg">{value}</p>
        </div>
      </div>
    </Card>
  );
};