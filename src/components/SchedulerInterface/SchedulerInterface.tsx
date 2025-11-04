"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Video, MapPin, Search, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

import CalendarGrid from "./subComponents/CalendarGrid";
import TimeSlots, { type Slot } from "./subComponents/TimeSlots";
import CandidateSelector from "./subComponents/CandidateSelector";
import InterviewerPicker, { type Interviewer } from "./subComponents/InterviewerPicker";
import JobDescriptionModal from "./subComponents/JobDescriptionModal";
import InterviewSummary from "./subComponents/InterviewSummary";

import { fetchCandidates, scheduleInterview, type RawCandidate } from "@/services/api/schedulerAPI";

// ---- Mock time slots (kept from original) ----
const MORNING: Slot[] = [
  { id: 1, time: "9:00 AM", available: true },
  { id: 2, time: "9:30 AM", available: true },
  { id: 3, time: "10:00 AM", available: true },
  { id: 4, time: "10:30 AM", available: false },
  { id: 5, time: "11:00 AM", available: true },
  { id: 6, time: "11:30 AM", available: true },
];
const AFTERNOON: Slot[] = [
  { id: 7, time: "1:00 PM", available: true },
  { id: 8, time: "1:30 PM", available: false },
  { id: 9, time: "2:00 PM", available: true },
  { id: 10, time: "2:30 PM", available: true },
  { id: 11, time: "3:00 PM", available: false },
  { id: 12, time: "3:30 PM", available: true },
  { id: 13, time: "4:00 PM", available: true },
  { id: 14, time: "4:30 PM", available: true },
];

// ---- Mock interviewers (kept from original semantics) ----
const DEFAULT_INTERVIEWERS: Interviewer[] = [
  { id: 1, name: "Alex Rodriguez", role: "Engineering Manager", checked: true },
  { id: 2, name: "Sarah Kim", role: "Senior Engineer", checked: true },
  { id: 3, name: "David Wilson", role: "Product Manager", checked: false },
];

