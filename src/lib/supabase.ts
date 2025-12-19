import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase ortam değişkenleri ayarlanmamış!');
  console.warn('Lütfen .env.local dosyasını kontrol edin.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

/**
 * Kullanıcı oturumunu başlat (Anonymous)
 */
export async function initializeSession() {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;
    return data.session?.user.id || 'anonymous';
  } catch (error) {
    console.error('Session hatası:', error);
    return 'anonymous-' + Date.now();
  }
}

/**
 * Hesap sonuçlarını kaydet
 */
export async function saveCalculatorResult(userId: string, result: any) {
  try {
    const { data, error } = await supabase
      .from('calculator_results')
      .insert([
        {
          user_id: userId,
          principal: result.input.principal,
          currency: result.input.currency,
          return_rate: result.input.returnRate,
          return_period: result.input.returnPeriod,
          period_count: result.input.periodCount,
          contribution_type: result.input.contributionType,
          contribution_amount: result.input.contributionAmount || 0,
          final_balance: result.finalBalance,
          total_interest_earned: result.totalInterestEarned,
          total_return_percent: result.totalReturnPercent,
          total_principal_invested: result.totalPrincipalInvested,
        },
      ])
      .select();

    if (error) throw error;
    console.log('✅ Veri kaydedildi:', data);
    return data[0];
  } catch (error) {
    console.error('❌ Kayıt hatası:', error);
    throw error;
  }
}

/**
 * Tüm hesap sonuçlarını getir
 */
export async function getCalculatorResults(userId: string) {
  try {
    const { data, error } = await supabase
      .from('calculator_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ Çekme hatası:', error);
    return [];
  }
}

/**
 * Tek bir sonucu sil
 */
export async function deleteCalculatorResult(resultId: string) {
  try {
    const { error } = await supabase
      .from('calculator_results')
      .delete()
      .eq('id', resultId);

    if (error) throw error;
    console.log('✅ Veri silindi');
  } catch (error) {
    console.error('❌ Silme hatası:', error);
    throw error;
  }
}

/**
 * Sonuç güncelle
 */
export async function updateCalculatorResult(resultId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('calculator_results')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resultId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('❌ Güncelleme hatası:', error);
    throw error;
  }
}
