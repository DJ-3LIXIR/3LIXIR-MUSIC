import { createClient } from 'npm:@supabase/supabase-js@2'
import { AwsClient } from 'npm:aws4fetch@1.0.20'

const BUCKET_NAME = '3lixir-plugins'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { plugin_id } = await req.json()
    if (!plugin_id) {
      return new Response(JSON.stringify({ error: 'Missing plugin_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: plugin, error: pluginError } = await supabase
      .from('plugins')
      .select('storage_key, name')
      .eq('id', plugin_id)
      .single()

    if (pluginError || !plugin?.storage_key) {
      return new Response(JSON.stringify({ error: 'Plugin not found', details: pluginError?.message }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify ownership
    const { data: orders } = await supabase
      .from('orders')
      .select('items')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    const owns = orders?.some(order => {
      const items = order.items as Array<{ id: string; type: string }>
      return Array.isArray(items) && items.some(
        item => item.type === 'plugin' && item.id === plugin_id
      )
    })

    if (!owns) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Fetch from R2 using aws4fetch (handles SigV4 signing automatically)
    const accountId = Deno.env.get('R2_ACCOUNT_ID')!
    const r2 = new AwsClient({
      accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID')!,
      secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY')!,
    })

    const r2Url = `https://${accountId}.r2.cloudflarestorage.com/${BUCKET_NAME}/${plugin.storage_key}`
    const r2Response = await r2.fetch(r2Url)

    if (!r2Response.ok) {
      const errText = await r2Response.text()
      return new Response(JSON.stringify({
        error: 'R2 fetch failed',
        status: r2Response.status,
        details: errText,
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const filename = plugin.storage_key.split('/').pop() || 'plugin.zip'

    return new Response(r2Response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', message: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
