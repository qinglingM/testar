import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQuizStore } from '@/store/useQuizStore';
import { toast } from 'sonner';
import { track } from '@/utils/analytics';

export const usePaymentListener = () => {
  const user = useQuizStore(state => state.user);
  const setVip = useQuizStore(state => state.setVip);
  const fetchUserHistory = useQuizStore(state => state.fetchUserHistory);

  useEffect(() => {
    if (!user) return;

    // Listen to changes in the orders table for this user
    const channel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new.status === 'completed') {
            toast.success('支付成功！已为您解锁全部权限');
            
            // Update local state
            setVip(true);
            fetchUserHistory();

            // Track success
            track('payment_success', {
              order_id: payload.new.id,
              product_type: payload.new.product_type,
              amount: payload.new.amount,
              quiz_id: payload.new.quiz_id
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, setVip, fetchUserHistory]);
};
