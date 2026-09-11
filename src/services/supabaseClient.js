import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwhgynhzxevmauvrjnym.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3aGd5bmh6eGV2bWF1dnJqbnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4ODUzMjQsImV4cCI6MjEwNDQ2MTMyNH0.IYpZCZCycbx7GtdvifjkC4i_MDs9vZWvC7WfFdzjFnA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);