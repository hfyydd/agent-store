// // app/recharge/page.tsx
// 'use client';

// import { useState } from 'react';
// import { createClient } from '@/utils/supabase/client';

// const amounts = [50, 100, 200, 500, 1000, 2000, 5000];

// export default function RechargePage() {
//   const [selectedAmount, setSelectedAmount] = useState(50);
//   const [customAmount, setCustomAmount] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('wechat');
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const supabase = createClient();

//   const handleAmountSelect = (amount: number | 'custom') => {
//     if (amount === 'custom') {
//       setSelectedAmount(0);
//     } else {
//       setSelectedAmount(amount);
//       setCustomAmount('');
//     }
//   };

//   const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setCustomAmount(e.target.value);
//     setSelectedAmount(0);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!agreeTerms) {
//       alert('请同意充值协议');
//       return;
//     }

//     const amount = selectedAmount || Number(customAmount);
//     if (!amount || amount <= 0) {
//       alert('请选择或输入有效的充值金额');
//       return;
//     }

//     // 这里应该调用您的支付处理逻辑
//     console.log('处理充值:', { amount, paymentMethod });

//     // 示例：记录充值请求到 Supabase
//     const { data, error } = await supabase
//       .from('recharge_requests')
//       .insert([
//         { amount, payment_method: paymentMethod, status: 'pending' }
//       ]);

//     if (error) {
//       console.error('充值请求失败:', error);
//       alert('充值请求失败，请稍后重试');
//     } else {
//       alert('充值请求已提交，请等待处理');
//     }
//   };

//   return (
//     <div className="p-4 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">账户充值</h1>
      
//       <div className="bg-gray-100 p-4 rounded-md mb-6">
//         <p>1.请确保您的账户有足够金额进行交易。</p>
//         <p>2.若充值过程遇到交易问题，请前往相应的第三方支付平台进行确认。</p>
//         <p>3.为了保障您的账户安全与充值体验的顺畅，您每月最多可享受30次充值服务。1天内未支付的订单，会自动关闭。</p>
//         <p>4.充值完成后可前往 <a href="/dashboard/overview" className="text-blue-500">账户总览</a> 查看账户余额。</p>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">支付金额：</label>
//           <div className="grid grid-cols-4 gap-2 mt-1">
//             {amounts.map((amount) => (
//               <button
//                 key={amount}
//                 type="button"
//                 className={`px-4 py-2 border rounded ${
//                   selectedAmount === amount ? 'bg-blue-500 text-white' : 'bg-white'
//                 }`}
//                 onClick={() => handleAmountSelect(amount)}
//               >
//                 {amount}元
//               </button>
//             ))}
//             <button
//               type="button"
//               className={`px-4 py-2 border rounded ${
//                 selectedAmount === 0 ? 'bg-blue-500 text-white' : 'bg-white'
//               }`}
//               onClick={() => handleAmountSelect('custom')}
//             >
//               自定义
//             </button>
//           </div>
//           {selectedAmount === 0 && (
//             <input
//               type="number"
//               value={customAmount}
//               onChange={handleCustomAmountChange}
//               placeholder="请输入金额"
//               className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
//             />
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">支付方式：</label>
//           <div className="mt-1 space-x-4">
//             <button
//               type="button"
//               className={`px-4 py-2 border rounded ${
//                 paymentMethod === 'wechat' ? 'bg-green-500 text-white' : 'bg-white'
//               }`}
//               onClick={() => setPaymentMethod('wechat')}
//             >
//               微信
//             </button>
//             <button
//               type="button"
//               className={`px-4 py-2 border rounded ${
//                 paymentMethod === 'alipay' ? 'bg-blue-500 text-white' : 'bg-white'
//               }`}
//               onClick={() => setPaymentMethod('alipay')}
//             >
//               支付宝
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center">
//           <input
//             id="terms"
//             type="checkbox"
//             checked={agreeTerms}
//             onChange={(e) => setAgreeTerms(e.target.checked)}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
//             确认支付即表同意本平台 <a href="#" className="text-blue-500">《充值协议》</a>
//           </label>
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           确认支付
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function RechargePage() {
  const [showQRCode, setShowQRCode] = useState(false);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">账户充值</h1>
      
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <p className="mb-2">尊敬的用户，我们目前正在升级我们的在线充值系统，以提供更好的服务体验。</p>
        <p className="mb-2">在此期间，我们提供以下充值方式：</p>
        <ol className="list-decimal list-inside mb-2">
          <li>添加我们的客服微信：<strong>微信号：koalababy2024</strong></li>
          <li>告知客服您需要充值的金额</li>
          <li>客服将指导您完成充值流程</li>
          <li>10 考拉币🐨 = 1 元</li>
        </ol>
        <p>我们将尽快恢复在线充值功能，感谢您的理解和支持。</p>
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowQRCode(!showQRCode)}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          {showQRCode ? '隐藏二维码' : '显示微信二维码'}
        </button>

        {showQRCode && (
          <div className="mt-4">
            <p className="mb-2">请扫描下方二维码添加客服微信：</p>
            {/* 替换为实际的二维码图片 */}
            <Image
              src="/images/koala.jpg"
              alt="客服微信二维码"
              width={200}
              height={200}
              className="mx-auto"
            />
            <p className="mt-2">微信号：koalababy2024</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h2 className="font-bold mb-2">充值说明：</h2>
        <ul className="list-disc list-inside">
          <li>充值金额将在客服处理后到账</li>
          <li>如有任何疑问，请直接联系客服</li>
          <li>我们承诺为您提供安全、可靠的充值服务</li>
          <li>充值完成后可前往 <a href="/dashboard/overview" className="text-blue-500">账户总览</a> 查看账户余额</li>
        </ul>
      </div>
    </div>
  );
}