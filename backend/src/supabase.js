const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Detecta tanto variables vacías como los valores de ejemplo del .env.example
// que alguien pudo haber dejado sin reemplazar (causa típica de "fetch failed").
const looksLikePlaceholder =
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl.includes('tu-proyecto') ||
    supabaseKey.includes('tu-service-role') ||
    supabaseKey.includes('tu-api-key');

let supabase;

if (looksLikePlaceholder) {
    console.warn('\n⚠️  SUPABASE_URL / SUPABASE_KEY no configuradas en .env');
    console.warn('⚠️  El servidor arrancará, pero la persistencia en base de datos estará DESACTIVADA.\n');

    supabase = {
        from: () => ({
            upsert: async () => {
                console.warn('[supabase-stub] upsert ignorado: faltan credenciales de Supabase');
                return { data: null, error: null };
            },
            select: () => ({
                order: async () => {
                    console.warn('[supabase-stub] select ignorado: faltan credenciales de Supabase');
                    return { data: [], error: null };
                }
            }),
            insert: async () => {
                console.warn('[supabase-stub] insert ignorado: faltan credenciales de Supabase');
                return { data: null, error: null };
            }
        })
    };
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = supabase;
