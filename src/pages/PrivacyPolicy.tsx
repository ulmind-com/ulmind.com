import React from 'react';
import { ShieldCheck } from "lucide-react";
import { InteractiveLegalLayout, TranslateBlock } from '@/components/InteractiveLegalLayout';

const PrivacyPolicy = () => {
  return (
    <InteractiveLegalLayout 
      title={
        <TranslateBlock 
          en="Privacy Policy" 
          hi="गोपनीयता नीति" 
          bn="গোপনীয়তা নীতি" 
          es="Política de Privacidad" 
          fr="Politique de Confidentialité" 
          ar="سياسة الخصوصية"
          zh="隐私政策"
          de="Datenschutzerklärung"
          ja="プライバシーポリシー"
          ru="Политика конфиденциальности"
          pt="Política de Privacidade"
        />
      } 
      date={
        <TranslateBlock 
          en={<>Updated On: <span className="text-white">04/04/2026</span></>}
          hi={<>अपडेट किया गया: <span className="text-white">04/04/2026</span></>}
          bn={<>সর্বশেষ আপডেট: <span className="text-white">04/04/2026</span></>}
          es={<>Actualizado el: <span className="text-white">04/04/2026</span></>}
          fr={<>Mis à jour le: <span className="text-white">04/04/2026</span></>}
          ar={<>تم التحديث في: <span className="text-white">04/04/2026</span></>}
          zh={<>更新日期: <span className="text-white">04/04/2026</span></>}
          de={<>Aktualisiert am: <span className="text-white">04/04/2026</span></>}
          ja={<>更新日: <span className="text-white">04/04/2026</span></>}
          ru={<>Обновлено: <span className="text-white">04/04/2026</span></>}
          pt={<>Atualizado em: <span className="text-white">04/04/2026</span></>}
        />
      }
      icon={ShieldCheck}
    >
      {/* 1. Introduction and Applicability */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Introduction and Applicability</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">परिचय और प्रयोज्यता (Introduction & Applicability)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">ভূমিকা এবং প্রযোজ্যতা</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Introducción y Aplicabilidad</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Introduction et Applicabilité</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">المقدمة وقابلية التطبيق</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">简介与适用性</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Einleitung und Anwendbarkeit</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">はじめにと適用範囲</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Введение и применимость</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Introdução e Aplicabilidade</h2>}
        />
        <TranslateBlock 
          en={<p>Welcome to ULMiND. We understand that your privacy is of utmost importance, and we are committed to safeguarding the personal information you share with us. This Privacy Policy outlines how ULMiND ("we," "our," or "us") collects, uses, protects, and discloses your information when you visit our website, use our services, or engage with us for web development, mobile app development, AI/ML solutions, and other digital services.</p>}
          hi={<p>ULMiND में आपका स्वागत है। हम समझते हैं कि आपकी गोपनीयता अत्यंत महत्वपूर्ण है, और हम आपके द्वारा हमारे साथ साझा की जाने वाली व्यक्तिगत जानकारी की सुरक्षा के लिए दृढ़ता से प्रतिबद्ध हैं। यह गोपनीयता नीति विस्तृत रूप से यह स्पष्ट करती है कि जब आप हमारी वेबसाइट पर जाते हैं, हमारी सेवाओं का उपयोग करते हैं, या वेब और मोबाइल ऐप डेवलपमेंट, AI/ML समाधानों और अन्य डिजिटल सेवाओं के लिए हमसे जुड़ते हैं, तो ULMiND आपकी जानकारी कैसे एकत्र, उपयोग, सुरक्षित और प्रकट करता है।</p>}
          bn={<p>ULMiND-এ আপনাকে স্বাগত। আমরা অনুধাবন করি যে আপনার গোপনীয়তা অত্যন্ত গুরুত্বপূর্ণ, এবং আপনি আমাদের সাথে যে ব্যক্তিগত তথ্য আদান-প্রদান করেন তার সুরক্ষায় আমরা দৃঢ়ভাবে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতিটিতে বিশদভাবে বর্ণনা করা হয়েছে যে, যখন আপনি আমাদের ওয়েবসাইট পরিদর্শন করেন, আমাদের পরিষেবাগুলি গ্রহণ করেন, বা ওয়েব ডেভেলপমেন্ট, মোবাইল অ্যাপ ডেভেলপমেন্ট, AI/ML সলিউশন এবং অন্যান্য ডিজিটাল পরিষেবাগুলির জন্য আমাদের সাথে যুক্ত হন, তখন ULMiND কীভাবে আপনার তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ এবং প্রকাশ করে।</p>}
          es={<p>Bienvenido a ULMiND. Entendemos que su privacidad es de suma importancia y estamos comprometidos a salvaguardar la información personal que comparte con nosotros. Esta Política de Privacidad describe cómo ULMiND recopila, utiliza, protege y divulga su información al visitar nuestro sitio web o utilizar nuestros servicios.</p>}
          fr={<p>Bienvenue chez ULMiND. Nous comprenons que votre confidentialité est de la plus haute importance. Cette politique de confidentialité décrit comment ULMiND collecte, utilise, protège et divulgue vos informations.</p>}
          ar={<p>مرحبًا بك في ULMiND. نحن ندرك أن خصوصيتك في غاية الأهمية، ونحن ملتزمون بحماية المعلومات الشخصية التي تشاركها معنا. توضح سياسة الخصوصية هذه كيف تقوم ULMiND بجمع واستخدام وحماية والكشف عن معلوماتك.</p>}
          zh={<p>欢迎来到 ULMiND。我们深知您的隐私至关重要，并致力于保护您与我们共享的个人信息。本隐私政策概述了当您访问我们的网站或使用我们的服务时，ULMiND 如何收集、使用、保护和披露您的信息。</p>}
          de={<p>Willkommen bei ULMiND. Wir verstehen, dass Ihre Privatsphäre von größter Bedeutung ist, und verpflichten uns, die persönlichen Daten zu schützen, die Sie mit uns teilen. Diese Datenschutzerklärung beschreibt, wie ULMiND Ihre Daten erfasst, verwendet, schützt und weitergibt.</p>}
          ja={<p>ULMiNDへようこそ。当社は、お客様のプライバシーが極めて重要であることを理解し、お客様が当社と共有する個人情報の保護に努めています。本プライバシーポリシーは、ULMiNDがお客様の情報をどのように収集、利用、保護、開示するかについて概説しています。</p>}
          ru={<p>Добро пожаловать в ULMiND. Мы понимаем, что ваша конфиденциальность имеет первостепенное значение, и стремимся защищать личную информацию, которой вы с нами делитесь. В этой Политике конфиденциальности описывается, как ULMiND собирает, использует, защищает и раскрывает вашу информацию.</p>}
          pt={<p>Bem-vindo à ULMiND. Entendemos que a sua privacidade é de extrema importância e estamos comprometidos em proteger as informações pessoais que você compartilha conosco. Esta Política de Privacidade descreve como a ULMiND coleta, usa, protege e divulga suas informações.</p>}
        />
        <TranslateBlock 
          en={<p>By accessing our website or utilizing our services, you consent to the data practices described in this policy.</p>}
          hi={<p>हमारी वेबसाइट का उपयोग करने या हमारी सेवाओं तक पहुँच प्राप्त करने के साथ, आप इस नीति में वर्णित डेटा प्रथाओं के प्रति अपनी सहमति व्यक्त करते हैं।</p>}
          bn={<p>আমাদের ওয়েবসাইট অ্যাক্সেস বা পরিষেবাগুলি ব্যবহার করার মাধ্যমে, আপনি এই নীতিতে বর্ণিত ডেটা অনুশীলনগুলির প্রতি আপনার আইনি সম্মতি জ্ঞাপন করছেন।</p>}
          es={<p>Al acceder a nuestro sitio web o utilizar nuestros servicios, usted acepta las prácticas de datos descritas en esta política.</p>}
          fr={<p>En accédant à notre site Web ou en utilisant nos services, vous consentez aux pratiques de données décrites dans cette politique.</p>}
          ar={<p>من خلال الوصول إلى موقعنا الإلكتروني أو الاستفادة من خدماتنا، فإنك توافق على ممارسات البيانات الموضحة في هذه السياسة.</p>}
          zh={<p>通过访问我们的网站或使用我们的服务，即表示您同意本政策中描述的数据处理做法。</p>}
          de={<p>Durch den Zugriff auf unsere Website oder die Nutzung unserer Dienste stimmen Sie den in dieser Richtlinie beschriebenen Datenpraktiken zu.</p>}
          ja={<p>当社のウェブサイトにアクセスするか、当社のサービスを利用することにより、お客様は本ポリシーに記載されているデータ慣行に同意したものとみなされます。</p>}
          ru={<p>Получая доступ к нашему веб-сайту или используя наши услуги, вы соглашаетесь с методами обработки данных, описанными в этой политике.</p>}
          pt={<p>Ao acessar nosso site ou utilizar nossos serviços, você concorda com as práticas de dados descritas nesta política.</p>}
        />
      </div>

      {/* 2. Information We Collect */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">हमारे द्वारा एकत्रित की जाने वाली जानकारी</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">আমরা যে সকল তথ্য সংগ্রহ করি</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Información Que Recopilamos</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Informations Que Nous Collectons</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">المعلومات التي نجمعها</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">我们收集的信息</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Informationen, die wir sammeln</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">収集する情報</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Информация, которую мы собираем</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Informações que Coletamos</h2>}
        />
        <TranslateBlock 
          en={<p>We collect both Personal and Non-Personal Information to provide you with the best possible service.</p>}
          hi={<p>आपको सर्वोत्तम संभव सेवा प्रदान करने के उद्देश्य से हम व्यक्तिगत और गैर-व्यक्तिगत दोनों प्रकार की जानकारी एकत्र करते हैं।</p>}
          bn={<p>আপনাকে সর্বোত্তম সম্ভাব্য পরিষেবা প্রদানের উদ্দেশ্যে আমরা ব্যক্তিগত এবং অ-ব্যক্তিগত উভয় প্রকার তথ্যই সংগ্রহ করে থাকি।</p>}
          es={<p>Recopilamos información personal y no personal para brindarle el mejor servicio posible.</p>}
          fr={<p>Nous collectons des informations personnelles et non personnelles pour vous fournir le meilleur service possible.</p>}
          ar={<p>نحن نجمع كلاً من المعلومات الشخصية وغير الشخصية لتزويدك بأفضل خدمة ممكنة.</p>}
          zh={<p>我们收集个人和非个人信息，以便为您提供最佳服务。</p>}
          de={<p>Wir sammeln sowohl persönliche als auch nicht-persönliche Informationen, um Ihnen den bestmöglichen Service zu bieten.</p>}
          ja={<p>お客様に最適なサービスを提供するために、個人情報および非個人情報の両方を収集します。</p>}
          ru={<p>Мы собираем как личную, так и неличную информацию, чтобы предоставить вам наилучший сервис.</p>}
          pt={<p>Coletamos informações pessoais e não pessoais para fornecer o melhor serviço possível.</p>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Personal Information:</strong> When you contact us for a project, request a quote, or subscribe to our newsletter, we may collect personally identifiable information such as your name, email address, phone number, company name, and project requirements.</>}
              hi={<><strong className="text-foreground font-semibold">व्यक्तिगत जानकारी:</strong> जब आप किसी परियोजना के लिए हमसे संपर्क करते हैं, कोई कोटेशन (quote) मांगते हैं, या हमारे न्यूज़लेटर की सदस्यता लेते हैं, तो हम आपका नाम, ईमेल पता, फोन नंबर, कंपनी का नाम और परियोजना की आवश्यकताओं जैसी व्यक्तिगत रूप से पहचान योग्य जानकारी एकत्र कर सकते हैं।</>}
              bn={<><strong className="text-foreground font-semibold">ব্যক্তিগত তথ্য:</strong> আপনি যখন কোনো প্রকল্পের বিষয়ে আমাদের সাথে যোগাযোগ করেন, কোনো কোটেশনের অনুরোধ করেন, অথবা আমাদের নিউজলেটার সাবস্ক্রাইব করেন, তখন আমরা আপনার নাম, ইমেল ঠিকানা, ফোন নম্বর, কোম্পানির নাম এবং প্রকল্পের প্রয়োজনীয়তার মতো ব্যক্তিগতভাবে শনাক্তযোগ্য তথ্য সংগ্রহ করতে পারি।</>}
              es={<><strong className="text-foreground font-semibold">Información Personal:</strong> Cuando se comunica con nosotros para un proyecto, podemos recopilar información de identificación personal como su nombre y correo electrónico.</>}
              fr={<><strong className="text-foreground font-semibold">Informations Personnelles :</strong> Lorsque vous nous contactez, nous pouvons collecter des informations telles que votre nom et votre adresse e-mail.</>}
              ar={<><strong className="text-foreground font-semibold">معلومات شخصية:</strong> عندما تتصل بنا بخصوص مشروع، قد نجمع معلومات تعريف شخصية مثل اسمك وعنوان بريدك الإلكتروني.</>}
              zh={<><strong className="text-foreground font-semibold">个人信息：</strong> 当您与我们联系时，我们可能会收集您的姓名和电子邮件地址等个人身份信息。</>}
              de={<><strong className="text-foreground font-semibold">Persönliche Informationen:</strong> Wenn Sie uns kontaktieren, können wir persönlich identifizierbare Informationen wie Ihren Namen und Ihre E-Mail-Adresse erfassen.</>}
              ja={<><strong className="text-foreground font-semibold">個人情報：</strong> プロジェクトについてお問い合わせいただく際、氏名やメールアドレスなどの個人を特定できる情報を収集する場合があります。</>}
              ru={<><strong className="text-foreground font-semibold">Личная информация:</strong> При обращении к нам мы можем собирать личную информацию, такую как ваше имя и адрес электронной почты.</>}
              pt={<><strong className="text-foreground font-semibold">Informações Pessoais:</strong> Quando você entra em contato conosco, podemos coletar informações de identificação pessoal, como seu nome e endereço de e-mail.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Automatically Collected Information:</strong> When you visit our website, our servers automatically record information that your browser sends. This may include your IP address, browser type, device information, operating system, and the pages of our website that you visit.</>}
              hi={<><strong className="text-foreground font-semibold">स्वचालित रूप से एकत्रित जानकारी:</strong> जब आप हमारी वेबसाइट पर जाते हैं, तो हमारे सर्वर स्वचालित रूप से वह जानकारी रिकॉर्ड करते हैं जो आपका ब्राउज़र भेजता है। इसमें आपका आईपी पता, ब्राउज़र का प्रकार, डिवाइस की जानकारी, ऑपरेटिंग सिस्टम और हमारी वेबसाइट के वे पृष्ठ शामिल हो सकते हैं जिन्हें आप देखते हैं।</>}
              bn={<><strong className="text-foreground font-semibold">স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য:</strong> আপনি যখন আমাদের ওয়েবসাইট পরিদর্শন করেন, তখন আপনার ব্রাউজার কর্তৃক প্রেরিত তথ্য আমাদের সার্ভার স্বয়ংক্রিয়ভাবে রেকর্ড করে। এর মধ্যে আপনার আইপি অ্যাড্রেস, ব্রাউজারের ধরন, ডিভাইসের তথ্য, অপারেটিং সিস্টেম এবং আমাদের ওয়েবসাইটে আপনার পরিদর্শনকৃত পৃষ্ঠাগুলির তথ্য অন্তর্ভুক্ত থাকতে পারে।</>}
              es={<><strong className="text-foreground font-semibold">Información Recopilada Automáticamente:</strong> Cuando visita nuestro sitio web, nuestros servidores registran automáticamente la información que envía su navegador.</>}
              fr={<><strong className="text-foreground font-semibold">Informations Collectées Automatiquement :</strong> Lors de votre visite sur notre site, nos serveurs enregistrent automatiquement les informations envoyées par votre navigateur.</>}
              ar={<><strong className="text-foreground font-semibold">المعلومات التي يتم جمعها تلقائيًا:</strong> عندما تزور موقعنا، تسجل خوادمنا تلقائيًا المعلومات التي يرسلها متصفحك.</>}
              zh={<><strong className="text-foreground font-semibold">自动收集的信息：</strong> 当您访问我们的网站时，我们的服务器会自动记录您的浏览器发送的信息。</>}
              de={<><strong className="text-foreground font-semibold">Automatisch erfasste Informationen:</strong> Wenn Sie unsere Website besuchen, zeichnen unsere Server automatisch Informationen auf, die Ihr Browser sendet.</>}
              ja={<><strong className="text-foreground font-semibold">自動的に収集される情報：</strong> 当社のウェブサイトにアクセスすると、サーバーはブラウザが送信する情報を自動的に記録します。</>}
              ru={<><strong className="text-foreground font-semibold">Автоматически собираемая информация:</strong> Когда вы посещаете наш веб-сайт, наши серверы автоматически записывают информацию, которую отправляет ваш браузер.</>}
              pt={<><strong className="text-foreground font-semibold">Informações Coletadas Automaticamente:</strong> Ao visitar nosso site, nossos servidores registram automaticamente as informações que seu navegador envia.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Cookies and Tracking:</strong> We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. (For more details, please refer to our Cookie Policy).</>}
              hi={<><strong className="text-foreground font-semibold">कुकीज़ और ट्रैकिंग:</strong> आपके ब्राउज़िंग अनुभव को बेहतर बनाने, साइट ट्रैफ़िक का विश्लेषण करने और सामग्री को अनुकूलित करने के लिए हम कुकीज़ का उपयोग करते हैं। (अधिक जानकारी के लिए, कृपया हमारी कुकी नीति देखें)।</>}
              bn={<><strong className="text-foreground font-semibold">কুকিজ এবং ট্র্যাকিং:</strong> আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, ওয়েবসাইটের ট্র্যাফিক বিশ্লেষণ করতে এবং কনটেন্ট কাস্টমাইজ করতে আমরা কুকিজ ব্যবহার করি। (অধিক তথ্যের জন্য, অনুগ্রহ করে আমাদের কুকি নীতি পড়ুন)।</>}
              es={<><strong className="text-foreground font-semibold">Cookies y Seguimiento:</strong> Utilizamos cookies para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido.</>}
              fr={<><strong className="text-foreground font-semibold">Cookies et Suivi :</strong> Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic du site.</>}
              ar={<><strong className="text-foreground font-semibold">ملفات تعريف الارتباط والتتبع:</strong> نحن نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح الخاصة بك وتحليل حركة مرور الموقع.</>}
              zh={<><strong className="text-foreground font-semibold">Cookie 和跟踪：</strong> 我们使用 Cookie 来增强您的浏览体验并分析网站流量。</>}
              de={<><strong className="text-foreground font-semibold">Cookies und Tracking:</strong> Wir verwenden Cookies, um Ihr Surferlebnis zu verbessern und den Website-Traffic zu analysieren.</>}
              ja={<><strong className="text-foreground font-semibold">クッキーとトラッキング：</strong> ブラウジング体験を向上させ、サイトのトラフィックを分析するためにクッキーを使用します。</>}
              ru={<><strong className="text-foreground font-semibold">Файлы cookie и отслеживание:</strong> Мы используем файлы cookie для улучшения вашего опыта просмотра и анализа посещаемости сайта.</>}
              pt={<><strong className="text-foreground font-semibold">Cookies e Rastreamento:</strong> Utilizamos cookies para aprimorar sua experiência de navegação e analisar o tráfego do site.</>}
            />
          </li>
        </ul>
      </div>

      {/* 3. How We Use Your Information */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">हम आपकी जानकारी का उपयोग कैसे करते हैं</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">আপনার তথ্যের ব্যবহার প্রক্রিয়া</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Cómo Utilizamos Su Información</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Comment Nous Utilisons Vos Informations</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">كيف نستخدم معلوماتك</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">我们如何使用您的信息</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Wie wir Ihre Informationen verwenden</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">情報の利用目的</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Как мы используем вашу информацию</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Como Usamos Suas Informações</h2>}
        />
        <TranslateBlock 
          en={<p>ULMiND uses the collected data for various professional purposes, including:</p>}
          hi={<p>ULMiND एकत्रित किए गए डेटा का उपयोग विभिन्न व्यावसायिक उद्देश्यों के लिए करता है, जिनमें शामिल हैं:</p>}
          bn={<p>ULMiND সংগৃহীত ডেটা বিভিন্ন পেশাদার উদ্দেশ্যে ব্যবহার করে, যার মধ্যে রয়েছে:</p>}
          es={<p>ULMiND utiliza los datos recopilados para varios propósitos profesionales, que incluyen:</p>}
          fr={<p>ULMiND utilise les données collectées à diverses fins professionnelles, notamment :</p>}
          ar={<p>تستخدم ULMiND البيانات التي تم جمعها لأغراض مهنية مختلفة، بما في ذلك:</p>}
          zh={<p>ULMiND 将收集的数据用于各种专业目的，包括：</p>}
          de={<p>ULMiND verwendet die gesammelten Daten für verschiedene professionelle Zwecke, einschließlich:</p>}
          ja={<p>ULMiNDは、収集したデータを以下の様々な専門的目的のために使用します：</p>}
          ru={<p>ULMiND использует собранные данные для различных профессиональных целей, включая:</p>}
          pt={<p>A ULMiND utiliza os dados coletados para vários fins profissionais, incluindo:</p>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Providing Services:</strong> To deliver the software, web, or AI development services you have requested, including drafting proposals, service agreements, and invoices.</>}
              hi={<><strong className="text-foreground font-semibold">सेवाएं प्रदान करना:</strong> आपके द्वारा अनुरोधित सॉफ़्टवेयर, वेब या एआई विकास सेवाएं प्रदान करने के लिए, जिसमें प्रस्ताव, सेवा समझौते और चालान (इनवॉइस) तैयार करना शामिल है।</>}
              bn={<><strong className="text-foreground font-semibold">পরিষেবা প্রদান:</strong> খসড়া প্রস্তাবনা, পরিষেবা চুক্তি এবং ইনভয়েস প্রস্তুতকরণ সহ আপনার অনুরোধকৃত সফ্টওয়্যার, ওয়েব, বা এআই ডেভেলপমেন্ট পরিষেবাগুলি প্রদান করার জন্য।</>}
              es={<><strong className="text-foreground font-semibold">Prestación de Servicios:</strong> Para entregar los servicios solicitados de desarrollo web, de software o de IA.</>}
              fr={<><strong className="text-foreground font-semibold">Fourniture de Services :</strong> Pour fournir les services de développement logiciel, web ou IA que vous avez demandés.</>}
              ar={<><strong className="text-foreground font-semibold">تقديم الخدمات:</strong> لتقديم خدمات تطوير البرامج أو الويب أو الذكاء الاصطناعي التي طلبتها.</>}
              zh={<><strong className="text-foreground font-semibold">提供服务：</strong> 提供您请求的软件、Web或AI开发服务。</>}
              de={<><strong className="text-foreground font-semibold">Erbringung von Dienstleistungen:</strong> Um die von Ihnen angeforderten Software-, Web- oder KI-Entwicklungsdienste bereitzustellen.</>}
              ja={<><strong className="text-foreground font-semibold">サービスの提供：</strong> ご依頼いただいたソフトウェア、Web、またはAI開発サービスを提供するため。</>}
              ru={<><strong className="text-foreground font-semibold">Предоставление услуг:</strong> Для предоставления запрошенных вами услуг по разработке программного обеспечения, веб-сайтов или ИИ.</>}
              pt={<><strong className="text-foreground font-semibold">Prestação de Serviços:</strong> Para fornecer os serviços de desenvolvimento de software, web ou IA que você solicitou.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Communication:</strong> To respond to your inquiries, provide customer support, and send important updates regarding your ongoing projects.</>}
              hi={<><strong className="text-foreground font-semibold">संचार:</strong> आपकी पूछताछ का उत्तर देने, ग्राहक सहायता प्रदान करने और आपकी चल रही परियोजनाओं के संबंध में महत्वपूर्ण अपडेट भेजने के लिए।</>}
              bn={<><strong className="text-foreground font-semibold">যোগাযোগ:</strong> আপনার জিজ্ঞাসার উত্তর প্রদান করতে, গ্রাহক সহায়তা নিশ্চিত করতে এবং আপনার চলমান প্রকল্প সম্পর্কিত গুরুত্বপূর্ণ আপডেটগুলি প্রেরণ করতে।</>}
              es={<><strong className="text-foreground font-semibold">Comunicación:</strong> Para responder a sus consultas, brindar atención al cliente y enviar actualizaciones importantes.</>}
              fr={<><strong className="text-foreground font-semibold">Communication :</strong> Pour répondre à vos demandes, fournir un support client et envoyer des mises à jour importantes.</>}
              ar={<><strong className="text-foreground font-semibold">التواصل:</strong> للرد على استفساراتك وتقديم دعم العملاء وإرسال التحديثات المهمة.</>}
              zh={<><strong className="text-foreground font-semibold">沟通：</strong> 响应您的询问，提供客户支持，并发送有关您正在进行的项目的重要更新。</>}
              de={<><strong className="text-foreground font-semibold">Kommunikation:</strong> Um auf Ihre Anfragen zu antworten, Kundensupport zu bieten und wichtige Updates zu senden.</>}
              ja={<><strong className="text-foreground font-semibold">コミュニケーション：</strong> お問い合わせへの対応、カスタマーサポートの提供、重要な更新の送信のため。</>}
              ru={<><strong className="text-foreground font-semibold">Связь:</strong> Для ответов на ваши запросы, предоставления поддержки клиентам и отправки важных обновлений.</>}
              pt={<><strong className="text-foreground font-semibold">Comunicação:</strong> Para responder às suas perguntas, fornecer suporte ao cliente e enviar atualizações importantes.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Improvement:</strong> To analyze website usage and user feedback, helping us improve our UI/UX, service offerings, and overall digital presence.</>}
              hi={<><strong className="text-foreground font-semibold">उन्नयन:</strong> वेबसाइट के उपयोग और उपयोगकर्ता की प्रतिक्रिया का विश्लेषण करने के लिए, जो हमारे UI/UX, सेवाओं और समग्र डिजिटल उपस्थिति को बेहतर बनाने में हमारी सहायता करता है।</>}
              bn={<><strong className="text-foreground font-semibold">উন্নয়ন সাধন:</strong> ওয়েবসাইটের ব্যবহার এবং ব্যবহারকারীর প্রতিক্রিয়া বিশ্লেষণের মাধ্যমে আমাদের UI/UX, পরিষেবা প্রদান এবং সামগ্রিক ডিজিটাল উপস্থিতি উন্নত করতে।</>}
              es={<><strong className="text-foreground font-semibold">Mejora:</strong> Para analizar el uso del sitio web y los comentarios de los usuarios, ayudándonos a mejorar nuestros servicios.</>}
              fr={<><strong className="text-foreground font-semibold">Amélioration :</strong> Pour analyser l'utilisation du site et les commentaires des utilisateurs afin d'améliorer nos services.</>}
              ar={<><strong className="text-foreground font-semibold">التحسين:</strong> لتحليل استخدام الموقع وتعليقات المستخدمين لمساعدتنا في تحسين خدماتنا.</>}
              zh={<><strong className="text-foreground font-semibold">改进：</strong> 分析网站使用情况和用户反馈，帮助我们改善 UI/UX 和服务提供。</>}
              de={<><strong className="text-foreground font-semibold">Verbesserung:</strong> Zur Analyse der Website-Nutzung und des Benutzer-Feedbacks, um unsere Dienstleistungen zu verbessern.</>}
              ja={<><strong className="text-foreground font-semibold">改善：</strong> 当社のUI/UX、サービス提供、および全体的なデジタルプレゼンスを向上させるための分析のため。</>}
              ru={<><strong className="text-foreground font-semibold">Улучшение:</strong> Для анализа использования веб-сайта и отзывов пользователей, чтобы улучшить наши услуги.</>}
              pt={<><strong className="text-foreground font-semibold">Melhoria:</strong> Para analisar o uso do site e o feedback do usuário, ajudando-nos a melhorar nossos serviços.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Marketing:</strong> To send you promotional materials, newsletters, and updates about ULMiND (only if you have opted in to receive them).</>}
              hi={<><strong className="text-foreground font-semibold">विपणन (Marketing):</strong> आपको प्रचार सामग्री, न्यूज़लेटर और ULMiND के बारे में अपडेट भेजने के लिए (केवल तभी जब आपने उन्हें प्राप्त करने की सहमति दी हो)।</>}
              bn={<><strong className="text-foreground font-semibold">মার্কেটিং:</strong> আপনাকে প্রচারমূলক সামগ্রী, নিউজলেটার এবং ULMiND সম্পর্কিত আপডেটগুলি প্রেরণ করতে (শুধুমাত্র যদি আপনি সেগুলো গ্রহণের সম্মতি প্রদান করে থাকেন)।</>}
              es={<><strong className="text-foreground font-semibold">Marketing:</strong> Para enviarle materiales promocionales y actualizaciones (solo si ha optado por recibirlos).</>}
              fr={<><strong className="text-foreground font-semibold">Marketing :</strong> Pour vous envoyer des offres promotionnelles (uniquement si vous avez accepté de les recevoir).</>}
              ar={<><strong className="text-foreground font-semibold">التسويق:</strong> لإرسال مواد ترويجية ورسائل إخبارية وتحديثات (فقط إذا وافقت على ذلك).</>}
              zh={<><strong className="text-foreground font-semibold">市场营销：</strong> 向您发送促销材料和时事通讯（仅当您选择接收时）。</>}
              de={<><strong className="text-foreground font-semibold">Marketing:</strong> Um Ihnen Werbematerialien und Newsletter zu senden (nur wenn Sie zugestimmt haben).</>}
              ja={<><strong className="text-foreground font-semibold">マーケティング：</strong> プロモーション資料やニュースレターを送信するため（同意した場合のみ）。</>}
              ru={<><strong className="text-foreground font-semibold">Маркетинг:</strong> Для отправки вам рекламных материалов и информационных бюллетеней (только если вы согласились).</>}
              pt={<><strong className="text-foreground font-semibold">Marketing:</strong> Para enviar materiais promocionais e boletins informativos (apenas se você tiver optado por recebê-los).</>}
            />
          </li>
        </ul>
      </div>

      {/* 4. Data Sharing and Disclosure */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Data Sharing and Disclosure</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">डेटा साझाकरण और प्रकटीकरण</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">ডেটা আদান-প্রদান এবং প্রকাশ</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Intercambio y Divulgación de Datos</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Partage et Divulgation des Données</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">مشاركة البيانات والإفصاح عنها</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">数据共享与披露</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Datenweitergabe und -offenlegung</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">データの共有と開示</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Обмен и раскрытие данных</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Compartilhamento e Divulgação de Dados</h2>}
        />
        <TranslateBlock 
          en={<p>We treat your data with strict confidentiality. We do not sell, trade, or rent your Personal Information to third parties. We may share your information only under the following circumstances:</p>}
          hi={<p>हम आपके डेटा को अत्यंत गोपनीयता के साथ सुरक्षित रखते हैं। हम आपकी व्यक्तिगत जानकारी को किसी तीसरे पक्ष को बेचते, व्यापार या किराए पर नहीं देते हैं। हम आपकी जानकारी केवल निम्नलिखित परिस्थितियों में साझा कर सकते हैं:</p>}
          bn={<p>আমরা আপনার ডেটাকে কঠোর গোপনীয়তার সাথে সংরক্ষণ করি। আমরা কোনো তৃতীয় পক্ষের নিকট আপনার ব্যক্তিগত তথ্য বিক্রয়, লেনদেন বা ভাড়া প্রদান করি না। শুধুমাত্র নিম্নোক্ত পরিস্থিতি সাপেক্ষে আমরা আপনার তথ্য শেয়ার করতে পারি:</p>}
          es={<p>Tratamos sus datos con estricta confidencialidad. No vendemos, intercambiamos ni alquilamos su Información Personal a terceros. Solo podemos compartir su información bajo las siguientes circunstancias:</p>}
          fr={<p>Nous traitons vos données avec une stricte confidentialité. Nous ne vendons pas vos informations personnelles. Nous ne pouvons partager vos informations que dans les circonstances suivantes :</p>}
          ar={<p>نتعامل مع بياناتك بسرية تامة. نحن لا نبيع أو نتاجر أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في ظل الظروف التالية:</p>}
          zh={<p>我们对您的数据严格保密。我们绝不向第三方出售、交易或出租您的个人信息。我们仅在以下情况下共享您的信息：</p>}
          de={<p>Wir behandeln Ihre Daten streng vertraulich. Wir verkaufen, tauschen oder vermieten Ihre persönlichen Daten nicht an Dritte. Wir können Ihre Informationen nur unter folgenden Umständen weitergeben:</p>}
          ja={<p>当社は、お客様のデータを厳格な機密性をもって取り扱います。お客様の個人情報を第三者に販売、交換、または貸与することはありません。以下の状況においてのみ、情報を共有する場合があります：</p>}
          ru={<p>Мы относимся к вашим данным со строгой конфиденциальностью. Мы не продаем, не обмениваем и не сдаем в аренду вашу личную информацию третьим лицам. Мы можем делиться вашей информацией только при следующих обстоятельствах:</p>}
          pt={<p>Tratamos seus dados com estricta confidencialidade. Não vendemos, trocamos ou alugamos suas informações pessoais a terceiros. Só podemos compartilhar suas informações nas seguintes circunstâncias:</p>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Trusted Service Providers:</strong> We may share data with third-party vendors who assist us in operating our website, conducting our business, or servicing you (e.g., cloud hosting providers, payment gateways), provided they agree to keep this information confidential.</>}
              hi={<><strong className="text-foreground font-semibold">विश्वसनीय सेवा प्रदाता:</strong> हम उन तीसरे पक्ष के विक्रेताओं के साथ डेटा साझा कर सकते हैं जो हमारी वेबसाइट संचालित करने, हमारा व्यवसाय चलाने या आपको सेवा देने में हमारी सहायता करते हैं (जैसे, क्लाउड होस्टिंग प्रदाता, भुगतान गेटवे), बशर्ते वे इस जानकारी को गोपनीय रखने के लिए कानूनी रूप से बाध्य हों।</>}
              bn={<><strong className="text-foreground font-semibold">বিশ্বস্ত পরিষেবা প্রদানকারী:</strong> আমাদের ওয়েবসাইট পরিচালনা করতে, আমাদের ব্যবসায়িক কার্যক্রম পরিচালনা করতে বা আপনাকে পরিষেবা প্রদান করতে সহায়তাকারী তৃতীয় পক্ষের বিক্রেতাদের (যেমন, ক্লাউড হোস্টিং প্রোভাইডার, পেমেন্ট গেটওয়ে) সাথে আমরা ডেটা শেয়ার করতে পারি, এই শর্তে যে তারা এই তথ্য গোপন রাখতে আইনত বাধ্য থাকবেন।</>}
              es={<><strong className="text-foreground font-semibold">Proveedores de Servicios Confiables:</strong> Podemos compartir datos con proveedores externos que nos ayudan a operar nuestro negocio.</>}
              fr={<><strong className="text-foreground font-semibold">Prestataires de Services de Confiance :</strong> Nous pouvons partager des données avec des fournisseurs tiers qui nous aident à exploiter notre entreprise.</>}
              ar={<><strong className="text-foreground font-semibold">مقدمو الخدمات الموثوق بهم:</strong> قد نشارك البيانات مع البائعين الخارجيين الذين يساعدوننا في تشغيل أعمالنا.</>}
              zh={<><strong className="text-foreground font-semibold">受信任的服务提供商：</strong> 我们可能会与协助我们运营网站、开展业务或为您提供服务的第三方供应商共享数据。</>}
              de={<><strong className="text-foreground font-semibold">Vertrauenswürdige Dienstleister:</strong> Wir können Daten mit Drittanbietern teilen, die uns beim Betrieb unseres Geschäfts unterstützen.</>}
              ja={<><strong className="text-foreground font-semibold">信頼できるサービスプロバイダー：</strong> 当社のウェブサイトの運営や事業の実施を支援する第三者ベンダーとデータを共有する場合があります。</>}
              ru={<><strong className="text-foreground font-semibold">Надежные поставщики услуг:</strong> Мы можем делиться данными со сторонними поставщиками, которые помогают нам в ведении бизнеса.</>}
              pt={<><strong className="text-foreground font-semibold">Provedores de Serviços Confiáveis:</strong> Podemos compartilhar dados com fornecedores terceirizados que nos auxiliam na operação de nossos negócios.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).</>}
              hi={<><strong className="text-foreground font-semibold">कानूनी आवश्यकताएं:</strong> यदि कानून द्वारा ऐसा करना अनिवार्य है या सार्वजनिक अधिकारियों (जैसे, अदालत या सरकारी एजेंसी) के वैध अनुरोधों के जवाब में हम आपकी जानकारी का प्रकटीकरण कर सकते हैं।</>}
              bn={<><strong className="text-foreground font-semibold">আইনগত বাধ্যবাধকতা:</strong> আইন দ্বারা নির্দেশিত হলে বা যথাযথ সরকারী কর্তৃপক্ষের (যেমন, আদালত বা নিয়ন্ত্রক সংস্থা) বৈধ অনুরোধের প্রেক্ষিতে আমরা আপনার তথ্য প্রকাশ করতে পারি।</>}
              es={<><strong className="text-foreground font-semibold">Requisitos Legales:</strong> Podemos divulgar su información si así lo exige la ley o autoridades públicas.</>}
              fr={<><strong className="text-foreground font-semibold">Exigences Légales :</strong> Nous pouvons divulguer vos informations si la loi l'exige.</>}
              ar={<><strong className="text-foreground font-semibold">المتطلبات القانونية:</strong> قد نكشف عن معلوماتك إذا كان ذلك مطلوبًا بموجب القانون.</>}
              zh={<><strong className="text-foreground font-semibold">法律要求：</strong> 如果法律要求或响应公共机构的有效请求，我们可能会披露您的信息。</>}
              de={<><strong className="text-foreground font-semibold">Gesetzliche Anforderungen:</strong> Wir können Ihre Informationen offenlegen, wenn dies gesetzlich vorgeschrieben ist.</>}
              ja={<><strong className="text-foreground font-semibold">法的要件：</strong> 法律により義務付けられている場合、情報を開示することがあります。</>}
              ru={<><strong className="text-foreground font-semibold">Юридические требования:</strong> Мы можем раскрыть вашу информацию, если этого требует закон.</>}
              pt={<><strong className="text-foreground font-semibold">Requisitos Legais:</strong> Podemos divulgar suas informações se exigido por lei.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your Personal Information may be transferred as a business asset.</>}
              hi={<><strong className="text-foreground font-semibold">व्यावसायिक हस्तांतरण:</strong> विलय (merger), अधिग्रहण, या संपत्ति की बिक्री की स्थिति में, आपकी व्यक्तिगत जानकारी को व्यावसायिक संपत्ति के रूप में स्थानांतरित किया जा सकता है।</>}
              bn={<><strong className="text-foreground font-semibold">ব্যবসায়িক রূপান্তর:</strong> একীভূতকরণ (Merger), অধিগ্রহণ বা সম্পদ হস্তান্তরের ক্ষেত্রে, আপনার ব্যক্তিগত তথ্য একটি ব্যবসায়িক সম্পদ হিসেবে পরিগণিত ও স্থানান্তরিত হতে পারে।</>}
              es={<><strong className="text-foreground font-semibold">Transferencias Comerciales:</strong> En caso de fusión o adquisición, su información puede ser transferida.</>}
              fr={<><strong className="text-foreground font-semibold">Transferts Commerciaux :</strong> En cas de fusion ou d'acquisition, vos informations peuvent être transférées.</>}
              ar={<><strong className="text-foreground font-semibold">عمليات النقل التجارية:</strong> في حالة الاندماج أو الاستحواذ، قد يتم نقل معلوماتك.</>}
              zh={<><strong className="text-foreground font-semibold">业务转让：</strong> 在合并、收购或资产出售的情况下，您的个人信息可能会作为业务资产被转让。</>}
              de={<><strong className="text-foreground font-semibold">Unternehmensübertragungen:</strong> Im Falle einer Fusion oder Übernahme können Ihre Daten übertragen werden.</>}
              ja={<><strong className="text-foreground font-semibold">事業譲渡：</strong> 合併、買収、または資産売却の際、個人情報が事業資産として譲渡される場合があります。</>}
              ru={<><strong className="text-foreground font-semibold">Передача бизнеса:</strong> В случае слияния или поглощения ваша информация может быть передана.</>}
              pt={<><strong className="text-foreground font-semibold">Transferências Comerciais:</strong> Em caso de fusão ou aquisição, suas informações podem ser transferidas.</>}
            />
          </li>
        </ul>
      </div>

      {/* 5. Data Security */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Data Security</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">डेटा सुरक्षा</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">ডেটা নিরাপত্তা</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Seguridad de Datos</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Sécurité des Données</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">أمن البيانات</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">数据安全</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Datensicherheit</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">データセキュリティ</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Безопасность данных</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Segurança de Dados</h2>}
        />
        <TranslateBlock 
          en={<p>ULMiND employs industry-standard security measures to protect your Personal Information from unauthorized access, alteration, disclosure, or destruction. While we strive to use commercially acceptable means to protect your personal data (including secure servers and encrypted communication), please understand that no method of transmission over the internet or method of electronic storage is 100% secure.</p>}
          hi={<p>ULMiND आपकी व्यक्तिगत जानकारी को अनधिकृत पहुँच, परिवर्तन, प्रकटीकरण या विनाश से बचाने के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करता है। यद्यपि हम आपके व्यक्तिगत डेटा की सुरक्षा के लिए व्यावसायिक रूप से स्वीकार्य साधनों (सुरक्षित सर्वर और एन्क्रिप्टेड संचार सहित) का उपयोग करने का प्रयास करते हैं, कृपया समझें कि इंटरनेट पर संचरण या इलेक्ट्रॉनिक भंडारण की कोई भी विधि 100% सुरक्षित नहीं है।</p>}
          bn={<p>অননুমোদিত অ্যাক্সেস, পরিবর্তন, প্রকাশ বা ধ্বংসের হাত থেকে আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে ULMiND ইন্ডাস্ট্রি-স্ট্যান্ডার্ড নিরাপত্তা ব্যবস্থা গ্রহণ করে। যদিও আপনার ব্যক্তিগত ডেটা সুরক্ষায় আমরা বাণিজ্যিকভাবে সর্বাধিক গ্রহণযোগ্য পদ্ধতিগুলো (যেমন সুরক্ষিত সার্ভার এবং এনক্রিপ্টেড কমিউনিকেশন) ব্যবহার করে থাকি, তথাপি অনুগ্রহ করে মনে রাখবেন যে ইন্টারনেটে ডেটা ট্রান্সমিশন বা ইলেকট্রনিক স্টোরেজের কোনো পদ্ধতিই ১০০% সুরক্ষিত নয়।</p>}
          es={<p>ULMiND emplea medidas de seguridad estándar de la industria para proteger su Información Personal del acceso no autorizado. Sin embargo, ningún método de transmisión por Internet es 100% seguro.</p>}
          fr={<p>ULMiND utilise des mesures de sécurité standard de l'industrie pour protéger vos informations. Cependant, aucune méthode de transmission sur Internet n'est sûre à 100 %.</p>}
          ar={<p>تستخدم ULMiND تدابير أمنية متوافقة مع معايير الصناعة لحماية معلوماتك. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت آمنة بنسبة 100٪.</p>}
          zh={<p>ULMiND 采用行业标准的安全措施来保护您的个人信息。然而，互联网上的传输方法或电子存储方法都无法保证 100% 的安全。</p>}
          de={<p>ULMiND wendet branchenübliche Sicherheitsmaßnahmen an, um Ihre Daten zu schützen. Es gibt jedoch keine Methode der Übertragung über das Internet, die zu 100 % sicher ist.</p>}
          ja={<p>ULMiNDは、業界標準のセキュリティ対策を講じて情報を保護します。ただし、インターネット上の送信方法で100%安全なものはありません。</p>}
          ru={<p>ULMiND применяет стандартные отраслевые меры безопасности для защиты вашей информации. Однако ни один метод передачи через Интернет не является безопасным на 100%.</p>}
          pt={<p>A ULMiND emprega medidas de segurança padrão da indústria para proteger suas informações. No entanto, nenhum método de transmissão pela Internet é 100% seguro.</p>}
        />
      </div>

      {/* 6. Data Retention */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Data Retention</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">डेटा प्रतिधारण (Data Retention)</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">ডেটা সংরক্ষণ (Data Retention)</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Retención de Datos</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Conservation des Données</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">الاحتفاظ بالبيانات</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">数据保留</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Vorratsdatenspeicherung</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">データの保持</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Хранение данных</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Retenção de Dados</h2>}
        />
        <TranslateBlock 
          en={<p>We will retain your Personal Information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>}
          hi={<p>हम आपकी व्यक्तिगत जानकारी को केवल तब तक ही बनाए रखेंगे जब तक कि इस गोपनीयता नीति में निर्धारित उद्देश्यों के लिए यह आवश्यक हो। हम अपने कानूनी दायित्वों का पालन करने, विवादों को सुलझाने और हमारे कानूनी समझौतों और नीतियों को लागू करने के लिए आवश्यक सीमा तक आपकी जानकारी को सुरक्षित और उपयोग में रखेंगे।</p>}
          bn={<p>এই গোপনীয়তা নীতিতে বর্ণিত উদ্দেশ্য সাধনের জন্য যতটুকু সময় প্রয়োজন, আমরা শুধুমাত্র ততদিনের জন্যই আপনার ব্যক্তিগত তথ্য সংরক্ষণ করব। আইনি বাধ্যবাধকতা পরিপালন, বিরোধ নিষ্পত্তি এবং আমাদের আইনি চুক্তি ও নীতিমালার প্রয়োগ নিশ্চিত করার স্বার্থে আমরা প্রয়োজনীয় সীমা পর্যন্ত আপনার তথ্য সংরক্ষণ ও ব্যবহার করব।</p>}
          es={<p>Conservaremos su Información Personal solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad.</p>}
          fr={<p>Nous conserverons vos informations personnelles uniquement le temps nécessaire aux fins énoncées dans la présente politique de confidentialité.</p>}
          ar={<p>سنحتفظ بمعلوماتك الشخصية فقط طالما كان ذلك ضروريًا للأغراض المنصوص عليها في سياسة الخصوصية هذه.</p>}
          zh={<p>我们仅在达到本隐私政策规定的目的所需的时间内保留您的个人信息。我们将保留和使用您的信息，以履行我们的法律义务。</p>}
          de={<p>Wir bewahren Ihre persönlichen Daten nur so lange auf, wie es für die in dieser Datenschutzrichtlinie dargelegten Zwecke erforderlich ist.</p>}
          ja={<p>本プライバシーポリシーに記載されている目的のために必要な期間のみ、個人情報を保持します。</p>}
          ru={<p>Мы будем хранить вашу личную информацию только до тех пор, пока это необходимо для целей, изложенных в настоящей Политике конфиденциальности.</p>}
          pt={<p>Reteremos suas Informações Pessoais apenas pelo tempo necessário para os fins estabelecidos nesta Política de Privacidade.</p>}
        />
      </div>

      {/* 7. Your Privacy Rights */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Your Privacy Rights</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">आपके गोपनीयता अधिकार</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">আপনার গোপনীয়তার অধিকার</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Sus Derechos de Privacidad</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Vos Droits de Confidentialité</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">حقوق الخصوصية الخاصة بك</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">您的隐私权</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Ihre Datenschutzrechte</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">プライバシーの権利</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Ваши права на конфиденциальность</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Seus Direitos de Privacidade</h2>}
        />
        <TranslateBlock 
          en={<p>Depending on your location, you may have the following rights regarding your personal data:</p>}
          hi={<p>आपके भौगोलिक स्थान के आधार पर, आपके व्यक्तिगत डेटा के संबंध में आपके पास निम्नलिखित अधिकार हो सकते हैं:</p>}
          bn={<p>আপনার ভৌগোলিক অবস্থানের ওপর ভিত্তি করে, ব্যক্তিগত ডেটা সম্পর্কে আপনার নিম্নলিখিত অধিকারগুলো প্রযোজ্য হতে পারে:</p>}
          es={<p>Dependiendo de su ubicación, puede tener los siguientes derechos con respecto a sus datos personales:</p>}
          fr={<p>Selon votre localisation, vous pouvez avoir les droits suivants concernant vos données personnelles :</p>}
          ar={<p>اعتمادًا على موقعك، قد تكون لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:</p>}
          zh={<p>根据您所在的位置，您对自己的个人数据可能拥有以下权利：</p>}
          de={<p>Abhängig von Ihrem Standort haben Sie möglicherweise folgende Rechte bezüglich Ihrer persönlichen Daten:</p>}
          ja={<p>お住まいの地域に応じて、お客様は個人データに関する以下の権利を有する場合があります：</p>}
          ru={<p>В зависимости от вашего местоположения вы можете иметь следующие права в отношении ваших личных данных:</p>}
          pt={<p>Dependendo da sua localização, você pode ter os seguintes direitos em relação aos seus dados pessoais:</p>}
        />
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Access and Update:</strong> You have the right to request access to the personal data we hold about you and to update or correct any inaccuracies.</>}
              hi={<><strong className="text-foreground font-semibold">पहुँच और अद्यतन:</strong> आपको हमारे पास मौजूद आपके व्यक्तिगत डेटा तक पहुँच का अनुरोध करने और किसी भी अशुद्धि को अपडेट या ठीक करने का पूर्ण अधिकार है।</>}
              bn={<><strong className="text-foreground font-semibold">অ্যাক্সেস এবং আপডেট:</strong> আপনার যে ব্যক্তিগত ডেটা আমাদের কাছে সংরক্ষিত আছে, তা অ্যাক্সেস করার এবং যেকোনো ভুল-ত্রুটি সংশোধন বা আপডেট করার অনুরোধ করার অধিকার আপনার রয়েছে।</>}
              es={<><strong className="text-foreground font-semibold">Acceso y Actualización:</strong> Tiene derecho a solicitar acceso a los datos personales que tenemos sobre usted.</>}
              fr={<><strong className="text-foreground font-semibold">Accès et Mise à jour :</strong> Vous avez le droit de demander l'accès à vos données personnelles.</>}
              ar={<><strong className="text-foreground font-semibold">الوصول والتحديث:</strong> يحق لك طلب الوصول إلى البيانات الشخصية التي نحتفظ بها عنك.</>}
              zh={<><strong className="text-foreground font-semibold">访问和更新：</strong> 您有权请求访问我们持有的有关您的个人数据，并更新或纠正任何不准确之处。</>}
              de={<><strong className="text-foreground font-semibold">Zugang und Aktualisierung:</strong> Sie haben das Recht, Zugang zu den persönlichen Daten zu verlangen, die wir über Sie speichern.</>}
              ja={<><strong className="text-foreground font-semibold">アクセスと更新：</strong> お客様は、当社が保有する個人データへのアクセス、更新、または修正を要求する権利を有します。</>}
              ru={<><strong className="text-foreground font-semibold">Доступ и обновление:</strong> Вы имеете право запросить доступ к личным данным, которые мы храним о вас.</>}
              pt={<><strong className="text-foreground font-semibold">Acesso e Atualização:</strong> Você tem o direito de solicitar acesso aos dados pessoais que mantemos sobre você.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Deletion:</strong> You can request that we delete your personal data, subject to certain legal exceptions.</>}
              hi={<><strong className="text-foreground font-semibold">विलोपन (Deletion):</strong> कुछ कानूनी अपवादों के अधीन, आप हमसे अपने व्यक्तिगत डेटा को हटाने का अनुरोध कर सकते हैं।</>}
              bn={<><strong className="text-foreground font-semibold">তথ্য অপসারণ (Deletion):</strong> নির্দিষ্ট কিছু আইনি ব্যতিক্রম সাপেক্ষে, আপনি আপনার সংরক্ষিত ব্যক্তিগত ডেটা মুছে ফেলার জন্য আমাদের নিকট অনুরোধ করতে পারেন।</>}
              es={<><strong className="text-foreground font-semibold">Eliminación:</strong> Puede solicitar que eliminemos sus datos personales.</>}
              fr={<><strong className="text-foreground font-semibold">Suppression :</strong> Vous pouvez demander que nous supprimions vos données personnelles.</>}
              ar={<><strong className="text-foreground font-semibold">الحذف:</strong> يمكنك أن تطلب منا حذف بياناتك الشخصية.</>}
              zh={<><strong className="text-foreground font-semibold">删除：</strong> 您可以请求我们删除您的个人数据（受某些法律例外情况的限制）。</>}
              de={<><strong className="text-foreground font-semibold">Löschung:</strong> Sie können verlangen, dass wir Ihre persönlichen Daten löschen.</>}
              ja={<><strong className="text-foreground font-semibold">削除：</strong> 特定の法的な例外を除き、個人データの削除を要求することができます。</>}
              ru={<><strong className="text-foreground font-semibold">Удаление:</strong> Вы можете запросить удаление ваших личных данных.</>}
              pt={<><strong className="text-foreground font-semibold">Exclusão:</strong> Você pode solicitar que excluamos seus dados pessoais.</>}
            />
          </li>
          <li>
            <TranslateBlock 
              en={<><strong className="text-foreground font-semibold">Opt-Out:</strong> You may opt out of receiving promotional communications from us by following the unsubscribe instructions included in those emails.</>}
              hi={<><strong className="text-foreground font-semibold">ऑप्ट-आउट:</strong> आप उन ईमेल में शामिल अनसब्सक्राइब (unsubscribe) निर्देशों का पालन करके हमसे प्रचार संचार प्राप्त करने से बाहर निकल सकते हैं।</>}
              bn={<><strong className="text-foreground font-semibold">অপ্ট-আউট:</strong> আমাদের ইমেলগুলোতে যুক্ত 'আনসাবস্ক্রাইব' (Unsubscribe) নির্দেশিকা অনুসরণ করে আপনি আমাদের প্রচারমূলক যোগাযোগ বার্তা গ্রহণ থেকে বিরত থাকতে পারেন।</>}
              es={<><strong className="text-foreground font-semibold">Exclusión:</strong> Puede optar por no recibir comunicaciones promocionales.</>}
              fr={<><strong className="text-foreground font-semibold">Retrait :</strong> Vous pouvez choisir de ne plus recevoir de communications promotionnelles.</>}
              ar={<><strong className="text-foreground font-semibold">إلغاء الاشتراك:</strong> يمكنك إلغاء الاشتراك في تلقي المراسلات الترويجية.</>}
              zh={<><strong className="text-foreground font-semibold">选择退出：</strong> 您可以按照电子邮件中包含的退订说明选择退出接收促销通信。</>}
              de={<><strong className="text-foreground font-semibold">Abmelden:</strong> Sie können den Erhalt von Werbemitteilungen abbestellen.</>}
              ja={<><strong className="text-foreground font-semibold">オプトアウト：</strong> いつでもプロモーションメールの受信を拒否することができます。</>}
              ru={<><strong className="text-foreground font-semibold">Отказ:</strong> Вы можете отказаться от получения рекламных сообщений.</>}
              pt={<><strong className="text-foreground font-semibold">Desativação:</strong> Você pode optar por não receber comunicações promocionais.</>}
            />
          </li>
        </ul>
      </div>

      {/* 8. Third-Party Links */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Third-Party Links</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">थर्ड-पार्टी लिंक</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">তৃতীয় পক্ষের লিঙ্ক</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Enlaces a Terceros</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Liens Tiers</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">روابط الطرف الثالث</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">第三方链接</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Links von Drittanbietern</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">サードパーティのリンク</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Сторонние ссылки</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Links de Terceiros</h2>}
        />
        <TranslateBlock 
          en={<p>Our website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>}
          hi={<p>हमारी वेबसाइट में अन्य वेबसाइटों के लिंक हो सकते हैं जो हमारे द्वारा संचालित नहीं हैं। यदि आप किसी तृतीय-पक्ष लिंक पर क्लिक करते हैं, तो आपको उस तृतीय पक्ष की साइट पर निर्देशित किया जाएगा। हम आपको दृढ़ता से सलाह देते हैं कि आप जिस भी साइट पर जाते हैं उसकी गोपनीयता नीति की समीक्षा करें। किसी भी तृतीय-पक्ष साइट या सेवाओं की सामग्री, गोपनीयता नीतियों या प्रथाओं पर हमारा कोई नियंत्रण नहीं है और हम इसके लिए कोई जिम्मेदारी नहीं लेते हैं।</p>}
          bn={<p>আমাদের ওয়েবসাইটে এমন কিছু ওয়েবসাইটের লিঙ্ক থাকতে পারে যা আমাদের দ্বারা পরিচালিত নয়। কোনো তৃতীয় পক্ষের লিঙ্কে ক্লিক করলে আপনাকে তাদের সাইটে রিডাইরেক্ট করা হবে। আপনি যে সাইটগুলোই ভিজিট করুন না কেন, আমরা দৃঢ়ভাবে পরামর্শ দিই তাদের নিজস্ব গোপনীয়তা নীতি যাচাই করে নেওয়ার জন্য। তৃতীয় পক্ষের সাইট বা পরিষেবার কনটেন্ট, গোপনীয়তা নীতি বা কার্যপ্রণালীর ওপর আমাদের কোনো নিয়ন্ত্রণ নেই এবং এর কোনো দায়ভার আমরা গ্রহণ করি না।</p>}
          es={<p>Nuestro sitio web puede contener enlaces a otros sitios que no son operados por nosotros. Le recomendamos encarecidamente que revise la Política de Privacidad de cada sitio que visite.</p>}
          fr={<p>Notre site Web peut contenir des liens vers d'autres sites. Nous vous conseillons de consulter la politique de confidentialité de chaque site que vous visitez.</p>}
          ar={<p>قد يحتوي موقعنا على روابط لمواقع أخرى لا نديرها. ننصحك بشدة بمراجعة سياسة الخصوصية لكل موقع تزوره.</p>}
          zh={<p>我们的网站可能包含非我们运营的其他网站的链接。如果您点击第三方链接，您将被引导至该第三方的网站。我们强烈建议您查看您访问的每个网站的隐私政策。</p>}
          de={<p>Unsere Website kann Links zu anderen Websites enthalten, die nicht von uns betrieben werden. Wir raten Ihnen dringend, die Datenschutzrichtlinie jeder Website, die Sie besuchen, zu überprüfen.</p>}
          ja={<p>当社のウェブサイトには、当社が運営していない他のウェブサイトへのリンクが含まれている場合があります。訪問するすべてのサイトのプライバシーポリシーを確認することを強くお勧めします。</p>}
          ru={<p>Наш веб-сайт может содержать ссылки на другие веб-сайты, которые не управляются нами. Мы настоятельно рекомендуем вам ознакомиться с Политикой конфиденциальности каждого посещаемого вами сайта.</p>}
          pt={<p>Nosso site pode conter links para outros sites que não são operados por nós. Aconselhamos vivamente que reveja a Política de Privacidade de cada site que visitar.</p>}
        />
      </div>

      {/* 9. Changes to This Privacy Policy */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Changes to This Privacy Policy</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">इस गोपनीयता नीति में संशोधन</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">গোপনীয়তা নীতির সংশোধন</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Cambios en Esta Política</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Modifications de Cette Politique</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">تغييرات على هذه السياسة</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">隐私政策的变更</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Änderungen dieser Richtlinie</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">本プライバシーポリシーの変更</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Изменения в Политике</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Alterações a Esta Política</h2>}
        />
        <TranslateBlock 
          en={<p>We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top.</p>}
          hi={<p>हम अपनी प्रथाओं में परिवर्तन को दर्शाने के लिए या अन्य परिचालन, कानूनी, या विनियामक कारणों से समय-समय पर अपनी गोपनीयता नीति को अपडेट कर सकते हैं। हम इस पृष्ठ पर नई गोपनीयता नीति पोस्ट करके और शीर्ष पर "प्रभावी तिथि" को अपडेट करके आपको किसी भी परिवर्तन के बारे में सूचित करेंगे।</p>}
          bn={<p>আমাদের কর্মপদ্ধতির পরিবর্তন প্রতিফলিত করতে বা অন্যান্য পরিচালনগত, আইনি বা নিয়ন্ত্রক কারণে আমরা সময়ে সময়ে এই গোপনীয়তা নীতি আপডেট করতে পারি। আমরা এই পেজে নতুন গোপনীয়তা নীতিটি প্রকাশ করার মাধ্যমে এবং শীর্ষে 'সর্বশেষ আপডেট' তারিখটি পরিবর্তন করে আপনাকে যেকোনো হালনাগাদ বিষয়ে অবহিত করব।</p>}
          es={<p>Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política en esta página.</p>}
          fr={<p>Nous pouvons mettre à jour notre politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page.</p>}
          ar={<p>قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنقوم بإخطارك بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة.</p>}
          zh={<p>我们可能会不时更新我们的隐私政策，以反映我们做法的变更。我们将通过在此页面上发布新的隐私政策来通知您任何变更。</p>}
          de={<p>Wir können unsere Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über alle Änderungen informieren, indem wir die neue Datenschutzrichtlinie auf dieser Seite veröffentlichen.</p>}
          ja={<p>当社は、当社の慣行の変更を反映させるため、随時プライバシーポリシーを更新することがあります。変更があった場合は、このページに新しいプライバシーポリシーを掲載してお知らせします。</p>}
          ru={<p>Мы можем время от времени обновлять нашу Политику конфиденциальности. Мы сообщим вам о любых изменениях, опубликовав новую Политику конфиденциальности на этой странице.</p>}
          pt={<p>Podemos atualizar nossa Política de Privacidade de tempos em tempos. Iremos notificá-lo de quaisquer alterações, publicando a nova Política nesta página.</p>}
        />
      </div>

      {/* 10. Contact Us */}
      <div className="space-y-4">
        <TranslateBlock 
          en={<h2 className="text-2xl font-bold text-foreground">Contact Us</h2>}
          hi={<h2 className="text-2xl font-bold text-foreground">संपर्क करें</h2>}
          bn={<h2 className="text-2xl font-bold text-foreground">যোগাযোগ করুন</h2>}
          es={<h2 className="text-2xl font-bold text-foreground">Contáctenos</h2>}
          fr={<h2 className="text-2xl font-bold text-foreground">Nous Contacter</h2>}
          ar={<h2 className="text-2xl font-bold text-foreground">اتصل بنا</h2>}
          zh={<h2 className="text-2xl font-bold text-foreground">联系我们</h2>}
          de={<h2 className="text-2xl font-bold text-foreground">Kontaktiere uns</h2>}
          ja={<h2 className="text-2xl font-bold text-foreground">お問い合わせ</h2>}
          ru={<h2 className="text-2xl font-bold text-foreground">Свяжитесь с нами</h2>}
          pt={<h2 className="text-2xl font-bold text-foreground">Contate-nos</h2>}
        />
        <TranslateBlock 
          en={<p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:</p>}
          hi={<p>यदि इस गोपनीयता नीति के संबंध में या हम आपके डेटा को कैसे संभालते हैं, इस बारे में आपके कोई प्रश्न, चिंताएँ या अनुरोध हैं, तो कृपया हमसे संपर्क करें:</p>}
          bn={<p>এই গোপনীয়তা নীতি সম্পর্কে অথবা আমরা কীভাবে আপনার ডেটা পরিচালনা করি তা নিয়ে আপনার কোনো প্রশ্ন, উদ্বেগ বা অনুরোধ থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:</p>}
          es={<p>Si tiene alguna pregunta, inquietud o solicitud con respecto a esta Política de Privacidad, contáctenos:</p>}
          fr={<p>Si vous avez des questions, des préoccupations ou des demandes concernant cette politique de confidentialité, veuillez nous contacter :</p>}
          ar={<p>إذا كانت لديك أي أسئلة أو مخاوف أو طلبات بخصوص سياسة الخصوصية هذه ، فيرجى الاتصال بنا:</p>}
          zh={<p>如果您对本隐私政策或我们处理您数据的方式有任何疑问、担忧或请求，请联系我们：</p>}
          de={<p>Wenn Sie Fragen, Bedenken oder Anfragen zu dieser Datenschutzrichtlinie haben, kontaktieren Sie uns bitte:</p>}
          ja={<p>このプライバシーポリシー、または当社によるデータの取り扱いに関するご質問、懸念事項、またはご要望がある場合は、以下までご連絡ください：</p>}
          ru={<p>Если у вас есть какие-либо вопросы, проблемы или запросы относительно настоящей Политики конфиденциальности, свяжитесь с нами:</p>}
          pt={<p>Se você tiver alguma dúvida, preocupação ou solicitação em relação a esta Política de Privacidade, entre em contato conosco:</p>}
        />
        <ul className="space-y-2 mt-2">
          <li>
             <TranslateBlock 
                en={<><strong className="text-foreground font-semibold">Email:</strong> contact@ulmind.com</>}
                hi={<><strong className="text-foreground font-semibold">ईमेल:</strong> contact@ulmind.com</>}
                bn={<><strong className="text-foreground font-semibold">ইমেল:</strong> contact@ulmind.com</>}
                es={<><strong className="text-foreground font-semibold">Correo Electrónico:</strong> contact@ulmind.com</>}
                fr={<><strong className="text-foreground font-semibold">E-mail :</strong> contact@ulmind.com</>}
                ar={<><strong className="text-foreground font-semibold">بريد إلكتروني:</strong> contact@ulmind.com</>}
                zh={<><strong className="text-foreground font-semibold">电子邮件：</strong> contact@ulmind.com</>}
                de={<><strong className="text-foreground font-semibold">E-Mail:</strong> contact@ulmind.com</>}
                ja={<><strong className="text-foreground font-semibold">Eメール：</strong> contact@ulmind.com</>}
                ru={<><strong className="text-foreground font-semibold">Эл. почта:</strong> contact@ulmind.com</>}
                pt={<><strong className="text-foreground font-semibold">E-mail:</strong> contact@ulmind.com</>}
             />
          </li>
          <li>
             <TranslateBlock 
                en={<><strong className="text-foreground font-semibold">Phone:</strong> +91 85378 61040</>}
                hi={<><strong className="text-foreground font-semibold">फ़ोन:</strong> +91 85378 61040</>}
                bn={<><strong className="text-foreground font-semibold">ফোন:</strong> +91 85378 61040</>}
                es={<><strong className="text-foreground font-semibold">Teléfono:</strong> +91 85378 61040</>}
                fr={<><strong className="text-foreground font-semibold">Téléphone :</strong> +91 85378 61040</>}
                ar={<><strong className="text-foreground font-semibold">هاتف:</strong> +91 85378 61040</>}
                zh={<><strong className="text-foreground font-semibold">电话：</strong> +91 85378 61040</>}
                de={<><strong className="text-foreground font-semibold">Telefon:</strong> +91 85378 61040</>}
                ja={<><strong className="text-foreground font-semibold">電話番号：</strong> +91 85378 61040</>}
                ru={<><strong className="text-foreground font-semibold">Телефон:</strong> +91 85378 61040</>}
                pt={<><strong className="text-foreground font-semibold">Telefone:</strong> +91 85378 61040</>}
             />
          </li>
          <li>
             <TranslateBlock 
                en={<><strong className="text-foreground font-semibold">Address:</strong> Bankura, West Bengal, India</>}
                hi={<><strong className="text-foreground font-semibold">पता:</strong> बांकुड़ा, पश्चिम बंगाल, भारत</>}
                bn={<><strong className="text-foreground font-semibold">ঠিকানা:</strong> বাঁকুড়া, পশ্চিমবঙ্গ, ভারত</>}
                es={<><strong className="text-foreground font-semibold">Dirección:</strong> Bankura, West Bengal, India</>}
                fr={<><strong className="text-foreground font-semibold">Adresse :</strong> Bankura, West Bengal, India</>}
                ar={<><strong className="text-foreground font-semibold">العنوان:</strong> Bankura, West Bengal, India</>}
                zh={<><strong className="text-foreground font-semibold">地址：</strong> 印度西孟加拉邦班库拉</>}
                de={<><strong className="text-foreground font-semibold">Adresse:</strong> Bankura, West Bengal, India</>}
                ja={<><strong className="text-foreground font-semibold">住所：</strong> Bankura, West Bengal, India</>}
                ru={<><strong className="text-foreground font-semibold">Адрес:</strong> Банкура, Западная Бенгалия, Индия</>}
                pt={<><strong className="text-foreground font-semibold">Endereço:</strong> Bankura, West Bengal, India</>}
             />
          </li>
        </ul>
      </div>

    </InteractiveLegalLayout>
  );
};

export default PrivacyPolicy;