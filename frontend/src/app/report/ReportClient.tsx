"use client";

import { useState, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Upload, X, MapPin, CheckCircle } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MockDataBanner } from "@/components/ui/Banner";
import { submitReport, getRecentReports } from "@/lib/api";
import { pollutionTypeLabel, relativeTime } from "@/lib/format";
import type { PollutionType, CitizenReport } from "@/types";
import { blurLocation } from "@/lib/geo";
import { useEffect } from "react";

const LocationPickerMap = dynamic(
  () => import("@/components/map/LocationPickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-paper border border-border rounded-sm flex items-center justify-center text-muted text-14">
        Loading map...
      </div>
    ),
  }
);

const POLLUTION_TYPES: { value: PollutionType; label: string }[] = [
  { value: "open_waste_burning", label: "Open waste burning" },
  { value: "crop_burning", label: "Crop burning" },
  { value: "construction_dust", label: "Construction dust" },
  { value: "industrial_emission", label: "Industrial emission" },
  { value: "vehicle_smoke", label: "Vehicle smoke" },
  { value: "other", label: "Other" },
];

const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 5;
const MAX_DESC_CHARS = 500;
const DEFAULT_LAT = 19.076;
const DEFAULT_LNG = 72.8777;

interface FormErrors {
  pollutionType?: string;
  description?: string;
  location?: string;
  consent?: string;
}

interface PreviewFile {
  name: string;
  url: string;
  size: number;
}

