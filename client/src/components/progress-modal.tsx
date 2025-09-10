import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressModal({ isOpen, onClose }: ProgressModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Validating transaction...', icon: CheckCircle },
    { label: 'Broadcasting to network...', icon: Loader2 },
    { label: 'Waiting for confirmation...', icon: Clock },
  ];

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setCurrentStep(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 33;
          if (newProgress >= 33 && currentStep === 0) {
            setCurrentStep(1);
          }
          if (newProgress >= 66 && currentStep === 1) {
            setCurrentStep(2);
          }
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(onClose, 1000);
          }
          return Math.min(newProgress, 100);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, onClose, currentStep]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-0 max-w-sm">
        <div className="text-center p-8">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <DialogTitle className="text-lg font-semibold mb-2">Processing Transaction</DialogTitle>
            <p className="text-muted-foreground">Please wait while your transaction is being processed</p>
          </div>
          
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className={index <= currentStep ? 'text-white' : 'text-muted-foreground'}>
                    {step.label}
                  </span>
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : index === currentStep ? (
                    <Icon className="w-4 h-4 text-accent animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
          
          <div>
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">Estimated time: 2-5 minutes</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
