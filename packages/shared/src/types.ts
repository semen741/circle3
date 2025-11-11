export type Effects = { mute?: boolean; contrast?: number; blur?: number };
export type JobPayload = {
  job_id: string;
  chat_id: number;
  reply_progress_message_id: number | null;
  file_id: string | null;
  upload_tmp_path: string | null;
  start_time: number;
  end_time: number;
  effects: Effects;
  constraints: { max_size_mb: number };
  idempotency_key?: string;
};
