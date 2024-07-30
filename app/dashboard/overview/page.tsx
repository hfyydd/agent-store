// app/account-overview/page.tsx
import Link from "next/link";

export default function AccountOverviewPage() {
  // 假数据
  const accountInfo = {
    balance: 13.86,
    gift_balance: 15.00,
    cumulative_recharge: 0.00,
    total_consumption: 1.13,
    yesterday_consumption: 0.00,
    this_month_consumption: 0.07
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">账户总览</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">余额（元）</h2>
          <p className="text-3xl font-bold text-blue-600">{accountInfo.balance.toFixed(2)} 元</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">累计充值（元）</h2>
          <p className="text-3xl font-bold text-green-600">{accountInfo.cumulative_recharge.toFixed(2)} 元</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">赠送金额（元）</h2>
          <p className="text-3xl font-bold text-purple-600">{accountInfo.gift_balance.toFixed(2)} 元</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">总消费（元）</h2>
          <p className="text-3xl font-bold text-red-600">{accountInfo.total_consumption.toFixed(2)} 元</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">消费明细</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">昨日消费（元）</p>
            <p className="text-xl font-semibold">{accountInfo.yesterday_consumption.toFixed(2)} 元</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">本月消费（元）</p>
            <p className="text-xl font-semibold">{accountInfo.this_month_consumption.toFixed(2)} 元</p>
          </div>
        </div>
      </div>

      <Link
        href="/recharge"
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        去充值
      </Link>
    </div>
  );
}