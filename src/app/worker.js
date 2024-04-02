import { pipeline, env } from "@xenova/transformers";

// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static task = 'translation';
    static model = 'Xenova/nllb-200-distilled-600M';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    // Retrieve the classification pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    let classifier = await PipelineSingleton.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });
    const source_lang = "eng_Latn"
    //static target_lang = "jpn_Jpan"
    const target_lang = "zho_Hans"
    // Actually perform the classification
    let output = await classifier(event.data.text, {
        src_lang: source_lang, // Hindi
        tgt_lang: target_lang, // French
    });

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: output,
    });
});