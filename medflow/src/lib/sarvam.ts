export const transcribeAudio = async (audioBlob: Blob, inputLanguage: string = "en-IN") => {
    const apiKey = process.env.NEXT_PUBLIC_SARVAM_AI_API_KEY;
    if (!apiKey) {
        console.error("Sarvam AI API Key is missing");
        return null;
    }
    console.log(`Calling Sarvam STT: model=saaras:v3, inputLang=${inputLanguage}, key=${apiKey.substring(0, 6)}...`);

    const formData = new FormData();
    // STUBBORNNESS: Some browsers/environments keep the 'codecs=opus' metadata even after wrapping.
    // We convert to ArrayBuffer to completely strip all original metadata from the blob.
    const arrayBuffer = await audioBlob.arrayBuffer();
    const sanitizedBlob = new Blob([arrayBuffer], { type: 'audio/webm' });

    formData.append("file", sanitizedBlob, "recording.webm");
    formData.append("model", "saaras:v3");

    // For translation mode, it's often better to let it auto-detect or use specific 'mode'
    if (inputLanguage === "en-IN") {
        formData.append("language_code", "en-IN");
        formData.append("mode", "transcribe");
    } else {
        // Translation mode: Indic to English
        formData.append("mode", "translate");
        // Only append language_code if it's explicitly set and not unknown
        if (inputLanguage && inputLanguage !== "unknown") {
            formData.append("language_code", inputLanguage);
        }
    }

    try {
        const response = await fetch("https://api.sarvam.ai/speech-to-text", {
            method: "POST",
            headers: {
                "api-subscription-key": apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const status = response.status;
            let errorText = await response.text();
            console.error(`Sarvam AI API Error (${status}):`, errorText);
            return null;
        }

        const data = await response.json();
        console.log("Sarvam AI Response:", data);
        return data.translation || data.transcript;
    } catch (error) {
        console.error("Error calling Sarvam AI:", error);
        return null;
    }
};

export const translateText = async (text: string, sourceLang: string = "en-IN", targetLang: string = "hi-IN") => {
    const apiKey = process.env.NEXT_PUBLIC_SARVAM_AI_API_KEY;
    if (!apiKey) return null;

    try {
        const response = await fetch("https://api.sarvam.ai/text-to-text/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": apiKey,
            },
            body: JSON.stringify({
                input: text,
                source_language_code: sourceLang,
                target_language_code: targetLang,
                model: "mayura:v1"
            }),
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.translated_text;
    } catch (error) {
        console.error("Error calling Sarvam Translation:", error);
        return null;
    }
};

export const textToSpeech = async (text: string, languageCode: string = "en-IN") => {
    const apiKey = process.env.NEXT_PUBLIC_SARVAM_AI_API_KEY;
    if (!apiKey) return null;

    try {
        const response = await fetch("https://api.sarvam.ai/text-to-speech", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-subscription-key": apiKey,
            },
            body: JSON.stringify({
                inputs: [text],
                target_language_code: languageCode,
                speaker: "meera", // One of the high-quality voices
                model: "bulbul:v3",
                audio_format: "mp3",
                sampling_rate: 24000
            }),
        });

        if (!response.ok) {
            console.error("Sarvam TTS Error:", await response.text());
            return null;
        }

        const data = await response.json();
        // Bulbul v3 returns base64 audio in audios[0]
        return data.audios[0];
    } catch (error) {
        console.error("Error calling Sarvam TTS:", error);
        return null;
    }
};
