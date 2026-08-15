"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import Button from "@/components/ui/Button";
import { createAppointment } from "@/services/appointment";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { dictionary } = useLanguage();

  const [appointment, setAppointment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!appointment.trim()) {
      toast.error("Please enter an appointment.");
      return;
    }

    try {
      setLoading(true);

      await createAppointment({
        appointment: appointment.trim(),
      });

      toast.success("Appointment saved successfully.");

      // Clear textarea after successful save
      setAppointment("");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ?? "Failed to save appointment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Appointment Card */}
      <div className="mt-8 grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md sm:rounded-3xl sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-5 flex items-start gap-3 sm:items-center sm:gap-4">
            {/* Icon */}
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#ACC822]/15 text-xl sm:h-12 sm:w-12 sm:text-2xl lg:h-14 lg:w-14">
              📅
            </div>

            {/* Title */}
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-800 sm:text-lg lg:text-xl">
                {dictionary.appointment.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                {dictionary.appointment.description}
              </p>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={appointment}
            onChange={(e) => setAppointment(e.target.value)}
            rows={6}
            placeholder={dictionary.appointment.placeholder}
            className="min-h-[160px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#ACC822] focus:bg-white focus:ring-4 focus:ring-[#ACC822]/20 sm:p-4 sm:text-base"
          />

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-[#ACC822] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#96B51D] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
            >
              {loading ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 014-4H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Appointment"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
