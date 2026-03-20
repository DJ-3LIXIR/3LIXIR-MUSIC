import { AwsClient } from 'npm:aws4fetch@1.0.20'

const BUCKET_NAME = '3lixir-loader'

const FILES = {
  mac: '3lixir-loader-1.0.2.dmg',
  pc:  '3lixir-loader-1.0.0-setup.exe',
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const platform = url.searchParams.get('platform') as 'mac' | 'pc' | null

    if (!platform || !FILES[platform]) {
      return new Response(JSON.stringify({ error: 'Missing or invalid platform. Use ?platform=mac or ?platform=pc' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const accountId = Deno.env.get('R2_ACCOUNT_ID')!
    const r2 = new AwsClient({
      accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID')!,
      secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY')!,
    })

    const fileKey = FILES[platform]
    const r2Url = `https://${accountId}.r2.cloudflarestorage.com/${BUCKET_NAME}/${fileKey}`

    // Generate a presigned URL valid for 1 hour
    const signed = await r2.sign(
      new Request(r2Url, { method: 'GET' }),
      { aws: { signQuery: true, allHeaders: true }, expiresIn: 3600 }
    )

    return new Response(JSON.stringify({ url: signed.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', message: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
