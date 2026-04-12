"use client";

import { useLanguage } from "@/lib/language-context";

export default function TermsPage() {
  const { locale } = useLanguage();

  if (locale === "zh") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">服务条款</h1>
        <p className="mt-2 text-sm text-gray-500">最后更新：2026年4月12日</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. 服务概述</h2>
            <p className="mt-2">
              IELTSBoost（&quot;本平台&quot;）是由ML Ventures运营的AI驱动雅思备考平台。本平台提供写作和口语练习、AI评分反馈、进度追踪等功能。使用本平台即表示您同意以下条款。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. 账号</h2>
            <p className="mt-2">
              您需要创建账号才能使用本平台的核心功能。您有责任保管账号凭证的安全。每位用户仅可持有一个账号。我们保留在合理理由下暂停或终止账号的权利。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. 免费与付费服务</h2>
            <p className="mt-2">
              本平台提供有限的免费使用额度和付费Pro订阅。免费用户每个板块每天可提交3次（写作、口语、阅读和听力）。Pro用户享有无限使用权。订阅费用按月计费。具体价格请参见定价页面。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. AI反馈免责声明</h2>
            <p className="mt-2">
              本平台提供的所有分数和反馈均为AI生成的估算，不代表官方雅思成绩。AI反馈仅供练习参考，不保证与实际雅思考试成绩一致。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. 用户内容</h2>
            <p className="mt-2">
              您提交的作文和口语回答归您所有。我们存储您的提交内容以便提供反馈和追踪进度。我们不会公开分享您的个人提交内容。我们可能会使用匿名化的数据来改进我们的服务。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. 可接受使用</h2>
            <p className="mt-2">
              您不得滥用本平台，包括但不限于：尝试操纵AI评分系统、将本平台的反馈冒充为官方雅思成绩、转售本平台的访问权限，或上传非法或有害内容。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. 服务可用性</h2>
            <p className="mt-2">
              我们努力保持平台的可用性，但不保证服务不中断。我们可能会随时更新、修改或暂时中断服务以进行维护或改进。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">8. 责任限制</h2>
            <p className="mt-2">
              在法律允许的最大范围内，ML Ventures不对因使用本平台而产生的间接、附带或后果性损害承担责任。我们的总责任不超过您在过去12个月内支付的金额。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">9. 条款变更</h2>
            <p className="mt-2">
              我们可能会不时更新本条款。重大变更将通过平台或电子邮件通知您。继续使用本平台即表示您接受更新后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">10. 联系方式</h2>
            <p className="mt-2">
              如有任何问题，请通过以下方式联系我们：<a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 12, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Overview</h2>
          <p className="mt-2">
            IELTSBoost (&quot;the Platform&quot;) is an AI-powered IELTS preparation platform operated by ML Ventures. The Platform provides writing and speaking practice, AI-generated scoring feedback, and progress tracking. By using the Platform, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Accounts</h2>
          <p className="mt-2">
            You must create an account to access core features. You are responsible for maintaining the security of your account credentials. Each user may hold only one account. We reserve the right to suspend or terminate accounts for reasonable cause.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Free and Paid Services</h2>
          <p className="mt-2">
            The Platform offers a limited free tier and a paid Pro subscription. Free users may submit up to 3 tasks per section per day (Writing, Speaking, Reading, and Listening). Pro subscribers receive unlimited access to all features. Subscriptions are billed monthly. See the pricing page for current rates.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. AI Feedback Disclaimer</h2>
          <p className="mt-2">
            All scores and feedback provided by the Platform are AI-generated estimates and do not represent official IELTS scores. AI feedback is intended for practice purposes only and is not guaranteed to match actual IELTS exam results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. User Content</h2>
          <p className="mt-2">
            Essays and speaking responses you submit remain your property. We store your submissions to provide feedback and track your progress. We will not publicly share your individual submissions. We may use anonymized, aggregated data to improve our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">6. Acceptable Use</h2>
          <p className="mt-2">
            You may not misuse the Platform, including but not limited to: attempting to manipulate the AI scoring system, misrepresenting Platform feedback as official IELTS scores, reselling access to the Platform, or uploading illegal or harmful content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">7. Service Availability</h2>
          <p className="mt-2">
            We strive to keep the Platform available but do not guarantee uninterrupted service. We may update, modify, or temporarily suspend the service at any time for maintenance or improvements.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">8. Limitation of Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, ML Ventures shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid in the preceding 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">9. Changes to Terms</h2>
          <p className="mt-2">
            We may update these terms from time to time. Material changes will be communicated via the Platform or email. Continued use of the Platform after changes constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">10. Contact</h2>
          <p className="mt-2">
            For questions about these terms, contact us at{" "}
            <a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
