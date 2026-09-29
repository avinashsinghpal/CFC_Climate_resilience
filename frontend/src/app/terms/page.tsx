import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Terms and Conditions for the Federated Climate Action Platform prototype. Covers prototype status, citizen submissions, location privacy, and data integrity.",
};

const BUILD_DATE = new Date().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const sections = [
  { id: "acceptance", label: "1. Acceptance" },
  { id: "prototype-status", label: "2. Prototype status and no warranty" },
  { id: "permitted-use", label: "3. Permitted use" },
  { id: "submissions", label: "4. Citizen submissions and consent" },
  { id: "privacy", label: "5. Location privacy and personal data" },
  { id: "sample-data", label: "6. Sample data disclaimer" },
  { id: "integrity", label: "7. Data integrity and evidentiary use" },
  { id: "third-party", label: "8. Third-party data sources" },
  { id: "ip", label: "9. Intellectual property" },
  { id: "liability", label: "10. Limitation of liability" },
  { id: "changes", label: "11. Changes to terms" },
  { id: "governing-law", label: "12. Governing law and contact" },
];

export default function TermsPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl">
        <h1 className="text-40 font-semibold text-ink mb-2">
          Terms and Conditions
        </h1>
        <p className="text-16 text-muted mb-2">
          Last updated: {BUILD_DATE}
        </p>
        <p className="text-16 text-muted mb-8">
          These Terms and Conditions govern your use of the Federated Climate
          Action Platform (the &quot;Platform&quot;). Please read them carefully.
        </p>

        {/* Table of contents */}
        <nav
          aria-label="Terms table of contents"
          className="border border-border rounded-sm bg-paper p-6 mb-10"
        >
          <h2 className="text-16 font-semibold text-ink mb-3">
            Table of contents
          </h2>
          <ol className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-16 text-primary hover:text-primary-hover transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Sections */}
        <div className="space-y-10 text-16 leading-relaxed">
          <section aria-labelledby="acceptance">
            <h2
              id="acceptance"
              className="text-28 font-semibold text-ink mb-4"
            >
              1. Acceptance
            </h2>
            <p className="text-muted mb-3">
              By accessing or using the Platform, you agree to be bound by
              these Terms. If you do not agree, you must not use the Platform.
            </p>
            <p className="text-muted">
              The Platform is operated by [Operating entity name] (&quot;we&quot;, &quot;us&quot;,
              &quot;our&quot;). Use of the Platform is subject to these Terms and any
              applicable law.
            </p>
          </section>

          <section aria-labelledby="prototype-status">
            <h2
              id="prototype-status"
              className="text-28 font-semibold text-ink mb-4"
            >
              2. Prototype status and no warranty
            </h2>
            <p className="text-muted mb-3">
              The Platform is a prototype built for demonstration and research
              purposes only. It is not an operational system. All backend
              endpoints return 501 Not Implemented. No real sensor readings, air
              quality forecasts, or integrity records are shown unless
              explicitly stated.
            </p>
            <p className="text-muted mb-3">
              The Platform is provided &quot;as is&quot; without any warranty of any kind,
              express or implied, including but not limited to warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
            <p className="text-muted">
              We do not warrant that the Platform will be available, accurate,
              complete, reliable, or error-free. You use it at your own risk.
            </p>
          </section>

          <section aria-labelledby="permitted-use">
            <h2
              id="permitted-use"
              className="text-28 font-semibold text-ink mb-4"
            >
              3. Permitted use
            </h2>
            <p className="text-muted mb-3">
              You may use the Platform only for lawful purposes. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                Attempt to gain unauthorised access to any part of the Platform
                or its infrastructure.
              </li>
              <li>
                Submit false, misleading, or malicious data through the citizen
                reporting form.
              </li>
              <li>
                Use the Platform for any commercial purpose without our written
                consent.
              </li>
              <li>
                Reproduce or distribute the Platform&apos;s content without
                attribution.
              </li>
            </ul>
          </section>

          <section aria-labelledby="submissions">
            <h2
              id="submissions"
              className="text-28 font-semibold text-ink mb-4"
            >
              4. Citizen submissions and consent
            </h2>
            <p className="text-muted mb-3">
              When you submit a pollution report through the Platform, you
              confirm that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>The information you provide is accurate to the best of your knowledge.</li>
              <li>
                You consent to the processing of your submission data as
                described in Section 5.
              </li>
              <li>
                You understand that, in this prototype, submissions are not
                processed in real time and will not result in any municipal
                action.
              </li>
            </ul>
            <p className="text-muted mt-3">
              Submissions may be logged for the purpose of improving the
              Platform. You may request deletion by contacting us at [Contact
              email].
            </p>
          </section>

          <section aria-labelledby="privacy">
            <h2
              id="privacy"
              className="text-28 font-semibold text-ink mb-4"
            >
              5. Location privacy and personal data
            </h2>
            <p className="text-muted mb-3">
              We apply geo-indistinguishability to location data before storage.
              This means your exact coordinates are perturbed using a Laplace
              noise mechanism before any data is retained, so that your precise
              location cannot be recovered from stored records.
            </p>
            <p className="text-muted mb-3">
              Location metadata embedded in uploaded photographs is stripped
              before the photograph is processed.
            </p>
            <p className="text-muted mb-3">
              We handle personal data in accordance with the Digital Personal
              Data Protection Act, 2023 (DPDPA 2023) of India. In plain
              language, this means:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                We collect only the minimum data necessary to operate the
                Platform.
              </li>
              <li>
                We use your data only for the purpose for which it was
                collected.
              </li>
              <li>You have the right to access, correct, or erase your data.</li>
              <li>
                We will inform you if your data is involved in a breach that
                may harm you.
              </li>
            </ul>
            <p className="text-muted mt-3">
              To exercise your rights under DPDPA 2023, contact [Contact
              email].
            </p>
          </section>

          <section aria-labelledby="sample-data">
            <h2
              id="sample-data"
              className="text-28 font-semibold text-ink mb-4"
            >
              6. Sample data disclaimer
            </h2>
            <p className="text-muted mb-3">
              All numeric data displayed by the Platform, including sensor
              readings, air quality indices, forecasts, and integrity hashes,
              are synthetically generated for demonstration purposes. They are
              explicitly labelled as sample data wherever they appear.
            </p>
            <p className="text-muted">
              Sample data must not be relied upon for any decision relating to
              public health, legal proceedings, enforcement action, or resource
              allocation. Real air quality data must be obtained from authorised
              monitoring stations and regulatory bodies.
            </p>
          </section>

          <section aria-labelledby="integrity">
            <h2
              id="integrity"
              className="text-28 font-semibold text-ink mb-4"
            >
              7. Data integrity and evidentiary use
            </h2>
            <p className="text-muted mb-3">
              The Data Integrity feature of the Platform is designed to produce
              cryptographically verifiable records that could, in a production
              system, support evidentiary use before competent authorities,
              including the National Green Tribunal.
            </p>
            <p className="text-muted mb-3">
              However, in this prototype, no real zk-SNARK proofs are generated
              and no records are anchored on any blockchain. The integrity hashes
              displayed are synthetic.
            </p>
            <p className="text-muted font-medium">
              Nothing in this Platform constitutes legal advice. Whether data
              produced by a production version of this Platform would be
              admissible as evidence is a question of law to be decided by the
              relevant tribunal or court.
            </p>
          </section>

          <section aria-labelledby="third-party">
            <h2
              id="third-party"
              className="text-28 font-semibold text-ink mb-4"
            >
              8. Third-party data sources
            </h2>
            <p className="text-muted mb-3">
              The Platform references the following third-party data sources:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                <strong className="text-ink">OpenStreetMap:</strong> Map tiles
                are provided by OpenStreetMap contributors under the Open
                Database Licence. Attribution is displayed on every map.
              </li>
              <li>
                <strong className="text-ink">Sentinel-5P TROPOMI:</strong>{" "}
                Satellite data referenced in the Platform is from the Copernicus
                Sentinel-5P mission operated by the European Space Agency (ESA).
                In this prototype, all satellite data is synthetic.
              </li>
            </ul>
          </section>

          <section aria-labelledby="ip">
            <h2
              id="ip"
              className="text-28 font-semibold text-ink mb-4"
            >
              9. Intellectual property
            </h2>
            <p className="text-muted mb-3">
              The Platform&apos;s code, design and documentation are the intellectual
              property of [Operating entity name] unless stated otherwise. You
              may view and evaluate the Platform but may not reproduce, modify,
              or distribute it without written permission.
            </p>
            <p className="text-muted">
              Third-party components used by the Platform are subject to their
              own licences, which are available in the project repository.
            </p>
          </section>

          <section aria-labelledby="liability">
            <h2
              id="liability"
              className="text-28 font-semibold text-ink mb-4"
            >
              10. Limitation of liability
            </h2>
            <p className="text-muted mb-3">
              To the maximum extent permitted by applicable law, [Operating
              entity name] shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of or inability to use the Platform.
            </p>
            <p className="text-muted">
              Our total liability to you for any claim arising from these Terms
              shall not exceed INR 1,000 (one thousand rupees).
            </p>
          </section>

          <section aria-labelledby="changes">
            <h2
              id="changes"
              className="text-28 font-semibold text-ink mb-4"
            >
              11. Changes to terms
            </h2>
            <p className="text-muted">
              We may update these Terms at any time. The &quot;Last updated&quot; date at
              the top of this page reflects the most recent revision. Continued
              use of the Platform after a change constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          <section aria-labelledby="governing-law">
            <h2
              id="governing-law"
              className="text-28 font-semibold text-ink mb-4"
            >
              12. Governing law and contact
            </h2>
            <p className="text-muted mb-3">
              These Terms are governed by the laws of India. Any dispute arising
              from these Terms shall be subject to the exclusive jurisdiction of
              the courts of [Operating entity jurisdiction].
            </p>
            <p className="text-muted">
              For questions about these Terms or to exercise your data rights,
              contact us at: [Contact email].
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-14 text-muted">
            Back to{" "}
            <Link
              href="/"
              className="text-primary hover:text-primary-hover transition-colors duration-[120ms]"
            >
              home
            </Link>{" "}
            or{" "}
            <Link
              href="/report"
              className="text-primary hover:text-primary-hover transition-colors duration-[120ms]"
            >
              report pollution
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
