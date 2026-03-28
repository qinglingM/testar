import { useEffect } from 'react';

/**
 * @deprecated 支付链路已完全关闭。
 * 前端不再监听订单表的变更。该 Hook 仅保留结构以防第三方依赖失效。
 */
export const usePaymentListener = () => {
  useEffect(() => {
    // No-op: Payment logic disabled
    // All membership status is now handled strictly via verifyActivationCode and refreshProfile
  }, []);
};
