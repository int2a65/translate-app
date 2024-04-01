import { NextResponse } from 'next/server'
import PipelineSingleton from './pipeline.js';

export async function GET(request) {
    const text = request.nextUrl.searchParams.get('text');
    const source_lang = "eng_Latn"
    //static target_lang = "jpn_Jpan"
    const target_lang = "zho_Hans"
    if (!text) {
        return NextResponse.json({
            error: 'Missing text parameter',
        }, { status: 400 });
    }
    // Get the classification pipeline. When called for the first time,
    // this will load the pipeline and cache it for future use.
    const translator = await PipelineSingleton.getInstance();

    // Actually perform the classification
    const result = await translator(text, {
        src_lang: source_lang, // Hindi
        tgt_lang: target_lang, // French
      });

    return NextResponse.json(result);
}