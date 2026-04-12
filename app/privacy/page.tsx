"use client";

import { useLanguage } from "@/lib/language-context";

export default function PrivacyPage() {
  const { locale } = useLanguage();

  if (locale === "zh") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">隐私政策</h1>
        <p className="mt-2 text-sm text-gray-500">最后更新：2026年4月12日</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. 概述</h2>
            <p className="mt-2">
              本隐私政策说明了IELTSBoost（由ML Ventures运营）如何收集、使用和保护您的个人信息。我们致力于保护您的隐私并对我们的数据处理方式保持透明。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. 我们收集的信息</h2>
            <div className="mt-2 space-y-2">
              <p><strong>账号信息：</strong>电子邮件地址，以及通过Google登录时的基本个人资料信息（姓名、头像）。</p>
              <p><strong>提交内容：</strong>您提交的写作作文和口语回答，包括上传的图片和PDF文件。</p>
              <p><strong>使用数据：</strong>提交次数、功能使用频率和会话信息。</p>
              <p><strong>支付信息：</strong>支付通过Stripe处理。我们不直接存储您的信用卡号或银行信息。Stripe会收集处理支付所需的信息。</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. 信息使用方式</h2>
            <div className="mt-2 space-y-2">
              <p>我们使用您的信息来：</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>提供AI评分反馈</li>
                <li>追踪您的练习进度和分数历史</li>
                <li>处理订阅付款</li>
                <li>改进平台服务</li>
                <li>发送与您账号相关的重要通知</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. AI处理</h2>
            <p className="mt-2">
              您的提交内容会发送至第三方AI服务（Anthropic的Claude）进行评估。这些内容仅用于生成反馈，不会被AI提供商用于训练模型。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. 数据存储</h2>
            <p className="mt-2">
              您的数据存储在Supabase（托管于美国AWS服务器）上。上传的文件存储在Supabase Storage中。我们采取合理措施保护您的数据安全，包括加密传输和访问控制。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. 数据共享</h2>
            <div className="mt-2 space-y-2">
              <p>我们不会出售您的个人数据。我们仅与以下方共享数据：</p>
              <ul className="ml-4 list-disc space-y-1">
                <li><strong>Anthropic：</strong>处理AI评估请求</li>
                <li><strong>Supabase：</strong>数据存储和身份验证</li>
                <li><strong>Stripe：</strong>支付处理</li>
                <li><strong>Google：</strong>OAuth身份验证（如您选择Google登录）</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. 您的权利</h2>
            <div className="mt-2 space-y-2">
              <p>您有权：</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>请求导出您的数据</li>
                <li>请求删除您的账号和相关数据</li>
                <li>随时取消订阅</li>
              </ul>
              <p>如需行使这些权利，请联系 <a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>。</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. Cookie</h2>
            <p className="mt-2">
              我们使用必要的Cookie来维护您的登录会话和语言偏好。我们不使用第三方跟踪Cookie或广告Cookie。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. 政策变更</h2>
            <p className="mt-2">
              我们可能会更新本隐私政策。重大变更将通过平台或电子邮件通知您。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. 联系方式</h2>
            <p className="mt-2">
              如有隐私方面的问题，请联系：<a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 12, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Overview</h2>
          <p className="mt-2">
            This privacy policy explains how IELTSBoost (operated by ML Ventures) collects, uses, and protects your personal information. We are committed to protecting your privacy and being transparent about our data practices.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Information We Collect</h2>
          <div className="mt-2 space-y-2">
            <p><strong>Account information:</strong> Email address, and basic profile information (name, avatar) if you sign in with Google.</p>
            <p><strong>Submissions:</strong> Writing essays and speaking responses you submit, including uploaded images and PDF files.</p>
            <p><strong>Usage data:</strong> Submission counts, feature usage frequency, and session information.</p>
            <p><strong>Payment information:</strong> Payments are processed through Stripe. We do not directly store your credit card number or bank details. Stripe collects the information necessary to process payments.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. How We Use Your Information</h2>
          <div className="mt-2 space-y-2">
            <p>We use your information to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Provide AI-generated scoring and feedback on your submissions</li>
              <li>Track your practice progress and score history</li>
              <li>Process subscription payments</li>
              <li>Improve the Platform and our services</li>
              <li>Send important notices related to your account</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. AI Processing</h2>
          <p className="mt-2">
            Your submissions are sent to third-party AI services (Anthropic&apos;s Claude) for evaluation. This content is used solely to generate your feedback and is not used by the AI provider to train their models.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. Data Storage</h2>
          <p className="mt-2">
            Your data is stored on Supabase (hosted on AWS servers in the United States). Uploaded files are stored in Supabase Storage. We implement reasonable security measures to protect your data, including encrypted transmission and access controls.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Data Sharing</h2>
          <div className="mt-2 space-y-2">
            <p>We do not sell your personal data. We share data only with the following service providers as necessary to operate the Platform:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li><strong>Anthropic:</strong> To process AI evaluation requests</li>
              <li><strong>Supabase:</strong> For data storage and authentication</li>
              <li><strong>Stripe:</strong> For payment processing</li>
              <li><strong>Google:</strong> For OAuth authentication (if you choose Google sign-in)</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Your Rights</h2>
          <div className="mt-2 space-y-2">
            <p>You have the right to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Request an export of your data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Cancel your subscription at any time</li>
            </ul>
            <p>To exercise these rights, contact <a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>.</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Cookies</h2>
          <p className="mt-2">
            We use essential cookies to maintain your login session and language preferences. We do not use third-party tracking cookies or advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this privacy policy from time to time. Material changes will be communicated via the Platform or email.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
          <p className="mt-2">
            For privacy-related questions, contact us at{" "}
            <a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
