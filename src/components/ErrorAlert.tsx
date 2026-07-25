import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry, onDismiss }) => {
  return (
    <div id="error-alert-banner" className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 shadow-xl flex items-start justify-between gap-3 my-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-red-200">Weather Data Notice</h4>
          <p className="text-xs text-red-300/90 mt-0.5 leading-relaxed">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2.5 px-3 py-1 text-xs font-semibold rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" /> Retry Loading
            </button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-red-400 hover:text-red-200 transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
