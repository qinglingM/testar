export type EventName = 
  | 'page_view'
  | 'quiz_detail_view'
  | 'result_free_view'
  | 'report_full_view'
  | 'history_view'
  | 'member_center_view'
  | 'quiz_click'
  | 'quiz_start'
  | 'quiz_answer'
  | 'quiz_complete'
  | 'quiz_exit'
  | 'paywall_view'
  | 'unlock_click'
  | 'purchase_click'
  | 'payment_initiate'
  | 'payment_success'
  | 'payment_fail'
  | 'payment_cancel'
  | 'member_activate'
  | 'member_benefit_use'
  | 'register_success'
  | 'login_success'
  | 'account_bind_success'
  | 'restore_purchase'
  | 'logout'
  | 'share_click'
  | 'share_success'
  | 'unlock_card_click'
  | 'verify_activation_code'
  | 'related_quiz_click';

export interface CommonProperties {
  event_time: number;
  distinct_id: string;
  user_id?: string;
  session_id: string;
  page_name: string;
  page_path: string;
  quiz_id?: string;
  quiz_slug?: string;
  quiz_category?: string;
  source_channel?: string;
  source_module?: string;
  device_type: string;
  os: string;
  web_version: string;
}

export interface EventParams {
  page_view: { page_name: string; page_path: string; referrer?: string; source_channel?: string };
  quiz_detail_view: { quiz_id: string; quiz_slug: string; source_module?: string };
  result_free_view: { quiz_id: string; result_key: string; is_first_view: boolean; dwell_time?: number };
  report_full_view: { quiz_id: string; result_key: string; entry_type: 'purchase' | 'member' | 'restore' };
  quiz_click: { quiz_id: string; source_module: string; position_index?: number };
  quiz_start: { quiz_id: string };
  quiz_answer: { quiz_id: string; question_id: string; option_id: string; step_index: number; time_spent_on_question?: number };
  quiz_complete: { quiz_id: string; time_spent: number; time_spent_total?: number; result_key: string };
  quiz_exit: { quiz_id: string; step_index: number; time_spent: number };
  paywall_view: { quiz_id?: string; paywall_type: 'single_unlock' | 'member_offer'; trigger_point: string };
  unlock_click: { quiz_id: string; result_key: string; entry_point: string };
  purchase_click: { product_type: string; payment_method?: string; quiz_id?: string; price?: number; decision_time?: number };
  payment_initiate: { order_id: string; product_type: string; payment_method?: string; amount: number };
  payment_success: { order_id: string; product_type: string; amount: number; quiz_id?: string };
  payment_fail: { order_id: string; reason_code: string };
  payment_cancel: { order_id: string };
  member_activate: { plan_type: string; amount: number };
  member_benefit_use: { quiz_id: string; benefit_type: string };
  register_success: { method: string };
  login_success: { method: string };
  share_click: { quiz_id: string; result_key: string; share_type: string };
  related_quiz_click: { current_quiz_id: string; target_quiz_id: string; source_module: string };
  // Add other events as needed with empty objects if no specific params
  history_view: {};
  member_center_view: {};
  logout: {};
  share_success: { quiz_id: string; result_key: string };
  unlock_card_click: { quiz_id: string; type?: 'upgrade' | 'full' };
  verify_activation_code: { code: string; success: boolean; type?: 'upgrade' | 'full' };
  account_bind_success: { method: string };
  restore_purchase: { restore_count: number };
}
