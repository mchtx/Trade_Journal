
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// .env.local dosyasını manuel oku
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabaseUrl = envConfig.VITE_SUPABASE_URL;
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY;

console.log('--- Supabase Bağlantı Testi ---');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? (supabaseKey.substring(0, 10) + '...') : 'YOK');

if (!supabaseUrl || supabaseUrl.includes('xxxxx')) {
    console.error('\n❌ HATA: Supabase URL geçersiz (xxxxx).');
    console.error('Lütfen .env.local dosyasını gerçek bilgilerle güncelleyin.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('\nBağlantı deneniyor...');
    try {
        // Basit bir sorgu ile bağlantıyı test et
        const { data, error } = await supabase.from('trades').select('count', { count: 'exact', head: true });
        
        if (error) {
            console.error('❌ Bağlantı Hatası:', error.message);
            if (error.message.includes('FetchError') || error.message.includes('network')) {
                console.error('Sunucuya ulaşılamadı. URL doğru mu?');
            }
        } else {
            console.log('✅ Bağlantı Başarılı!');
            
            // Kullanıcı oluşturmayı dene
            console.log('\nTest kullanıcısı oluşturuluyor (test@example.com)...');
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: 'test@example.com',
                password: 'password123'
            });

            if (authError) {
                console.error('❌ Kullanıcı Oluşturma Hatası:', authError.message);
            } else {
                console.log('✅ Kullanıcı işlemi sonucu:', authData);
                if (authData.user) {
                    console.log('Kullanıcı ID:', authData.user.id);
                    console.log('Lütfen bu email ve şifre ile giriş yapın.');
                } else {
                    console.log('Kullanıcı oluşturuldu ancak onay bekleniyor olabilir.');
                }
            }
        }
    } catch (err) {
        console.error('❌ Beklenmeyen Hata:', err);
    }
}

testConnection();
