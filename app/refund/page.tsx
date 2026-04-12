"use client";

import { useLanguage } from "@/lib/language-context";

export default function RefundPage() {
  const { locale } = useLanguage();

  if (locale === "zh") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">退款政策</h1>
        <p className="mt-2 text-sm text-gray-500">最后更新：2026年4月12日</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">我们的承诺</h2>
            <p className="mt-2">
              我们希望您对IELTSBoost完全满意。如果不满意，我们会尽力解决。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">14天退款保证</h2>
            <p className="mt-2">
              如果您订阅了Pro计划后不满意，可以在首次付款后的14天内申请全额退款，无需说明理由。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">14天后的退款</h2>
            <p className="mt-2">
              超过14天后，我们会按剩余订阅期按比例退款。例如，如果您在30天周期的第20天取消，我们会退还剩余10天的费用。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">取消订阅</h2>
            <div className="mt-2 space-y-2">
              <p>您可以随时取消Pro订阅：</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>取消后，您的Pro权益将持续到当前计费周期结束</li>
                <li>取消后不会再产生新的费用</li>
                <li>您的账号将自动降级为免费版</li>
                <li>您的所有数据和历史记录将被保留</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">如何申请退款</h2>
            <p className="mt-2">
              请发送邮件至 <a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a>，说明您的账号邮箱和退款请求。我们会在3个工作日内处理您的请求。退款将退回到您的原始支付方式。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900">例外情况</h2>
            <p className="mt-2">
              如果我们发现滥用退款政策的行为（如反复订阅后退款），我们保留拒绝退款的权利。
            </p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Refund Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: April 12, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Our Commitment</h2>
          <p className="mt-2">
            We want you to be completely satisfied with IELTSBoost. If you are not, we will do our best to make it right.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">14-Day Money-Back Guarantee</h2>
          <p className="mt-2">
            If you subscribe to the Pro plan and are not satisfied, you may request a full refund within 14 days of your first payment. No questions asked.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Refunds After 14 Days</h2>
          <p className="mt-2">
            After the 14-day guarantee period, we offer pro-rated refunds for the remaining time on your subscription. For example, if you cancel on day 20 of a 30-day billing cycle, we will refund the remaining 10 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Cancellation</h2>
          <div className="mt-2 space-y-2">
            <p>You may cancel your Pro subscription at any time:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>After cancellation, your Pro benefits continue until the end of the current billing cycle</li>
              <li>No further charges will be made after cancellation</li>
              <li>Your account will automatically revert to the free tier</li>
              <li>All your data and submission history will be preserved</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">How to Request a Refund</h2>
          <p className="mt-2">
            Email <a href="mailto:support@ieltsboost.ai" className="text-blue-600 hover:underline">support@ieltsboost.ai</a> with your account email and refund request. We will process your request within 3 business days. Refunds will be returned to your original payment method.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">Exceptions</h2>
          <p className="mt-2">
            We reserve the right to decline refund requests in cases of policy abuse, such as repeated subscribe-and-refund cycles.
          </p>
        </section>
      </div>
    </div>
  );
}
