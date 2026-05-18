import React from "react";
import { CheckCircle2, Clock } from "lucide-react";

interface Step {
  time: string;
  instruction: string;
}

interface KitchenTimelineProps {
  steps: Step[];
}

export default function KitchenTimeline({ steps }: KitchenTimelineProps) {
  return (
    <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-8 pb-4">
      {steps.map((step, idx) => (
        <div key={idx} className="relative pl-8 md:pl-10">
          {/* Timeline Dot */}
          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary-100 border-2 border-primary-500 z-10" />
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                <Clock className="w-3 h-3" />
                {step.time}
              </span>
              <span className="text-slate-400 text-sm font-medium">Step {idx + 1}</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {step.instruction}
            </p>
          </div>
        </div>
      ))}

      {/* End Dot */}
      <div className="relative pl-8 md:pl-10">
        <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center z-10">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-green-600 font-bold text-lg pt-0.5">Ready to serve!</div>
      </div>
    </div>
  );
}