export default function ReportClient() {
  const [pollutionType, setPollutionType] = useState<PollutionType | "">("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(DEFAULT_LAT);
  const [lng, setLng] = useState(DEFAULT_LNG);
  const [consent, setConsent] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notEnabled, setNotEnabled] = useState(false);
  const [recentReports, setRecentReports] = useState<CitizenReport[]>([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentIsMock, setRecentIsMock] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadRecent() {
      const result = await getRecentReports();
      setRecentReports(result.data);
      setRecentIsMock(result.isMock);
      setRecentLoading(false);
    }
    loadRecent();
  }, []);

  function handleLocationChange(newLat: number, newLng: number) {
    setLat(newLat);
    setLng(newLng);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setErrors((e) => ({
        ...e,
        location: "Geolocation is not supported by your browser.",
      }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setErrors((e) => ({ ...e, location: undefined }));
      },
      () => {
        setErrors((e) => ({
          ...e,
          location: "Could not get your location. Please place the pin manually.",
        }));
      }
    );
  }

  function validateFiles(files: FileList | File[]): string {
    const arr = Array.from(files);
    for (const file of arr) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        return `${file.name}: only JPEG and PNG files are accepted.`;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return `${file.name}: file must be ${MAX_FILE_SIZE_MB} MB or smaller.`;
      }
    }
    if (previews.length + arr.length > MAX_FILES) {
      return `You can attach up to ${MAX_FILES} photos.`;
    }
    return "";
  }

  function addFiles(files: FileList | File[]) {
    const err = validateFiles(files);
    if (err) {
      setFileError(err);
      return;
    }
    setFileError("");
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      setPreviews((p) => [...p, { name: file.name, url, size: file.size }]);
    });
  }

  function removeFile(name: string) {
    setPreviews((p) => {
      const updated = p.filter((f) => f.name !== name);
      return updated;
    });
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      addFiles(e.dataTransfer.files);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [previews]
  );

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!pollutionType) newErrors.pollutionType = "Please select a pollution type.";
    if (description.trim().length < 10)
      newErrors.description = "Please describe what you observed (at least 10 characters).";
    if (!consent) newErrors.consent = "You must accept the terms to submit a report.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const blurred = blurLocation({ lat, lng }, 500);
    const result = await submitReport({
      pollutionType: pollutionType as PollutionType,
      description,
      lat,
      lng,
      blurredLat: blurred.lat,
      blurredLng: blurred.lng,
      consentGiven: consent,
    });
    setSubmitting(false);
    if (result.isMock) {
      setNotEnabled(true);
    } else {
      setSubmitted(true);
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-28 font-semibold text-ink mb-2">
        Report pollution
      </h1>
      <p className="text-16 text-muted mb-8">
        Use this form to report a pollution event. Your location will be
        blurred before storage to protect your privacy.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="border border-green-300 bg-green-50 rounded-sm p-8 text-center">
              <CheckCircle
                size={40}
                className="text-green-700 mx-auto mb-4"
                aria-hidden="true"
              />
              <h2 className="text-20 font-semibold text-ink mb-2">
                Report submitted
              </h2>
              <p className="text-16 text-muted">
                Your report has been received. The platform will review it and
                link it to nearby sensor readings.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Pollution report form"
              className="space-y-6"
            >
              {notEnabled && (
                <div className="border border-border rounded-sm p-4 bg-amber-50 text-14 text-amber-900">
                  <strong>Submission is not enabled in this prototype.</strong>{" "}
                  The backend endpoint returns 501 Not Implemented. Your form
                  data has been preserved.
                </div>
              )}

              {/* Pollution type */}
              <Select
                id="pollution-type"
                label="Type of pollution"
                required
                placeholder="Select a type..."
                options={POLLUTION_TYPES}
                value={pollutionType}
                onChange={(e) =>
                  setPollutionType(e.target.value as PollutionType | "")
                }
                error={errors.pollutionType}
              />

              {/* Photo upload */}
              <fieldset>
                <legend className="text-14 font-medium text-ink mb-1">
                  Photos (optional, up to {MAX_FILES})
                </legend>
                <p className="text-14 text-muted mb-2">
                  JPEG and PNG only, {MAX_FILE_SIZE_MB} MB each. Location
                  metadata in photos is removed before upload.
                </p>

                {/* Drop zone */}
                <div
                  ref={dropRef}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-sm p-8 text-center cursor-pointer hover:border-primary transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  tabIndex={0}
                  role="button"
                  aria-label="Click or drag photos here to attach them"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      fileInputRef.current?.click();
                  }}
                >
                  <Upload
                    size={24}
                    className="text-muted mx-auto mb-2"
                    aria-hidden="true"
                  />
                  <p className="text-14 text-muted">
                    Drag photos here or click to browse
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  className="sr-only"
                  aria-hidden="true"
                  onChange={(e) =>
                    e.target.files && addFiles(e.target.files)
                  }
                />
                {fileError && (
                  <p role="alert" className="text-14 text-red-700 mt-1">
                    {fileError}
                  </p>
                )}

                {/* Previews */}
                {previews.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-3">
                    {previews.map((f) => (
                      <li key={f.name} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={f.url}
                          alt={`Preview of ${f.name}`}
                          className="w-20 h-20 object-cover rounded-sm border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(f.name)}
                          className="absolute -top-2 -right-2 bg-red-700 text-white rounded-sm w-5 h-5 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                          aria-label={`Remove ${f.name}`}
                        >
                          <X size={12} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </fieldset>

              {/* Location picker */}
              <fieldset>
                <legend className="text-14 font-medium text-ink mb-1">
                  Location
                </legend>
                <p className="text-14 text-muted mb-2">
                  Click the map or drag the pin to mark the pollution location.
                  Your exact position is blurred before it is stored
                  (geo-indistinguishability).
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-14 font-medium text-primary border border-primary rounded-sm hover:bg-paper transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    <MapPin size={14} aria-hidden="true" />
                    Use my location
                  </button>
                  <label className="flex items-center gap-2 text-14 text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBlur}
                      onChange={(e) => setShowBlur(e.target.checked)}
                      className="accent-primary"
                    />
                    Show blur radius (500 m)
                  </label>
                </div>

                <LocationPickerMap
                  lat={lat}
                  lng={lng}
                  onLocationChange={handleLocationChange}
                  showBlurRadius={showBlur}
                  blurRadiusMeters={500}
                />

                {errors.location && (
                  <p role="alert" className="text-14 text-red-700 mt-1">
                    {errors.location}
                  </p>
                )}
              </fieldset>

              {/* Description */}
              <Textarea
                id="description"
                label="Description"
                required
                placeholder="Describe what you observed..."
                maxLength={MAX_DESC_CHARS}
                showCount
                currentLength={description.length}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
              />

              {/* Consent */}
              <fieldset>
                <legend className="sr-only">Consent</legend>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 accent-primary"
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    aria-invalid={!!errors.consent}
                  />
                  <span className="text-14 text-muted">
                    I have read and agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-primary underline hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    including the data privacy provisions (Section 5). I
                    understand this is a prototype and my report will not be
                    actioned in real time.
                  </span>
                </label>
                {errors.consent && (
                  <p
                    id="consent-error"
                    role="alert"
                    className="text-14 text-red-700 mt-1"
                  >
                    {errors.consent}
                  </p>
                )}
              </fieldset>

              <Button
                type="submit"
                disabled={submitting}
                variant="primary"
                size="lg"
              >
                {submitting ? "Submitting..." : "Submit report"}
              </Button>
            </form>
          )}
        </div>

        {/* Sidebar: recent reports */}
        <aside aria-labelledby="recent-reports-heading">
          {!recentLoading && recentIsMock && (
            <MockDataBanner>
              Sample data. These are not real reports.
            </MockDataBanner>
          )}
          <h2
            id="recent-reports-heading"
            className="text-16 font-semibold text-ink mt-4 mb-3"
          >
            Recent reports near you
          </h2>
          {recentLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-paper border border-border rounded-sm" />
              ))}
            </div>
          ) : recentReports.length === 0 ? (
            <div className="border border-dashed border-border bg-paper rounded-sm p-6 text-center">
              <p className="text-14 font-medium text-ink mb-1">
                No reports near you yet
              </p>
              <p className="text-14 text-muted">
                Be the first — submit a report and it will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {recentReports.map((report) => (
                <li
                  key={report.id}
                  className="border border-border bg-surface rounded-sm p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-14 font-medium text-ink">
                      {pollutionTypeLabel(report.pollutionType)}
                    </span>
                    <Badge variant="status">{report.status}</Badge>
                  </div>
                  <p className="text-14 text-muted">{report.area}</p>
                  <p className="text-14 text-muted">
                    {relativeTime(report.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
