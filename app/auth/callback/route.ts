import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      // 检查是否已存在 account 记录
      const { data: accountData, error: accountError } = await supabase
        .from('accounts')
        .select()
        .eq('user_id', data.user.id)
        .single()

      if (accountError && accountError.code === 'PGRST116') {
        // 如果没有找到记录，创建一个新的 account 记录
        const { error: insertError } = await supabase
          .from('accounts')
          .insert({
            user_id: data.user.id,
            balance: 0,
            cumulative_charge: 0,
            gift_amount: 0,
            total_consumption: 0,
            yesterday_consumption: 0,
            this_month_consumption: 0,
          })

        if (insertError) {
          console.error("Error inserting account record:", insertError)
          // 重定向到登录页面并显示错误消息
          return NextResponse.redirect(`${origin}/login?message=Error creating account. Please contact support.`)
        }
      } else if (accountError) {
        console.error("Error checking account record:", accountError)
        // 重定向到登录页面并显示错误消息
        return NextResponse.redirect(`${origin}/login?message=Error checking account. Please try again.`)
      }
    }

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    } else {
      // 认证过程中出现错误，重定向到登录页面并显示错误消息
      console.error("Authentication error:", error)
      return NextResponse.redirect(`${origin}/login?message=Authentication failed. Please try again.`)
    }
  }

  // 如果没有 code 参数，重定向到登录页面并显示错误消息
  return NextResponse.redirect(`${origin}/login?message=Invalid authentication attempt. Please try again.`);
}