import React from 'react';
import { CTASection } from '@/components/Sections/CTASection';
import BlurBlob from "@/components/BlurBlob";

const PrivacyPolicy = () => {
  return (
    // 'pb-20' and 'min-h-screen' class removed to let CTA attach directly to the footer
    <div className="bg-background pt-[100px] md:pt-[15px] relative overflow-hidden">
      <BlurBlob position={{ top: "10%", left: "10%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-cyan-300 dark:bg-cyan-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "50%", left: "80%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-fuchsia-300 dark:bg-fuchsia-600" opacityClass="opacity-40 dark:opacity-20" />
      <BlurBlob position={{ top: "90%", left: "20%" }} size={{ width: "600px", height: "600px" }} colorClass="bg-yellow-200 dark:bg-yellow-600" opacityClass="opacity-40 dark:opacity-20" />
      
      {/* Top Banner - Exact shape, thickness, and perfect middle centering */}
      <div className="w-full bg-[#F94E4E] h-[120px] md:h-[140px] flex items-center justify-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white m-0 leading-none">
          Privacy Policy
        </h1>
      </div>

      {/* Content Area - Added pb-20 here to ensure gap before CTA */}
      <div className="max-w-4xl mx-auto px-6 mt-12 pb-24 space-y-8 text-muted-foreground leading-relaxed">
        
        {/* 1. Introduction and Applicability */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Introduction and Applicability</h2>
          <p>
            Welcome to ULMiND. We understand that your privacy is of utmost importance, and we are committed to safeguarding the personal information you share with us. This Privacy Policy outlines how ULMiND ("we," "our," or "us") collects, uses, protects, and discloses your information when you visit our website, use our services, or engage with us for web development, mobile app development, AI/ML solutions, and other digital services.
          </p>
          <p>
            By accessing our website or utilizing our services, you consent to the data practices described in this policy.
          </p>
        </div>

        {/* 2. Information We Collect */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
          <p>We collect both Personal and Non-Personal Information to provide you with the best possible service.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Personal Information:</strong> When you contact us for a project, request a quote, or subscribe to our newsletter, we may collect personally identifiable information such as your name, email address, phone number, company name, and project requirements.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Automatically Collected Information:</strong> When you visit our website, our servers automatically record information that your browser sends. This may include your IP address, browser type, device information, operating system, and the pages of our website that you visit.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Cookies and Tracking:</strong> We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. (For more details, please refer to our Cookie Policy).
            </li>
          </ul>
        </div>

        {/* 3. How We Use Your Information */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
          <p>ULMiND uses the collected data for various professional purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Providing Services:</strong> To deliver the software, web, or AI development services you have requested, including drafting proposals, service agreements, and invoices.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Communication:</strong> To respond to your inquiries, provide customer support, and send important updates regarding your ongoing projects.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Improvement:</strong> To analyze website usage and user feedback, helping us improve our UI/UX, service offerings, and overall digital presence.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Marketing:</strong> To send you promotional materials, newsletters, and updates about ULMiND (only if you have opted in to receive them).
            </li>
          </ul>
        </div>

        {/* 4. Data Sharing and Disclosure */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Data Sharing and Disclosure</h2>
          <p>We treat your data with strict confidentiality. We do not sell, trade, or rent your Personal Information to third parties. We may share your information only under the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Trusted Service Providers:</strong> We may share data with third-party vendors who assist us in operating our website, conducting our business, or servicing you (e.g., cloud hosting providers, payment gateways), provided they agree to keep this information confidential.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
            </li>
            <li>
              <strong className="text-foreground font-semibold">Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your Personal Information may be transferred as a business asset.
            </li>
          </ul>
        </div>

        {/* 5. Data Security */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Data Security</h2>
          <p>
            ULMiND employs industry-standard security measures to protect your Personal Information from unauthorized access, alteration, disclosure, or destruction. While we strive to use commercially acceptable means to protect your personal data (including secure servers and encrypted communication), please understand that no method of transmission over the internet or method of electronic storage is 100% secure.
          </p>
        </div>

        {/* 6. Data Retention */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Data Retention</h2>
          <p>
            We will retain your Personal Information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
          </p>
        </div>

        {/* 7. Your Privacy Rights */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Your Privacy Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong className="text-foreground font-semibold">Access and Update:</strong> You have the right to request access to the personal data we hold about you and to update or correct any inaccuracies.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Deletion:</strong> You can request that we delete your personal data, subject to certain legal exceptions.
            </li>
            <li>
              <strong className="text-foreground font-semibold">Opt-Out:</strong> You may opt out of receiving promotional communications from us by following the unsubscribe instructions included in those emails.
            </li>
          </ul>
        </div>

        {/* 8. Third-Party Links */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Third-Party Links</h2>
          <p>
            Our website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </div>

        {/* 9. Changes to This Privacy Policy */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.
          </p>
        </div>

        {/* 10. Contact Us */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:</p>
          <ul className="space-y-2 mt-2">
            <li><strong className="text-foreground font-semibold">Email:</strong> contact@ulmind.com</li>
            <li><strong className="text-foreground font-semibold">Phone:</strong> +91 85378 61040</li>
            <li><strong className="text-foreground font-semibold">Address:</strong> Haldia, West Bengal, India</li>
          </ul>
        </div>

      </div>
      
      {/* Added CTA Section here - no wrapper needed so it attaches directly */}
      <CTASection />
      
    </div>
  );
};

export default PrivacyPolicy;