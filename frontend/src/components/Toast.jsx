import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!message) return null;

    const styles = {
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
        },
        error: {
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
        },
    };

    const s = styles[type] || styles.success;

    return (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${s.bg} max-w-sm`}>
                {s.icon}
                <p className={`text-sm font-medium ${s.text}`}>{message}</p>
                <button onClick={onClose} className="ml-auto p-0.5 rounded hover:bg-black/5 transition">
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
