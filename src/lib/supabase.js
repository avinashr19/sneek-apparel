import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yowfbrkglsuvyrqxegwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2ZicmtnbHN1dnlycXhlZ3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODQ3OTIsImV4cCI6MjA5OTc2MDc5Mn0.NpfDMlbbTj5L9gX0OZhrxN0m1bXJqy75juAHhtYqpR8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
