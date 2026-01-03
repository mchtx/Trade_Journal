import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug için konsola yazdır (Güvenlik için tam URL/Key yazdırmıyoruz)
console.log('Supabase Config Durumu:', {
  URL: supabaseUrl ? '✅ Tanımlı (' + supabaseUrl.substring(0, 15) + '...)' : '❌ TANIMSIZ',
  KEY: supabaseAnonKey ? '✅ Tanımlı' : '❌ TANIMSIZ'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase ortam değişkenleri ayarlanmamış!');
  console.warn('Lütfen .env.local dosyasını kontrol edin.');
}

if (supabaseUrl?.includes('xxxxx.supabase.co')) {
  console.error('🛑 HATALI YAPILANDIRMA: .env.local dosyasında varsayılan (placeholder) Supabase URL bulunuyor.');
  console.error('Lütfen SUPABASE_SETUP.md dosyasındaki adımları takiperek kendi proje bilgilerinizi girin.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

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
    
    return (data || []).map((r: any) => ({
      id: r.id,
      input: {
        principal: r.principal,
        currency: r.currency,
        returnRate: r.return_rate,
        returnPeriod: r.return_period,
        periodCount: r.period_count,
        contributionType: r.contribution_type,
        contributionAmount: r.contribution_amount
      },
      finalBalance: r.final_balance,
      totalInterestEarned: r.total_interest_earned,
      totalReturnPercent: r.total_return_percent,
      totalPrincipalInvested: r.total_principal_invested,
      yearlyData: [], // Veritabanında saklanmıyor, gerekirse hesaplanabilir
      calculatedAt: r.created_at,
      created_at: r.created_at
    }));
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

// ==================== TRADES ====================

export async function getTrades(userId: string) {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', userId)
    .order('entry_time', { ascending: false });

  if (error) throw error;
  
  return data.map((t: any) => ({
    id: t.id,
    symbol: t.symbol,
    direction: t.direction,
    entryPrice: t.entry_price,
    exitPrice: t.exit_price,
    positionSize: t.position_size,
    entryTime: t.entry_time,
    exitTime: t.exit_time,
    stopLoss: t.stop_loss,
    takeProfit: t.take_profit,
    strategyTag: t.strategy_tag,
    notes: t.notes,
    screenshots: t.screenshots,
    emotionScore: t.emotion_score,
    disciplineScore: t.discipline_score,
    excludeFromStats: t.exclude_from_stats,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  }));
}

export async function addTrade(userId: string, trade: any) {
  const dbTrade = {
    user_id: userId,
    symbol: trade.symbol,
    direction: trade.direction,
    entry_price: trade.entryPrice,
    exit_price: trade.exitPrice,
    position_size: trade.positionSize,
    entry_time: trade.entryTime,
    exit_time: trade.exitTime,
    stop_loss: trade.stopLoss,
    take_profit: trade.takeProfit,
    strategy_tag: trade.strategyTag,
    notes: trade.notes,
    screenshots: trade.screenshots,
    emotion_score: trade.emotionScore,
    discipline_score: trade.disciplineScore,
    exclude_from_stats: trade.excludeFromStats,
    created_at: trade.createdAt,
    updated_at: trade.updatedAt
  };

  const { data, error } = await supabase
    .from('trades')
    .insert([dbTrade])
    .select()
    .single();

  if (error) throw error;
  
  return { ...trade, id: data.id };
}

export async function updateTrade(tradeId: string, updates: any) {
  const dbUpdates: any = {};
  if (updates.symbol) dbUpdates.symbol = updates.symbol;
  if (updates.direction) dbUpdates.direction = updates.direction;
  if (updates.entryPrice) dbUpdates.entry_price = updates.entryPrice;
  if (updates.exitPrice) dbUpdates.exit_price = updates.exitPrice;
  if (updates.positionSize) dbUpdates.position_size = updates.positionSize;
  if (updates.entryTime) dbUpdates.entry_time = updates.entryTime;
  if (updates.exitTime) dbUpdates.exit_time = updates.exitTime;
  if (updates.stopLoss) dbUpdates.stop_loss = updates.stopLoss;
  if (updates.takeProfit) dbUpdates.take_profit = updates.takeProfit;
  if (updates.strategyTag) dbUpdates.strategy_tag = updates.strategyTag;
  if (updates.notes) dbUpdates.notes = updates.notes;
  if (updates.screenshots) dbUpdates.screenshots = updates.screenshots;
  if (updates.emotionScore) dbUpdates.emotion_score = updates.emotionScore;
  if (updates.disciplineScore) dbUpdates.discipline_score = updates.disciplineScore;
  if (updates.excludeFromStats !== undefined) dbUpdates.exclude_from_stats = updates.excludeFromStats;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('trades')
    .update(dbUpdates)
    .eq('id', tradeId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTrade(tradeId: string) {
  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', tradeId);

  if (error) throw error;
}

// ==================== RULES ====================

export async function getRules(userId: string) {
  const { data, error } = await supabase
    .from('rules')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  
  return data.map((r: any) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    isPinned: r.is_pinned,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  }));
}

export async function addRule(userId: string, rule: any) {
  const dbRule = {
    user_id: userId,
    title: rule.title,
    description: rule.description,
    category: rule.category,
    is_pinned: rule.isPinned,
    created_at: rule.createdAt,
    updated_at: rule.updatedAt
  };

  const { data, error } = await supabase
    .from('rules')
    .insert([dbRule])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    isPinned: data.is_pinned,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function updateRule(ruleId: string, updates: any) {
  const dbUpdates: any = {};
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.description) dbUpdates.description = updates.description;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.isPinned !== undefined) dbUpdates.is_pinned = updates.isPinned;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('rules')
    .update(dbUpdates)
    .eq('id', ruleId)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    isPinned: data.is_pinned,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteRule(ruleId: string) {
  const { error } = await supabase
    .from('rules')
    .delete()
    .eq('id', ruleId);

  if (error) throw error;
}

// ==================== SETTINGS ====================

export async function getSettings(userId: string) {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  
  if (!data) return null;

  return {
    theme: data.theme,
    defaultRiskRewardThreshold: data.default_risk_reward_threshold,
    excludedDates: data.excluded_dates || []
  };
}

export async function saveSettings(userId: string, settings: any) {
  const dbSettings = {
    user_id: userId,
    theme: settings.theme,
    default_risk_reward_threshold: settings.defaultRiskRewardThreshold,
    excluded_dates: settings.excludedDates
  };

  const { data, error } = await supabase
    .from('settings')
    .upsert(dbSettings, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  
  return {
    theme: data.theme,
    defaultRiskRewardThreshold: data.default_risk_reward_threshold,
    excludedDates: data.excluded_dates || []
  };
}
