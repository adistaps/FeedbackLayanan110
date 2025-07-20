
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get query parameters
    const url = new URL(req.url);
    const limit = url.searchParams.get('limit') || '50';
    const jenis_feedback = url.searchParams.get('jenis_feedback');
    const start_date = url.searchParams.get('start_date');
    const end_date = url.searchParams.get('end_date');

    // Build query
    let query = supabase
      .from('feedback_survei')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));

    // Add filters if provided
    if (jenis_feedback) {
      query = query.eq('jenis_feedback', jenis_feedback);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get statistics
    const { data: statsData, error: statsError } = await supabase
      .from('feedback_survei')
      .select('jenis_feedback, rating_kepuasan');

    let statistics = {};
    if (!statsError && statsData) {
      const totalFeedback = statsData.length;
      const avgRating = statsData.reduce((sum, item) => sum + item.rating_kepuasan, 0) / totalFeedback;
      
      const jenisFeedbackCount = statsData.reduce((acc, item) => {
        acc[item.jenis_feedback] = (acc[item.jenis_feedback] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const ratingDistribution = statsData.reduce((acc, item) => {
        acc[item.rating_kepuasan] = (acc[item.rating_kepuasan] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      statistics = {
        total_feedback: totalFeedback,
        average_rating: Math.round(avgRating * 100) / 100,
        feedback_types: jenisFeedbackCount,
        rating_distribution: ratingDistribution
      };
    }

    const response = {
      success: true,
      data: data,
      statistics: statistics,
      total_records: data?.length || 0,
      filters_applied: {
        limit: parseInt(limit),
        jenis_feedback: jenis_feedback || null,
        start_date: start_date || null,
        end_date: end_date || null
      }
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-feedback-data function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
