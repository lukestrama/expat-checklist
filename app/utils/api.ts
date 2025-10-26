import { CHECKLIST_SECTIONS } from "./constants"

interface ChecklistParams {
    origin: string,
    destination: string
}
export const getApiBody = (origin: string, destination: string) => {
    return {
        "model": "gpt-5",
        "prompt": {
            "id": "pmpt_68fcd401a80c8190bb63d9f3e5cdda3f084c9f8714cd40f3",
            "version": "2",
            "variables": {
                origin,
                destination
            }
        },
        "text": {
            "format": {
                "type": "json_schema",
                "name": "expat_checklist_response",
                "schema": {
                    "type": "object",
                    "properties": {
                        [CHECKLIST_SECTIONS.BEFORE_LEAVING]: {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "task": { "type": "string" },
                                    "description": { "type": "string" },
                                    "urgency": { "type": "string", "enum": ["high", "medium", "low"] }
                                },
                                "required": ["task", "description", "urgency"],
                                "additionalProperties": false
                            }
                        },
                        [CHECKLIST_SECTIONS.AFTER_ARRIVING]: {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "task": { "type": "string" },
                                    "description": { "type": "string" },
                                    "timeframe": { "type": "string" }
                                },
                                "required": ["task", "description", "timeframe"],
                                "additionalProperties": false
                            }
                        },
                        "summary": { "type": "string" }
                    },
                    "required": [CHECKLIST_SECTIONS.BEFORE_LEAVING, CHECKLIST_SECTIONS.AFTER_ARRIVING, "summary"],
                    "additionalProperties": false
                },
                "strict": true
            }
        }
    }
}

export const getChecklistFromOpenAI = (params: ChecklistParams) => {
    const { origin, destination } = params
    return fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_KEY}`
        },
        body: JSON.stringify(getApiBody(origin, destination))
    })

}
