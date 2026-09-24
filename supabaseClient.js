// ===================================================================
// NAGARIK-AI: Supabase Client Adapter
// Handles PostgreSQL queries, realtime features, and connection health
// ===================================================================

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

let supabaseInstance = null;
let currentSupabaseUrl = process.env.SUPABASE_URL || '';
let currentSupabaseKey = process.env.SUPABASE_ANON_KEY || '';

function initSupabase(url, key) {
  if (url && key) {
    try {
      currentSupabaseUrl = url.trim();
      currentSupabaseKey = key.trim();
      supabaseInstance = createClient(currentSupabaseUrl, currentSupabaseKey, {
        auth: { persistSession: false }
      });
      console.log(`⚡ Supabase client initialized for: ${currentSupabaseUrl}`);
      return true;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
      return false;
    }
  }
  supabaseInstance = null;
  return false;
}

// Initial initialization if environment variables are set
if (currentSupabaseUrl && currentSupabaseKey) {
  initSupabase(currentSupabaseUrl, currentSupabaseKey);
}

function isSupabaseConfigured() {
  return !!supabaseInstance && !!currentSupabaseUrl && !!currentSupabaseKey;
}

function getSupabase() {
  return supabaseInstance;
}

// Test Connection
async function testConnection() {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      message: 'Supabase credentials not configured. Using local JSON store.'
    };
  }

  try {
    const { data, error } = await supabaseInstance
      .from('complaints')
      .select('id')
      .limit(1);

    if (error) {
      return {
        connected: false,
        message: `Connected to project, but table 'complaints' not found. Please run supabase_schema.sql. (${error.message})`
      };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase PostgreSQL database!'
    };
  } catch (err) {
    return {
      connected: false,
      message: `Connection error: ${err.message}`
    };
  }
}

// Fetch complaints from Supabase
async function fetchComplaintsFromSupabase() {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabaseInstance
      .from('complaints')
      .select('*')
      .order('reported_at', { ascending: false });

    if (error) {
      console.warn('Supabase select error:', error.message);
      return null;
    }

    // Map snake_case to camelCase for API compatibility
    return (data || []).map(row => ({
      id: row.id,
      title: row.title,
      category: row.category,
      categoryLabel: row.category_label,
      description: row.description,
      severity: row.severity,
      department: row.department,
      status: row.status,
      location: row.location || {},
      imageUrl: row.image_url,
      resolutionProof: row.resolution_proof,
      upvotes: row.upvotes || 1,
      reportedAt: row.reported_at,
      slaHours: row.sla_hours,
      assignedOfficer: row.assigned_officer,
      citizenContact: row.citizen_contact,
      timeline: row.timeline || []
    }));
  } catch (err) {
    console.error('Error querying Supabase:', err);
    return null;
  }
}

// Insert complaint into Supabase
async function insertComplaintToSupabase(complaint) {
  if (!isSupabaseConfigured()) return null;

  try {
    const record = {
      id: complaint.id,
      title: complaint.title,
      category: complaint.category,
      category_label: complaint.categoryLabel,
      description: complaint.description,
      severity: complaint.severity,
      department: complaint.department,
      status: complaint.status || 'Reported',
      location: complaint.location,
      image_url: complaint.imageUrl,
      resolution_proof: complaint.resolutionProof || null,
      upvotes: complaint.upvotes || 1,
      reported_at: complaint.reportedAt,
      sla_hours: complaint.slaHours,
      assigned_officer: complaint.assignedOfficer || null,
      citizen_contact: complaint.citizenContact || null,
      timeline: complaint.timeline || []
    };

    const { data, error } = await supabaseInstance
      .from('complaints')
      .insert([record])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return null;
    }
    return data && data[0] ? data[0] : record;
  } catch (err) {
    console.error('Error inserting into Supabase:', err);
    return null;
  }
}

// Update complaint in Supabase
async function updateComplaintInSupabase(id, updates) {
  if (!isSupabaseConfigured()) return null;

  try {
    const record = {};
    if (updates.status) record.status = updates.status;
    if (updates.assignedOfficer !== undefined) record.assigned_officer = updates.assignedOfficer;
    if (updates.resolutionProof !== undefined) record.resolution_proof = updates.resolutionProof;
    if (updates.timeline !== undefined) record.timeline = updates.timeline;
    if (updates.upvotes !== undefined) record.upvotes = updates.upvotes;
    record.updated_at = new Date().toISOString();

    const { data, error } = await supabaseInstance
      .from('complaints')
      .update(record)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error.message);
      return null;
    }
    return data && data[0] ? data[0] : true;
  } catch (err) {
    console.error('Error updating Supabase:', err);
    return null;
  }
}

module.exports = {
  initSupabase,
  isSupabaseConfigured,
  getSupabase,
  testConnection,
  fetchComplaintsFromSupabase,
  insertComplaintToSupabase,
  updateComplaintInSupabase,
  getCurrentConfig: () => ({
    url: currentSupabaseUrl,
    keyProvided: !!currentSupabaseKey
  })
};
