import { Card } from '@/components/ui/card';
import { PropsWithChildren } from 'react';

interface ClueCardProps extends PropsWithChildren {
  label: string;
  icon?: React.ReactNode;
}

export const ClueCard = ({ label, icon, children }: ClueCardProps) => {
  return (
    <Card className="gradient-card border-border/50 hover:border-primary/30 transition-smooth p-4">
      <div className='flex flex-row gap-3'>
        {icon && (
          <div className="text-primary">
            {icon}
          </div>
        )}
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
      </div>
      <div className='mt-4'>
        <p className="text-foreground font-semibold text-lg">{children}</p>
      </div>
    </Card>
  );
};