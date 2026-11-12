import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Phone, Heart, MessageCircle, ShieldCheck } from "lucide-react";

interface SafetyAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SafetyAlertModal({ open, onOpenChange }: SafetyAlertModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-2xl font-bold text-slate-900">
                We're Here For You • Immediate Safety Protocol
              </AlertDialogTitle>
              <p className="text-xs text-red-600 font-semibold uppercase tracking-wider mt-0.5">
                Clinical Safety & Crisis Triage
              </p>
            </div>
          </div>
          <AlertDialogDescription className="text-sm text-slate-600">
            If you are experiencing overwhelming emotional distress, thoughts of self-harm, or feeling unsafe, please remember: your safety and well-being come first. You don't have to carry this alone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-5 mt-4">
          {/* Verified Crisis Resources */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-red-600" />
              Direct Emergency & Mental Health Helplines
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div className="bg-white p-3 rounded-lg border border-red-100 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    Pakistan 24/7
                  </span>
                  <p className="font-semibold text-slate-900 text-sm">Umang Mental Health Helpline</p>
                  <p className="text-xs text-slate-600 mb-2">24/7 Clinical & Psychological First Aid</p>
                </div>
                <a
                  href="tel:03117786264"
                  className="text-xs font-bold text-red-600 hover:text-red-700 underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call 0311-7786264
                </a>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    Pakistan Counseling
                  </span>
                  <p className="font-semibold text-slate-900 text-sm">Rozan Toll-Free Counseling</p>
                  <p className="text-xs text-slate-600 mb-2">Mon-Sat (10:00 AM - 6:00 PM PKT)</p>
                </div>
                <a
                  href="tel:080022444"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Dial 0800-22444
                </a>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    Emergency Rescue
                  </span>
                  <p className="font-semibold text-slate-900 text-sm">Rescue 1122 (Pakistan)</p>
                  <p className="text-xs text-slate-600 mb-2">Immediate Ambulance & Physical Emergency</p>
                </div>
                <a
                  href="tel:1122"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Dial 1122
                </a>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mb-1">
                    International / USA
                  </span>
                  <p className="font-semibold text-slate-900 text-sm">988 Suicide & Crisis Lifeline</p>
                  <p className="text-xs text-slate-600 mb-2">24/7 confidential crisis line</p>
                </div>
                <a
                  href="tel:988"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" /> Call or Text 988
                </a>
              </div>
            </div>
          </div>

          {/* Real-time Grounding Exercise */}
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-primary" />
              Acute Grounding Exercise: The 5-4-3-2-1 Technique
            </h3>
            <p className="text-xs text-slate-600 mb-2">
              Slow down your breathing. Look around your physical surroundings right now and name:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-primary/10">
                <span className="font-bold text-primary text-sm">5</span>
                <p className="text-slate-600 mt-0.5">Things you can SEE</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-primary/10">
                <span className="font-bold text-primary text-sm">4</span>
                <p className="text-slate-600 mt-0.5">Things you can TOUCH</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-primary/10">
                <span className="font-bold text-primary text-sm">3</span>
                <p className="text-slate-600 mt-0.5">Sounds you can HEAR</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-primary/10">
                <span className="font-bold text-primary text-sm">2</span>
                <p className="text-slate-600 mt-0.5">Things you can SMELL</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-primary/10 col-span-2 sm:col-span-1">
                <span className="font-bold text-primary text-sm">1</span>
                <p className="text-slate-600 mt-0.5">Thing you can TASTE</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => window.open("tel:03117786264", "_self")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Helpline (0311-7786264)
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="sm:w-44 border-slate-300"
              size="lg"
            >
              I am Safe, Return
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confidential & Free. You matter, and professional human help is available.</span>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}