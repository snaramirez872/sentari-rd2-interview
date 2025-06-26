// Test Provided by Sean
import { extractRawText } from "../../core/steps/rawTextIn";
import { mockTranscripts } from "../../lib/mockData";

describe('Step 1 - Raw Text Input', () => {
    it('Should return the same string', () => {
        const mockOne = mockTranscripts.one;
        const result = extractRawText(mockOne);
        expect(result.split(' ')).toEqual(mockOne.split(' '));
    });

    it('Should trim leading and trailing whitespaces', () => {
        const mockTwo = mockTranscripts.two;
        const caseTwo = "I've been tired recently.";
        const result = extractRawText(mockTwo);
        expect(result.split(' ')).toEqual(caseTwo.split(' '));
    });

    it('Should remove newline chars', () => {
        const mockThree = mockTranscripts.three;
        const caseThree = "I really need to get this done";
        const result = extractRawText(mockThree);
        expect(result.split(' ')).toEqual(caseThree.split(' '));
    });
});