export default function SchedulerInterface() {
  const router = useRouter();

  // steps: 1 date, 2 time, 3 confirm
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [candidates, setCandidates] = useState<RawCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<RawCandidate | null>(null);

  const [interviewers, setInterviewers] = useState<Interviewer[]>(DEFAULT_INTERVIEWERS);

  const [jobDescription, setJobDescription] = useState("");
  const [showJDModal, setShowJDModal] = useState(false);

  // --------- data loading ----------
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fetchCandidates();
      setCandidates(list);
    } catch (e) {
      // fallback to a tiny mock if backend is down
      setCandidates([
        { id: 1, name: "Emily Johnson", role: "Senior Software Engineer", photo: null },
        { id: 2, name: "Michael Chen", role: "Senior Software Engineer", photo: null },
        { id: 3, name: "Sophia Williams", role: "Senior Software Engineer", photo: null },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // --------- calendar handlers ----------
  const goPrevMonth = () =>
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  const goNextMonth = () =>
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  const pickDay = (d: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), d));
    setStep(2);
  };

  // --------- time slot handlers ----------
  const backToCalendar = () => setStep(1);
  const pickSlot = (s: Slot) => {
    setSelectedSlot(s);
    setStep(3);
  };

  // toggle interviewer
  const toggleInterviewer = (id: number) =>
    setInterviewers((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));

  // --------- schedule interview ----------
  const handleSchedule = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate");
      return;
    }
    if (!selectedSlot) {
      alert("Please pick a time slot");
      return;
    }

    // ensure we have email (if not, attempt to refresh candidates for this job)
    let withEmail = selectedCandidate;
    if (!withEmail.email) {
      const refreshed = await fetchCandidates(withEmail.job_id);
      const found = refreshed.find((c: { id: any; }) => String(c.id) === String(withEmail.id));
      if (!found?.email) {
        alert("Cannot schedule interview: Candidate email not found.");
        return;
      }
      withEmail = found;
    }

    // compose datetime from date + slot
    const [hm, ampm] = selectedSlot.time.split(" ");
    const [hStr, mStr] = hm.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    const isPM = ampm?.toUpperCase().includes("PM");
    const dt = new Date(selectedDate);
    dt.setHours(isPM && h !== 12 ? h + 12 : h === 12 && !isPM ? 0 : h);
    dt.setMinutes(m);

    const res = await scheduleInterview({
      candidate_id: withEmail.id,
      email: withEmail.email!,
      date_iso: dt.toISOString(),
      time_slot: selectedSlot.time,
      job_description: jobDescription || null,
    });

    if (!res.success) {
      alert(`Failed to schedule interview: ${res.message ?? "Unknown error"}`);
      return;
    }

    if (res.already_scheduled) {
      alert(`Interview already scheduled.\nLink: ${res.interview_link}`);
    } else {
      const msg =
        `Interview scheduled!\n\n` +
        `Candidate: ${withEmail.name}\n` +
        `Email: ${withEmail.email}\n` +
        `Link: ${res.interview_link}\n` +
        `KB: ${res.knowledge_base_id}\n` +
        `Resume: ${res.resume_extracted ? "✅" : "❌"}\n` +
        `Job Description: ${res.job_description_used ? "✅ Provided" : "📝 Auto" }\n\n` +
        `${res.email_sent ? "Email sent." : "Email sending failed."}`;
      alert(msg);
      if (res.interview_link && navigator.clipboard) {
        try { await navigator.clipboard.writeText(res.interview_link); } catch {}
      }
    }

    // back to candidate list (or route)
    router.push("/candidates");
  };

  // --------- derived ---------
  const selectedTitle = selectedCandidate?.job_title ?? selectedCandidate?.role ?? undefined;
  const candidatesCount = candidates.length;

  // --------- UI ---------
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading candidates...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* keep your Navbar in layout */}

      <main className="flex-grow p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-700">Interview Scheduler</h1>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                placeholder="Search…"
                className="font-medium text-gray-700 rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Wizard container */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Step header */}
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-700">Schedule an Interview</h2>
              <div className="flex items-center">
                {([1, 2, 3] as const).map((n, i) => (
                  <React.Fragment key={n}>
                    <div
                      className={[
                        "flex items-center",
                        step >= n ? "text-blue-600" : "text-gray-400",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-full border-2",
                          step >= n ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300",
                        ].join(" ")}
                      >
                        {n}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {n === 1 ? "Select Date" : n === 2 ? "Select Time" : "Confirm"}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`mx-2 h-1 w-8 ${step > n ? "bg-blue-600" : "bg-gray-200"}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {step === 1 && (
              <CalendarGrid
                selectedDate={selectedDate}
                onPrevMonth={goPrevMonth}
                onNextMonth={goNextMonth}
                onPickDay={pickDay}
              />
            )}

            {step === 2 && (
              <TimeSlots
                date={selectedDate}
                morning={MORNING}
                afternoon={AFTERNOON}
                selected={selectedSlot}
                onPick={pickSlot}
                onBack={backToCalendar}
              />
            )}

            {step === 3 && (
              <div>
                <InterviewSummary
                  date={selectedDate}
                  timeText={selectedSlot?.time}
                  title={selectedTitle}
                  candidateName={selectedCandidate?.name}
                />

                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <CandidateSelector
                    items={candidates}
                    selected={selectedCandidate}
                    onPick={(c) => {
                      setSelectedCandidate(c);
                      if (c.job_description) setJobDescription(c.job_description);
                    }}
                  />

                  <InterviewerPicker
                    items={interviewers}
                    onToggle={toggleInterviewer}
                  />
                </div>

                {/* Job Description section */}
                <div className="mb-4 border-t border-gray-200 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">Job Description (Optional)</h4>
                    <button
                      onClick={() => setShowJDModal(true)}
                      className="flex items-center text-sm text-blue-600 hover:underline"
                    >
                      <FileText size={16} className="mr-1" />
                      {jobDescription ? "Edit" : "Add"} Job Description
                    </button>
                  </div>
                  <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-sm text-gray-600">
                      {jobDescription ? (
                        <span>{jobDescription.length > 120 ? `${jobDescription.slice(0, 120)}…` : jobDescription}</span>
                      ) : (
                        <em>
                          No job description provided. The system will use a generic description
                          or candidate&apos;s profile.
                        </em>
                      )}
                    </p>
                  </div>
                </div>

                {/* Interview method (kept visual) */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="mb-3 font-medium text-gray-700">Interview Method</h4>
                  <div className="flex space-x-4">
                    <div className="flex-1 cursor-pointer rounded-md border border-blue-500 bg-blue-50 p-4 hover:border-blue-500 hover:bg-blue-50">
                      <div className="flex items-center">
                        <Video size={20} className="mr-3 text-blue-800" />
                        <div>
                          <div className="font-medium text-sm text-gray-700">AI-Powered Video Interview</div>
                          <div className="text-sm text-gray-500">
                            Secure interview link will be sent automatically
                          </div>
                          <div className="mt-1 text-xs text-green-600">
                            ✓ Knowledge base will be created from resume
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 cursor-pointer rounded-md border border-gray-200 p-4 hover:border-blue-500 hover:bg-blue-50">
                      <div className="flex items-center">
                        <MapPin size={20} className="mr-3 text-gray-600" />
                        <div>
                          <div className="font-medium text-sm text-gray-700 ">In-Person</div>
                          <div className="text-sm text-gray-500">
                            Office location details will be shared
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={!selectedCandidate}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Job Description Modal */}
      <JobDescriptionModal
        open={showJDModal}
        value={jobDescription}
        defaultTitle={selectedTitle}
        onChange={setJobDescription}
        onClose={() => setShowJDModal(false)}
        onSave={() => setShowJDModal(false)}
      />
    </div>
  );
}
