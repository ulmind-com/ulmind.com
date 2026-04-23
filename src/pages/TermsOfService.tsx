import React from 'react';
import { Scale } from "lucide-react";
import { InteractiveLegalLayout, TranslateBlock } from '@/components/InteractiveLegalLayout';

const TermsOfService = () => {
  return (
    <InteractiveLegalLayout 
      title={
        <TranslateBlock 
          en="Terms of Service" 
          hi="सेवा की शर्तें (Terms of Service)" 
          bn="পরিষেবার শর্তাবলী (Terms of Service)" 
          es="Términos de Servicio" 
          fr="Conditions d'Utilisation" 
          ar="شروط الخدمة"
          zh="服务条款"
          de="Nutzungsbedingungen"
          ja="利用規約"
          ru="Условия обслуживания"
          pt="Termos de Serviço"
        />
      } 
      date={
        <TranslateBlock 
          en={<>Updated On: <span className="text-white">22/04/2026</span></>}
          hi={<>अपडेट किया गया: <span className="text-white">22/04/2026</span></>}
          bn={<>সর্বশেষ আপডেট: <span className="text-white">22/04/2026</span></>}
          es={<>Actualizado el: <span className="text-white">22/04/2026</span></>}
          fr={<>Mis à jour le: <span className="text-white">22/04/2026</span></>}
          ar={<>تم التحديث في: <span className="text-white">22/04/2026</span></>}
          zh={<>更新日期: <span className="text-white">22/04/2026</span></>}
          de={<>Aktualisiert am: <span className="text-white">22/04/2026</span></>}
          ja={<>更新日: <span className="text-white">22/04/2026</span></>}
          ru={<>Обновлено: <span className="text-white">22/04/2026</span></>}
          pt={<>Atualizado em: <span className="text-white">22/04/2026</span></>}
        />
      }
      icon={Scale}
    >
      {/* Introduction */}
      <TranslateBlock 
         en={<p>Welcome to ULMiND. These Terms of Service ("Terms") govern your access to and use of our website, products, and software development services (collectively, the "Services") provided by ULMiND ("we," "our," or "us"). By accessing our website, requesting a proposal, or utilizing our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.</p>}
         hi={<p>ULMiND में आपका स्वागत है। सेवा की ये शर्तें ("शर्तें") ULMiND ("हम", "हमारा", या "हमें") द्वारा प्रदान की जाने वाली हमारी वेबसाइट, उत्पादों और सॉफ्टवेयर विकास सेवाओं (सामूहिक रूप से, "सेवाएं") तक आपकी पहुंच और उपयोग को नियंत्रित करती हैं। हमारी वेबसाइट तक पहुँचने, कोई प्रस्ताव मांगने, या हमारी सेवाओं का उपयोग करने से, आप इन शर्तों द्वारा कानूनी रूप से बाध्य होने के लिए सहमत हैं। यदि आप इन शर्तों से सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।</p>}
         bn={<p>ULMiND-এ আপনাকে স্বাগত। এই পরিষেবার শর্তাবলী ("শর্তাবলী") ULMiND ("আমরা", "আমাদের") কর্তৃক প্রদত্ত ওয়েবসাইট, পণ্য এবং সফ্টওয়্যার ডেভেলপমেন্ট পরিষেবাগুলিতে (সম্মিলিতভাবে "পরিষেবা") আপনার অ্যাক্সেস এবং ব্যবহারকে নিয়ন্ত্রণ করে। আমাদের ওয়েবসাইট অ্যাক্সেস, কোনো প্রস্তাবনার (Proposal) অনুরোধ, অথবা আমাদের পরিষেবা গ্রহণের মাধ্যমে আপনি এই শর্তাবলী দ্বারা আইনিভাবে আবদ্ধ হতে সম্মতি জ্ঞাপন করছেন। আপনি যদি এই শর্তাবলীতে সম্মত না হন, তবে অনুগ্রহ করে আমাদের পরিষেবা গ্রহণ করা থেকে বিরত থাকুন।</p>}
         es={<p>Bienvenido a ULMiND. Estos Términos de Servicio rigen su acceso y uso de nuestro sitio web, productos y servicios de desarrollo de software proporcionados por ULMiND.</p>}
         fr={<p>Bienvenue chez ULMiND. Ces Conditions d'Utilisation régissent votre accès et votre utilisation de notre site Web, de nos produits et de nos services de développement.</p>}
         ar={<p>مرحبًا بك في ULMiND. تحكم شروط الخدمة هذه وصولك إلى واستخدام موقعنا الإلكتروني ومنتجاتنا وخدمات تطوير البرامج الخاصة بنا. باستخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط.</p>}
         zh={<p>欢迎来到 ULMiND。本服务条款规定了您对 ULMiND 提供的网站、产品和软件开发服务的访问和使用。访问我们的网站或使用我们的服务，即表示您同意受本条款的约束。</p>}
         de={<p>Willkommen bei ULMiND. Diese Nutzungsbedingungen regeln Ihren Zugriff auf und Ihre Nutzung unserer Website, Produkte und Softwareentwicklungsdienste. Durch die Nutzung unserer Dienste stimmen Sie diesen Bedingungen zu.</p>}
         ja={<p>ULMiNDへようこそ。本利用規約は、ULMiNDが提供するウェブサイト、製品、およびソフトウェア開発サービスへのアクセスと利用に適用されます。当社のサービスを利用することにより、本規約に同意したものとみなされます。</p>}
         ru={<p>Добро пожаловать в ULMiND. Настоящие Условия обслуживания регулируют ваш доступ и использование нашего веб-сайта, продуктов и услуг по разработке программного обеспечения. Используя наши услуги, вы соглашаетесь соблюдать настоящие Условия.</p>}
         pt={<p>Bem-vindo à ULMiND. Estes Termos de Serviço regem o seu acesso e uso do nosso site, produtos e serviços de desenvolvimento de software fornecidos pela ULMiND. Ao utilizar os nossos serviços, você concorda em ficar vinculado a estes Termos.</p>}
      />

      {/* Scope of Services */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Scope of Services</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">सेवाओं का दायरा</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">পরিষেবার পরিধি</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Alcance de los Servicios</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Étendue des Services</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">نطاق الخدمات</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">服务范围</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Leistungsumfang</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">サービス範囲</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Объем услуг</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Escopo de Serviços</h2>}
        />
        <TranslateBlock 
          en={<p>ULMiND specializes in custom software development, web and mobile application development, Artificial Intelligence/Machine Learning (AI/ML) solutions, and related digital services. The specific scope, deliverables, timeline, and pricing for any project will be detailed in a separate Service Agreement, Proposal, or Statement of Work (SOW) agreed upon by both parties.</p>}
          hi={<p>ULMiND कस्टम सॉफ्टवेयर डेवलपमेंट, वेब और मोबाइल एप्लिकेशन डेवलपमेंट, आर्टिफिशियल इंटेलिजेंस/मशीन लर्निंग (AI/ML) सॉल्यूशंस और संबंधित डिजिटल सेवाओं में विशेषज्ञ है। किसी भी विशिष्ट परियोजना के लिए कार्य का दायरा, डिलिवरेबल्स, समयरेखा और मूल्य निर्धारण दोनों पक्षों की सहमति से एक अलग सेवा समझौते, प्रस्ताव या कार्य विवरण (SOW) में विस्तृत रूप से वर्णित किया जाएगा।</p>}
          bn={<p>ULMiND কাস্টম সফ্টওয়্যার ডেভেলপমেন্ট, ওয়েব ও মোবাইল অ্যাপ্লিকেশন ডেভেলপমেন্ট, আর্টিফিশিয়াল ইন্টেলিজেন্স/মেশিন লার্নিং (AI/ML) সলিউশন এবং সংশ্লিষ্ট ডিজিটাল পরিষেবা প্রদানে বিশেষায়িত। যেকোনো নির্দিষ্ট প্রকল্পের জন্য কাজের পরিধি, ডেলিভারেবল, সময়সীমা এবং মূল্য নির্ধারণ উভয় পক্ষের সম্মতিক্রমে একটি পৃথক পরিষেবা চুক্তি (Service Agreement), প্রস্তাবনা, বা স্টেটমেন্ট অফ ওয়ার্কে (SOW) বিশদভাবে উল্লেখ করা হবে।</p>}
          es={<p>ULMiND se especializa en el desarrollo de software personalizado, aplicaciones web y móviles, soluciones de IA/ML y servicios digitales relacionados. El alcance específico se detallará en un Acuerdo de Servicio separado.</p>}
          fr={<p>ULMiND est spécialisé dans le développement de logiciels sur mesure, d'applications web et mobiles, de solutions IA/ML et de services numériques connexes. La portée spécifique sera détaillée dans un contrat de service séparé.</p>}
          ar={<p>تتخصص ULMiND في تطوير البرامج المخصصة وتطبيقات الويب والجوال وحلول الذكاء الاصطناعي/التعلم الآلي والخدمات الرقمية ذات الصلة. سيتم تفصيل النطاق المحدد لأي مشروع في اتفاقية خدمة منفصلة.</p>}
          zh={<p>ULMiND 专注于定制软件开发、Web 和移动应用程序开发、人工智能/机器学习（AI/ML）解决方案以及相关的数字服务。任何项目的具体范围将会在单独的服务协议中详细说明。</p>}
          de={<p>ULMiND ist auf maßgeschneiderte Softwareentwicklung, Web- und mobile Anwendungsentwicklung, KI/ML-Lösungen und verwandte digitale Dienste spezialisiert. Der genaue Umfang wird in einer separaten Dienstleistungsvereinbarung detailliert beschrieben.</p>}
          ja={<p>ULMiNDは、カスタムソフトウェア開発、Webおよびモバイルアプリケーション開発、AI/MLソリューション、および関連するデジタルサービスを専門としています。具体的な範囲は、別途サービス契約書に詳述されます。</p>}
          ru={<p>ULMiND специализируется на разработке пользовательского программного обеспечения, веб- и мобильных приложений, решениях в области ИИ/МО и связанных цифровых услугах. Конкретный объем будет детализирован в отдельном Соглашении об услугах.</p>}
          pt={<p>A ULMiND é especializada no desenvolvimento de software personalizado, aplicativos web e móveis, soluções de IA/ML e serviços digitais relacionados. O escopo específico será detalhado em um Acordo de Serviço separado.</p>}
        />
      </div>

      {/* Client Responsibilities */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Client Responsibilities</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">ग्राहक की जिम्मेदारियां</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">ক্লায়েন্টের দায়িত্বসমূহ</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Responsabilidades del Cliente</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Responsabilités du Client</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">مسؤوليات العميل</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">客户责任</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Verantwortlichkeiten des Kunden</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">クライアントの責任</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Обязанности клиента</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Responsabilidades do Cliente</h2>}
        />
        <TranslateBlock 
          en={<p>To ensure the successful and timely delivery of projects, the Client agrees to:</p>}
          hi={<p>परियोजनाओं की सफल और समय पर डिलीवरी सुनिश्चित करने के लिए, ग्राहक निम्नलिखित बातों पर सहमत होता है:</p>}
          bn={<p>প্রকল্পের সফল ও সময়ানুগ ডেলিভারি নিশ্চিত করতে ক্লায়েন্ট নিম্নোক্ত বিষয়গুলোতে সম্মত হবেন:</p>}
          es={<p>Para asegurar la entrega exitosa y oportuna de los proyectos, el Cliente acepta:</p>}
          fr={<p>Pour assurer la livraison réussie et dans les délais des projets, le Client accepte de:</p>}
          ar={<p>لضمان تسليم المشاريع بنجاح وفي الوقت المناسب، يوافق العميل على:</p>}
          zh={<p>为确保项目成功并按时交付，客户同意：</p>}
          de={<p>Um die erfolgreiche und rechtzeitige Lieferung von Projekten zu gewährleisten, verpflichtet sich der Kunde zu Folgendem:</p>}
          ja={<p>プロジェクトの成功とタイムリーな納品を確実にするため、クライアントは以下の事項に同意するものとします：</p>}
          ru={<p>Для обеспечения успешной и своевременной сдачи проектов Клиент обязуется:</p>}
          pt={<p>Para garantir a entrega bem-sucedida e oportuna dos projetos, o Cliente concorda em:</p>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
               en={<>Provide clear, accurate, and complete project requirements.</>}
               hi={<>परियोजना की स्पष्ट, सटीक और पूर्ण आवश्यकताएँ प्रदान करना।</>}
               bn={<>প্রকল্পের প্রয়োজনীয়তা সম্পর্কে স্পষ্ট, নির্ভুল এবং সম্পূর্ণ তথ্য প্রদান করা।</>}
               es={<>Proporcionar requisitos de proyecto claros, precisos y completos.</>}
               fr={<>Fournir des exigences de projet claires, précises et complètes.</>}
               ar={<>تقديم متطلبات مشروع واضحة ودقيقة وكاملة.</>}
               zh={<>提供清晰、准确、完整的项目要求。</>}
               de={<>Klare, genaue und vollständige Projektanforderungen bereitzustellen.</>}
               ja={<>明確かつ正確で完全なプロジェクト要件を提供すること。</>}
               ru={<>Предоставить четкие, точные и полные требования к проекту.</>}
               pt={<>Fornecer requisitos de projeto claros, precisos e completos.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<>Supply necessary assets, credentials, data, and feedback in a timely manner.</>}
               hi={<>आवश्यक संपत्ति, क्रेडेंशियल, डेटा और फीडबैक समय पर आपूर्ति करना।</>}
               bn={<>প্রয়োজনীয় অ্যাসেট, ক্রেডেনশিয়াল, ডেটা এবং ফিডব্যাক সময়মতো সরবরাহ করা।</>}
               es={<>Suministrar los activos, credenciales, datos y comentarios necesarios de manera oportuna.</>}
               fr={<>Fournir les actifs, identifiants, données et commentaires nécessaires en temps opportun.</>}
               ar={<>توفير الأصول والبيانات والتعليقات اللازمة في الوقت المناسب.</>}
               zh={<>及时提供必要的资产、凭据、数据和反馈。</>}
               de={<>Notwendige Vermögenswerte, Anmeldeinformationen, Daten und Feedback rechtzeitig bereitzustellen.</>}
               ja={<>必要な資産、認証情報、データ、およびフィードバックをタイムリーに提供すること。</>}
               ru={<>Своевременно предоставлять необходимые активы, учетные данные, данные и отзывы.</>}
               pt={<>Fornecer os ativos, credenciais, dados e feedback necessários de forma oportuna.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<>Designate a primary point of contact for project communications and approvals.</>}
               hi={<>परियोजना संचार और अनुमोदन के लिए एक प्राथमिक संपर्क व्यक्ति (point of contact) नामित करना।</>}
               bn={<>প্রকল্পের যোগাযোগ এবং অনুমোদনের জন্য একজন নির্দিষ্ট প্রাইমারি কন্ট্যাক্ট পার্সন নিয়োগ করা।</>}
               es={<>Designar un punto de contacto principal para las comunicaciones y aprobaciones del proyecto.</>}
               fr={<>Désigner un point de contact principal pour les communications et les approbations du projet.</>}
               ar={<>تعيين نقطة اتصال رئيسية لاتصالات المشروع والموافقات.</>}
               zh={<>指定一个主要联系人，负责项目沟通和审批。</>}
               de={<>Einen primären Ansprechpartner für Projektkommunikation und -genehmigungen zu benennen.</>}
               ja={<>プロジェクトのコミュニケーションおよび承認のための主要な連絡窓口を指定すること。</>}
               ru={<>Назначить основное контактное лицо для связи по проекту и утверждений.</>}
               pt={<>Designar um ponto de contato principal para as comunicações e aprovações do projeto.</>}
            />
          </li>
        </ul>
        <TranslateBlock 
          en={<p>Delays caused by the Client’s failure to provide required materials or feedback may result in timeline extensions and additional costs.</p>}
          hi={<p>ग्राहक द्वारा आवश्यक सामग्री या फीडबैक प्रदान करने में विफलता के कारण होने वाली देरी के परिणामस्वरूप परियोजना की समयरेखा में विस्तार और अतिरिक्त लागत उत्पन्न हो सकती है।</p>}
          bn={<p>ক্লায়েন্টের পক্ষ থেকে প্রয়োজনীয় উপকরণ বা ফিডব্যাক প্রদানে বিলম্বের ফলে প্রকল্পের সময়সীমা বৃদ্ধি পেতে পারে এবং এর জন্য অতিরিক্ত খরচ ধার্য হতে পারে।</p>}
          es={<p>Los retrasos causados por la falta de entrega de materiales o comentarios por parte del Cliente pueden resultar en extensiones de cronograma y costos adicionales.</p>}
          fr={<p>Les retards causés par le défaut du Client de fournir les matériaux ou commentaires requis peuvent entraîner des prolongations de délai et des coûts supplémentaires.</p>}
          ar={<p>قد يؤدي التأخير الناجم عن عدم تقديم العميل للمواد أو التعليقات المطلوبة إلى تمديد الجدول الزمني وتكاليف إضافية.</p>}
          zh={<p>由于客户未能提供所需材料或反馈而导致的延误，可能会导致时间表延长并产生额外费用。</p>}
          de={<p>Verzögerungen, die dadurch entstehen, dass der Kunde erforderliche Materialien oder Rückmeldungen nicht bereitstellt, können zu Fristverlängerungen und zusätzlichen Kosten führen.</p>}
          ja={<p>クライアントが必要な資料やフィードバックを提供しなかったことによる遅延は、スケジュールの延長および追加費用につながる可能性があります。</p>}
          ru={<p>Задержки, вызванные неспособностью Клиента предоставить требуемые материалы или отзывы, могут привести к продлению сроков и дополнительным расходам.</p>}
          pt={<p>Atrasos causados pela falha do Cliente em fornecer os materiais ou feedback necessários podem resultar em extensões de cronograma e custos adicionais.</p>}
        />
      </div>

      {/* Payment Terms and Invoicing */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Payment Terms and Invoicing</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">भुगतान शर्तें और बिलिंग (Invoicing)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">পেমেন্টের শর্তাবলী এবং বিলিং</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Condiciones de Pago y Facturación</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Conditions de Paiement et Facturation</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">شروط الدفع والفواتير</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">付款条件和发票</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Zahlungsbedingungen und Rechnungsstellung</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">支払い条件と請求書</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Условия оплаты и выставление счетов</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Condições de Pagamento e Faturamento</h2>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Pricing & Milestones:</strong> Project costs and payment schedules will be outlined in the agreed-upon Proposal or Service Agreement. We typically require an upfront deposit before commencing work, with subsequent payments tied to project milestones.</>}
               hi={<><strong className="text-foreground font-semibold">मूल्य निर्धारण और माइलस्टोन:</strong> परियोजना की लागत और भुगतान कार्यक्रम स्वीकृत प्रस्ताव या सेवा समझौते में स्पष्ट किए जाएंगे। काम शुरू करने से पहले हम आमतौर पर एक अग्रिम जमा (upfront deposit) का अनुरोध करते हैं, और बाद के भुगतान परियोजना के विशिष्ट माइलस्टोन से जुड़े होते हैं।</>}
               bn={<><strong className="text-foreground font-semibold">মূল্য নির্ধারণ এবং মাইলফলক:</strong> প্রকল্পের ব্যয় এবং পেমেন্ট শিডিউল অনুমোদিত প্রস্তাবনা বা পরিষেবা চুক্তিতে সুস্পষ্টভাবে উল্লেখ করা থাকবে। কাজ শুরু করার পূর্বে আমরা সাধারণত একটি আপফ্রন্ট ডিপোজিটের দাবি করে থাকি, এবং পরবর্তী পেমেন্টগুলো প্রকল্পের নির্দিষ্ট মাইলফলক অর্জনের সাথে সংযুক্ত থাকে।</>}
               es={<><strong className="text-foreground font-semibold">Precios e Hitos:</strong> Los costos del proyecto y los calendarios de pago se describirán en la Propuesta acordada.</>}
               fr={<><strong className="text-foreground font-semibold">Prix et Étapes :</strong> Les coûts du projet et les échéanciers de paiement seront décrits dans la proposition convenue.</>}
               ar={<><strong className="text-foreground font-semibold">الأسعار والمعالم:</strong> سيتم تحديد تكاليف المشروع وجداول الدفع في الاقتراح المتفق عليه.</>}
               zh={<><strong className="text-foreground font-semibold">定价与里程碑：</strong> 项目成本和付款时间表将在商定的提案中列出。通常在开始工作之前需要预付定金。</>}
               de={<><strong className="text-foreground font-semibold">Preise und Meilensteine:</strong> Projektkosten und Zahlungspläne werden in der vereinbarten Angebotsvorlage beschrieben.</>}
               ja={<><strong className="text-foreground font-semibold">価格設定とマイルストーン：</strong> プロジェクトの費用と支払いスケジュールは、合意された提案書に記載されます。</>}
               ru={<><strong className="text-foreground font-semibold">Цены и этапы:</strong> Стоимость проекта и графики платежей будут изложены в согласованном Предложении.</>}
               pt={<><strong className="text-foreground font-semibold">Preços e Marcos:</strong> Os custos do projeto e os cronogramas de pagamento serão descritos na Proposta acordada.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Invoices:</strong> Invoices will be issued upon reaching designated milestones or on a recurring basis for ongoing support/maintenance. Payments are due within the timeframe specified on the invoice.</>}
               hi={<><strong className="text-foreground font-semibold">चालान (Invoices):</strong> निर्धारित माइलस्टोन तक पहुंचने पर या चल रहे समर्थन/रखरखाव के लिए आवर्ती आधार पर चालान जारी किए जाएंगे। भुगतान चालान पर निर्दिष्ट समय सीमा के भीतर देय हैं।</>}
               bn={<><strong className="text-foreground font-semibold">ইনভয়েস:</strong> নির্ধারিত মাইলফলকে পৌঁছানোর পর অথবা চলমান সহায়তা/রক্ষণাবেক্ষণের জন্য পর্যায়ক্রমিক ভিত্তিতে ইনভয়েস ইস্যু করা হবে। ইনভয়েসে উল্লিখিত সময়সীমার মধ্যে পেমেন্ট পরিশোধ করা বাধ্যতামূলক।</>}
               es={<><strong className="text-foreground font-semibold">Facturas:</strong> Las facturas se emitirán al alcanzar los hitos designados o de forma recurrente para soporte continuo.</>}
               fr={<><strong className="text-foreground font-semibold">Factures :</strong> Les factures seront émises lors de l'atteinte des étapes désignées ou sur une base récurrente pour le support continu.</>}
               ar={<><strong className="text-foreground font-semibold">الفواتير:</strong> سيتم إصدار الفواتير عند الوصول إلى معالم معينة أو على أساس متكرر للدعم المستمر.</>}
               zh={<><strong className="text-foreground font-semibold">发票：</strong> 发票将在达到指定的里程碑时或在持续支持时定期开具。</>}
               de={<><strong className="text-foreground font-semibold">Rechnungen:</strong> Rechnungen werden bei Erreichen bestimmter Meilensteine oder regelmäßig für laufenden Support ausgestellt.</>}
               ja={<><strong className="text-foreground font-semibold">請求書：</strong> 請求書は、指定されたマイルストーンに到達した時点、または継続的なサポートのために定期的に発行されます。</>}
               ru={<><strong className="text-foreground font-semibold">Счета-фактуры:</strong> Счета-фактуры будут выставляться по достижении назначенных этапов или на регулярной основе.</>}
               pt={<><strong className="text-foreground font-semibold">Faturas:</strong> As faturas serão emitidas ao atingir os marcos designados ou de forma recorrente para suporte contínuo.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Late Payments:</strong> ULMiND reserves the right to pause work or withhold deliverables if payments are delayed. Late payments may incur an additional interest charge as specified in the applicable invoice or agreement.</>}
               hi={<><strong className="text-foreground font-semibold">देर से भुगतान:</strong> यदि भुगतान में देरी होती है तो ULMiND को काम रोकने या डिलिवरेबल्स को रोकने का पूर्ण अधिकार है। लागू चालान या समझौते में निर्दिष्टानुसार देर से भुगतान पर अतिरिक्त ब्याज या शुल्क लगाया जा सकता है।</>}
               bn={<><strong className="text-foreground font-semibold">বিলম্বে পেমেন্ট:</strong> পেমেন্ট পরিশোধে বিলম্ব হলে ULMiND কাজ স্থগিত বা ডেলিভারি আটকে রাখার সম্পূর্ণ অধিকার সংরক্ষণ করে। প্রযোজ্য ইনভয়েস বা চুক্তিতে উল্লেখিত শর্তানুযায়ী বিলম্বে পেমেন্টের জন্য অতিরিক্ত সুদ বা চার্জ আরোপ করা হতে পারে।</>}
               es={<><strong className="text-foreground font-semibold">Pagos Atrasados:</strong> ULMiND se reserva el derecho de pausar el trabajo si los pagos se retrasan.</>}
               fr={<><strong className="text-foreground font-semibold">Retards de Paiement :</strong> ULMiND se réserve le droit de suspendre les travaux si les paiements sont retardés.</>}
               ar={<><strong className="text-foreground font-semibold">المدفوعات المتأخرة:</strong> تحتفظ ULMiND بالحق في إيقاف العمل إذا تأخرت المدفوعات.</>}
               zh={<><strong className="text-foreground font-semibold">延迟付款：</strong> 如果延迟付款，ULMiND 保留暂停工作或扣留交付物的权利。</>}
               de={<><strong className="text-foreground font-semibold">Zahlungsverzug:</strong> ULMiND behält sich das Recht vor, die Arbeit bei verspäteten Zahlungen zu pausieren.</>}
               ja={<><strong className="text-foreground font-semibold">支払いの遅延：</strong> 支払いが遅延した場合、ULMiNDは作業を一時停止または納品物の引き渡しを保留する権利を留保します。</>}
               ru={<><strong className="text-foreground font-semibold">Просроченные платежи:</strong> ULMiND оставляет за собой право приостановить работу в случае задержки платежей.</>}
               pt={<><strong className="text-foreground font-semibold">Pagamentos Atrasados:</strong> A ULMiND reserva-se o direito de pausar o trabalho se os pagamentos atrasarem.</>}
            />
          </li>
        </ul>
      </div>

      {/* Intellectual Property Rights */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Intellectual Property Rights</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">बौद्धिक संपदा अधिकार (Intellectual Property Rights)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">বৌদ্ধিক সম্পত্তি অধিকার (Intellectual Property Rights)</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Derechos de Propiedad Intelectual</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Droits de Propriété Intellectuelle</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">حقوق الملكية الفكرية</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">知识产权</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Geistige Eigentumsrechte</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">知的財産権</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Права на интеллектуальную собственность</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Direitos de Propriedade Intelectual</h2>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Client Ownership:</strong> Upon receipt of full and final payment, ULMiND grants the Client exclusive rights and ownership of the final custom code, design assets, and deliverables created specifically for the project, unless otherwise stated in the Service Agreement.</>}
               hi={<><strong className="text-foreground font-semibold">ग्राहक का स्वामित्व:</strong> पूर्ण और अंतिम भुगतान प्राप्त होने पर, जब तक कि सेवा समझौते में अन्यथा न कहा गया हो, ULMiND ग्राहक को विशेष रूप से परियोजना के लिए बनाए गए अंतिम कस्टम कोड, डिज़ाइन एसेट्स और डिलिवरेबल्स का अनन्य अधिकार और स्वामित्व प्रदान करता है।</>}
               bn={<><strong className="text-foreground font-semibold">ক্লায়েন্টের মালিকানা:</strong> সম্পূর্ণ এবং চূড়ান্ত পেমেন্ট প্রাপ্তির পর, পরিষেবা চুক্তিতে ভিন্ন কিছু উল্লেখ না থাকলে, ULMiND প্রকল্পের জন্য বিশেষভাবে তৈরি করা চূড়ান্ত কাস্টম কোড, ডিজাইন অ্যাসেট এবং ডেলিভারেবলের উপর ক্লায়েন্টকে একচেটিয়া অধিকার ও মালিকানা প্রদান করে।</>}
               es={<><strong className="text-foreground font-semibold">Propiedad del Cliente:</strong> Al recibir el pago completo, ULMiND otorga al Cliente los derechos exclusivos sobre el código final y los activos de diseño.</>}
               fr={<><strong className="text-foreground font-semibold">Propriété du Client :</strong> À la réception du paiement intégral, ULMiND accorde au Client les droits exclusifs sur le code final et les actifs de conception.</>}
               ar={<><strong className="text-foreground font-semibold">ملكية العميل:</strong> عند استلام الدفعة الكاملة، تمنح ULMiND العميل حقوق الملكية الحصرية للرمز المخصص النهائي.</>}
               zh={<><strong className="text-foreground font-semibold">客户所有权：</strong> 在收到全额最终付款后，除非服务协议另有说明，否则 ULMiND 授予客户为项目专门创建的最终定制代码的专有权。</>}
               de={<><strong className="text-foreground font-semibold">Eigentum des Kunden:</strong> Nach vollständiger Zahlung gewährt ULMiND dem Kunden die exklusiven Rechte am endgültigen benutzerdefinierten Code.</>}
               ja={<><strong className="text-foreground font-semibold">クライアントの所有権：</strong> サービス契約に別段の定めがない限り、全額の支払いの受領をもって、ULMiNDはプロジェクトのために特別に作成された最終的なカスタムコードの排他的権利を付与します。</>}
               ru={<><strong className="text-foreground font-semibold">Собственность клиента:</strong> После получения полной оплаты ULMiND предоставляет Клиенту эксклюзивные права на окончательный код.</>}
               pt={<><strong className="text-foreground font-semibold">Propriedade do Cliente:</strong> Após o recebimento do pagamento integral, a ULMiND concede ao Cliente os direitos exclusivos sobre o código final.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">ULMiND’s Rights:</strong> ULMiND retains ownership of all pre-existing libraries, frameworks, tools, and proprietary methodologies used during development. We grant the Client a non-exclusive, non-transferable license to use these underlying elements solely as integrated into the final deliverable.</>}
               hi={<><strong className="text-foreground font-semibold">ULMiND के अधिकार:</strong> विकास के दौरान उपयोग की जाने वाली सभी पूर्व-विद्यमान लाइब्रेरी, फ्रेमवर्क, टूल और स्वामित्व संबंधी पद्धतियों (methodologies) का स्वामित्व ULMiND बरकरार रखता है। हम क्लाइंट को केवल अंतिम डिलिवरेबल के साथ एकीकृत रूप में इन तत्वों का उपयोग करने के लिए एक गैर-अनन्य, गैर-हस्तांतरणीय लाइसेंस प्रदान करते हैं।</>}
               bn={<><strong className="text-foreground font-semibold">ULMiND-এর অধিকার:</strong> ডেভেলপমেন্ট প্রক্রিয়া চলাকালীন ব্যবহৃত সমস্ত প্রাক-বিদ্যমান লাইব্রেরি, ফ্রেমওয়ার্ক, টুলস এবং নিজস্ব মেথডোলজির মালিকানা ULMiND সংরক্ষণ করে। আমরা ক্লায়েন্টকে এই অন্তর্নিহিত উপাদানগুলো শুধুমাত্র চূড়ান্ত ডেলিভারেবলের সাথে একীভূত অবস্থায় ব্যবহারের জন্য একটি অ-একচেটিয়া (Non-exclusive), অ-হস্তান্তরযোগ্য লাইসেন্স প্রদান করি।</>}
               es={<><strong className="text-foreground font-semibold">Derechos de ULMiND:</strong> ULMiND conserva la propiedad de todas las bibliotecas y herramientas preexistentes utilizadas durante el desarrollo.</>}
               fr={<><strong className="text-foreground font-semibold">Droits d'ULMiND :</strong> ULMiND conserve la propriété de toutes les bibliothèques et outils préexistants utilisés lors du développement.</>}
               ar={<><strong className="text-foreground font-semibold">حقوق ULMiND:</strong> تحتفظ ULMiND بملكية جميع المكتبات والأدوات الموجودة مسبقًا والمستخدمة أثناء التطوير.</>}
               zh={<><strong className="text-foreground font-semibold">ULMiND 的权利：</strong> ULMiND 保留在开发过程中使用的所有预先存在的库、框架、工具和专有方法的所有权。</>}
               de={<><strong className="text-foreground font-semibold">Rechte von ULMiND:</strong> ULMiND behält das Eigentum an allen zuvor vorhandenen Bibliotheken und Werkzeugen, die während der Entwicklung verwendet wurden.</>}
               ja={<><strong className="text-foreground font-semibold">ULMiNDの権利：</strong> ULMiNDは、開発中に使用された既存のライブラリ、フレームワーク、ツールの所有権を保持します。</>}
               ru={<><strong className="text-foreground font-semibold">Права ULMiND:</strong> ULMiND сохраняет за собой право собственности на все ранее существовавшие библиотеки и инструменты, используемые во время разработки.</>}
               pt={<><strong className="text-foreground font-semibold">Direitos da ULMiND:</strong> A ULMiND mantém a propriedade de todas as bibliotecas e ferramentas pré-existentes usadas durante o desenvolvimento.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Portfolio Rights:</strong> Unless a Non-Disclosure Agreement (NDA) states otherwise, ULMiND reserves the right to showcase the completed project (e.g., logos, screenshots, and generic descriptions) in our portfolio, marketing materials, and website.</>}
               hi={<><strong className="text-foreground font-semibold">पोर्टफोलियो अधिकार:</strong> जब तक कि एक गैर-प्रकटीकरण समझौता (NDA) इसके विपरीत न कहता हो, ULMiND अपने पोर्टफोलियो, मार्केटिंग सामग्री और वेबसाइट में पूर्ण की गई परियोजना (जैसे, लोगो, स्क्रीनशॉट और सामान्य विवरण) को प्रदर्शित करने का अधिकार सुरक्षित रखता है।</>}
               bn={<><strong className="text-foreground font-semibold">পোর্টফোলিও অধিকার:</strong> নন-ডিসক্লোজার এগ্রিমেন্ট (NDA) দ্বারা স্পষ্টভাবে বারণ করা না থাকলে, ULMiND তার পোর্টফোলিও, মার্কেটিং ম্যাটেরিয়াল এবং ওয়েবসাইটে সম্পন্নকৃত প্রকল্পটি (যেমন- লোগো, স্ক্রিনশট এবং সাধারণ বিবরণ) প্রদর্শন করার অধিকার সংরক্ষণ করে।</>}
               es={<><strong className="text-foreground font-semibold">Derechos de Portafolio:</strong> A menos que un NDA indique lo contrario, ULMiND se reserva el derecho de mostrar el proyecto en nuestro portafolio.</>}
               fr={<><strong className="text-foreground font-semibold">Droits de Portefeuille :</strong> À moins qu'un NDA ne stipule le contraire, ULMiND se réserve le droit de présenter le projet dans notre portefeuille.</>}
               ar={<><strong className="text-foreground font-semibold">حقوق المحفظة:</strong> ما لم تنص اتفاقية عدم الإفصاح على خلاف ذلك، تحتفظ ULMiND بالحق في عرض المشروع المكتمل في محفظتنا.</>}
               zh={<><strong className="text-foreground font-semibold">投资组合权利：</strong> 除非保密协议 (NDA) 另有规定，否则 ULMiND 保留展示已完成项目的权利。</>}
               de={<><strong className="text-foreground font-semibold">Portfolio-Rechte:</strong> Sofern eine NDA nichts anderes vorschreibt, behält sich ULMiND das Recht vor, das abgeschlossene Projekt in unserem Portfolio zu präsentieren.</>}
               ja={<><strong className="text-foreground font-semibold">ポートフォリオ権：</strong> 秘密保持契約（NDA）に別段の定めがない限り、ULMiNDは完成したプロジェクトをポートフォリオで公開する権利を留保します。</>}
               ru={<><strong className="text-foreground font-semibold">Права на портфолио:</strong> Если соглашение о неразглашении (NDA) не гласит иное, ULMiND оставляет за собой право демонстрировать завершенный проект в нашем портфолио.</>}
               pt={<><strong className="text-foreground font-semibold">Direitos de Portfólio:</strong> A menos que um NDA indique o contrário, a ULMiND reserva-se o direito de mostrar o projeto em nosso portfólio.</>}
            />
          </li>
        </ul>
      </div>

      {/* Confidentiality */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Confidentiality</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">गोपनीयता (Confidentiality)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">গোপনীয়তা (Confidentiality)</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Confidencialidad</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Confidentialité</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">السرية</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">保密性</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Vertraulichkeit</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">機密保持</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Конфиденциальность</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Confidencialidade</h2>}
        />
        <TranslateBlock 
          en={<p>Both parties agree to treat all sensitive business information, technical data, trade secrets, and client lists shared during the engagement as strictly confidential. Neither party shall disclose such Confidential Information to any third party without prior written consent, except as required by law.</p>}
          hi={<p>दोनों पक्ष परियोजना के दौरान साझा की गई सभी संवेदनशील व्यावसायिक जानकारी, तकनीकी डेटा, व्यापार रहस्य और ग्राहक सूचियों को सख्ती से गोपनीय मानने के लिए सहमत हैं। कानून द्वारा आवश्यक होने के अलावा, कोई भी पक्ष पूर्व लिखित सहमति के बिना किसी तीसरे पक्ष को ऐसी गोपनीय जानकारी का खुलासा नहीं करेगा।</p>}
          bn={<p>উভয় পক্ষই প্রকল্প চলাকালীন আদান-প্রদানকৃত সমস্ত সংবেদনশীল ব্যবসায়িক তথ্য, প্রযুক্তিগত ডেটা, ট্রেড সিক্রেট এবং ক্লায়েন্ট লিস্টকে কঠোরভাবে গোপনীয় হিসেবে বিবেচনা করতে সম্মত। আইনের বাধ্যবাধকতা ব্যতীত, কোনো পক্ষই পূর্ব লিখিত সম্মতি ছাড়া এ ধরনের গোপনীয় তথ্য কোনো তৃতীয় পক্ষের নিকট প্রকাশ করবে না।</p>}
          es={<p>Ambas partes acuerdan tratar toda la información comercial confidencial como estrictamente confidencial.</p>}
          fr={<p>Les deux parties conviennent de traiter toutes les informations commerciales sensibles comme strictement confidentielles.</p>}
          ar={<p>يوافق كلا الطرفين على التعامل مع جميع المعلومات التجارية الحساسة كسرية للغاية.</p>}
          zh={<p>双方同意将在合作期间共享的所有敏感商业信息作为严格保密处理。</p>}
          de={<p>Beide Parteien vereinbaren, alle vertraulichen Geschäftsinformationen streng vertraulich zu behandeln.</p>}
          ja={<p>両当事者は、業務提携中に共有されるすべての機密のビジネス情報を厳格に機密として扱うことに同意します。</p>}
          ru={<p>Обе стороны соглашаются рассматривать всю конфиденциальную деловую информацию как строго конфиденциальную.</p>}
          pt={<p>Ambas as partes concordam em tratar todas as informações comerciais sensíveis como estritamente confidenciais.</p>}
        />
      </div>

      {/* Warranties and Revisions */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Warranties and Revisions</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">वारंटी और संशोधन</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">ওয়ারেন্টি এবং সংশোধন</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Garantías y Revisiones</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Garanties et Révisions</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">الضمانات والمراجعات</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">保证与修订</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Garantien und Revisionen</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">保証と修正</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Гарантии и исправления</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Garantias e Revisões</h2>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Testing & Acceptance:</strong> We conduct internal testing before delivering software. The Client will have a designated User Acceptance Testing (UAT) period to review the deliverables and report any bugs or discrepancies from the original scope.</>}
               hi={<><strong className="text-foreground font-semibold">परीक्षण और स्वीकृति (UAT):</strong> हम सॉफ्टवेयर डिलीवर करने से पहले आंतरिक परीक्षण (internal testing) करते हैं। ग्राहक को डिलिवरेबल्स की समीक्षा करने और मूल दायरे के सापेक्ष किसी भी बग या विसंगतियों की रिपोर्ट करने के लिए एक निर्दिष्ट उपयोगकर्ता स्वीकृति परीक्षण (User Acceptance Testing - UAT) अवधि प्रदान की जाएगी।</>}
               bn={<><strong className="text-foreground font-semibold">টেস্টিং এবং গ্রহণ (UAT):</strong> সফ্টওয়্যার ডেলিভারির পূর্বে আমরা অভ্যন্তরীণ টেস্টিং সম্পন্ন করি। ডেলিভারেবলগুলো পর্যালোচনা করার জন্য এবং প্রাথমিক পরিধির সাপেক্ষে যেকোনো বাগ বা ত্রুটি রিপোর্ট করার জন্য ক্লায়েন্টকে একটি নির্দিষ্ট ইউজার অ্যাক্সেপ্টেন্স টেস্টিং (UAT) সময়কাল প্রদান করা হবে।</>}
               es={<><strong className="text-foreground font-semibold">Pruebas y Aceptación:</strong> Realizamos pruebas internas antes de entregar el software.</>}
               fr={<><strong className="text-foreground font-semibold">Tests et Acceptation :</strong> Nous effectuons des tests internes avant de livrer le logiciel.</>}
               ar={<><strong className="text-foreground font-semibold">الاختبار والقبول:</strong> نجري اختبارات داخلية قبل تسليم البرنامج.</>}
               zh={<><strong className="text-foreground font-semibold">测试和验收：</strong> 在交付软件之前，我们会进行内部测试。</>}
               de={<><strong className="text-foreground font-semibold">Prüfung und Abnahme:</strong> Wir führen interne Tests durch, bevor wir Software ausliefern.</>}
               ja={<><strong className="text-foreground font-semibold">テストと受入：</strong> ソフトウェアを提供する前に内部テストを実施します。</>}
               ru={<><strong className="text-foreground font-semibold">Тестирование и приемка:</strong> Мы проводим внутреннее тестирование перед поставкой программного обеспечения.</>}
               pt={<><strong className="text-foreground font-semibold">Testes e Aceitação:</strong> Realizamos testes internos antes de entregar o software.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Warranty Period:</strong> ULMiND typically provides a standard bug-fixing warranty period (e.g., 30 days) following project deployment, covering errors that prevent the software from functioning as outlined in the initial scope.</>}
               hi={<><strong className="text-foreground font-semibold">वारंटी अवधि:</strong> परियोजना की तैनाती के बाद ULMiND आमतौर पर एक मानक बग-फिक्सिंग वारंटी अवधि (जैसे, 30 दिन) प्रदान करता है, जो उन त्रुटियों को कवर करता है जो सॉफ़्टवेयर को प्रारंभिक दायरे में वर्णित कार्यक्षमता से रोकती हैं।</>}
               bn={<><strong className="text-foreground font-semibold">ওয়ারেন্টি সময়কাল:</strong> প্রকল্প ডেপ্লয়মেন্টের পর ULMiND সাধারণত একটি স্ট্যান্ডার্ড বাগ-ফিক্সিং ওয়ারেন্টি পিরিয়ড (যেমন, ৩০ দিন) প্রদান করে, যা মূলত প্রাথমিক পরিধিতে বর্ণিত সফ্টওয়্যারের স্বাভাবিক কার্যক্রমে বাধা সৃষ্টিকারী ত্রুটিগুলোকে কভার করে।</>}
               es={<><strong className="text-foreground font-semibold">Período de Garantía:</strong> ULMiND proporciona un período de garantía estándar para la corrección de errores.</>}
               fr={<><strong className="text-foreground font-semibold">Période de Garantie :</strong> ULMiND offre une période de garantie standard pour la correction de bogues.</>}
               ar={<><strong className="text-foreground font-semibold">فترة الضمان:</strong> توفر ULMiND فترة ضمان قياسية لإصلاح الأخطاء.</>}
               zh={<><strong className="text-foreground font-semibold">保修期：</strong> ULMiND 通常提供标准的错误修复保修期。</>}
               de={<><strong className="text-foreground font-semibold">Garantiezeitraum:</strong> ULMiND bietet eine Standard-Fehlerbehebungsgarantie.</>}
               ja={<><strong className="text-foreground font-semibold">保証期間：</strong> ULMiNDは標準のバグ修正保証期間を提供します。</>}
               ru={<><strong className="text-foreground font-semibold">Гарантийный срок:</strong> ULMiND предоставляет стандартный гарантийный срок на исправление ошибок.</>}
               pt={<><strong className="text-foreground font-semibold">Período de Garantia:</strong> A ULMiND fornece um período de garantia padrão para correção de bugs.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Exclusions:</strong> This warranty does not cover issues arising from third-party API changes, unauthorized modifications by the Client, server downtime, or new feature requests not included in the original SOW.</>}
               hi={<><strong className="text-foreground font-semibold">वारंटी से बहिष्करण (Exclusions):</strong> यह वारंटी तृतीय-पक्ष API परिवर्तनों, ग्राहक द्वारा किए गए अनधिकृत संशोधनों, सर्वर डाउनटाइम, या मूल SOW में शामिल नहीं किए गए नए फीचर अनुरोधों से उत्पन्न होने वाली समस्याओं को कवर नहीं करती है।</>}
               bn={<><strong className="text-foreground font-semibold">ওয়ারেন্টি বহির্ভূত বিষয় (Exclusions):</strong> তৃতীয় পক্ষের API পরিবর্তন, ক্লায়েন্ট কর্তৃক অননুমোদিত পরিবর্তন, সার্ভার ডাউনটাইম, অথবা মূল SOW-তে অন্তর্ভুক্ত নয় এমন নতুন ফিচারের অনুরোধের ফলে সৃষ্ট কোনো সমস্যা এই ওয়ারেন্টির অন্তর্ভুক্ত নয়।</>}
               es={<><strong className="text-foreground font-semibold">Exclusiones:</strong> Esta garantía no cubre problemas derivados de cambios en API de terceros.</>}
               fr={<><strong className="text-foreground font-semibold">Exclusions :</strong> Cette garantie ne couvre pas les problèmes liés aux modifications d'API tierces.</>}
               ar={<><strong className="text-foreground font-semibold">الاستثناءات:</strong> لا يغطي هذا الضمان المشكلات الناشئة عن تغييرات واجهة برمجة تطبيقات الجهات الخارجية.</>}
               zh={<><strong className="text-foreground font-semibold">除外责任：</strong> 此保修不涵盖因第三方 API 更改引起的问题。</>}
               de={<><strong className="text-foreground font-semibold">Ausschlüsse:</strong> Diese Garantie deckt keine Probleme ab, die durch API-Änderungen Dritter entstehen.</>}
               ja={<><strong className="text-foreground font-semibold">除外事項：</strong> サードパーティのAPIの変更による問題は保証対象外です。</>}
               ru={<><strong className="text-foreground font-semibold">Исключения:</strong> Данная гарантия не распространяется на проблемы, возникающие из-за изменений API третьих лиц.</>}
               pt={<><strong className="text-foreground font-semibold">Exclusões:</strong> Esta garantia não cobre problemas decorrentes de alterações de API de terceiros.</>}
            />
          </li>
        </ul>
      </div>

      {/* Limitation of Liability */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">दायित्व की सीमा (Limitation of Liability)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">দায়বদ্ধতার সীমাবদ্ধতা (Limitation of Liability)</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Limitación de Responsabilidad</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Limitation de Responsabilité</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">تحديد المسؤولية</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">责任限制</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Haftungsbeschränkung</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">責任の制限</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Ограничение ответственности</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Limitação de Responsabilidade</h2>}
        />
        <TranslateBlock 
          en={<p>To the maximum extent permitted by law, ULMiND shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising out of or related to your use of our Services. In no event shall ULMiND’s total liability exceed the total amount paid by the Client to ULMiND for the specific project or service giving rise to the claim.</p>}
          hi={<p>कानून द्वारा अनुमत अधिकतम सीमा तक, ULMiND हमारी सेवाओं के आपके उपयोग से उत्पन्न होने वाले या उससे संबंधित किसी भी अप्रत्यक्ष, आकस्मिक, विशेष, परिणामी या दंडात्मक नुकसान (जिसमें लाभ, डेटा, या व्यावसायिक अवसरों की हानि शामिल है) के लिए उत्तरदायी नहीं होगा। किसी भी स्थिति में ULMiND की कुल देयता उस विशिष्ट परियोजना या सेवा के लिए ग्राहक द्वारा भुगतान की गई कुल राशि से अधिक नहीं होगी जिससे दावा उत्पन्न होता है।</p>}
          bn={<p>আইন দ্বারা অনুমোদিত সর্বোচ্চ সীমা পর্যন্ত, আমাদের পরিষেবা ব্যবহারের ফলে উদ্ভূত কোনো পরোক্ষ, আনুষঙ্গিক, বিশেষ, ফলাফলস্বরূপ, বা শাস্তিমূলক ক্ষতির জন্য (যার মধ্যে লাভের ক্ষতি, ডেটা হারানো বা ব্যবসায়িক সুযোগের ক্ষতি অন্তর্ভুক্ত) ULMiND দায়ী থাকবে না। কোনো অবস্থাতেই ULMiND-এর মোট দায়বদ্ধতার পরিমাণ নির্দিষ্ট প্রকল্প বা পরিষেবার জন্য ক্লায়েন্ট কর্তৃক প্রদত্ত মোট মূল্যের চেয়ে বেশি হবে নিয়োগ না।</p>}
          es={<p>En la medida máxima permitida por la ley, ULMiND no será responsable de ningún daño indirecto, incidental o consecuente.</p>}
          fr={<p>Dans toute la mesure permise par la loi, ULMiND ne sera pas responsable des dommages indirects, accessoires ou consécutifs.</p>}
          ar={<p>إلى أقصى حد يسمح به القانون، لن تكون ULMiND مسؤولة عن أي أضرار غير مباشرة.</p>}
          zh={<p>在法律允许的最大范围内，ULMiND 不对任何间接或附带损害负责。</p>}
          de={<p>Soweit gesetzlich zulässig, haftet ULMiND nicht für indirekte, zufällige oder Folgeschäden.</p>}
          ja={<p>法律で認められる最大限の範囲において、ULMiNDは間接的または付随的な損害に対して責任を負いません。</p>}
          ru={<p>В максимальной степени, разрешенной законом, ULMiND не несет ответственности за любые косвенные убытки.</p>}
          pt={<p>Na extensão máxima permitida por lei, a ULMiND não será responsável por quaisquer danos indiretos ou incidentais.</p>}
        />
      </div>

      {/* Term and Termination */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Term and Termination</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">अवधि और अनुबंध की समाप्ति</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">মেয়াদ এবং চুক্তি বাতিলকরণ</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Plazo y Terminación</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Durée et Résiliation</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">المدة والإنهاء</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">期限和终止</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Laufzeit und Beendigung</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">期間および解約</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Срок и прекращение</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Prazo e Rescisão</h2>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Termination by Client:</strong> The Client may terminate a project at any time with written notice. In such cases, the Client is responsible for paying for all work completed and resources allocated up to the date of termination.</>}
               hi={<><strong className="text-foreground font-semibold">ग्राहक द्वारा समाप्ति:</strong> ग्राहक लिखित नोटिस देकर किसी भी समय किसी परियोजना को समाप्त कर सकता है। ऐसे मामलों में, ग्राहक समाप्ति की तारीख तक पूर्ण किए गए सभी कार्यों और आवंटित संसाधनों के लिए भुगतान करने के लिए कानूनी रूप से उत्तरदायी है।</>}
               bn={<><strong className="text-foreground font-semibold">ক্লায়েন্ট কর্তৃক চুক্তি বাতিল:</strong> ক্লায়েন্ট চাইলে লিখিত নোটিশ প্রদানের মাধ্যমে যেকোনো সময় প্রকল্প বাতিল করতে পারেন। এ ক্ষেত্রে, ক্লায়েন্ট চুক্তি বাতিলের তারিখ পর্যন্ত সম্পন্ন হওয়া সকল কাজ এবং বরাদ্দকৃত রিসোর্সের মূল্য পরিশোধ করতে আইনিভাবে বাধ্য থাকবেন।</>}
               es={<><strong className="text-foreground font-semibold">Terminación por el Cliente:</strong> El Cliente puede rescindir un proyecto en cualquier momento con notificación por escrito.</>}
               fr={<><strong className="text-foreground font-semibold">Résiliation par le Client :</strong> Le Client peut résilier un projet à tout moment par notification écrite.</>}
               ar={<><strong className="text-foreground font-semibold">الإنهاء من قبل العميل:</strong> يجوز للعميل إنهاء مشروع في أي وقت بإشعار كتابي.</>}
               zh={<><strong className="text-foreground font-semibold">客户终止：</strong> 客户可随时通过书面通知终止项目。</>}
               de={<><strong className="text-foreground font-semibold">Beendigung durch den Kunden:</strong> Der Kunde kann ein Projekt jederzeit mit schriftlicher Mitteilung beenden.</>}
               ja={<><strong className="text-foreground font-semibold">クライアントによる解約：</strong> クライアントは書面による通知によりいつでもプロジェクトを解約できます。</>}
               ru={<><strong className="text-foreground font-semibold">Расторжение Клиентом:</strong> Клиент может расторгнуть проект в любое время с письменным уведомлением.</>}
               pt={<><strong className="text-foreground font-semibold">Rescisão pelo Cliente:</strong> O Cliente pode rescindir um projeto a qualquer momento com aviso por escrito.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Termination by ULMiND:</strong> We reserve the right to suspend or terminate Services if the Client breaches these Terms, fails to make timely payments, or engages in unlawful or abusive behavior.</>}
               hi={<><strong className="text-foreground font-semibold">ULMiND द्वारा समाप्ति:</strong> यदि ग्राहक इन शर्तों का उल्लंघन करता है, समय पर भुगतान करने में विफल रहता है, या गैरकानूनी या अपमानजनक व्यवहार में संलग्न होता है, तो हम सेवाओं को निलंबित करने या समाप्त करने का पूर्ण अधिकार सुरक्षित रखते हैं।</>}
               bn={<><strong className="text-foreground font-semibold">ULMiND কর্তৃক চুক্তি বাতিল:</strong> ক্লায়েন্ট যদি এই শর্তাবলী লঙ্ঘন করেন, সময়মতো পেমেন্ট পরিশোধে ব্যর্থ হন, অথবা বেআইনি বা অশালীন আচরণে লিপ্ত হন, তবে আমরা পরিষেবা স্থগিত বা বাতিল করার পূর্ণ অধিকার সংরক্ষণ করি।</>}
               es={<><strong className="text-foreground font-semibold">Terminación por ULMiND:</strong> Nos reservamos el derecho de suspender o rescindir los Servicios si el Cliente incumple estos Términos.</>}
               fr={<><strong className="text-foreground font-semibold">Résiliation par ULMiND :</strong> Nous nous réservons le droit de suspendre ou de résilier les Services si le Client enfreint ces Conditions.</>}
               ar={<><strong className="text-foreground font-semibold">الإنهاء بواسطة ULMiND:</strong> نحتفظ بالحق في تعليق أو إنهاء الخدمات إذا خالف العميل هذه الشروط.</>}
               zh={<><strong className="text-foreground font-semibold">ULMiND 终止：</strong> 如果客户违反这些条款，我们保留暂停或终止服务的权利。</>}
               de={<><strong className="text-foreground font-semibold">Beendigung durch ULMiND:</strong> Wir behalten uns das Recht vor, die Dienstleistungen auszusetzen oder zu beenden, wenn der Kunde diese Bedingungen verletzt.</>}
               ja={<><strong className="text-foreground font-semibold">ULMiNDによる解約：</strong> クライアントが本規約に違反した場合、当社はサービスを停止または終了する権利を留保します。</>}
               ru={<><strong className="text-foreground font-semibold">Расторжение со стороны ULMiND:</strong> Мы оставляем за собой право приостановить или прекратить предоставление Услуг, если Клиент нарушает настоящие Условия.</>}
               pt={<><strong className="text-foreground font-semibold">Rescisão pela ULMiND:</strong> Reservamo-nos o direito de suspender ou rescindir os Serviços se o Cliente violar estes Termos.</>}
            />
          </li>
        </ul>
      </div>

      {/* Zero Tolerance Policy */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground text-red-500">Zero Tolerance Policy</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground text-red-500">शून्य सहिष्णुता नीति (Zero Tolerance Policy)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground text-red-500">জিরো টলারেন্স নীতি (Zero Tolerance Policy)</h2>}
          es={<h2 className="text-2xl font-bold text-foreground text-red-500">Política de Tolerancia Cero</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground text-red-500">Politique de Tolérance Zéro</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground text-red-500">سياسة عدم التسامح مطلقاً</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground text-red-500">零容忍政策</h2>}
          de={<h2 className="text-2xl font-bold text-foreground text-red-500">Null-Toleranz-Politik</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground text-red-500">ゼロ・トレランス（一切許容しない）ポリシー</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground text-red-500">Политика абсолютной нетерпимости</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground text-red-500">Política de Tolerância Zero</h2>}
        />
        <TranslateBlock 
          en={<p>At ULMiND, we hold our internal teams, clients, and partners to the highest echelon of professional integrity, ethics, and operational excellence. To protect our ecosystem, our clients' trust, and our proprietary assets, ULMiND enforces an uncompromising Zero Tolerance Policy against any form of misconduct.</p>}
          hi={<p>ULMiND में, हम अपनी आंतरिक टीमों, ग्राहकों और भागीदारों से पेशेवर अखंडता, नैतिकता और परिचालन उत्कृष्टता के उच्चतम स्तर की अपेक्षा करते हैं। हमारे पारिस्थितिकी तंत्र, हमारे ग्राहकों के भरोसे और हमारी स्वामित्व वाली संपत्ति की रक्षा के लिए, ULMiND किसी भी प्रकार के दुराचार के खिलाफ एक समझौताहीन शून्य सहिष्णुता नीति लागू करता है।</p>}
          bn={<p>ULMiND-এ, আমরা আমাদের অভ্যন্তরীণ টিম, ক্লায়েন্ট এবং পার্টনারদের কাছ থেকে সর্বোচ্চ স্তরের পেশাদার সততা, নৈতিকতা এবং অপারেশনাল উৎকর্ষতা আশা করি। আমাদের ইকোসিস্টেম, ক্লায়েন্টদের আস্থা এবং আমাদের নিজস্ব সম্পদ সুরক্ষার স্বার্থে, ULMiND যেকোনো ধরনের অসদাচরণের বিরুদ্ধে আপসহীন জিরো টলারেন্স নীতি প্রয়োগ করে।</p>}
          es={<p>En ULMiND, mantenemos a nuestros equipos, clientes y socios en el nivel más alto de integridad profesional. ULMiND aplica una Política de Tolerancia Cero contra cualquier forma de mala conducta.</p>}
          fr={<p>Chez ULMiND, nous maintenons nos équipes, clients et partenaires au plus haut niveau d'intégrité professionnelle. ULMiND applique une politique de tolérance zéro contre toute forme d'inconduite.</p>}
          ar={<p>في ULMiND، نلزم فرقنا الداخلية وعملائنا وشركائنا بأعلى درجات النزاهة المهنية. تطبق ULMiND سياسة عدم التسامح مطلقًا ضد أي شكل من أشكال سوء السلوك.</p>}
          zh={<p>在 ULMiND，我们要求内部团队、客户和合作伙伴保持最高水平的职业操守。ULMiND 对任何形式的不当行为执行不妥协的零容忍政策。</p>}
          de={<p>Bei ULMiND halten wir unsere internen Teams, Kunden und Partner auf höchstem Niveau der professionellen Integrität. ULMiND setzt eine kompromisslose Null-Toleranz-Politik gegen jede Form von Fehlverhalten durch.</p>}
          ja={<p>ULMiNDでは、社内チーム、クライアント、およびパートナーに最高水準の職業上の誠実さを求めています。いかなる形態の不正行為に対しても、妥協のないゼロ・トレランスポリシーを適用します。</p>}
          ru={<p>В ULMiND мы требуем от наших внутренних команд, клиентов и партнеров высочайшего уровня профессиональной честности. ULMiND применяет бескомпромиссную Политику абсолютной нетерпимости к любым формам неправомерных действий.</p>}
          pt={<p>Na ULMiND, exigimos de nossas equipes internas, clientes e parceiros o mais alto nível de integridade profissional. A ULMiND aplica uma Política de Tolerância Zero intransigente contra qualquer forma de má conduta.</p>}
        />
        <TranslateBlock 
          en={<p>Engagement with ULMiND requires strict adherence to the following tenets; violation of any will not be entertained under any circumstances:</p>}
          hi={<p>ULMiND के साथ जुड़ने के लिए निम्नलिखित सिद्धांतों का कड़ाई से पालन करना अनिवार्य है; किसी भी परिस्थिति में इसके किसी भी उल्लंघन को बर्दाश्त नहीं किया जाएगा:</p>}
          bn={<p>ULMiND-এর সাথে যুক্ত হওয়ার জন্য নিম্নলিখিত মূলনীতিগুলো কঠোরভাবে মেনে চলা বাধ্যতামূলক; কোনো অবস্থাতেই এর কোনো রূপ লঙ্ঘন বরদাস্ত করা হবে না:</p>}
          es={<p>El compromiso con ULMiND requiere el estricto cumplimiento de los siguientes principios:</p>}
          fr={<p>L'engagement avec ULMiND nécessite le strict respect des principes suivants :</p>}
          ar={<p>يتطلب التعامل مع ULMiND الالتزام الصارم بالمبادئ التالية:</p>}
          zh={<p>与 ULMiND 合作需要严格遵守以下原则：</p>}
          de={<p>Die Zusammenarbeit mit ULMiND erfordert die strikte Einhaltung der folgenden Grundsätze:</p>}
          ja={<p>ULMiNDとの取引には、以下の原則の厳守が求められます：</p>}
          ru={<p>Сотрудничество с ULMiND требует строгого соблюдения следующих принципов:</p>}
          pt={<p>O envolvimento com a ULMiND requer estrita adesão aos seguintes princípios:</p>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Data Compromise & Security Breaches:</strong> Any unauthorized access, extraction, distribution, or personal exploitation of client data, source code, server credentials, or proprietary intellectual property is strictly forbidden. We mandate absolute data sanctity.</>}
               hi={<><strong className="text-foreground font-semibold">डेटा समझौता और सुरक्षा उल्लंघन:</strong> ग्राहक के डेटा, स्रोत कोड, सर्वर क्रेडेंशियल या मालिकाना बौद्धिक संपदा का कोई भी अनधिकृत उपयोग, निष्कर्षण, वितरण या व्यक्तिगत शोषण सख्त वर्जित है। हम डेटा की पूर्ण गोपनीयता और सुरक्षा सुनिश्चित करना अनिवार्य मानते हैं।</>}
               bn={<><strong className="text-foreground font-semibold">ডেটা আপস এবং নিরাপত্তা লঙ্ঘন:</strong> ক্লায়েন্টের ডেটা, সোর্স কোড, সার্ভার ক্রেডেনশিয়াল বা বুদ্ধিবৃত্তিক সম্পত্তির কোনো অননুমোদিত অ্যাক্সেস, নিষ্কাশন, বিতরণ বা ব্যক্তিগত স্বার্থে ব্যবহার কঠোরভাবে নিষিদ্ধ। আমরা ডেটার সর্বোচ্চ গোপনীয়তা ও নিরাপত্তা নিশ্চিতকরণ বাধ্যতামূলক করি।</>}
               es={<><strong className="text-foreground font-semibold">Violaciones de Seguridad:</strong> El acceso no autorizado a los datos del cliente está estrictamente prohibido.</>}
               fr={<><strong className="text-foreground font-semibold">Failles de Sécurité :</strong> L'accès non autorisé aux données du client est strictement interdit.</>}
               ar={<><strong className="text-foreground font-semibold">الانتهاكات الأمنية:</strong> يُمنع منعًا باتًا الوصول غير المصرح به إلى بيانات العميل.</>}
               zh={<><strong className="text-foreground font-semibold">安全漏洞：</strong> 严禁未经授权访问客户数据。</>}
               de={<><strong className="text-foreground font-semibold">Sicherheitsverletzungen:</strong> Jeder unbefugte Zugriff auf Kundendaten ist strengstens untersagt.</>}
               ja={<><strong className="text-foreground font-semibold">セキュリティ違反：</strong> クライアントデータへの不正アクセスは固く禁じられています。</>}
               ru={<><strong className="text-foreground font-semibold">Нарушения безопасности:</strong> Несанкционированный доступ к данным клиента строго запрещен.</>}
               pt={<><strong className="text-foreground font-semibold">Violações de Segurança:</strong> O acesso não autorizado aos dados do cliente é estritamente proibido.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Religious Intolerance, Proselytizing & Respect for Personal Liberties:</strong> ULMiND champions a secular, religiously neutral, and harmonious professional ecosystem. We unequivocally respect individual faith and personal liberties; the wearing of religious attire or cultural symbols (e.g., tilak, burqa, hijab, cross, etc.) is a strictly private matter, and ULMiND will never interfere with, question, or dictate these personal choices. Conversely, any form of religious proselytizing, attempts at conversion, or the imposition of personal religious ideologies upon others is strictly prohibited and viewed with extreme suspicion. Furthermore, making direct or indirect comments, subtle gestures, or derogatory mockery regarding an individual's faith, beliefs, or religious attire is completely unacceptable. Faith is strictly personal. Any personnel found engaging in such behavior or violating these boundaries will face immediate and uncompromising disciplinary action.</>}
               hi={<><strong className="text-foreground font-semibold">धार्मिक असहिष्णुता, धर्मांतरण और व्यक्तिगत स्वतंत्रता का सम्मान:</strong> ULMiND एक धर्मनिरपेक्ष, धार्मिक रूप से तटस्थ और सामंजस्यपूर्ण पेशेवर पारिस्थितिकी तंत्र में विश्वास करता है। हम व्यक्तिगत आस्था और स्वतंत्रता का पूर्ण सम्मान करते हैं; धार्मिक पोशाक या सांस्कृतिक प्रतीक (जैसे- तिलक, बुर्का, हिजाब, क्रॉस आदि) पहनना पूर्णतः व्यक्तिगत मामला है, और ULMiND कभी भी इन व्यक्तिगत विकल्पों पर हस्तक्षेप, सवाल या निर्देश नहीं देगा। इसके विपरीत, कार्यस्थल पर किसी भी प्रकार का धार्मिक प्रचार, धर्मांतरण का प्रयास या दूसरों पर अपनी धार्मिक विचारधारा थोपना सख्त वर्जित है। इसके अतिरिक्त, किसी के धार्मिक विश्वास या पोशाक को लेकर प्रत्यक्ष या अप्रत्यक्ष टिप्पणी करना, या अपमानजनक व्यवहार करना पूर्णतः अस्वीकार्य है। धर्म एक व्यक्तिगत विषय है। यदि कोई ऐसा करता पाया जाता है, तो उसके खिलाफ सख्त और दंडात्मक कार्रवाई की जाएगी।</>}
               bn={<><strong className="text-foreground font-semibold">ধর্মীয় অসহিষ্ণুতা, ধর্মান্তরিতকরণ এবং ব্যক্তিগত স্বাধীনতার প্রতি সম্মান:</strong> ULMiND একটি ধর্মনিরপেক্ষ, ধর্মীয়ভাবে নিরপেক্ষ এবং সুশৃঙ্খল পেশাদার ইকোসিস্টেমে বিশ্বাস করে। আমরা ব্যক্তিগত বিশ্বাস এবং স্বাধীনতার প্রতি পূর্ণ সম্মান প্রদর্শন করি; ধর্মীয় পোশাক বা সাংস্কৃতিক প্রতীক (যেমন- তিলক, বোরখা, হিজাব, ক্রস ইত্যাদি) পরিধান করা সম্পূর্ণ ব্যক্তিগত বিষয়, এবং ULMiND কখনোই এসব ব্যক্তিগত পছন্দের ওপর হস্তক্ষেপ, প্রশ্ন বা নির্দেশ প্রদান করবে না। পক্ষান্তরে, কর্মক্ষেত্রে যেকোনো প্রকার ধর্মীয় প্রচার, ধর্মান্তরিতকরণের চেষ্টা বা অন্যের ওপর নিজ ধর্মীয় মতাদর্শ চাপিয়ে দেওয়া সম্পূর্ণ নিষিদ্ধ। অধিকন্তু, কারো ধর্মীয় বিশ্বাস বা পোশাক নিয়ে প্রত্যক্ষ বা পরোক্ষ মন্তব্য করা, বা অবমাননাকর আচরণ করা চরম শাস্তিযোগ্য অপরাধ। ধর্ম সম্পূর্ণ ব্যক্তিগত বিষয়। এ ধরনের আচরণে যুক্ত প্রমাণ পাওয়া গেলে তার বিরুদ্ধে কঠোর ও আপসহীন শাস্তিমূলক ব্যবস্থা গ্রহণ করা হবে।</>}
               es={<><strong className="text-foreground font-semibold">Intolerancia Religiosa y Libertades Personales:</strong> ULMiND defiende un ecosistema secular y neutral.</>}
               fr={<><strong className="text-foreground font-semibold">Intolérance Religieuse et Libertés Personnelles :</strong> ULMiND défend un écosystème laïc et neutre.</>}
               ar={<><strong className="text-foreground font-semibold">التعصب الديني:</strong> تدعم ULMiND نظامًا بيئيًا علمانيًا ومحايدًا.</>}
               zh={<><strong className="text-foreground font-semibold">宗教不容忍：</strong> ULMiND 倡导世俗和中立的生态系统。</>}
               de={<><strong className="text-foreground font-semibold">Religiöse Intoleranz:</strong> ULMiND setzt sich für ein säkulares und neutrales Ökosystem ein.</>}
               ja={<><strong className="text-foreground font-semibold">宗教的不寛容：</strong> ULMiNDは世俗的で中立的なエコシステムを支持します。</>}
               ru={<><strong className="text-foreground font-semibold">Религиозная нетерпимость:</strong> ULMiND выступает за светскую и нейтральную экосистему.</>}
               pt={<><strong className="text-foreground font-semibold">Intolerância Religiosa:</strong> A ULMiND defende um ecossistema secular e neutro.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Workplace Harassment & Discrimination:</strong> We are committed to an inclusive and respectful environment. Any form of physical, verbal, or psychological harassment, discrimination, or abusive conduct directed toward ULMiND personnel, management, or clients will not be tolerated.</>}
               hi={<><strong className="text-foreground font-semibold">कार्यस्थल उत्पीड़न और भेदभाव:</strong> हम एक समावेशी और सम्मानजनक वातावरण बनाए रखने के लिए प्रतिबद्ध हैं। ULMiND के कर्मियों, प्रबंधन या ग्राहकों के प्रति किसी भी प्रकार के शारीरिक, मौखिक या मनोवैज्ञानिक उत्पीड़न, भेदभाव या अपमानजनक आचरण को कतई बर्दाश्त नहीं किया जाएगा।</>}
               bn={<><strong className="text-foreground font-semibold">কর্মক্ষেত্রে হয়রানি এবং বৈষম্য:</strong> আমরা একটি অন্তর্ভুক্তিমূলক ও সম্মানজনক কাজের পরিবেশ বজায় রাখতে প্রতিশ্রুতিবদ্ধ। ULMiND-এর কর্মী, ম্যানেজমেন্ট বা ক্লায়েন্টদের প্রতি নির্দেশিত যেকোনো প্রকার শারীরিক, মৌখিক বা মানসিক হয়রানি, বৈষম্য বা গালিগালাজ কোনোভাবেই সহ্য করা হবে না।</>}
               es={<><strong className="text-foreground font-semibold">Acoso y Discriminación:</strong> Estamos comprometidos con un entorno inclusivo y respetuoso.</>}
               fr={<><strong className="text-foreground font-semibold">Harcèlement et Discrimination :</strong> Nous nous engageons à offrir un environnement inclusif et respectueux.</>}
               ar={<><strong className="text-foreground font-semibold">التحرش والتمييز:</strong> نحن ملتزمون ببيئة شاملة ومحترمة.</>}
               zh={<><strong className="text-foreground font-semibold">骚扰和歧视：</strong> 我们致力于提供包容和尊重的环境。</>}
               de={<><strong className="text-foreground font-semibold">Belästigung und Diskriminierung:</strong> Wir setzen uns für ein integratives und respektvolles Umfeld ein.</>}
               ja={<><strong className="text-foreground font-semibold">ハラスメントと差別：</strong> 私たちは包括的で敬意のある環境に取り組んでいます。</>}
               ru={<><strong className="text-foreground font-semibold">Домогательства и дискриминация:</strong> Мы стремимся к созданию инклюзивной и уважительной среды.</>}
               pt={<><strong className="text-foreground font-semibold">Assédio e Discriminação:</strong> Estamos comprometidos com um ambiente inclusivo e respeitoso.</>}
            />
          </li>
          <li>
            <TranslateBlock 
               en={<><strong className="text-foreground font-semibold">Unethical Business Practices:</strong> Engaging in intellectual property theft (plagiarism), fraudulent billing, misrepresentation of working hours, unauthorized sub-contracting, or any deceptive practices that compromise project integrity is deemed a severe violation.</>}
               hi={<><strong className="text-foreground font-semibold">अनैतिक व्यावसायिक प्रथाएँ:</strong> बौद्धिक संपदा की चोरी (plagiarism), कपटपूर्ण बिलिंग, काम के घंटों की गलत बयानी, अनधिकृत उप-अनुबंध (sub-contracting), या परियोजना की अखंडता से समझौता करने वाली किसी भी भ्रामक प्रथा में शामिल होना गंभीर उल्लंघन माना जाता है।</>}
               bn={<><strong className="text-foreground font-semibold">অনৈতিক ব্যবসায়িক চর্চা:</strong> মেধাস্বত্ব চুরি (Plagiarism), প্রতারণামূলক বিলিং, কাজের সময়ের মিথ্যা তথ্য প্রদান, অননুমোদিত সাব-কন্ট্রাক্টিং, বা প্রকল্পের অখণ্ডতা ক্ষুণ্ণ করে এমন যেকোনো প্রতারণামূলক কাজে লিপ্ত হওয়াকে গুরুতর আইনভঙ্গ হিসেবে বিবেচনা করা হয়।</>}
               es={<><strong className="text-foreground font-semibold">Prácticas Comerciales Poco Éticas:</strong> Participar en el robo de propiedad intelectual es una violación grave.</>}
               fr={<><strong className="text-foreground font-semibold">Pratiques Commerciales Contraires à l'Éthique :</strong> Le vol de propriété intellectuelle est une violation grave.</>}
               ar={<><strong className="text-foreground font-semibold">الممارسات غير الأخلاقية:</strong> تعتبر سرقة الملكية الفكرية انتهاكًا خطيرًا.</>}
               zh={<><strong className="text-foreground font-semibold">不道德行为：</strong> 盗窃知识产权被视为严重违规。</>}
               de={<><strong className="text-foreground font-semibold">Unethische Praktiken:</strong> Der Diebstahl von geistigem Eigentum ist ein schwerwiegender Verstoß.</>}
               ja={<><strong className="text-foreground font-semibold">非倫理的な慣行：</strong> 知的財産の窃盗は重大な違反です。</>}
               ru={<><strong className="text-foreground font-semibold">Неэтичные практики:</strong> Кража интеллектуальной собственности является серьезным нарушением.</>}
               pt={<><strong className="text-foreground font-semibold">Práticas antiéticas:</strong> O roubo de propriedade intelectual é uma violação grave.</>}
            />
          </li>
        </ul>
      </div>

      {/* Governing Law and Dispute Resolution */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Governing Law and Dispute Resolution</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">शासी कानून और विवाद समाधान</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">পরিচালনাকারী আইন এবং বিরোধ নিষ্পত্তি</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Ley Aplicable y Resolución de Disputas</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Loi Applicable et Résolution des Litiges</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">القانون المعمول به وحل النزاعات</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">适用法律和争议解决</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Geltendes Recht und Streitbeilegung</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">準拠法および紛争解決</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Применимое право и разрешение споров</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Lei Aplicável e Resolução de Disputas</h2>}
        />
        <TranslateBlock 
          en={<p>These Terms and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Bankura, West Bengal, India.</p>}
          hi={<p>ये शर्तें और कोई भी अलग समझौते जिनके तहत हम आपको सेवाएं प्रदान करते हैं, भारत के कानूनों के अनुसार शासित और विश्लेषित किए जाएंगे। इन शर्तों के संबंध में या उनसे उत्पन्न होने वाले किसी भी विवाद का निपटारा विशेष रूप से बांकुड़ा, पश्चिम बंगाल, भारत में स्थित अदालतों के अनन्य अधिकार क्षेत्र के अधीन होगा।</p>}
          bn={<p>এই শর্তাবলী এবং আপনাকে প্রদত্ত যেকোনো পরিষেবা সম্পর্কিত পৃথক চুক্তিসমূহ ভারতের আইনের অধীনে পরিচালিত ও বিশ্লেষিত হবে। এই শর্তাবলীর সাথে সম্পর্কিত বা এর থেকে উদ্ভূত যেকোনো বিরোধের নিষ্পত্তি শুধুমাত্র ভারতের পশ্চিমবঙ্গ রাজ্যের বাঁকুড়া জেলায় অবস্থিত আদালতের একচেটিয়া এখতিয়ারভুক্ত হবে।</p>}
          es={<p>Estos Términos se regirán e interpretarán de acuerdo con las leyes de la India.</p>}
          fr={<p>Ces Conditions seront régies et interprétées conformément aux lois de l'Inde.</p>}
          ar={<p>تخضع هذه الشروط لقوانين الهند.</p>}
          zh={<p>这些条款应受印度法律管辖并按其解释。</p>}
          de={<p>Diese Bedingungen unterliegen den Gesetzen Indiens.</p>}
          ja={<p>これらの条項はインドの法律に準拠し、解釈されます。</p>}
          ru={<p>Настоящие Условия регулируются и толкуются в соответствии с законодательством Индии.</p>}
          pt={<p>Estes Termos serão regidos e interpretados de acordo com as leis da Índia.</p>}
        />
      </div>

    </InteractiveLegalLayout>
  );
};

export default TermsOfService;