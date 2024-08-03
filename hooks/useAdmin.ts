// hooks/useAdmin.ts
'use client'

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    async function checkAdminStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user?.user_metadata?.is_admin);
      setLoading(false);
    }

    checkAdminStatus();
  }, []);

  return { isAdmin, loading };
}