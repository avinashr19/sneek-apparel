const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://yowfbrkglsuvyrqxegwx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvd2ZicmtnbHN1dnlycXhlZ3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxODQ3OTIsImV4cCI6MjA5OTc2MDc5Mn0.NpfDMlbbTj5L9gX0OZhrxN0m1bXJqy75juAHhtYqpR8');
async function run() {
  const { data, error } = await supabase.from('admin_users').select('*');
  console.log(data);
}
run();
