import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4"
        >
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start space-x-3 backdrop-blur-md ${
            toast.type === "warning"
              ? "bg-amber-900/90 text-amber-50 border-amber-500/30"
              : toast.type === "success"
              ? "bg-emerald-900/90 text-emerald-50 border-emerald-500/30"
              : "bg-stone-900/90 text-stone-50 border-stone-700"
          }`}>
            {toast.type === "warning" ? (
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            ) : toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-semibold leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
