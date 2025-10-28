import { CHECKLIST_SECTIONS } from "./constants"
import OpenAI from "openai";

const client = new OpenAI({ });

interface ChecklistParams {
    originCountry: string,
    destination: string
}
export const getChecklistApiBody = (originCountry: string, destination: string): OpenAI.Responses.ResponseCreateParams => {
    return {
        model: "gpt-5-nano",
        prompt: {
            id: "pmpt_68fcd401a80c8190bb63d9f3e5cdda3f084c9f8714cd40f3",
            version: "7",
            variables: {
                origincountry: originCountry,
                destination
            }
        },
        max_output_tokens: 1000,
        text: {
            format: {
                type: "json_schema",
                name: "expat_checklist_response",
                schema: {
                    type: "object",
                    properties: {
                        [CHECKLIST_SECTIONS.BEFORE_LEAVING]: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    task: { type: "string" },
                                    description: { type: "string" },
                                    urgency: { type: "string", enum: ["high", "medium", "low"] }
                                },
                                required: ["task", "description", "urgency"],
                                additionalProperties: false
                            }
                        },
                        [CHECKLIST_SECTIONS.AFTER_ARRIVING]: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    task: { type: "string" },
                                    description: { type: "string" },
                                    timeframe: { type: "string" }
                                },
                                required: ["task", "description", "timeframe"],
                                additionalProperties: false
                            }
                        },
                        summary: { type: "string" }
                    },
                    required: [CHECKLIST_SECTIONS.BEFORE_LEAVING, CHECKLIST_SECTIONS.AFTER_ARRIVING, "summary"],
                    additionalProperties: false
                },
                strict: true
            }
        }
    }
}

export const getChecklistFromOpenAI = async (params: ChecklistParams) => {
    const { originCountry, destination } = params
    const body = getChecklistApiBody(originCountry, destination)

    return await client.responses.create(body)
}


