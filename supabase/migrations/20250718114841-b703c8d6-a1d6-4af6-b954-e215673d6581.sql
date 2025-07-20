-- Create storage policies for feedback-photos bucket
CREATE POLICY "Public Access for feedback photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'feedback-photos');

CREATE POLICY "Anyone can upload feedback photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'feedback-photos');

CREATE POLICY "Anyone can update feedback photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'feedback-photos');

CREATE POLICY "Anyone can delete feedback photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'feedback-photos');