// Step 12 - PUBLISH - Package `{entryId, response_text, carry_in}`

export interface PublishResult {
  entryId: string;
  responseText: string;
  carryIn: boolean;
}
export function publishEntry(
  entryId: string,
  responseText: string,
  carryIn: boolean
): PublishResult {
  console.log(
    `[PUBLISH] input=entryId: <${entryId}>, responseText:<${responseText}>,carryIn:<${carryIn}>, output=${JSON.stringify(
      { entryId, responseText, carryIn }
    )} | NOTE: Published entry.`
  );
  return {
    entryId,
    responseText,
    carryIn,
  };
}
