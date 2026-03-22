import React from 'react';
import { CTASection } from '@/components/Sections/CTASection';
import BlurBlob from "@/components/BlurBlob";

const TermsOfService = () => {
  return (
    // 'pb-20' and 'min-h-screen' class removed to let CTA attach directly to the footer
    <div className="bg-background pt-[100px] md:pt-[15px] relative overflow-hidden">
      <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "50%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "90%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200 dark:bg-yellow-600" opacityClass="opacity-40 dark:opacity-20" />

      {/* Top Banner */}
      <div className="w-full bg-[#F94E4E] h-[120px] md:h-[140px] flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white m-0 leading-none">
          Terms of Service
        </h1>
      </div>

      {/* Content Area - Added pb-24 here to ensure gap before CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-12 pb-24 space-y-8 text-muted-foreground leading-relaxed">
        
        {/* Introduction */}
        <p>
          Welcome to ULMiND. These Terms of Service ("Terms") govern your access to and use of our website, products, and software development services (collectively, the "Services") provided by ULMiND ("we," "our," or "us"). By accessing our website, requesting a proposal, or utilizing our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
        </p>

        {/* Scope of Services */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Scope of Services</h2>
          <p>
            ULMiND specializes in custom software development, web and mobile application development, Artificial Intelligence/Machine Learning (AI/ML) solutions, and related digital services. The specific scope, deliverables, timeline, and pricing for any project will be detailed in a separate Service Agreement, Proposal, or Statement of Work (SOW) agreed upon by both parties.
          </p>
        </div>

        {/* Client Responsibilities */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Client Responsibilities</h2>
          <p>To ensure the successful and timely delivery of projects, the Client agrees to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide clear, accurate, and complete project requirements.</li>
            <li>Supply necessary assets, credentials, data, and feedback in a timely manner.</li>
            <li>Designate a primary point of contact for project communications and approvals.</li>
          </ul>
          <p>
            Delays caused by the Client’s failure to provide required materials or feedback may result in timeline extensions and additional costs.
          </p>
        </div>

        {/* Payment Terms and Invoicing */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Payment Terms and Invoicing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Pricing & Milestones:</strong> Project costs and payment schedules will be outlined in the agreed-upon Proposal or Service Agreement. We typically require an upfront deposit before commencing work, with subsequent payments tied to project milestones.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Invoices:</strong> Invoices will be issued upon reaching designated milestones or on a recurring basis for ongoing support/maintenance. Payments are due within the timeframe specified on the invoice.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Late Payments:</strong> ULMiND reserves the right to pause work or withhold deliverables if payments are delayed. Late payments may incur an additional interest charge as specified in the applicable invoice or agreement.
            </li>
          </ul>
        </div>

        {/* Intellectual Property Rights */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Intellectual Property Rights</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Client Ownership:</strong> Upon receipt of full and final payment, ULMiND grants the Client exclusive rights and ownership of the final custom code, design assets, and deliverables created specifically for the project, unless otherwise stated in the Service Agreement.
            </li>
            <li>
              <strong className="text-foreground font-semibold">ULMiND’s Rights:</strong> ULMiND retains ownership of all pre-existing libraries, frameworks, tools, and proprietary methodologies used during development. We grant the Client a non-exclusive, non-transferable license to use these underlying elements solely as integrated into the final deliverable.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Portfolio Rights:</strong> Unless a Non-Disclosure Agreement (NDA) states otherwise, ULMiND reserves the right to showcase the completed project (e.g., logos, screenshots, and generic descriptions) in our portfolio, marketing materials, and website.
            </li>
          </ul>
        </div>

        {/* Confidentiality */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Confidentiality</h2>
          <p>
            Both parties agree to treat all sensitive business information, technical data, trade secrets, and client lists shared during the engagement as strictly confidential. Neither party shall disclose such Confidential Information to any third party without prior written consent, except as required by law.
          </p>
        </div>

        {/* Warranties and Revisions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Warranties and Revisions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Testing & Acceptance:</strong> We conduct internal testing before delivering software. The Client will have a designated User Acceptance Testing (UAT) period to review the deliverables and report any bugs or discrepancies from the original scope.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Warranty Period:</strong> ULMiND typically provides a standard bug-fixing warranty period (e.g., 30 days) following project deployment, covering errors that prevent the software from functioning as outlined in the initial scope.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Exclusions:</strong> This warranty does not cover issues arising from third-party API changes, unauthorized modifications by the Client, server downtime, or new feature requests not included in the original SOW.
            </li>
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, ULMiND shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or related to your use of our Services. In no event shall ULMiND’s total liability exceed the total amount paid by the Client to ULMiND for the specific project or service giving rise to the claim.
          </p>
        </div>

        {/* Term and Termination */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Term and Termination</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Termination by Client:</strong> The Client may terminate a project at any time with written notice. In such cases, the Client is responsible for paying for all work completed and resources allocated up to the date of termination.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Termination by ULMiND:</strong> We reserve the right to suspend or terminate Services if the Client breaches these Terms, fails to make timely payments, or engages in unlawful or abusive behavior.
            </li>
          </ul>
        </div>

        {/* Governing Law and Dispute Resolution */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Governing Law and Dispute Resolution</h2>
          <p>
            These Terms and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Haldia, West Bengal, India.
          </p>
        </div>

      </div>

      {/* Added CTA Section here - no wrapper needed so it attaches directly */}
      <CTASection />

    </div>
  );
};

export default TermsOfService;