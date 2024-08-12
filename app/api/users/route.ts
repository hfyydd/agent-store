import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 定义 Supabase 用户类型
interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata: {
    [key: string]: any;
  };
  // 可以根据需要添加更多字段
}

// 定义账户类型
interface Account {
  user_id: string;
  balance: number;
}

// 定义我们要返回的用户类型
interface UserWithBalance {
  id: string;
  email?: string;
  user_metadata: {
    [key: string]: any;
  };
  balance: number;
}

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // 获取并验证令牌
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  // 验证用户
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // 检查用户是否为管理员
  const isAdmin = user.user_metadata?.is_admin === true;

  if (!isAdmin) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  // 获取用户列表
  const { data, error: usersError } = await supabase.auth.admin.listUsers({
    perPage: 1000, // 或者更大的数字，取决于你的需求
  });

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  // 获取所有用户的账户信息
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('user_id, balance');

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 });
  }

  // 将用户信息和账户信息合并
  const usersWithBalance: UserWithBalance[] = data.users.map((user: SupabaseUser) => {
    const account = (accounts as Account[]).find(acc => acc.user_id === user.id);
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      balance: account ? account.balance : 0
    };
  });

  return NextResponse.json(usersWithBalance);
}