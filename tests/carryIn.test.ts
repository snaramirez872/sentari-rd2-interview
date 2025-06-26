import { runPipeline } from "../src/core/pipeline";
const similarTranscrips = [
    "I've been overwhelmed with work lately, but I'm determined to push through and finish strong.",
    "Stress is really building up these days, but I'm trying to stay focused and get things done.",
    "It's a tough week, and I'm feeling the pressure, but I know I have to keep moving forward.",
    "Lots on my plate right now, feeling a bit anxious, but I'm motivated to tackle it all.",
    "The workload is intense, and I'm starting to become sad."
]

describe('Verfying carry-in logic', () => {
    it('entry is similar with themes/vibes', async () => {
        for (const transcript of similarTranscrips){
            await runPipeline(transcript)
        }

        const similarTranscript = await runPipeline("With everything going on, I feel sad and depressed.")
        const differentTranscript = await runPipeline("I'm grateful and appreciative because I feel amazing.")

        expect(similarTranscript.carryIn).toBe(true)
        expect(differentTranscript.carryIn).toBe(false)
    })
})