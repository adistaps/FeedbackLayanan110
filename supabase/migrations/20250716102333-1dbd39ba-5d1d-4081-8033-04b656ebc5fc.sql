
-- Create table for feedback survey
CREATE TABLE public.feedback_survei (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  jenis_feedback TEXT NOT NULL CHECK (jenis_feedback IN ('saran', 'keluhan', 'pujian')),
  judul_utama TEXT NOT NULL,
  pesan_feedback TEXT NOT NULL,
  rating_kepuasan INTEGER NOT NULL CHECK (rating_kepuasan >= 1 AND rating_kepuasan <= 5),
  nama TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedback_survei ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public insert (for survey submissions)
CREATE POLICY "Allow public insert on feedback_survei" 
  ON public.feedback_survei 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow public select (for viewing feedback if needed)
CREATE POLICY "Allow public select on feedback_survei" 
  ON public.feedback_survei 
  FOR SELECT 
  USING (true);
