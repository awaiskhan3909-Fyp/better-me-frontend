import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Phone, Heart, MessageCircle } from "lucide-react";

interface SafetyAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SafetyAlertModal({ open, onOpenChange }: SafetyAlertModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-2xl">We're Here For You</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            We've detected that you may be experiencing intense distress. Your safety is our top priority.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 mt-4">
          {/* Crisis Resources */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary" />
              Immediate Support Resources
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-slate-900">988 Suicide & Crisis Lifeline</p>
                  <p className="text-sm text-slate-600">
                    Call or text <strong>988</strong> • Available 24/7
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-slate-900">Crisis Text Line</p>
                  <p className="text-sm text-slate-600">
                    Text <strong>HELLO</strong> to <strong>741741</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-slate-900">Emergency Services</p>
                  <p className="text-sm text-slate-600">
                    If you're in immediate danger, call <strong>911</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grounding Exercise */}
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Grounding Exercise: 5-4-3-2-1 Technique
            </h3>
            <div className="space-y-2 text-sm text-slate-800">
              <p>Take a deep breath and notice:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>5 things</strong> you can see around you</li>
                <li>• <strong>4 things</strong> you can touch or feel</li>
                <li>• <strong>3 things</strong> you can hear</li>
                <li>• <strong>2 things</strong> you can smell</li>
                <li>• <strong>1 thing</strong> you can taste</li>
              </ul>
              <p className="mt-3 italic">
                This can help bring you back to the present moment.
              </p>
            </div>
          </div>

          {/* Immediate Steps */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              What You Can Do Right Now
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✓ Reach out to a trusted friend or family member</li>
              <li>✓ Remove yourself from any immediate danger</li>
              <li>✓ Contact a mental health professional</li>
              <li>✓ Go to the nearest emergency room if needed</li>
              <li>✓ Use the crisis resources listed above</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => window.open("tel:988", "_self")}
              className="flex-1 bg-red-600 hover:bg-red-700"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988 Now
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Continue Session
            </Button>
          </div>

          <p className="text-xs text-center text-slate-600 mt-2">
            Remember: You are not alone, and there are people who want to help you through this.
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
