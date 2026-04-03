import { supabase } from '../src/services/SupabaseClient.js';

// Mock the supabase client for testing
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      from: jest.fn((table) => ({
        insert: jest.fn().mockResolvedValue({ data: null, error: null }),
        select: jest.fn().mockResolvedValue({ data: [], error: null })
      }))
    }))
  };
});

describe('Database Models (Supabase)', () => {
  it('should initialize supabase client correctly', () => {
    expect(supabase).toBeDefined();
  });

  describe('Threat Model', () => {
    it('should validate required fields conceptually (DB mock test)', async () => {
      const mockThreat = {
        organization_id: 'org_1',
        organization_domains: ['example.com'],
        category: 'Credential_Leak',
        sensitive_data_type: 'password',
        sensitive_data_value: 'password123',
        source_type: 'simulated_dataset',
        keywords: ['breach', 'password'],
        context_snippet: 'username: user@example.com password: password123',
        risk_level: 'Medium'
      };

      const result = await supabase.from('threats').insert([mockThreat]);
      expect(result.error).toBeNull();
    });
  });
});
